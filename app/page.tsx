"use client";

import { useMemo, useState } from "react";
import { usePlausible } from "next-plausible";

type Status = "idle" | "sending" | "sent" | "error";

export default function Page() {
  const plausible = usePlausible();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [docType, setDocType] = useState<string>("請求書");
  const [company, setCompany] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  

  const canSubmit = useMemo(() => {
    if (status === "sending") return false;
    if (!email.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return false;
    return true;
  }, [email, status]);

  function track(event: string, props: Record<string, unknown> = {}) {
    plausible(event, Object.keys(props).length ? { props } : undefined);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("sending");

    try {
      const fd = new FormData();
      fd.set("email", email.trim());
      fd.set("docType", docType);
      fd.set("company", company.trim());
      fd.set("notes", notes.trim());
      if (file) fd.set("file", file);

      const res = await fetch("/api/lead", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "送信に失敗しました");
      }

      setStatus("sent");
      track("form_submit", { docType });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    }
  }

  return (
    <main className="container">
      <div className="nav">
        <div className="badge">検証中 / 先行利用の受付</div>
        <div className="kicker">帳票PDF → Excel 自動入力</div>
      </div>

      <div className="card hero">
        <h1 className="h1">PDFを開いて、Excelに打ち直す作業をやめませんか？</h1>
        <p className="lead">
          同じ帳票なら、一度設定するだけで PDF・スキャン書類をExcelに自動入力します。
        </p>
        <div className="ctaRow">
          <a
            className="btn btnPrimary"
            href="#check"
            onClick={() => track("cta_click", { position: "hero" })}
          >
            無料で使えるか確認する
          </a>
          <a className="btn" href="#how">
            仕組みを見る
          </a>
        </div>
        <p className="note">※ 万能変換ツールではありません。「同じ形式を繰り返し処理」する業務向けです。</p>
      </div>

      <div className="grid">
        <div className="card section">
          <h2 className="h2">こんな作業、毎月やっていませんか？</h2>
          <ul className="ul">
            <li>PDFやスキャンを見ながらExcelに手入力</li>
            <li>請求書・申請書・報告書の様式が毎回同じ</li>
            <li>ミスが怖くてダブルチェック</li>
            <li>「自動化したいけど、結局うまくいかない」</li>
          </ul>
          <hr className="hr" />
          <h2 className="h2">このサービスでできること</h2>
          <ul className="ul">
            <li>同じ帳票レイアウトなら毎回自動入力</li>
            <li>既存のExcelフォーマットに対応</li>
            <li>日本語帳票対応（日付・住所・会社名など）</li>
            <li>PDF / スキャン / FAX画像OK</li>
          </ul>

          <hr className="hr" id="how" />
          <h2 className="h2">使い方はシンプルです</h2>
          <ol className="ul">
            <li>帳票PDFを1枚アップロード</li>
            <li>Excelの入力先を一度だけ指定</li>
            <li>次回からは自動入力</li>
          </ol>
          <p className="note">（※ 開発中のため、現在は「自動化できるかどうかの事前確認」のみ行っています）</p>

          <hr className="hr" />
          <h2 className="h2">対応予定の帳票例</h2>
          <ul className="ul">
            <li>請求書</li>
            <li>納品書</li>
            <li>点検報告書</li>
            <li>各種申請書</li>
          </ul>
        </div>

        <div className="card section" id="check">
          <h2 className="h2">あなたの帳票が対応できるか無料で確認します</h2>
          <p className="kicker">
            開発前のため、現在は「事前検証」だけ行っています。帳票PDF（任意）とメールアドレスを送ってください。
          </p>

          {status === "sent" ? (
            <div className="toast" style={{ marginTop: 12 }}>
              送信しました。確認後にご連絡します。
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
              <label className="label">
                メールアドレス（必須）
                <input
                  className="input"
                  type="email"
                  onFocus={() => track("form_start")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.jp"
                  required
                />
              </label>

              <label className="label">
                帳票の種類
                <select className="select" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="請求書">請求書</option>
                  <option value="納品書">納品書</option>
                  <option value="点検報告書">点検報告書</option>
                  <option value="申請書">申請書</option>
                  <option value="その他">その他</option>
                </select>
              </label>

              <label className="label">
                会社名（任意）
                <input
                  className="input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="例）株式会社〇〇"
                />
              </label>

              <label className="label">
                帳票PDF（任意・1枚）
                <input
                  className="input"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    if (f) {
                      track("file_attached", { size: f.size, type: f.type });
                    }
                  }}
                />
              </label>

              <label className="label">
                補足（任意）
                <textarea
                  className="textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例）毎月50枚、同じ様式。Excelは既存テンプレあり。"
                />
              </label>

              {status === "error" && (
                <div className="toast" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
                  {error || "送信に失敗しました"}
                </div>
              )}

              <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
                {status === "sending" ? "送信中..." : "帳票を送って確認する"}
              </button>

              <p className="note">
                送信内容は事前検証の目的でのみ使用します。開発中のため、返信に少し時間がかかる場合があります。
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="card footer">
        <div>会社名：株式会社 Aisara</div>
        <div>所在地：〒132-0011 東京都江戸川区瑞江２丁目−５−３ グレイス瑞江 2F</div>
        <div>お問い合わせ：info@aisara.co.jp</div>
        <div>現在は開発検証段階です。</div>
      </div>
    </main>
  );
}

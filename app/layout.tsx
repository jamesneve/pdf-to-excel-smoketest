import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "帳票PDF→Excel 自動入力（検証中）",
  description: "同じ帳票なら一度設定するだけで、PDF・スキャン書類をExcelに自動入力します（検証中）。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H3E1BPXL10"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H3E1BPXL10', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}


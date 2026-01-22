import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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
          async
          src="https://plausible.io/js/pa-qb6qooiSm4WW3FJtTy0rc.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `}
        </Script>
      </body>
    </html>
  );
}

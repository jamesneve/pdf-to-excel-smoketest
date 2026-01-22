"use client";

import PlausibleProvider from "next-plausible";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="pdftoexcel.aisara.jp" trackOutboundLinks>
      {children}
    </PlausibleProvider>
  );
}

// app/layout.tsx

import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

import "./globals.css";

export const metadata = {
  title: "Stock Imagery AI",
  description: "The easiest way to create AI images and videos for free",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body>
        <Providers>
          {/* <main className="dark text-foreground bg-background"> */}

          <Script
            id="lemonSqueezy"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.lemonSqueezyAffiliateConfig = { store: "stockimagery", debug: true }`,
            }}
          />
          <Script
            src="https://lmsqueezy.com/affiliate.js"
            strategy="beforeInteractive"
            defer
          ></Script>

          {children}
          {/* </main> */}
          <Script
            defer
            src="https://api.pirsch.io/pirsch-extended.js"
            id="pirschextendedjs"
            data-code="UbeLfhWpTfPx0K9ivBE7D6maOVqaAzzV"
          ></Script>
        </Providers>
      </body>
    </html>
  );
}

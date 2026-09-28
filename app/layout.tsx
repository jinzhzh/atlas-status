import type { ReactNode } from "react";

export const metadata = {
  title: "Atlas Status",
  description: "Atlas status page — overall status and recent incidents",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#0f172a", color: "#e2e8f0" }}>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>{children}</main>
      </body>
    </html>
  );
}

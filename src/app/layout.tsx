import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoUni OS — Autonomous University Operating System",
  description: "Privacy-first intelligent campus operations by The Cloud Engineers.",
  applicationName: "AutoUni OS"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

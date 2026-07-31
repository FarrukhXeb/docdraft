import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocDraft",
  description: "Draft RFP and proposal responses, fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

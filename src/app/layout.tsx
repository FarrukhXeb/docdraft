import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocDraft",
  description: "Draft RFP and proposal responses, fast.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180" }],
  },
};

// Applied before paint so the persisted theme never flashes the wrong palette.
const themeScript = `try{if(localStorage.getItem("docdraft-theme")==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}

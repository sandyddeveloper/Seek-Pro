import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seek-Pro",
  description: "Seek-Pro web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

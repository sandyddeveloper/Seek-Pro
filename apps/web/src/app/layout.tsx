import type { Metadata } from "next";
import { Manrope, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SeekPro — Executive AI Operating System",
  description:
    "The minimal executive operating system that quietly deflects interruptions, harmonizes your daily calendar, and preserves cognitive flow.",
  icons: {
    icon: "/images/seekpro_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${hankenGrotesk.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="font-body bg-background text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}

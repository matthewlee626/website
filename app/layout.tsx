import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const PPNikkeiMaru = localFont({
  src: "./fonts/PPNikkeiMaru-Regular.otf",
  variable: "--font-nikkei-maru",
});

export const metadata: Metadata = {
  title: "matthew lee",
  description: "Hey! You've found the metadata for my website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={PPNikkeiMaru.variable}>
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const PPRightDidone = localFont({
  src: "/fonts/PPRightDidone-TallRegular.otf",
  variable: "--font-right-didone",
});

export const PPNikkeiMaru = localFont({
  src: "/fonts/PPNikkeiMaru-Regular.otf",
  variable: "--font-nikkei-maru",
});

export const metadata: Metadata = {
  title: "Matthew Lee",
  description: "Hey! You've found the metadata for my website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${PPRightDidone.variable} ${PPNikkeiMaru.variable} antialiased text-white bg-[#33507b]`}>
        {children}
      </body>
    </html>
  );
}

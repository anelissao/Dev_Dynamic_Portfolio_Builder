import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Builder - Showcase Your Developer Journey",
  description: "Build a beautiful developer portfolio in one minute. Import GitHub projects, customize themes, and share your work with the world for free.",
  keywords: ["portfolio", "developer", "github", "projects"],
  openGraph: {
    title: "Portfolio Builder",
    description: "Build a beautiful developer portfolio in one minute",
    type: "website",
    siteName: "Portfolio Builder",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

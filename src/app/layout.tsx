import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./app.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foliox",
  description: "Notion meets Canva for Developers.",
  icons: {
    icon: "/logo_foliox.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--bg-canvas)] font-sans text-[var(--text-primary)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

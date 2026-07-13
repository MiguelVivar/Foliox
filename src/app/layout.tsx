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

// Static inline literal — no user input is interpolated, so this is not an XSS vector.
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("foliox-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--bg-canvas)] font-sans text-[var(--text-primary)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

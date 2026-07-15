import type { Metadata } from "next";

// The editor is a fully client-rendered, session-dependent canvas (drag & drop,
// GitHub auth) with no SEO value — statically prerendering it forces Node to build
// the Appwrite client at build time, which crashes when env vars aren't present yet.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editor — Foliox",
  description: "Build your GitHub README, portfolio, and developer brand visually.",
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg-canvas)]">
      {children}
    </div>
  );
}

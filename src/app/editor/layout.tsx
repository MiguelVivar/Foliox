import type { Metadata } from "next";

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

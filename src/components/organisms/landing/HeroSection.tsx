"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TerminalCodeBlock } from "@/components/molecules/TerminalCodeBlock";
import { GitBranch, MoveRight, ArrowRight, Star, Sparkles, LayoutGrid } from "lucide-react";

export function HeroSection() {
  const [activeLayout, setActiveLayout] = useState<"standard" | "minimal">("standard");

  // Simulated code representations for standard and minimal layouts
  const standardAST = `export const profile = {
  username: "octocat",
  theme: "flat-swiss",
  blocks: [
    { type: "header", name: "Jane Doe", title: "Systems Architect" },
    { type: "skills", items: ["TypeScript", "Rust", "Docker", "Next.js"] },
    { type: "github-stats", layout: "compact", showStars: true }
  ]
};`;

  const standardMD = `# Jane Doe ── Systems Architect
> Notion meets Canva developer profile layout.

## 🛠️ Tech Stack
\`\`\`ts
const stack = ["TypeScript", "Rust", "Docker", "Next.js"];
\`\`\`

## 📊 Metrics
- ★ 1,420 Stars gained on open-source repos
- ⑂ 250 Pull Requests compiled in 2026`;

  const minimalAST = `export const profile = {
  username: "octocat",
  theme: "minimal-mono",
  blocks: [
    { type: "header", name: "Jane Doe", title: "Backend Engineer" },
    { type: "git-commits", limit: 5 }
  ]
};`;

  const minimalMD = `# Jane Doe
Backend Engineer ── Focusing on database scale.

\`\`\`sh
$ git log --oneline -n 5
7ef340a fix(api): optimize connection pooling
89df2c2 feat(db): add partition schema for analytics
\`\`\``;

  return (
    <section className="relative w-full overflow-hidden border-b border-[var(--border-subtle)] px-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Left column: Text copy & CTAs */}
        <div className="flex flex-col items-start gap-6 text-left lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>v1.0.0-beta RELEASED</span>
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
            Notion meets Canva for Developer Branding.
          </h1>

          <p className="max-w-xl font-sans text-base text-[var(--text-muted)] leading-relaxed">
            Olvídate de los generadores de README estáticos y formularios aburridos. Diseña tu perfil de GitHub, currículum técnico y portafolio en un lienzo modular drag-and-drop impulsado por IA local (BYOK).
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--bg-brand-cta)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--text-brand-cta)] border border-transparent hover:border-[var(--border-focus)] transition-colors"
            >
              [Open Visual Editor]
              <ArrowRight size={14} />
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-2.5 font-mono text-sm text-[var(--text-primary)] hover:border-[var(--border-focus)] transition-colors"
            >
              <GitBranch size={14} className="text-[var(--text-muted)]" />
              [Explore GitHub Repo]
            </a>
          </div>
        </div>

        {/* Right column: Split Preview / Mockup Screen */}
        <div className="w-full lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                <LayoutGrid size={14} className="text-[var(--text-muted)]" />
                Interactive Visual Compiler
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveLayout("standard")}
                  className={`px-2 py-0.5 rounded-sm font-mono text-[10px] border ${
                    activeLayout === "standard"
                      ? "border-[var(--border-focus)] text-[var(--text-primary)] bg-[var(--bg-canvas)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Standard Layout
                </button>
                <button
                  onClick={() => setActiveLayout("minimal")}
                  className={`px-2 py-0.5 rounded-sm font-mono text-[10px] border ${
                    activeLayout === "minimal"
                      ? "border-[var(--border-focus)] text-[var(--text-primary)] bg-[var(--bg-canvas)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Minimal Mono
                </button>
              </div>
            </div>

            {/* Split Screen Simulated Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Canvas Preview */}
              <div className="flex flex-col gap-3 p-3 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] min-h-[280px]">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  [Drag-and-Drop Workspace]
                </span>

                {activeLayout === "standard" ? (
                  <>
                    <div className="border border-[var(--border-subtle)] rounded p-2.5 bg-[var(--bg-surface)]">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
                          Jane Doe
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          [Header]
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        Systems Architect ── Notion meets Canva.
                      </p>
                    </div>

                    <div className="border border-[var(--border-subtle)] rounded p-2.5 bg-[var(--bg-surface)]">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
                          Tech Stack
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          [Skills]
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {["TypeScript", "Rust", "Docker", "Next.js"].map((tech) => (
                          <span
                            key={tech}
                            className="bg-[var(--bg-canvas)] text-[9px] px-1 py-0.5 border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border border-[var(--border-subtle)] rounded p-2.5 bg-[var(--bg-surface)] flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
                          GitHub Metrics
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          [Stats]
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-emerald-400 mt-2">
                        ★ 1,420 Stars
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border border-[var(--border-subtle)] rounded p-2.5 bg-[var(--bg-surface)]">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
                          Jane Doe
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          [Header]
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        Backend Engineer ── Focusing on database scale.
                      </p>
                    </div>

                    <div className="border border-[var(--border-subtle)] rounded p-2.5 bg-[var(--bg-surface)] flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-xs text-[var(--text-primary)]">
                          Commit History
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          [GitLog]
                        </span>
                      </div>
                      <div className="font-mono text-[9px] text-[var(--text-muted)] mt-2 flex flex-col gap-1">
                        <div>● 7ef340a optimize pool</div>
                        <div>● 89df2c2 analytics schema</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Code Preview (TerminalCodeBlock) */}
              <div className="flex items-stretch">
                <TerminalCodeBlock
                  astContent={activeLayout === "standard" ? standardAST : minimalAST}
                  markdownContent={activeLayout === "standard" ? standardMD : minimalMD}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

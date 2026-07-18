"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Columns2, LayoutTemplate, Home, Settings, User } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/cn";

export function ClientOnlyEditor() {
  const { splitView, toggleSplitView, blocks, addBlock, updateBlock } = useEditorStore();
  const { user } = useAuthStore();
  const [selectedProfile, setSelectedProfile] = useState("architect-cv");
  const [showImportBanner, setShowImportBanner] = useState(true);

  async function handleAutoImport() {
    const username = prompt("Enter your GitHub username to auto-import profile & existing README.md:");
    if (!username) return;

    try {
      // 1. User details
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();

      // Update or add Hero Bio
      const existingHero = blocks.find((b) => b.kind === "hero-bio");
      if (existingHero) {
        updateBlock(existingHero.id, (b) =>
          b.kind === "hero-bio"
            ? {
                ...b,
                style: b.style,
                content: {
                  name: userData.name || b.content.name || userData.login,
                  tagline: userData.bio || b.content.tagline || "",
                  avatarUrl: userData.avatar_url || b.content.avatarUrl,
                },
              }
            : b
        );
      } else {
        addBlock({
          id: `block-${Date.now()}-hb`,
          kind: "hero-bio",
          content: {
            name: userData.name || userData.login,
            tagline: userData.bio || "",
            avatarUrl: userData.avatar_url,
          },
        });
      }

      // 2. Languages
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=60&sort=updated`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const langCounts: Record<string, number> = {};
        repos.forEach((repo: any) => {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });

        const sortedLangs = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([lang]) => lang)
          .slice(0, 6);

        if (sortedLangs.length > 0) {
          const existingTech = blocks.find((b) => b.kind === "tech-stack");
          if (existingTech) {
            updateBlock(existingTech.id, (b) =>
              b.kind === "tech-stack"
                ? {
                    ...b,
                    style: b.style,
                    content: {
                      technologies: Array.from(new Set([...b.content.technologies, ...sortedLangs])),
                    },
                  }
                : b
            );
          } else {
            addBlock({
              id: `block-${Date.now()}-ts`,
              kind: "tech-stack",
              content: { technologies: sortedLangs },
            });
          }
        }
      }

      // 3. GitHub README
      let readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`);
      if (!readmeRes.ok) {
        readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`);
      }
      if (readmeRes.ok) {
        const readmeContent = await readmeRes.text();
        if (readmeContent && readmeContent.trim()) {
          const existingMarkdown = blocks.find((b) => b.kind === "markdown-custom");
          if (existingMarkdown) {
            updateBlock(existingMarkdown.id, (b) =>
              b.kind === "markdown-custom"
                ? { ...b, style: b.style, content: { markdown: readmeContent } }
                : b
            );
          } else {
            addBlock({
              id: `block-${Date.now()}-md`,
              kind: "markdown-custom",
              content: { markdown: readmeContent },
            });
          }
        }
      }
      setShowImportBanner(false);
      alert("SUCCESS: Profile details, languages & existing README imported!");
    } catch (err: any) {
      alert("Error importing profile: " + err.message);
    }
  }

  return (
    <main className="crt-scanlines flex flex-col md:flex-row flex-1 overflow-hidden bg-[var(--bg-canvas)]">
      {/* ── Canvas zone ── */}
      <section
        className={cn(
          "relative flex flex-col overflow-hidden transition-none",
          splitView ? "w-full md:w-[60%]" : "flex-1",
        )}
      >
        {/* Glassmorphic Premium Toolbar Strip */}
        <div className="crt-glass flex items-center justify-between px-4 py-3 font-mono text-[10px] select-none border-b border-[var(--accent-phosphor)]/20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[var(--accent-phosphor)] hover:text-white border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] bg-[var(--accent-phosphor)]/10 rounded-sm px-2.5 py-1 transition-all uppercase tracking-widest font-bold crt-glowing-glow"
            >
              <Home size={11} />
              <span>Home</span>
            </Link>

            <span className="text-[var(--accent-phosphor)]/30">|</span>

            {/* Profile switching dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)] uppercase tracking-wider text-[9px]">Workspace:</span>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="bg-[var(--bg-canvas)] border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] px-2 py-1 rounded-sm text-[var(--accent-phosphor)] focus:outline-none focus:border-[var(--accent-phosphor)] font-mono text-[9px] uppercase tracking-widest transition-all"
              >
                <option value="architect-cv">Systems Architect CV</option>
                <option value="github-readme">GitHub Special README</option>
                <option value="devto-bio">Dev.to custom Bio</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[var(--text-muted)]">
              <User size={11} className="text-[var(--accent-phosphor)]" />
              <span className="font-bold text-[var(--text-primary)]">{user?.name ? user.name.toUpperCase().replace(" ", "_") : "JANE_DOE"}</span>
              <span className="bg-[var(--accent-phosphor)]/20 text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)]/50 px-1.5 py-0.5 rounded-sm text-[8px] tracking-widest uppercase animate-pulse font-extrabold shadow-[0_0_8px_var(--glow-color)]">PRO</span>
            </div>

            <Link
              href="/settings"
              className="p-1.5 border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] bg-[var(--bg-canvas)] rounded-sm text-[var(--accent-phosphor)] hover:text-white transition-all hover:shadow-[0_0_8px_var(--glow-color)]"
              title="Configurations"
            >
              <Settings size={12} />
            </Link>

            <button
              type="button"
              onClick={toggleSplitView}
              aria-label={
                splitView ? "Close Markdown preview" : "Open Markdown preview"
              }
              aria-pressed={splitView}
              className={cn(
                "flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all font-bold cursor-pointer",
                splitView
                  ? "border-[var(--accent-phosphor)] bg-[var(--accent-phosphor)]/20 text-[var(--accent-phosphor)] shadow-[0_0_10px_var(--glow-color)]"
                  : "border-[var(--accent-phosphor)]/30 text-[var(--accent-phosphor)] hover:border-[var(--accent-phosphor)] hover:bg-[var(--accent-phosphor)]/10 hover:shadow-[0_0_8px_var(--glow-color)]",
              )}
            >
              {splitView ? (
                <LayoutTemplate size={11} />
              ) : (
                <Columns2 size={11} />
              )}
              {splitView ? "Canvas only" : "Split view"}
            </button>
          </div>
        </div>

        {user && showImportBanner && (
          <div className="mx-6 mt-4 p-3 bg-[var(--accent-phosphor)]/10 border border-[var(--accent-phosphor)]/30 rounded-sm flex items-center justify-between font-mono text-[10px] z-20">
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-[var(--accent-phosphor)]">●</span>
              <span className="text-[var(--text-primary)]">Connected to GitHub via OAuth. Populate editor with your active README?</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAutoImport}
                className="bg-[var(--accent-phosphor)] text-[var(--bg-canvas)] font-bold px-3 py-1 rounded-sm hover:-translate-y-0.5 transition-all uppercase tracking-wider cursor-pointer"
              >
                Auto-Import Profile
              </button>
              <button
                type="button"
                onClick={() => setShowImportBanner(false)}
                className="text-[var(--text-muted)] hover:text-white uppercase tracking-wider px-2 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <EditorCanvas />
      </section>

      {/* ── Markdown preview (split view only) ── */}
      {splitView && (
        <section className="flex w-full md:w-[40%] flex-col overflow-hidden border-t md:border-t-0 md:border-l border-[var(--accent-phosphor)]/20 bg-[var(--bg-canvas)]/90 backdrop-blur-md">
          <MarkdownPreview />
        </section>
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-full md:w-80 flex-shrink-0 flex-col overflow-y-auto border-t md:border-t-0 md:border-l border-[var(--accent-phosphor)]/20 bg-[var(--bg-surface)]/95 backdrop-blur-md">
        <EditorSidebar />
      </aside>
    </main>
  );
}

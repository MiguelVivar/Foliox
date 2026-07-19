"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Columns2,
  LayoutTemplate,
  Home,
  Settings,
  User,
  Globe,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/cn";

export function ClientOnlyEditor() {
  const {
    splitView,
    toggleSplitView,
    blocks,
    addBlock,
    updateBlock,
    lang,
    setLang,
  } = useEditorStore();
  const { user, checkSession } = useAuthStore();
  const [selectedProfile, setSelectedProfile] = useState("architect-cv");
  const [showImportBanner, setShowImportBanner] = useState(true);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleAutoImport() {
    const rawUsername = prompt(
      lang === "es"
        ? "Ingresa tu usuario de GitHub para auto-importar perfil y tu README.md:"
        : "Enter your GitHub username to auto-import profile & existing README.md:",
    );
    if (!rawUsername) return;

    // Sanitize to extract username from full URLs or repo paths
    let cleaned = rawUsername
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "");
    const segments = cleaned.split("/").filter(Boolean);
    const username = segments[0] || rawUsername.trim();

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
            : b,
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
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=60&sort=updated`,
      );
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
                      technologies: Array.from(
                        new Set([...b.content.technologies, ...sortedLangs]),
                      ),
                    },
                  }
                : b,
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
      let readmeRes = await fetch(
        `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
      );
      if (!readmeRes.ok) {
        readmeRes = await fetch(
          `https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
        );
      }
      if (readmeRes.ok) {
        const readmeContent = await readmeRes.text();
        if (readmeContent && readmeContent.trim()) {
          const existingMarkdown = blocks.find(
            (b) => b.kind === "markdown-custom",
          );
          if (existingMarkdown) {
            updateBlock(existingMarkdown.id, (b) =>
              b.kind === "markdown-custom"
                ? { ...b, style: b.style, content: { markdown: readmeContent } }
                : b,
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
      alert(
        lang === "es"
          ? "ÉXITO: ¡Perfil, lenguajes y README importados con éxito!"
          : "SUCCESS: Profile details, languages & existing README imported!",
      );
    } catch (err: any) {
      alert("Error importing profile: " + err.message);
    }
  }

  return (
    <main className="crt-scanlines flex flex-1 flex-col overflow-hidden bg-[var(--bg-canvas)] md:flex-row">
      {/* ── Canvas zone ── */}
      <section
        className={cn(
          "relative flex flex-col overflow-hidden transition-none",
          splitView ? "w-full md:w-[60%]" : "flex-1",
        )}
      >
        {/* Glassmorphic Premium Toolbar Strip */}
        <div className="crt-glass flex items-center justify-between border-b border-[var(--accent-phosphor)]/20 px-4 py-3 font-mono text-[10px] select-none">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="crt-glowing-glow flex items-center gap-1.5 rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--accent-phosphor)]/10 px-2.5 py-1 font-bold tracking-widest text-[var(--accent-phosphor)] uppercase transition-all hover:border-[var(--accent-phosphor)] hover:text-white"
            >
              <Home size={11} />
              <span>{t.editor.home}</span>
            </Link>

            <span className="text-[var(--accent-phosphor)]/30">|</span>

            {/* Profile switching dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] tracking-wider text-[var(--text-muted)] uppercase">
                {t.editor.workspace}:
              </span>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--bg-canvas)] px-2 py-1 font-mono text-[9px] tracking-widest text-[var(--accent-phosphor)] uppercase transition-all hover:border-[var(--accent-phosphor)] focus:border-[var(--accent-phosphor)] focus:outline-none"
              >
                <option value="architect-cv">Systems Architect CV</option>
                <option value="github-readme">GitHub Special README</option>
                <option value="devto-bio">Dev.to custom Bio</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User status */}
            <div className="hidden items-center gap-1.5 text-[var(--text-muted)] lg:flex">
              <User size={11} className="text-[var(--accent-phosphor)]" />
              <span className="font-bold text-[var(--text-primary)]">
                {user?.name
                  ? user.name.toUpperCase().replace(/\s+/g, "_")
                  : "JANE_DOE"}
              </span>
              <span className="animate-pulse rounded-sm border border-[var(--accent-phosphor)]/50 bg-[var(--accent-phosphor)]/20 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest text-[var(--accent-phosphor)] uppercase shadow-[0_0_8px_var(--glow-color)]">
                PRO
              </span>
            </div>

            {/* Language toggle selector */}
            <div className="flex items-center gap-1 rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--bg-canvas)] px-1.5 py-1">
              <Globe size={11} className="text-[var(--accent-phosphor)]" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "es")}
                className="cursor-pointer border-none bg-transparent font-mono text-[9px] tracking-widest text-[var(--accent-phosphor)] uppercase focus:outline-none"
              >
                <option value="es">ESP</option>
                <option value="en">ENG</option>
              </select>
            </div>

            {/* Visual theme toggler */}
            <ThemeToggle className="cursor-pointer rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--bg-canvas)] p-1.5 text-[var(--accent-phosphor)] transition-all hover:border-[var(--accent-phosphor)] hover:text-white hover:shadow-[0_0_8px_var(--glow-color)]" />

            <Link
              href="/settings"
              className="rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--bg-canvas)] p-1.5 text-[var(--accent-phosphor)] transition-all hover:border-[var(--accent-phosphor)] hover:text-white hover:shadow-[0_0_8px_var(--glow-color)]"
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
                "flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase transition-all",
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
              {splitView ? t.editor.canvasOnly : t.editor.splitView}
            </button>
          </div>
        </div>

        {user && showImportBanner && (
          <div className="z-20 mx-6 mt-4 flex items-center justify-between rounded-sm border border-[var(--accent-phosphor)]/30 bg-[var(--accent-phosphor)]/10 p-3 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-[var(--accent-phosphor)]">
                ●
              </span>
              <span className="text-[var(--text-primary)]">
                {t.editor.autoImportTitle}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAutoImport}
                className="cursor-pointer rounded-sm bg-[var(--accent-phosphor)] px-3 py-1 font-bold tracking-wider text-[var(--bg-canvas)] uppercase transition-all hover:-translate-y-0.5"
              >
                {t.editor.autoImportBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowImportBanner(false)}
                className="cursor-pointer px-2 tracking-wider text-[var(--text-muted)] uppercase hover:text-white"
              >
                {t.editor.dismissBtn}
              </button>
            </div>
          </div>
        )}

        <EditorCanvas />
      </section>

      {/* ── Markdown preview (split view only) ── */}
      {splitView && (
        <section className="flex w-full flex-col overflow-hidden border-t border-[var(--accent-phosphor)]/20 bg-[var(--bg-canvas)]/90 backdrop-blur-md md:w-[40%] md:border-t-0 md:border-l">
          <MarkdownPreview />
        </section>
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-full flex-shrink-0 flex-col overflow-y-auto border-t border-[var(--accent-phosphor)]/20 bg-[var(--bg-surface)]/95 backdrop-blur-md md:w-80 md:border-t-0 md:border-l">
        <EditorSidebar />
      </aside>
    </main>
  );
}

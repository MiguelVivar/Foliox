"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { GithubStatsBlock, HeroBioBlock, TechStackBlock } from "@/types/ast";
import { Download } from "lucide-react";

type Props = { block: GithubStatsBlock };

export function GithubStatsForm({ block }: Props) {
  const { updateBlock, blocks, addBlock } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  function patch(partial: Partial<GithubStatsBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "github-stats"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
  }

  async function handleImport() {
    const { username } = block.content;
    if (!username.trim()) {
      setStatusMsg("ERR: USERNAME_REQUIRED");
      return;
    }

    setLoading(true);
    setStatusMsg("IMPORTING...");

    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("USER_NOT_FOUND");
      const userData = await userRes.json();

      // Find or create Hero Bio
      const existingHero = blocks.find((b) => b.kind === "hero-bio") as HeroBioBlock | undefined;
      if (existingHero) {
        updateBlock(existingHero.id, (b) =>
          b.kind === "hero-bio"
            ? {
                ...b,
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

      // 2. Fetch repo languages
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
          const existingTech = blocks.find((b) => b.kind === "tech-stack") as TechStackBlock | undefined;
          if (existingTech) {
            updateBlock(existingTech.id, (b) =>
              b.kind === "tech-stack"
                ? {
                    ...b,
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

      setStatusMsg("SUCCESS: PROFILE_IMPORTED");
    } catch (err: any) {
      setStatusMsg(err.message === "USER_NOT_FOUND" ? "ERR: USER_NOT_FOUND" : "ERR: FETCH_FAILED");
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-phosphor)] transition-colors";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="gs-username" className={labelClass}>
          GitHub Username
        </label>
        <div className="flex gap-2">
          <input
            id="gs-username"
            type="text"
            value={block.content.username}
            onChange={(e) => patch({ username: e.target.value })}
            placeholder="your-github-username"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="flex items-center justify-center rounded-sm border border-[var(--border-subtle)] px-3 hover:border-[var(--accent-phosphor)] hover:text-[var(--accent-phosphor)] text-[var(--text-muted)] focus:outline-none transition-colors"
            title="Import profile details from GitHub"
          >
            <Download size={14} className={loading ? "animate-bounce" : ""} />
          </button>
        </div>
        {statusMsg && (
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent-phosphor)]">
            [{statusMsg}]
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          id="gs-private"
          type="checkbox"
          checked={block.content.showPrivate}
          onChange={(e) => patch({ showPrivate: e.target.checked })}
          className="h-4 w-4 accent-[var(--accent-phosphor)]"
        />
        <span className="text-sm text-[var(--text-primary)]">
          Include private contributions
        </span>
      </label>

      {block.content.username && (
        <p className="font-mono text-[10px] text-[var(--text-muted)]">
          Preview URL:{" "}
          <span className="break-all">
            github-readme-stats.vercel.app/api?username={block.content.username}
          </span>
        </p>
      )}
    </div>
  );
}

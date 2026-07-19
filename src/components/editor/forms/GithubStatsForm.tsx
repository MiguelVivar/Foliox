"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { GITHUB_STATS_THEMES } from "@/types/ast";
import type { GithubStatsBlock } from "@/types/ast";

type Props = { block: GithubStatsBlock };

export function GithubStatsForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  function patch(partial: Partial<GithubStatsBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "github-stats"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
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
        <input
          id="gs-username"
          type="text"
          value={block.content.username}
          onChange={(e) => patch({ username: e.target.value })}
          placeholder="your-github-username"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="gs-theme" className={labelClass}>
          Theme
        </label>
        <select
          id="gs-theme"
          value={block.content.theme || "dark"}
          onChange={(e) =>
            patch({
              theme: e.target.value as GithubStatsBlock["content"]["theme"],
            })
          }
          className={inputClass}
        >
          {GITHUB_STATS_THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
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

      {/* Toggles for Extra Widgets */}
      <div className="flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3">
        <span className={labelClass}>Infographics & Metrics</span>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.useMetrics}
            onChange={(e) => patch({ useMetrics: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            🚀 Use Metrics API (no rate-limit)
          </span>
        </label>

        {block.content.useMetrics && (
          <div className="ml-6 flex flex-col gap-1.5">
            <label htmlFor="gs-metrics-template" className={labelClass}>
              Metrics Template
            </label>
            <select
              id="gs-metrics-template"
              value={block.content.metricsTemplate || "default"}
              onChange={(e) =>
                patch({ metricsTemplate: e.target.value as any })
              }
              className={inputClass}
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.showLangs}
            onChange={(e) => patch({ showLangs: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            [+] Language Pie Chart
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.showTrophies}
            onChange={(e) => patch({ showTrophies: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            [+] Trophy Case (trophies)
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.showVisitorCounter}
            onChange={(e) => patch({ showVisitorCounter: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            [+] Visitor Counter
          </span>
        </label>
      </div>

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

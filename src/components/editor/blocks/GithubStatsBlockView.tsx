import { GitBranch } from "lucide-react";
import type { GithubStatsBlock } from "@/types/ast";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, showLangs, showTrophies, showVisitorCounter } = block.content;

  return (
    <div className="flex flex-col gap-3">
      {/* Username row */}
      <div className="flex items-center gap-2">
        <GitBranch size={16} className="text-[var(--text-muted)]" />
        <span className="font-mono text-sm text-[var(--text-primary)]">
          {username || <span className="italic text-[var(--text-muted)]">your-username</span>}
        </span>
      </div>

      {/* Visitor counter preview */}
      {showVisitorCounter && username && (
        <div className="flex justify-center border border-[var(--border-subtle)] p-2 rounded-sm bg-[var(--bg-canvas)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://profile-counter.glitch.me/${username}/count.svg`} alt="Visitor count" className="h-6 object-contain" />
        </div>
      )}

      {/* Stats preview placeholders */}
      <div className="grid grid-cols-3 gap-2">
        {["Commits", "PRs", "Stars"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-sm border border-[var(--border-subtle)] px-2 py-2"
          >
            <span className="font-mono text-xs text-[var(--text-muted)]">—</span>
            <span className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>

      {/* Extra widgets indicators */}
      {(showLangs || showTrophies) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {showLangs && (
            <span className="text-[8px] bg-[var(--accent-phosphor)]/10 text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)]/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono font-bold">
              [+] Lang_Chart
            </span>
          )}
          {showTrophies && (
            <span className="text-[8px] bg-[var(--accent-phosphor)]/10 text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)]/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono font-bold">
              [+] Trophies_Case
            </span>
          )}
        </div>
      )}

      <p className="font-mono text-[10px] text-[var(--text-muted)]">
        [stats rendered via github-readme-stats / profile-counter APIs]
      </p>
    </div>
  );
}

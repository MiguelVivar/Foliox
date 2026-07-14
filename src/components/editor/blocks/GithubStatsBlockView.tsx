import { GitBranch } from "lucide-react";
import type { GithubStatsBlock } from "@/types/ast";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username } = block.content;

  return (
    <div className="flex flex-col gap-3">
      {/* Username row */}
      <div className="flex items-center gap-2">
        <GitBranch size={16} className="text-[var(--text-muted)]" />
        <span className="font-mono text-sm text-[var(--text-primary)]">
          {username || <span className="italic text-[var(--text-muted)]">your-username</span>}
        </span>
      </div>

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

      <p className="font-mono text-[10px] text-[var(--text-muted)]">
        [stats rendered via github-readme-stats API]
      </p>
    </div>
  );
}

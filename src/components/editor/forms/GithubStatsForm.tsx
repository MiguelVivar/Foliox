"use client";

import { useEditorStore } from "@/store/useEditorStore";
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
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
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

      <label className="flex cursor-pointer items-center gap-3">
        <input
          id="gs-private"
          type="checkbox"
          checked={block.content.showPrivate}
          onChange={(e) => patch({ showPrivate: e.target.checked })}
          className="h-4 w-4 accent-[var(--border-focus)]"
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

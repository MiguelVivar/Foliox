"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { HeroBioBlock } from "@/types/ast";

type Props = { block: HeroBioBlock };

export function HeroBioForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  function patch(partial: Partial<HeroBioBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "hero-bio"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hb-name" className={labelClass}>Name</label>
        <input
          id="hb-name"
          type="text"
          value={block.content.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="hb-tagline" className={labelClass}>Tagline</label>
        <input
          id="hb-tagline"
          type="text"
          value={block.content.tagline}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder="e.g. Full-Stack Engineer · Open Source"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="hb-avatar" className={labelClass}>Avatar URL</label>
        <input
          id="hb-avatar"
          type="url"
          value={block.content.avatarUrl ?? ""}
          onChange={(e) => patch({ avatarUrl: e.target.value })}
          placeholder="https://github.com/you.png"
          className={inputClass}
        />
      </div>
    </div>
  );
}

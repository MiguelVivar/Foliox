"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { AsciiBannerBlock } from "@/types/ast";

const FONT_OPTIONS = [
  { value: "banner", label: "Banner" },
  { value: "block", label: "Block" },
  { value: "doom", label: "Doom" },
  { value: "slant", label: "Slant" },
  { value: "big", label: "Big" },
];

type Props = { block: AsciiBannerBlock };

export function AsciiBannerForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  function patch(partial: Partial<AsciiBannerBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "ascii-banner"
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
        <label htmlFor="ab-text" className={labelClass}>
          Banner Text
        </label>
        <input
          id="ab-text"
          type="text"
          value={block.content.text}
          onChange={(e) => patch({ text: e.target.value })}
          placeholder="FOLIOX"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ab-font" className={labelClass}>
          Font Style
        </label>
        <select
          id="ab-font"
          value={block.content.font}
          onChange={(e) => patch({ font: e.target.value })}
          className={inputClass}
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="font-mono text-[10px] text-[var(--text-muted)]">
        Full figlet rendering via Web Worker — Phase 6.
      </p>
    </div>
  );
}

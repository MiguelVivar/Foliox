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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ab-size" className={labelClass}>
          Font Size ({block.content.fontSize || 13}px)
        </label>
        <input
          id="ab-size"
          type="range"
          min="10"
          max="20"
          value={block.content.fontSize || 13}
          onChange={(e) => patch({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ab-color" className={labelClass}>
          Font Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="ab-color"
            type="color"
            value={block.content.fontColor || "#58a6ff"}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={block.content.fontColor || "#58a6ff"}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className={inputClass}
            placeholder="#58a6ff"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 select-none">
        <input
          type="checkbox"
          checked={block.content.glowEnabled ?? true}
          onChange={(e) => patch({ glowEnabled: e.target.checked })}
          className="h-4 w-4 accent-[var(--accent-phosphor)]"
        />
        <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
          Enable Glow Effect
        </span>
      </label>

      <label className="flex cursor-pointer items-center gap-3 select-none">
        <input
          type="checkbox"
          checked={block.content.shadowEnabled ?? false}
          onChange={(e) => patch({ shadowEnabled: e.target.checked })}
          className="h-4 w-4 accent-[var(--accent-phosphor)]"
        />
        <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
          Enable Text Shadow
        </span>
      </label>
    </div>
  );
}

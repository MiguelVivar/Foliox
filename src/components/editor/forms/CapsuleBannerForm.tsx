"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { CAPSULE_TYPES } from "@/types/ast";
import type { CapsuleBannerBlock } from "@/types/ast";

type Props = { block: CapsuleBannerBlock };

export function CapsuleBannerForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const {
    text = "",
    type,
    color,
    height = 200,
    fontColor = "#ffffff",
    section = "header",
  } = block.content;

  function patch(partial: Partial<CapsuleBannerBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "capsule-banner"
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
        <label htmlFor="cb-text" className={labelClass}>
          Banner Text
        </label>
        <input
          id="cb-text"
          type="text"
          value={text}
          onChange={(e) => patch({ text: e.target.value })}
          placeholder="Welcome to my profile"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-type" className={labelClass}>
          Shape
        </label>
        <select
          id="cb-type"
          value={type}
          onChange={(e) =>
            patch({
              type: e.target.value as CapsuleBannerBlock["content"]["type"],
            })
          }
          className={inputClass}
        >
          {CAPSULE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-section" className={labelClass}>
          Position
        </label>
        <select
          id="cb-section"
          value={section}
          onChange={(e) =>
            patch({ section: e.target.value as "header" | "footer" })
          }
          className={inputClass}
        >
          <option value="header">Header</option>
          <option value="footer">Footer</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-height" className={labelClass}>
          Height ({height}px)
        </label>
        <input
          id="cb-height"
          type="range"
          min="100"
          max="400"
          value={height}
          onChange={(e) => patch({ height: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-color" className={labelClass}>
          Banner Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="cb-color"
            type="color"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-fontcolor" className={labelClass}>
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="cb-fontcolor"
            type="color"
            value={fontColor}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={fontColor}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

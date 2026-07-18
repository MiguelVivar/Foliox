"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { RichMediaBlock } from "@/types/ast";

type Props = { block: RichMediaBlock };

export function RichMediaForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  function patch(partial: Partial<RichMediaBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "rich-media"
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
      {/* Media Type */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Media Type</span>
        <div className="grid grid-cols-2 gap-2">
          {["image", "video"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => patch({ mediaType: type as "image" | "video" })}
              className={`py-2 text-center rounded-sm font-mono text-xs border uppercase tracking-wider transition-colors ${
                block.content.mediaType === type
                  ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-phosphor)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rm-url" className={labelClass}>
          Media Source URL
        </label>
        <input
          id="rm-url"
          type="url"
          value={block.content.url}
          onChange={(e) => patch({ url: e.target.value })}
          placeholder="https://example.com/image.png or .mp4"
          className={inputClass}
        />
      </div>

      {/* Alignment */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Alignment</span>
        <div className="grid grid-cols-3 gap-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => patch({ align: align as "left" | "center" | "right" })}
              className={`py-2 text-center rounded-sm font-mono text-xs border uppercase tracking-wider transition-colors ${
                block.content.align === align
                  ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-phosphor)]"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rm-width" className={labelClass}>
            Width (optional)
          </label>
          <input
            id="rm-width"
            type="number"
            value={block.content.width || ""}
            onChange={(e) => patch({ width: parseInt(e.target.value) || undefined })}
            placeholder="Auto"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rm-height" className={labelClass}>
            Height (optional)
          </label>
          <input
            id="rm-height"
            type="number"
            value={block.content.height || ""}
            onChange={(e) => patch({ height: parseInt(e.target.value) || undefined })}
            placeholder="Auto"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

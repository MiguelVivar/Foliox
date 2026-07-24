"use client";

import { Plus, X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import type { TypingHeaderBlock } from "@/types/ast";

type Props = { block: TypingHeaderBlock };

export function TypingHeaderForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const { lines, speed = 50, pauseMs = 1000, color = "#36BCF7", fontSize = 24 } = block.content;

  function patch(partial: Partial<TypingHeaderBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "typing-header" ? { ...b, content: { ...b.content, ...partial } } : b,
    );
  }

  function setLine(index: number, value: string) {
    patch({ lines: lines.map((line, i) => (i === index ? value : line)) });
  }

  function addLine() {
    patch({ lines: [...lines, ""] });
  }

  function removeLine(index: number) {
    patch({ lines: lines.filter((_, i) => i !== index) });
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Lines</span>
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={line}
              onChange={(e) => setLine(index, e.target.value)}
              placeholder="Hi there, I'm Alex 👋"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeLine(index)}
              aria-label={`Remove line ${index + 1}`}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLine}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-[var(--border-subtle)] px-3 py-2 font-mono text-xs text-[var(--text-muted)] hover:border-[var(--accent-phosphor)] hover:text-[var(--accent-phosphor)]"
        >
          <Plus size={12} /> Add line
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-speed" className={labelClass}>
          Speed ({speed}ms per character)
        </label>
        <input
          id="th-speed"
          type="range"
          min="10"
          max="150"
          value={speed}
          onChange={(e) => patch({ speed: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-pause" className={labelClass}>
          Pause before deleting ({pauseMs}ms)
        </label>
        <input
          id="th-pause"
          type="range"
          min="0"
          max="3000"
          step="100"
          value={pauseMs}
          onChange={(e) => patch({ pauseMs: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-size" className={labelClass}>
          Font Size ({fontSize}px)
        </label>
        <input
          id="th-size"
          type="range"
          min="12"
          max="48"
          value={fontSize}
          onChange={(e) => patch({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-color" className={labelClass}>
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="th-color"
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
            placeholder="#36BCF7"
          />
        </div>
      </div>
    </div>
  );
}

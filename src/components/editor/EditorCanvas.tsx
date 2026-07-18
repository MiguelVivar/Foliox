"use client";

import { DotGrid } from "@/components/atoms/DotGrid";
import { useEditorStore } from "@/store/useEditorStore";
import { BentoCard } from "./BentoCard";

export function EditorCanvas() {
  const { blocks, selectBlock } = useEditorStore();

  return (
    <div
      className="relative flex flex-1 overflow-auto p-8 bg-[var(--bg-canvas)]"
      onClick={() => selectBlock(null)}
    >
      {/* Dot Grid background */}
      <DotGrid />

      {/* Canva Relative Sheet Area */}
      <div className="relative w-full h-[1500px] min-h-[1200px] border border-dashed border-[var(--accent-phosphor)]/10 rounded-sm">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center absolute inset-0 pointer-events-none select-none">
            <span className="font-mono text-4xl text-[var(--text-muted)] flex items-center justify-center h-12 w-12 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-sm shadow-[4px_4px_0_0_var(--border-subtle)]">
              +
            </span>
            <p className="text-sm font-medium text-[var(--text-primary)] mt-4">
              CANVAS_EMPTY
            </p>
            <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Add a block from the sidebar to start building <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">█</span>
            </p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <BentoCard
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
            />
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useEditorStore } from "@/store/useEditorStore";
import type { Block } from "@/types/ast";

type Props = { block: Block };

export function BlockStyleForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  const hasBorder = block.style?.hasBorder ?? true;
  const animate = block.style?.animate ?? false;

  function patchStyle(partial: { hasBorder?: boolean; animate?: boolean }) {
    updateBlock(block.id, (b) => ({
      ...b,
      style: {
        ...(b.style || {}),
        ...partial,
      },
    }));
  }

  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4 mt-4">
      <span className={labelClass}>Section Layout & Borders</span>
      
      <div className="flex flex-col gap-2">
        {/* Toggle Border */}
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <input
            type="checkbox"
            checked={hasBorder}
            onChange={(e) => patchStyle({ hasBorder: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
            [+] Render border wrapper
          </span>
        </label>

        {/* Toggle Animation */}
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <input
            type="checkbox"
            checked={animate}
            onChange={(e) => patchStyle({ animate: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
            [+] Micro-animations / scanlines
          </span>
        </label>
      </div>
    </div>
  );
}

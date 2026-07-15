"use client";

import { useFiglet } from "@/hooks/useFiglet";
import type { AsciiBannerBlock } from "@/types/ast";

type Props = { block: AsciiBannerBlock };

export function AsciiBannerBlockView({ block }: Props) {
  const { text, font } = block.content;
  const { art, loading } = useFiglet(text, font);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          ASCII Banner
        </span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {font}
        </span>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
        {!text ? (
          <span className="font-mono text-xs italic text-[var(--text-muted)]">
            Type text in the sidebar to preview…
          </span>
        ) : loading ? (
          <span className="animate-pulse font-mono text-xs text-[var(--text-muted)]">
            Rendering…
          </span>
        ) : art ? (
          <pre className="font-mono text-[10px] leading-tight text-[var(--text-primary)]">
            {art}
          </pre>
        ) : (
          <span className="font-mono text-xs italic text-[var(--text-muted)]">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

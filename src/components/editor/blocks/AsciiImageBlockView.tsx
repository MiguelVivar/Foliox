"use client";

import type { AsciiImageBlock } from "@/types/ast";

type Props = { block: AsciiImageBlock };

export function AsciiImageBlockView({ block }: Props) {
  const { asciiArt, colorMode, width } = block.content;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          ASCII Image Art
        </span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          w: {width || 60} · {colorMode}
        </span>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
        {!asciiArt ? (
          <span className="font-mono text-xs italic text-[var(--text-muted)]">
            Upload an image in the sidebar to convert to ASCII…
          </span>
        ) : (
          <pre className="font-mono text-[9px] leading-[7px] tracking-tighter text-[var(--text-primary)] whitespace-pre overflow-x-auto">
            {asciiArt}
          </pre>
        )}
      </div>
    </div>
  );
}

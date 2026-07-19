"use client";

import { useFiglet } from "@/hooks/useFiglet";
import type { AsciiBannerBlock } from "@/types/ast";

type Props = { block: AsciiBannerBlock };

export function AsciiBannerBlockView({ block }: Props) {
  const {
    text,
    font,
    fontSize = 13,
    fontColor = "#58a6ff",
    glowEnabled = true,
    shadowEnabled = false,
  } = block.content;
  const { art, loading } = useFiglet(text, font);

  const bannerStyle = {
    fontSize: `${fontSize}px`,
    color: fontColor,
    textShadow: shadowEnabled ? `0 0 8px ${fontColor}` : undefined,
    filter: glowEnabled ? `drop-shadow(0 0 8px ${fontColor})` : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
          ASCII Banner
        </span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {font}
        </span>
      </div>

      <div className="flex items-center justify-center overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6">
        {!text ? (
          <span className="font-mono text-xs text-[var(--text-muted)] italic">
            Type text in the sidebar to preview…
          </span>
        ) : loading ? (
          <span className="animate-pulse font-mono text-xs text-[var(--text-muted)]">
            Rendering…
          </span>
        ) : art ? (
          <pre
            className="font-mono leading-[1.15] whitespace-pre"
            style={bannerStyle}
          >
            {art}
          </pre>
        ) : (
          <span className="font-mono text-xs text-[var(--text-muted)] italic">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

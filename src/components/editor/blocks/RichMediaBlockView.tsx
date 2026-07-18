"use client";

import { Video, Image as ImageIcon } from "lucide-react";
import type { RichMediaBlock } from "@/types/ast";

type Props = { block: RichMediaBlock };

export function RichMediaBlockView({ block }: Props) {
  const { url, mediaType, align, width, height } = block.content;

  if (!url) {
    return (
      <div className="flex items-center gap-2 rounded-sm border border-dashed border-[var(--border-subtle)] p-4 justify-center">
        {mediaType === "video" ? (
          <Video size={16} className="text-[var(--text-muted)] animate-pulse" />
        ) : (
          <ImageIcon size={16} className="text-[var(--text-muted)] animate-pulse" />
        )}
        <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Empty media source
        </span>
      </div>
    );
  }

  const alignStyles: Record<string, string> = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  };

  const style = {
    width: width ? `${width}px` : "100%",
    maxHeight: height ? `${height}px` : "200px",
    objectFit: "contain" as const,
  };

  return (
    <div className={`flex w-full ${alignStyles[align]}`}>
      {mediaType === "video" ? (
        <video src={url} controls style={style} className="rounded-sm border border-[var(--border-subtle)]" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="media preview" style={style} className="rounded-sm border border-[var(--border-subtle)]" />
      )}
    </div>
  );
}

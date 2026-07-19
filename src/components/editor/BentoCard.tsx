"use client";

import React from "react";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEditorStore } from "@/store/useEditorStore";
import type { Block } from "@/types/ast";

import { HeroBioBlockView } from "./blocks/HeroBioBlockView";
import { TechStackBlockView } from "./blocks/TechStackBlockView";
import { GithubStatsBlockView } from "./blocks/GithubStatsBlockView";
import { AsciiBannerBlockView } from "./blocks/AsciiBannerBlockView";
import { AsciiImageBlockView } from "./blocks/AsciiImageBlockView";
import { SocialLinksBlockView } from "./blocks/SocialLinksBlockView";
import { RichMediaBlockView } from "./blocks/RichMediaBlockView";
import { MarkdownCustomBlockView } from "./blocks/MarkdownCustomBlockView";

const KIND_LABELS: Record<Block["kind"], string> = {
  "hero-bio": "Hero / Bio",
  "tech-stack": "Tech Stack",
  "github-stats": "GitHub Stats",
  "ascii-banner": "ASCII Banner",
  "ascii-image": "ASCII Image",
  "social-links": "Social Links",
  "rich-media": "Rich Media",
  "markdown-custom": "Custom Markdown",
};

type Props = {
  block: Block;
};

export function BentoCard({ block }: Props) {
  const { selectedBlockId, selectBlock, removeBlock } = useEditorStore();

  const isSelected = selectedBlockId === block.id;
  const hasBorder = block.style?.hasBorder ?? true;
  const isAnimated = block.style?.animate ?? false;

  function renderBlockContent() {
    switch (block.kind) {
      case "hero-bio":
        return <HeroBioBlockView block={block} />;
      case "tech-stack":
        return <TechStackBlockView block={block} />;
      case "github-stats":
        return <GithubStatsBlockView block={block} />;
      case "ascii-banner":
        return <AsciiBannerBlockView block={block} />;
      case "ascii-image":
        return <AsciiImageBlockView block={block} />;
      case "social-links":
        return <SocialLinksBlockView block={block} />;
      case "rich-media":
        return <RichMediaBlockView block={block} />;
      case "markdown-custom":
        return <MarkdownCustomBlockView block={block} />;
    }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-md p-5 transition-all duration-150 outline-none",
        isAnimated && "animate-[pulse_2s_infinite]",
        hasBorder
          ? isSelected
            ? "border border-[#f78166] bg-[#0d1117] shadow-[0_0_12px_rgba(247,129,102,0.15)]"
            : "border border-[#30363d] bg-[#0d1117] hover:border-[#8b949e]"
          : isSelected
            ? "border border-dashed border-[#f78166]/60 bg-[#0d1117]/80"
            : "border border-dashed border-[#30363d]/40 bg-[#0d1117]/40 hover:border-[#8b949e]/40",
      )}
    >
      {/* Drag handle + header badge */}
      <div className="block-drag-handle mb-3 flex cursor-grab items-center justify-between border-b border-[#30363d]/60 pb-2 text-xs select-none active:cursor-grabbing">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-[#8b949e] uppercase">
          <GripVertical size={12} className="text-[#8b949e]/60" />
          {KIND_LABELS[block.kind]}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(block.id);
          }}
          className="block-drag-handle-cancel text-[#8b949e] transition-colors hover:text-[#f78166]"
          title="Remove block"
        >
          <X size={13} />
        </button>
      </div>

      {/* Content wrapper - scrolls internally if it overflows the resized block */}
      <div className="w-full flex-1 overflow-auto text-left">
        {renderBlockContent()}
      </div>
    </div>
  );
}

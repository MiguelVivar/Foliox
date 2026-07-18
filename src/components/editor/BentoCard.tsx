"use client";

import React, { useState } from "react";
import { X, CornerRightDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { DragHandle } from "@/components/atoms/DragHandle";
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

// Label shown in the card header per block kind
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
  index: number;
  totalBlocks: number;
};

export function BentoCard({ block, index }: Props) {
  const { selectedBlockId, selectBlock, removeBlock, updateBlock } =
    useEditorStore();

  const isSelected = selectedBlockId === block.id;
  const hasBorder = block.style?.hasBorder ?? true;
  const isAnimated = block.style?.animate ?? false;

  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [blockStart, setBlockStart] = useState({ x: 0, y: 0 });

  const [resizing, setResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [sizeStart, setSizeStart] = useState({ w: 0, h: 0 });

  function handleDragStart(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    selectBlock(block.id);

    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setBlockStart({
      x: block.position?.x ?? 40,
      y: block.position?.y ?? (40 + index * 120),
    });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleDragMove(e: React.PointerEvent) {
    if (!dragging) return;
    e.stopPropagation();

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const snapGrid = 10;
    const newX = Math.round((blockStart.x + dx) / snapGrid) * snapGrid;
    const newY = Math.round((blockStart.y + dy) / snapGrid) * snapGrid;

    updateBlock(block.id, (b) => ({
      ...b,
      position: {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        w: b.position?.w ?? 320,
        h: b.position?.h ?? 220,
      },
    }));
  }

  function handleDragEnd(e: React.PointerEvent) {
    if (dragging) {
      setDragging(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }

  function handleResizeStart(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setSizeStart({
      w: block.position?.w ?? 320,
      h: block.position?.h ?? 220,
    });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleResizeMove(e: React.PointerEvent) {
    if (!resizing) return;
    e.stopPropagation();

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;

    const newW = Math.round((sizeStart.w + dx) / 10) * 10;
    const newH = Math.round((sizeStart.h + dy) / 10) * 10;

    updateBlock(block.id, (b) => ({
      ...b,
      position: {
        x: b.position?.x ?? 40,
        y: b.position?.y ?? (40 + index * 120),
        w: Math.max(150, newW),
        h: Math.max(80, newH),
      },
    }));
  }

  function handleResizeEnd(e: React.PointerEvent) {
    if (resizing) {
      setResizing(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }

  const cardStyle = {
    position: "absolute" as const,
    left: `${block.position?.x ?? 40}px`,
    top: `${block.position?.y ?? (40 + index * 120)}px`,
    width: `${block.position?.w ?? 320}px`,
    height: `${block.position?.h ?? 220}px`,
    zIndex: isSelected ? 30 : 10,
  };

  // Block content dispatcher
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
      style={cardStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      className={cn(
        "group relative rounded-sm p-4 outline-none transition-all duration-100 overflow-hidden flex flex-col",
        isAnimated && "animate-[pulse_2s_infinite]",
        hasBorder
          ? isSelected
            ? "border border-[var(--accent-phosphor)] bg-[var(--bg-surface)] shadow-[0_0_15px_rgba(110,231,167,0.25),4px_4px_0_0_var(--accent-phosphor)]"
            : "border border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 hover:border-[var(--accent-phosphor)] hover:shadow-[0_0_12px_rgba(110,231,167,0.15),4px_4px_0_0_var(--accent-phosphor)]"
          : isSelected
            ? "border border-dashed border-[var(--accent-phosphor)]/60 bg-[var(--bg-canvas)]/40 shadow-[0_0_10px_rgba(110,231,167,0.15)]"
            : "border border-dashed border-[var(--border-subtle)]/40 bg-[var(--bg-canvas)]/20 hover:border-[var(--accent-phosphor)]/40 hover:shadow-[0_0_8px_rgba(110,231,167,0.08)]",
        dragging && "opacity-80 shadow-none cursor-grabbing",
      )}
    >
      {/* Card header */}
      <div className="mb-2 flex items-center justify-between border-b border-[var(--border-subtle)]/50 pb-1 select-none">
        <div
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing hover:text-[var(--accent-phosphor)] transition-colors flex-1"
        >
          <DragHandle className="h-3 w-3 text-inherit" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
            [{KIND_LABELS[block.kind]}]
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(block.id);
          }}
          className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
          title="Remove block"
        >
          <X size={12} />
        </button>
      </div>

      {/* Block-specific content */}
      {renderBlockContent()}
    </div>
  );
}

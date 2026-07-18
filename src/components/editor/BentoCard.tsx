"use client";

import { useCallback, type KeyboardEvent } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
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

export function BentoCard({ block, index, totalBlocks }: Props) {
  const { selectedBlockId, selectBlock, removeBlock, reorderBlocks } =
    useEditorStore();

  const isSelected = selectedBlockId === block.id;

  // dnd-kit sortable wiring
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Keyboard reorder: Alt+ArrowUp / Alt+ArrowDown (DESIGN.md §5, WCAG spec)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!e.altKey) return;
      if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        reorderBlocks(index, index - 1);
      } else if (e.key === "ArrowDown" && index < totalBlocks - 1) {
        e.preventDefault();
        reorderBlocks(index, index + 1);
      }
    },
    [index, totalBlocks, reorderBlocks],
  );

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
      ref={setNodeRef}
      style={style}
      // Accessible focus target for keyboard reorder
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => selectBlock(isSelected ? null : block.id)}
      aria-label={`${KIND_LABELS[block.kind]} block. Press Alt+ArrowUp or Alt+ArrowDown to reorder.`}
      className={cn(
        // Base card (DESIGN.md §4.1 Bento Cards)
        "group relative rounded-sm border p-5 outline-none transition-all duration-300",
        // Sleek neon glow styling
        isSelected
          ? "border-[var(--accent-phosphor)] bg-[var(--bg-surface)] -translate-y-1 shadow-[0_0_15px_rgba(110,231,167,0.25),4px_4px_0_0_var(--accent-phosphor)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 hover:border-[var(--accent-phosphor)] hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(110,231,167,0.15),4px_4px_0_0_var(--accent-phosphor)]",
        // Ghost state while dragging (DESIGN.md §4.1)
        isDragging ? "opacity-30 shadow-none -translate-y-0" : "opacity-100",
        // Keyboard focus ring
        "focus-visible:outline-2 focus-visible:outline-[var(--accent-phosphor)]",
        // Hover surface
        "hover:bg-[var(--bg-surface-hover)]/95",
      )}
    >
      {/* Card header: drag handle + label + remove */}
      <div className="mb-3 flex items-center gap-2">
        {/* Drag handle — visible on hover, wired to dnd-kit listeners */}
        <DragHandle
          {...attributes}
          {...listeners}
          // Override cursor while drag attributes are active
          className="cursor-grab active:cursor-grabbing"
        />

        <span className="flex-1 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--accent-phosphor)] transition-colors">
          [{KIND_LABELS[block.kind]}]
        </span>

        {/* Remove button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don't trigger card selection
            removeBlock(block.id);
          }}
          aria-label={`Remove ${KIND_LABELS[block.kind]} block`}
          className="flex h-5 w-5 items-center justify-center rounded-sm text-[var(--text-muted)] opacity-0 hover:text-[var(--accent-phosphor)] group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--accent-phosphor)] transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Block-specific content */}
      {renderBlockContent()}
    </div>
  );
}

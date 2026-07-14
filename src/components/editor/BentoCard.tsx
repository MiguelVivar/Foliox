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
import { MarkdownCustomBlockView } from "./blocks/MarkdownCustomBlockView";

// Label shown in the card header per block kind
const KIND_LABELS: Record<Block["kind"], string> = {
  "hero-bio": "Hero / Bio",
  "tech-stack": "Tech Stack",
  "github-stats": "GitHub Stats",
  "ascii-banner": "ASCII Banner",
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
        "group relative rounded-md border bg-[var(--bg-surface)] p-4 outline-none",
        // Border: subtle by default, focus-color when selected
        isSelected
          ? "border-[var(--border-focus)]"
          : "border-[var(--border-subtle)]",
        // Ghost state while dragging (DESIGN.md §4.1)
        isDragging ? "opacity-30" : "opacity-100",
        // Keyboard focus ring (DESIGN.md §5: outline-2 outline-mauve-500)
        "focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]",
        // Hover surface
        "hover:bg-[var(--bg-surface-hover)]",
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

        <span className="flex-1 font-mono text-xs text-[var(--text-muted)]">
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
          className="flex h-5 w-5 items-center justify-center rounded-sm text-[var(--text-muted)] opacity-0 hover:text-[var(--text-primary)] group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
        >
          <X size={12} />
        </button>
      </div>

      {/* Block-specific content */}
      {renderBlockContent()}
    </div>
  );
}

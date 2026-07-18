"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DotGrid } from "@/components/atoms/DotGrid";
import { useEditorStore } from "@/store/useEditorStore";
import { BentoCard } from "./BentoCard";

export function EditorCanvas() {
  const { blocks, reorderBlocks, selectBlock } = useEditorStore();

  // dnd-kit sensors: pointer (mouse/touch) + keyboard (Enter/Space + arrows)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px of movement before initiating a drag, to prevent accidental drags on click
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = blocks.findIndex((b) => b.id === active.id);
    const toIndex = blocks.findIndex((b) => b.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderBlocks(fromIndex, toIndex);
    }
  }

  return (
    // Deselect on canvas click (clicking the empty area, not a card)
    <div
      className="relative flex flex-1 flex-col overflow-y-auto p-6"
      onClick={() => selectBlock(null)}
    >
      {/* Dot Grid background (DESIGN.md §4.1) */}
      <DotGrid />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-3">
            {blocks.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <span className="font-mono text-4xl text-[var(--text-muted)] flex items-center justify-center h-12 w-12 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-sm shadow-[4px_4px_0_0_var(--border-subtle)]" aria-hidden="true">
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
        </SortableContext>
      </DndContext>
    </div>
  );
}

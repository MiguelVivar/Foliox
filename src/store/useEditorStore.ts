"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block, Position } from "@/types/ast";
import type { Language } from "@/lib/translations";

// ---------------------------------------------------------------------------
// Style types (exported so serializer + StylePanel can share them)
// ---------------------------------------------------------------------------

export type BadgeStyle = "flat-square" | "flat" | "for-the-badge" | "plastic";

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

type EditorState = {
  blocks: Block[];
  selectedBlockId: string | null;
  splitView: boolean;
  badgeStyle: BadgeStyle;
  sectionSeparator: boolean;
  lang: Language;
};

type EditorActions = {
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updater: (block: Block) => Block) => void;
  updateBlockPositions: (updates: { id: string; position: Position }[]) => void;
  selectBlock: (id: string | null) => void;
  toggleSplitView: () => void;
  setBadgeStyle: (style: BadgeStyle) => void;
  toggleSectionSeparator: () => void;
  setLang: (lang: Language) => void;
};

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set) => ({
      blocks: [],
      selectedBlockId: null,
      splitView: false,
      badgeStyle: "flat-square",
      sectionSeparator: false,
      lang: "es",
      addBlock: (block) =>
        set((state) => {
          // New blocks stack below the lowest existing block on the
          // 12-column grid (see EditorCanvas) unless the caller already
          // supplies a position.
          const nextY = state.blocks.reduce(
            (max, b) =>
              Math.max(max, (b.position?.y ?? 0) + (b.position?.h ?? 0)),
            0,
          );
          const position = block.position || { x: 0, y: nextY, w: 12, h: 10 };
          return { blocks: [...state.blocks, { ...block, position }] };
        }),
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlockId:
            state.selectedBlockId === id ? null : state.selectedBlockId,
        })),
      updateBlock: (id, updater) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? updater(block) : block,
          ),
        })),
      updateBlockPositions: (updates) =>
        set((state) => {
          const positionById = new Map(updates.map((u) => [u.id, u.position]));
          return {
            blocks: state.blocks.map((block) =>
              positionById.has(block.id)
                ? { ...block, position: positionById.get(block.id) }
                : block,
            ),
          };
        }),
      selectBlock: (id) => set({ selectedBlockId: id }),
      toggleSplitView: () => set((state) => ({ splitView: !state.splitView })),
      setBadgeStyle: (style) => set({ badgeStyle: style }),
      toggleSectionSeparator: () =>
        set((state) => ({ sectionSeparator: !state.sectionSeparator })),
      setLang: (lang) => set({ lang }),
    }),
    { name: "foliox-editor-draft" },
  ),
);

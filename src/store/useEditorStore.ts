"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block } from "@/types/ast";
import type { Language } from "@/lib/translations";

// ---------------------------------------------------------------------------
// Style types (exported so serializer + StylePanel can share them)
// ---------------------------------------------------------------------------

export type BadgeStyle =
  | "flat-square"
  | "flat"
  | "for-the-badge"
  | "plastic";

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
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
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
          const position = block.position || {
            x: 40,
            y: 40 + state.blocks.length * 120,
            w: 320,
            h: 220,
          };
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
      reorderBlocks: (fromIndex, toIndex) =>
        set((state) => {
          const isValidRange =
            fromIndex >= 0 &&
            fromIndex < state.blocks.length &&
            toIndex >= 0 &&
            toIndex < state.blocks.length;
          if (!isValidRange) return state;

          const next = [...state.blocks];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { blocks: next };
        }),
      selectBlock: (id) => set({ selectedBlockId: id }),
      toggleSplitView: () =>
        set((state) => ({ splitView: !state.splitView })),
      setBadgeStyle: (style) => set({ badgeStyle: style }),
      toggleSectionSeparator: () =>
        set((state) => ({ sectionSeparator: !state.sectionSeparator })),
      setLang: (lang) => set({ lang }),
    }),
    { name: "foliox-editor-draft" },
  ),
);

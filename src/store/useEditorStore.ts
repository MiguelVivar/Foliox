"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block } from "@/types/ast";

type EditorState = {
  blocks: Block[];
  selectedBlockId: string | null;
};

type EditorActions = {
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updater: (block: Block) => Block) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  selectBlock: (id: string | null) => void;
};

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set) => ({
      blocks: [],
      selectedBlockId: null,
      addBlock: (block) =>
        set((state) => ({ blocks: [...state.blocks, block] })),
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
    }),
    { name: "foliox-editor-draft" },
  ),
);

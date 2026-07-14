import assert from "node:assert/strict";

// Minimal in-memory stub so zustand's persist middleware has a localStorage
// to call outside a browser. Scoped to this script only — dynamic import()
// below defers loading the store until after this stub is installed (a
// static top-level import would be hoisted and run before this line).
//
// zustand's default persist storage is `window.localStorage`, not a bare
// `localStorage` global (confirmed in node_modules/zustand/esm/middleware.mjs)
// — Node has neither, so both must be stubbed or persist silently falls
// back to a no-op storage and warns "storage is currently unavailable".
const memoryStorage = new Map<string, string>();
const localStorageStub = {
  getItem: (key: string) => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memoryStorage.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStorage.delete(key);
  },
  clear: () => {
    memoryStorage.clear();
  },
  key: () => null,
  length: 0,
} as Storage;
(globalThis as { localStorage?: Storage }).localStorage = localStorageStub;
(globalThis as { window?: { localStorage: Storage } }).window = {
  localStorage: localStorageStub,
};

const { useEditorStore } = await import("../store/useEditorStore.ts");

function makeBlock(id: string): import("../types/ast.ts").MarkdownCustomBlock {
  return { id, kind: "markdown-custom", content: { markdown: `block ${id}` } };
}

// addBlock
useEditorStore.getState().addBlock(makeBlock("a"));
useEditorStore.getState().addBlock(makeBlock("b"));
useEditorStore.getState().addBlock(makeBlock("c"));
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["a", "b", "c"],
  "addBlock should append blocks in order",
);

// selectBlock
useEditorStore.getState().selectBlock("b");
assert.equal(
  useEditorStore.getState().selectedBlockId,
  "b",
  "selectBlock should set selectedBlockId",
);

// updateBlock
useEditorStore.getState().updateBlock("b", (block) => {
  if (block.kind !== "markdown-custom") return block;
  return { ...block, content: { ...block.content, markdown: "updated" } };
});
const updated = useEditorStore.getState().blocks.find((block) => block.id === "b");
assert.equal(
  (updated as import("../types/ast.ts").MarkdownCustomBlock).content.markdown,
  "updated",
  "updateBlock should apply the updater to the matching block",
);

// reorderBlocks: move "a" (index 0) to index 2 -> expect b, c, a
useEditorStore.getState().reorderBlocks(0, 2);
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["b", "c", "a"],
  "reorderBlocks should move the block to the target index",
);

// reorderBlocks with out-of-range index is a no-op
const beforeInvalidReorder = useEditorStore.getState().blocks.map((block) => block.id);
useEditorStore.getState().reorderBlocks(0, 99);
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  beforeInvalidReorder,
  "reorderBlocks should ignore out-of-range indices",
);

// removeBlock clears selectedBlockId when the selected block is removed
useEditorStore.getState().removeBlock("b");
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["c", "a"],
  "removeBlock should remove the matching block",
);
assert.equal(
  useEditorStore.getState().selectedBlockId,
  null,
  "removeBlock should clear selectedBlockId when the removed block was selected",
);

console.log("useEditorStore selfcheck: all assertions passed");

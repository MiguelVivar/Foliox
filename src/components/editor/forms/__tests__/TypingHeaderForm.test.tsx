import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TypingHeaderForm } from "../TypingHeaderForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { TypingHeaderBlock } from "@/types/ast";

function makeBlock(): TypingHeaderBlock {
  return { id: "th-1", kind: "typing-header", content: { lines: ["Hello"] } };
}

describe("TypingHeaderForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("adds a new blank line when Add line is clicked", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TypingHeaderForm block={block} />);

    await user.click(screen.getByRole("button", { name: /add line/i }));

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "th-1") as TypingHeaderBlock;
    expect(stored.content.lines).toEqual(["Hello", ""]);
  });

  it("removes a line when its remove button is clicked", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TypingHeaderForm block={block} />);

    await user.click(screen.getByRole("button", { name: /remove line 1/i }));

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "th-1") as TypingHeaderBlock;
    expect(stored.content.lines).toEqual([]);
  });
});

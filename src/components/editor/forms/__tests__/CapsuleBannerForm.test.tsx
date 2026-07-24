import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CapsuleBannerForm } from "../CapsuleBannerForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { CapsuleBannerBlock } from "@/types/ast";

function makeBlock(): CapsuleBannerBlock {
  return { id: "cb-1", kind: "capsule-banner", content: { type: "waving", color: "#0d1117" } };
}

describe("CapsuleBannerForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("updates the shape when a new option is selected", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<CapsuleBannerForm block={block} />);

    await user.selectOptions(screen.getByLabelText(/shape/i), "rect");

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.type).toBe("rect");
  });

  it("updates banner text as the user types", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<CapsuleBannerForm block={block} />);

    await user.type(screen.getByLabelText(/banner text/i), "Hi");

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.text).toBe("Hi");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CapsuleBannerForm } from "../CapsuleBannerForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { CapsuleBannerBlock } from "@/types/ast";

function makeBlock(): CapsuleBannerBlock {
  return {
    id: "cb-1",
    kind: "capsule-banner",
    content: { type: "waving", color: "#0d1117" },
  };
}

// EditorSidebar re-derives `block` from the store on every render (it subscribes to the
// full store and recomputes `blocks.find(...)` each time), so the `block` prop passed to
// a form is always fresh. A bare `render(<CapsuleBannerForm block={staticBlock} />)` does
// not reproduce that — it mounts once with a JS-scope-static object and never re-supplies
// a fresh prop after store updates. This wrapper simulates EditorSidebar's live prop refresh.
function ConnectedCapsuleBannerForm({ blockId }: { blockId: string }) {
  const block = useEditorStore((s) =>
    s.blocks.find((b) => b.id === blockId),
  ) as CapsuleBannerBlock;
  return <CapsuleBannerForm block={block} />;
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

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.type).toBe("rect");
  });

  it("updates banner text as the user types", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<ConnectedCapsuleBannerForm blockId="cb-1" />);

    await user.type(screen.getByLabelText(/banner text/i), "Hi");

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.text).toBe("Hi");
  });
});

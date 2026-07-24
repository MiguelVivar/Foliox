import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechStackForm } from "../TechStackForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { TechStackBlock } from "@/types/ast";

function makeBlock(
  overrides: Partial<TechStackBlock["content"]> = {},
): TechStackBlock {
  return {
    id: "tech-1",
    kind: "tech-stack",
    content: { technologies: ["React"], ...overrides },
  };
}

describe("TechStackForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("defaults to Shields.io icon style", () => {
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TechStackForm block={block} />);
    expect(screen.getByRole("button", { name: "Shields.io" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches to Skill Icons style and updates the store", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TechStackForm block={block} />);

    await user.click(screen.getByRole("button", { name: "Skill Icons" }));

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "tech-1") as TechStackBlock;
    expect(stored.content.iconStyle).toBe("skill-icons");
  });
});

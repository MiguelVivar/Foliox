import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingHeaderBlockView } from "../TypingHeaderBlockView";
import type { TypingHeaderBlock } from "@/types/ast";

describe("TypingHeaderBlockView", () => {
  it("renders the typing-svg image when at least one line has text", () => {
    const block: TypingHeaderBlock = {
      id: "th1",
      kind: "typing-header",
      content: { lines: ["Hello world"] },
    };
    render(<TypingHeaderBlockView block={block} />);
    expect((screen.getByRole("img") as HTMLImageElement).src).toContain(
      "readme-typing-svg.demolab.com",
    );
  });

  it("shows an empty-state message when there are no lines", () => {
    const block: TypingHeaderBlock = {
      id: "th2",
      kind: "typing-header",
      content: { lines: [] },
    };
    render(<TypingHeaderBlockView block={block} />);
    expect(screen.getByText(/add at least one line/i)).toBeInTheDocument();
  });

  it("shows an empty-state message when all lines are blank", () => {
    const block: TypingHeaderBlock = {
      id: "th3",
      kind: "typing-header",
      content: { lines: ["", "   "] },
    };
    render(<TypingHeaderBlockView block={block} />);
    expect(screen.getByText(/add at least one line/i)).toBeInTheDocument();
  });
});

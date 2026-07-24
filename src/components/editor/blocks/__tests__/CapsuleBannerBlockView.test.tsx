import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CapsuleBannerBlockView } from "../CapsuleBannerBlockView";
import type { CapsuleBannerBlock } from "@/types/ast";

describe("CapsuleBannerBlockView", () => {
  it("renders a capsule-render image", () => {
    const block: CapsuleBannerBlock = {
      id: "cb1",
      kind: "capsule-banner",
      content: { type: "waving", color: "0d1117", text: "Welcome" },
    };
    render(<CapsuleBannerBlockView block={block} />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("capsule-render.vercel.app");
    expect(img.src).toContain("type=waving");
  });
});

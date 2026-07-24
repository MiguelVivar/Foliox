import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechStackBlockView } from "../TechStackBlockView";
import type { TechStackBlock } from "@/types/ast";

describe("TechStackBlockView", () => {
  it("renders one shields.io image per technology by default", () => {
    const block: TechStackBlock = {
      id: "t1",
      kind: "tech-stack",
      content: { technologies: ["React", "TypeScript"] },
    };
    render(<TechStackBlockView block={block} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images).toHaveLength(2);
    expect(images[0].src).toContain("img.shields.io");
  });

  it("renders a single combined image when iconStyle is skill-icons", () => {
    const block: TechStackBlock = {
      id: "t2",
      kind: "tech-stack",
      content: {
        technologies: ["React", "TypeScript"],
        iconStyle: "skill-icons",
      },
    };
    render(<TechStackBlockView block={block} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images).toHaveLength(1);
    expect(images[0].src).toContain("skillicons.dev/icons?i=react,ts");
  });

  it("shows an empty-state message when no technologies are selected", () => {
    const block: TechStackBlock = {
      id: "t3",
      kind: "tech-stack",
      content: { technologies: [] },
    };
    render(<TechStackBlockView block={block} />);
    expect(screen.getByText(/no technologies added yet/i)).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { applyTemplate, getTemplateIds } from "./readmeTemplates";

describe("Visual template", () => {
  it("is registered alongside the existing templates", () => {
    expect(getTemplateIds()).toContain("visual");
  });

  it("applies with unique ids and stacked positions for all 5 blocks", () => {
    const blocks = applyTemplate("visual");
    expect(blocks).toHaveLength(5);
    expect(blocks.map((b) => b.kind)).toEqual([
      "typing-header",
      "capsule-banner",
      "tech-stack",
      "github-stats",
      "social-links",
    ]);
    const ids = blocks.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

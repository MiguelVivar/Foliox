import { describe, it, expect } from "vitest";
import catalog from "./techCatalogData.json";

type CatalogEntry = { label: string; slug: string; hex: string };

describe("techCatalogData.json", () => {
  it("contains at least 3000 entries", () => {
    expect((catalog as CatalogEntry[]).length).toBeGreaterThan(3000);
  });

  it("has no duplicate slugs", () => {
    const slugs = (catalog as CatalogEntry[]).map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has a 6-hex-digit color with no '#' prefix", () => {
    for (const entry of catalog as CatalogEntry[]) {
      expect(entry.hex).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  it("includes well-known brands like React and TypeScript", () => {
    const labels = (catalog as CatalogEntry[]).map((entry) => entry.label);
    expect(labels).toContain("React");
    expect(labels).toContain("TypeScript");
  });
});

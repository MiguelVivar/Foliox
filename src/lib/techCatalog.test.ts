import { describe, it, expect } from "vitest";
import {
  findTechMeta,
  searchTech,
  getPopularTech,
  contrastColorFor,
  buildShieldsUrl,
  buildSkillIconsUrl,
  POPULAR_TECH,
} from "./techCatalog";

describe("techCatalog", () => {
  describe("findTechMeta", () => {
    it("finds a simple-icons-backed entry case-insensitively", () => {
      expect(findTechMeta("react")?.slug).toBe("react");
      expect(findTechMeta("REACT")?.slug).toBe("react");
    });

    it("finds legacy-override entries not present in simple-icons", () => {
      expect(findTechMeta("AWS")).toEqual({
        label: "AWS",
        slug: "amazonaws",
        hex: "232F3E",
        skillIconsSlug: "aws",
      });
      expect(findTechMeta("Java")?.slug).toBe("openjdk");
    });

    it("returns undefined for an unknown label", () => {
      expect(findTechMeta("Definitely Not A Real Technology")).toBeUndefined();
    });
  });

  describe("searchTech", () => {
    it("matches by case-insensitive substring", () => {
      const results = searchTech("script");
      expect(results.some((r) => r.label === "JavaScript")).toBe(true);
      expect(results.some((r) => r.label === "TypeScript")).toBe(true);
    });

    it("caps results at the given limit", () => {
      const results = searchTech("a", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getPopularTech", () => {
    it("resolves every POPULAR_TECH label to a real catalog entry", () => {
      const popular = getPopularTech();
      expect(popular.length).toBe(POPULAR_TECH.length);
      for (const entry of popular) {
        expect(entry.hex).toMatch(/^[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe("contrastColorFor", () => {
    it("picks black text for light backgrounds", () => {
      expect(contrastColorFor("F7DF1E")).toBe("black"); // JS yellow
    });

    it("picks white text for dark backgrounds", () => {
      expect(contrastColorFor("000000")).toBe("white");
    });
  });

  describe("buildShieldsUrl", () => {
    it("includes the encoded label, brand color, and logo slug", () => {
      const url = buildShieldsUrl("React");
      expect(url).toContain("React-61DAFB");
      expect(url).toContain("logo=react");
      expect(url).toContain("logoColor=black");
    });

    it("falls back to a neutral gray badge with no logo for unknown labels", () => {
      const url = buildShieldsUrl("Definitely Not Real");
      expect(url).toContain("555555");
      expect(url).toContain("logo=&");
    });

    it("applies the requested badge style", () => {
      const url = buildShieldsUrl("React", "for-the-badge");
      expect(url).toContain("style=for-the-badge");
    });
  });

  describe("buildSkillIconsUrl", () => {
    it("joins known skill-icons slugs with commas", () => {
      const url = buildSkillIconsUrl(["React", "TypeScript", "Docker"]);
      expect(url).toBe("https://skillicons.dev/icons?i=react,ts,docker");
    });

    it("drops labels with no known skill-icons mapping", () => {
      const url = buildSkillIconsUrl(["React", "Definitely Not Real"]);
      expect(url).toBe("https://skillicons.dev/icons?i=react");
    });
  });
});

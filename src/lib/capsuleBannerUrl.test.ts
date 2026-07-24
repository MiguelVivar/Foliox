import { describe, it, expect } from "vitest";
import { buildCapsuleUrl } from "./capsuleBannerUrl";

describe("buildCapsuleUrl", () => {
  it("builds a URL with the given type, color, and text", () => {
    const url = buildCapsuleUrl({ type: "waving", color: "0d1117", text: "Welcome" });
    expect(url).toContain("type=waving");
    expect(url).toContain("color=0d1117");
    expect(url).toContain("text=Welcome");
  });

  it("strips leading # from color and fontColor", () => {
    const url = buildCapsuleUrl({ type: "rect", color: "#123456", fontColor: "#abcdef" });
    expect(url).toContain("color=123456");
    expect(url).toContain("fontColor=abcdef");
  });

  it("defaults height to 200 and section to header", () => {
    const url = buildCapsuleUrl({ type: "cylinder", color: "000000" });
    expect(url).toContain("height=200");
    expect(url).toContain("section=header");
  });

  it("respects a custom height and footer section", () => {
    const url = buildCapsuleUrl({ type: "egg", color: "000000", height: 300, section: "footer" });
    expect(url).toContain("height=300");
    expect(url).toContain("section=footer");
  });
});

import { describe, it, expect } from "vitest";
import { buildTypingSvgUrl } from "./typingHeaderUrl";

describe("buildTypingSvgUrl", () => {
  it("joins multiple lines with a semicolon (percent-encoded)", () => {
    const url = buildTypingSvgUrl({ lines: ["Hello", "World"] });
    expect(url).toContain("lines=Hello%3BWorld");
  });

  it("applies defaults for speed, pause, color, and font size", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"] });
    expect(url).toContain("pause=1000");
    expect(url).toContain("color=36BCF7");
    expect(url).toContain("size=24");
    expect(url).toContain("speed=50");
  });

  it("strips a leading # from a supplied color", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"], color: "#FF0000" });
    expect(url).toContain("color=FF0000");
    expect(url).not.toContain("%23");
  });

  it("respects custom speed, pause, and font size", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"], speed: 80, pauseMs: 2000, fontSize: 32 });
    expect(url).toContain("speed=80");
    expect(url).toContain("pause=2000");
    expect(url).toContain("size=32");
  });
});

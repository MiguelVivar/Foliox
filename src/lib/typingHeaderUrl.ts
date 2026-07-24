import type { TypingHeaderBlock } from "@/types/ast";

export function buildTypingSvgUrl(
  content: TypingHeaderBlock["content"],
): string {
  const {
    lines,
    speed = 50,
    pauseMs = 1000,
    color = "36BCF7",
    fontSize = 24,
  } = content;
  const safeColor = color.replace(/^#/, "");

  const params = new URLSearchParams({
    font: "Fira Code",
    size: String(fontSize),
    pause: String(pauseMs),
    color: safeColor,
    center: "true",
    vCenter: "true",
    multiline: "true",
    speed: String(speed),
    lines: lines.join(";"),
  });

  return `https://readme-typing-svg.demolab.com?${params.toString()}`;
}

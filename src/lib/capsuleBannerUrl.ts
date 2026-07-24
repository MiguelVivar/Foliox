import type { CapsuleBannerBlock } from "@/types/ast";

export function buildCapsuleUrl(content: CapsuleBannerBlock["content"]): string {
  const { text = "", type, color, height = 200, fontColor = "ffffff", section = "header" } = content;

  const params = new URLSearchParams({
    type,
    color: color.replace(/^#/, ""),
    height: String(height),
    section,
    fontColor: fontColor.replace(/^#/, ""),
    text,
  });

  return `https://capsule-render.vercel.app/api?${params.toString()}`;
}

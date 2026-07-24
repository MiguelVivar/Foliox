import type { CapsuleBannerBlock } from "@/types/ast";
import { buildCapsuleUrl } from "@/lib/capsuleBannerUrl";

type Props = { block: CapsuleBannerBlock };

export function CapsuleBannerBlockView({ block }: Props) {
  return (
    <div className="flex justify-center">
      <img
        src={buildCapsuleUrl(block.content)}
        alt={block.content.text || "Banner"}
        className="w-full"
      />
    </div>
  );
}

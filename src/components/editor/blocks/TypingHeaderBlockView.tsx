import type { TypingHeaderBlock } from "@/types/ast";
import { buildTypingSvgUrl } from "@/lib/typingHeaderUrl";

type Props = { block: TypingHeaderBlock };

export function TypingHeaderBlockView({ block }: Props) {
  const { lines } = block.content;

  if (lines.length === 0 || lines.every((line) => !line.trim())) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        Add at least one line of text
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <img src={buildTypingSvgUrl(block.content)} alt={lines.join(" / ")} />
    </div>
  );
}

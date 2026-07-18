import { MarkdownRenderedView } from "../MarkdownRenderedView";
import type { MarkdownCustomBlock } from "@/types/ast";

type Props = { block: MarkdownCustomBlock };

export function MarkdownCustomBlockView({ block }: Props) {
  const { markdown } = block.content;

  if (!markdown) {
    return (
      <span className="italic text-[var(--text-muted)] font-mono text-xs">
        {`# Custom Markdown\n\nWrite anything here...`}
      </span>
    );
  }

  return (
    <div className="w-full overflow-x-auto text-[var(--text-primary)]">
      <MarkdownRenderedView markdown={markdown} className="!bg-transparent !p-0 !text-inherit" />
    </div>
  );
}

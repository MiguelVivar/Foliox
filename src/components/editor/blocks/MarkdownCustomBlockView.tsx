import type { MarkdownCustomBlock } from "@/types/ast";

type Props = { block: MarkdownCustomBlock };

export function MarkdownCustomBlockView({ block }: Props) {
  const { markdown } = block.content;

  return (
    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--text-primary)]">
      {markdown || (
        <span className="italic text-[var(--text-muted)]">
          {`# Custom Markdown\n\nWrite anything here...`}
        </span>
      )}
    </pre>
  );
}

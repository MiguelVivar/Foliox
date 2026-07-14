import type { AsciiBannerBlock } from "@/types/ast";

type Props = { block: AsciiBannerBlock };

// Simple ASCII art generator — renders text as block letters using a dot matrix.
// Full figlet integration is planned for Phase 6 (Web Worker offscreen canvas).
function toSimpleAscii(text: string): string {
  if (!text) return "";
  // Placeholder: wrap the text in a decorative ASCII frame
  const line = `+-${"─".repeat(text.length + 2)}-+`;
  return `${line}\n|  ${text}  |\n${line}`;
}

export function AsciiBannerBlockView({ block }: Props) {
  const { text, font } = block.content;
  const ascii = toSimpleAscii(text);

  return (
    <div className="flex flex-col gap-2">
      <pre className="overflow-x-auto font-mono text-xs leading-tight text-[var(--text-primary)]">
        {ascii || <span className="italic text-[var(--text-muted)]">ASCII banner preview</span>}
      </pre>
      {font && (
        <span className="font-mono text-[10px] text-[var(--text-muted)]">font: {font}</span>
      )}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { MarkdownCustomBlock } from "@/types/ast";

type Props = { block: MarkdownCustomBlock };

export function MarkdownCustomForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(value: string) {
    updateBlock(block.id, (b) =>
      b.kind === "markdown-custom"
        ? { ...b, content: { markdown: value } }
        : b,
    );
    // Auto-grow: reset height to auto first to shrink correctly on delete
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="mc-markdown"
        className="block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
      >
        Markdown Content
      </label>
      <textarea
        id="mc-markdown"
        ref={textareaRef}
        value={block.content.markdown}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className="w-full resize-none overflow-hidden rounded-none border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 font-mono text-xs leading-relaxed text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
        placeholder={"# Section Title\n\nYour Markdown here..."}
        spellCheck={false}
      />
    </div>
  );
}

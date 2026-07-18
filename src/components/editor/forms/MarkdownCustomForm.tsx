"use client";

import { useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { MarkdownCustomBlock } from "@/types/ast";
import { Heading, Bold, Link2, Image, Table, AlignCenter } from "lucide-react";

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
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }

  function insertAtCursor(textToInsert: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const value = block.content.markdown;

    const newValue =
      value.substring(0, startPos) +
      textToInsert +
      value.substring(endPos, value.length);

    handleChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + textToInsert.length;
      textarea.selectionEnd = startPos + textToInsert.length;
    }, 50);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="mc-markdown"
          className="block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
        >
          Markdown Content
        </label>
        
        {/* Helper edit bar */}
        <div className="flex gap-1.5 border border-[var(--border-subtle)] p-0.5 rounded-sm bg-[var(--bg-canvas)]">
          <button
            type="button"
            onClick={() => insertAtCursor("# ")}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Heading 1"
          >
            <Heading size={11} />
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor("**bold**")}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Bold"
          >
            <Bold size={11} />
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor("[Link](https://)")}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Hyperlink"
          >
            <Link2 size={11} />
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor("![Alt Text](https://)")}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Image/Gif"
          >
            <Image size={11} />
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor("| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |")}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Table"
          >
            <Table size={11} />
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor('<div align="center">\n  \n</div>')}
            className="p-1 hover:text-[var(--accent-phosphor)] hover:bg-[var(--bg-surface-hover)] rounded-sm transition-all"
            title="Align Center Div"
          >
            <AlignCenter size={11} />
          </button>
        </div>
      </div>
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

"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Badge } from "@/components/atoms/Badge";
import type { TechStackBlock } from "@/types/ast";

type Props = { block: TechStackBlock };

export function TechStackForm({ block }: Props) {
  const { updateBlock } = useEditorStore();

  const raw = block.content.technologies.join(", ");

  function handleChange(value: string) {
    const technologies = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      // deduplicate while preserving order
      .filter((t, i, arr) => arr.indexOf(t) === i);

    updateBlock(block.id, (b) =>
      b.kind === "tech-stack" ? { ...b, content: { technologies } } : b,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ts-technologies"
          className="block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
        >
          Technologies (comma-separated)
        </label>
        <input
          id="ts-technologies"
          type="text"
          defaultValue={raw}
          onBlur={(e) => handleChange(e.target.value)}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="TypeScript, React, Next.js, Tailwind CSS"
          className="w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
        />
      </div>

      {block.content.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {block.content.technologies.map((tech) => (
            <Badge key={tech} variant="mauve" mono>
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

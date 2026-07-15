"use client";

import { Sparkles } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useAiGenerate } from "@/hooks/useAiGenerate";
import { cn } from "@/lib/cn";
import type { HeroBioBlock } from "@/types/ast";

type Props = { block: HeroBioBlock };

export function HeroBioForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const { status, errorMessage, generate } = useAiGenerate();

  function patch(partial: Partial<HeroBioBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "hero-bio"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
  }

  async function handleImprove() {
    const source = block.content.tagline || block.content.name;
    const improved = await generate(source);
    if (improved) patch({ tagline: improved });
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hb-name" className={labelClass}>
          Name
        </label>
        <input
          id="hb-name"
          type="text"
          value={block.content.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="hb-tagline" className={labelClass}>
            Tagline
          </label>
          <button
            type="button"
            onClick={() => void handleImprove()}
            disabled={status === "loading"}
            aria-label="Improve tagline with AI"
            className={cn(
              "flex items-center gap-1 font-mono text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]",
              status === "loading"
                ? "cursor-wait text-[var(--text-muted)]"
                : status === "success"
                  ? "text-green-400"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            <Sparkles size={10} />
            {status === "loading" ? "Improving…" : "Improve with AI"}
          </button>
        </div>
        <input
          id="hb-tagline"
          type="text"
          value={block.content.tagline}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder="e.g. Full-Stack Engineer · Open Source"
          className={inputClass}
        />
        {status === "error" && errorMessage && (
          <p className="font-mono text-[10px] text-red-400">{errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="hb-avatar" className={labelClass}>
          Avatar URL
        </label>
        <input
          id="hb-avatar"
          type="url"
          value={block.content.avatarUrl ?? ""}
          onChange={(e) => patch({ avatarUrl: e.target.value })}
          placeholder="https://github.com/you.png"
          className={inputClass}
        />
      </div>
    </div>
  );
}

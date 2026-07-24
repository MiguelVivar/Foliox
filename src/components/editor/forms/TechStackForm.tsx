"use client";

import { X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { TechStackPicker } from "./TechStackPicker";
import type { TechStackBlock } from "@/types/ast";

type Props = { block: TechStackBlock };

export function TechStackForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const selected = block.content.technologies;
  const iconStyle = block.content.iconStyle ?? "shields";

  function setTechnologies(technologies: string[]) {
    updateBlock(block.id, (b) =>
      b.kind === "tech-stack"
        ? { ...b, content: { ...b.content, technologies } }
        : b,
    );
  }

  function setIconStyle(style: "shields" | "skill-icons") {
    updateBlock(block.id, (b) =>
      b.kind === "tech-stack"
        ? { ...b, content: { ...b.content, iconStyle: style } }
        : b,
    );
  }

  function addTech(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (selected.some((tech) => tech.toLowerCase() === trimmed.toLowerCase()))
      return;
    setTechnologies([...selected, trimmed]);
  }

  function removeTech(label: string) {
    setTechnologies(selected.filter((tech) => tech !== label));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
          Icon Style
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIconStyle("shields")}
            aria-pressed={iconStyle === "shields"}
            className={`flex-1 rounded-sm border px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors ${
              iconStyle === "shields"
                ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Shields.io
          </button>
          <button
            type="button"
            onClick={() => setIconStyle("skill-icons")}
            aria-pressed={iconStyle === "skill-icons"}
            className={`flex-1 rounded-sm border px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors ${
              iconStyle === "skill-icons"
                ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Skill Icons
          </button>
        </div>
      </div>

      <TechStackPicker
        selectedTechs={selected}
        onAdd={addTech}
        onRemove={removeTech}
      />

      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
            Selected technologies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-1.5 rounded-sm bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)]"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  aria-label={`Remove ${tech}`}
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

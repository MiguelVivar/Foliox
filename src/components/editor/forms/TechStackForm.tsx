"use client";

import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { Badge } from "@/components/atoms/Badge";
import { TECH_CATALOG, findTechMeta } from "@/lib/techCatalog";
import type { TechStackBlock } from "@/types/ast";

type Props = { block: TechStackBlock };

export function TechStackForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = block.content.technologies;

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return TECH_CATALOG.filter(
      (entry) =>
        entry.label.toLowerCase().includes(trimmed) &&
        !selected.some((tech) => tech.toLowerCase() === entry.label.toLowerCase()),
    ).slice(0, 8);
  }, [query, selected]);

  const exactMatchExists =
    query.trim().length > 0 &&
    selected.some((tech) => tech.toLowerCase() === query.trim().toLowerCase());

  function setTechnologies(technologies: string[]) {
    updateBlock(block.id, (b) =>
      b.kind === "tech-stack" ? { ...b, content: { technologies } } : b,
    );
  }

  function addTech(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (selected.some((tech) => tech.toLowerCase() === trimmed.toLowerCase())) return;
    setTechnologies([...selected, trimmed]);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function removeTech(label: string) {
    setTechnologies(selected.filter((tech) => tech !== label));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col gap-1.5">
        <label
          htmlFor="ts-search"
          className="block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
        >
          Add technology
        </label>
        <input
          ref={inputRef}
          id="ts-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (results[0]) addTech(results[0].label);
              else if (query.trim() && !exactMatchExists) addTech(query);
            }
          }}
          placeholder="Search React, Docker, PostgreSQL…"
          className="w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
        />

        {isOpen && query.trim() && (
          <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg">
            {results.map((entry) => (
              <button
                key={entry.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTech(entry.label)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              >
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: `#${entry.color}` }}
                />
                {entry.label}
              </button>
            ))}
            {!exactMatchExists && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTech(query)}
                className="flex w-full items-center gap-2 border-t border-[var(--border-subtle)] px-3 py-2 text-left font-mono text-xs text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              >
                Add &quot;{query.trim()}&quot; as custom badge
              </button>
            )}
            {results.length === 0 && exactMatchExists && (
              <p className="px-3 py-2 font-mono text-xs text-[var(--text-muted)]">
                Already added
              </p>
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tech) => {
            const meta = findTechMeta(tech);
            return (
              <Badge key={tech} variant="mauve" mono className="gap-1.5 pr-1">
                {meta && (
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: `#${meta.color}` }}
                  />
                )}
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  aria-label={`Remove ${tech}`}
                  className="ml-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X size={10} />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

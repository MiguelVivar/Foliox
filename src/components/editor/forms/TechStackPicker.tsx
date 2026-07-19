"use client";

import { useMemo, useState } from "react";
import { MARKDOWN_BADGES, searchBadges } from "@/lib/markdownBadges";
import { TechStackGrid } from "./TechStackGrid";

interface TechStackPickerProps {
  selectedTechs: string[];
  onAdd: (tech: string) => void;
  onRemove: (tech: string) => void;
}

export function TechStackPicker({
  selectedTechs,
  onAdd,
  onRemove,
}: TechStackPickerProps) {
  const [query, setQuery] = useState("");

  // Filter badges based on search query
  const filteredBadges = useMemo(() => {
    if (!query.trim()) {
      return MARKDOWN_BADGES;
    }
    return searchBadges(query);
  }, [query]);

  // Handle badge selection (toggle add/remove)
  const handleSelect = (label: string) => {
    const isSelected = selectedTechs.some(
      (tech) => tech.toLowerCase() === label.toLowerCase(),
    );

    if (isSelected) {
      onRemove(label);
    } else {
      onAdd(label);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tech-search"
          className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase"
        >
          Search technologies
        </label>
        <input
          id="tech-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies (React, Docker, PostgreSQL…)"
          className="w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
        />
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        <TechStackGrid
          badges={filteredBadges}
          selectedTechs={selectedTechs}
          onSelect={handleSelect}
        />
      </div>

      {filteredBadges.length === 0 && query.trim() && (
        <p className="text-center font-mono text-xs text-[var(--text-muted)]">
          No technologies found matching &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}

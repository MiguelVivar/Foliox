"use client";

import { buildShieldsUrl, type TechCatalogEntry } from "@/lib/techCatalog";

interface TechStackGridProps {
  entries: TechCatalogEntry[];
  selectedTechs: string[];
  onSelect: (label: string) => void;
}

export function TechStackGrid({ entries, selectedTechs, onSelect }: TechStackGridProps) {
  const isSelected = (label: string): boolean =>
    selectedTechs.some((tech) => tech.toLowerCase() === label.toLowerCase());

  return (
    <div
      data-testid="tech-stack-grid"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {entries.map((entry) => {
        const selected = isSelected(entry.label);
        return (
          <button
            key={entry.slug}
            type="button"
            onClick={() => onSelect(entry.label)}
            className={`flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-150 ${
              selected
                ? "ring-2 ring-green-400 ring-offset-1 ring-offset-[var(--bg-canvas)]"
                : "hover:bg-[var(--bg-surface-hover)]"
            }`}
            aria-label={entry.label}
          >
            <img
              src={buildShieldsUrl(entry.label)}
              alt={entry.label}
              className="h-auto w-full max-w-[100px]"
              loading="lazy"
            />
            <span className="text-center text-xs font-medium text-[var(--text-primary)]">
              {entry.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

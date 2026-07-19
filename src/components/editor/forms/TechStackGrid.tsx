"use client";

import type { Badge } from "@/lib/markdownBadges";

interface TechStackGridProps {
  badges: Badge[];
  selectedTechs: string[];
  onSelect: (label: string) => void;
}

export function TechStackGrid({
  badges,
  selectedTechs,
  onSelect,
}: TechStackGridProps) {
  const buildShieldsUrl = (badge: Badge): string => {
    const label = encodeURIComponent(badge.label);
    const logoColor = badge.logoColor || "000";
    const bgColor = badge.backgroundColor || "000";

    return `https://img.shields.io/badge/${label}-${bgColor}?style=flat-square&logo=${badge.logo}&logoColor=${logoColor}`;
  };

  const isSelected = (label: string): boolean =>
    selectedTechs.some((tech) => tech.toLowerCase() === label.toLowerCase());

  return (
    <div
      data-testid="tech-stack-grid"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {badges.map((badge) => {
        const selected = isSelected(badge.label);
        return (
          <button
            key={badge.label}
            type="button"
            onClick={() => onSelect(badge.label)}
            className={`flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-150 ${
              selected
                ? "ring-2 ring-green-400 ring-offset-1 ring-offset-[var(--bg-canvas)]"
                : "hover:bg-[var(--bg-surface-hover)]"
            }`}
            aria-label={badge.label}
          >
            <img
              src={buildShieldsUrl(badge)}
              alt={badge.alt}
              className="h-auto w-full max-w-[100px]"
              loading="lazy"
            />
            <span className="text-center text-xs font-medium text-[var(--text-primary)]">
              {badge.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

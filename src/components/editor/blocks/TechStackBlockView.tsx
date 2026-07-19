import type { TechStackBlock } from "@/types/ast";
import { getBadgeByLabel } from "@/lib/markdownBadges";

type Props = { block: TechStackBlock };

export function TechStackBlockView({ block }: Props) {
  const { technologies } = block.content;

  if (technologies.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        No technologies added yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => {
        const badge = getBadgeByLabel(tech);
        const bgColor = badge?.backgroundColor || "999999";
        const logoColor = badge?.logoColor || "fff";

        return (
          <a
            key={tech}
            href={`https://img.shields.io/badge/${encodeURIComponent(tech)}-${bgColor}?style=for-the-badge&logo=${badge?.logo || ""}&logoColor=${logoColor}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-opacity hover:opacity-80"
          >
            <img
              src={`https://img.shields.io/badge/${encodeURIComponent(tech)}-${bgColor}?style=for-the-badge&logo=${badge?.logo || ""}&logoColor=${logoColor}`}
              alt={tech}
              className="h-8"
            />
          </a>
        );
      })}
    </div>
  );
}

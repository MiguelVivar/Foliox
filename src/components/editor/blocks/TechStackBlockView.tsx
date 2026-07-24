import type { TechStackBlock } from "@/types/ast";
import { buildShieldsUrl, buildSkillIconsUrl } from "@/lib/techCatalog";

type Props = { block: TechStackBlock };

export function TechStackBlockView({ block }: Props) {
  const { technologies, iconStyle = "shields" } = block.content;

  if (technologies.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        No technologies added yet
      </p>
    );
  }

  if (iconStyle === "skill-icons") {
    return (
      <img
        src={buildSkillIconsUrl(technologies)}
        alt={technologies.join(", ")}
        className="max-w-full"
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => (
        <a
          key={tech}
          href={buildShieldsUrl(tech, "for-the-badge")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <img src={buildShieldsUrl(tech, "for-the-badge")} alt={tech} className="h-8" />
        </a>
      ))}
    </div>
  );
}

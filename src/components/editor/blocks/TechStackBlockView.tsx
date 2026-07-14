import { Badge } from "@/components/atoms/Badge";
import type { TechStackBlock } from "@/types/ast";

type Props = { block: TechStackBlock };

export function TechStackBlockView({ block }: Props) {
  const { technologies } = block.content;

  if (technologies.length === 0) {
    return (
      <p className="font-mono text-xs italic text-[var(--text-muted)]">
        No technologies added yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <Badge key={tech} variant="mauve" mono>
          {tech}
        </Badge>
      ))}
    </div>
  );
}

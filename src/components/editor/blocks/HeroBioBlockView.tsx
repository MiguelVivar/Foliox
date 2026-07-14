import type { HeroBioBlock } from "@/types/ast";

type Props = { block: HeroBioBlock };

export function HeroBioBlockView({ block }: Props) {
  const { name, tagline, avatarUrl } = block.content;

  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] font-mono text-lg text-[var(--text-muted)]">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <span aria-hidden="true">◈</span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {name || <span className="italic text-[var(--text-muted)]">Your name</span>}
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          {tagline || "Your tagline here"}
        </p>
      </div>
    </div>
  );
}

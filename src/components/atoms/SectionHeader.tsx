import React from "react";

interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
  className?: string;
}

export function SectionHeader({ badge, title, description, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col items-start gap-3 text-left ${className}`}>
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
        [{badge}]
      </span>
      <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl font-sans text-base text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}

import React from "react";

interface FlatBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function FlatBentoCard({
  children,
  className = "",
  hoverable = true,
  ...props
}: FlatBentoCardProps) {
  return (
    <div
      className={`rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-colors duration-150 ${
        hoverable ? "hover:border-[var(--border-focus)] hover:bg-[var(--bg-surface-hover)]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

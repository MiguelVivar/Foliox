import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "mauve";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  mono?: boolean;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-[var(--border-subtle)] text-[var(--text-muted)]",
  mauve: "border-[var(--border-focus)] text-[var(--text-primary)]",
};

export function Badge({
  variant = "neutral",
  mono = false,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs",
        mono && "font-mono",
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
}

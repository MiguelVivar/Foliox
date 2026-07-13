import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type MonospaceLabelProps = HTMLAttributes<HTMLSpanElement>;

export function MonospaceLabel({ className, ...rest }: MonospaceLabelProps) {
  return (
    <span
      className={cn("font-mono text-xs text-[var(--text-muted)]", className)}
      {...rest}
    />
  );
}

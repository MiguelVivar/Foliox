import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type DragHandleProps = HTMLAttributes<HTMLSpanElement>;

export function DragHandle({ className, ...rest }: DragHandleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "cursor-grab font-mono text-sm text-[var(--text-muted)] opacity-0 select-none group-hover:opacity-100",
        className,
      )}
      {...rest}
    >
      ::
    </span>
  );
}

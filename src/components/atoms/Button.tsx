import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)]",
  secondary:
    "border-[var(--border-subtle)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
  ghost:
    "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md border font-medium focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
}

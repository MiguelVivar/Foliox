"use client";

import type { ChangeEvent } from "react";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { cn } from "@/lib/cn";

export type BYOKInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

export function BYOKInput({
  value,
  onChange,
  label = "API Key",
  className,
}: BYOKInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor="byok-api-key"
        className="text-sm font-medium text-[var(--text-primary)]"
      >
        {label}
      </label>
      <input
        id="byok-api-key"
        type="password"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
      />
      <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
    </div>
  );
}

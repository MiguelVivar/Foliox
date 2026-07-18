"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { cn } from "@/lib/cn";
import type { BadgeStyle } from "@/store/useEditorStore";

// ---------------------------------------------------------------------------
// Badge style options
// ---------------------------------------------------------------------------

const BADGE_STYLES: { value: BadgeStyle; label: string; preview: string }[] = [
  {
    value: "flat-square",
    label: "Flat Square",
    preview: "https://img.shields.io/badge/TypeScript-555555?style=flat-square",
  },
  {
    value: "flat",
    label: "Flat",
    preview: "https://img.shields.io/badge/TypeScript-555555?style=flat",
  },
  {
    value: "for-the-badge",
    label: "For The Badge",
    preview:
      "https://img.shields.io/badge/TypeScript-555555?style=for-the-badge",
  },
  {
    value: "plastic",
    label: "Plastic",
    preview: "https://img.shields.io/badge/TypeScript-555555?style=plastic",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StylePanel() {
  const { badgeStyle, setBadgeStyle, sectionSeparator, toggleSectionSeparator } =
    useEditorStore();

  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-6">
      {/* Badge style */}
      <div className="flex flex-col gap-3">
        <p className={labelClass}>Badge Style</p>
        <div className="flex flex-col gap-2">
          {BADGE_STYLES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBadgeStyle(opt.value)}
              className={cn(
                "flex items-center justify-between rounded-sm border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-phosphor)] group",
                badgeStyle === opt.value
                  ? "border-[var(--accent-phosphor)] bg-[var(--bg-canvas)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--accent-phosphor)] hover:bg-[var(--bg-canvas)]",
              )}
            >
              <span className={cn(
                "font-mono text-xs transition-colors",
                badgeStyle === opt.value ? "text-[var(--accent-phosphor)]" : "text-[var(--text-primary)] group-hover:text-[var(--accent-phosphor)]"
              )}>
                {opt.label}
              </span>
              {/* Live preview via shields.io */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opt.preview}
                alt={`${opt.label} badge preview`}
                height={20}
                className="h-5 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Section separator */}
      <div className="flex flex-col gap-3">
        <p className={labelClass}>Section Separator</p>
        <label className="flex cursor-pointer items-center justify-between rounded-sm border border-[var(--border-subtle)] px-3 py-2.5 hover:border-[var(--accent-phosphor)] transition-colors group">
          <span className="font-mono text-xs text-[var(--text-primary)] group-hover:text-[var(--accent-phosphor)] transition-colors">
            Add{" "}
            <code className="rounded-sm bg-[var(--bg-canvas)] px-1 font-mono text-[10px]">
              ---
            </code>{" "}
            between blocks
          </span>
          <input
            type="checkbox"
            checked={sectionSeparator}
            onChange={toggleSectionSeparator}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
        </label>
        <p className="font-mono text-[10px] leading-relaxed text-[var(--text-muted)]">
          Adds a horizontal rule between each section in the Markdown output.
        </p>
      </div>

      {/* Info */}
      <MonospaceLabel>[CHANGES APPLY TO SPLIT VIEW OUTPUT INSTANTLY]</MonospaceLabel>
    </div>
  );
}

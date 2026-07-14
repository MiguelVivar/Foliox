"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { cn } from "@/lib/cn";
import type { Block } from "@/types/ast";

// ------------------------------------------------------------------
// Default block factories — produce ready-to-add AST blocks
// ------------------------------------------------------------------
function makeId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeHeroBio(): Block {
  return {
    id: makeId(),
    kind: "hero-bio",
    content: { name: "", tagline: "", avatarUrl: "" },
  };
}

function makeTechStack(): Block {
  return {
    id: makeId(),
    kind: "tech-stack",
    content: {
      technologies: ["TypeScript", "React", "Next.js"],
    },
  };
}

function makeGithubStats(): Block {
  return {
    id: makeId(),
    kind: "github-stats",
    content: { username: "", showPrivate: false },
  };
}

function makeAsciiBanner(): Block {
  return {
    id: makeId(),
    kind: "ascii-banner",
    content: { text: "FOLIOX", font: "banner" },
  };
}

function makeMarkdownCustom(): Block {
  return {
    id: makeId(),
    kind: "markdown-custom",
    content: {
      markdown:
        "<!-- Write your custom Markdown here -->\n\n## Section Title\n\nYour content...",
    },
  };
}

// ------------------------------------------------------------------
// Block catalog for the "Blocks" tab
// ------------------------------------------------------------------
const BLOCK_CATALOG: {
  label: string;
  description: string;
  factory: () => Block;
}[] = [
  {
    label: "Hero / Bio",
    description: "Name, tagline & avatar",
    factory: makeHeroBio,
  },
  {
    label: "Tech Stack",
    description: "Badge grid of technologies",
    factory: makeTechStack,
  },
  {
    label: "GitHub Stats",
    description: "Dynamic stats card",
    factory: makeGithubStats,
  },
  {
    label: "ASCII Banner",
    description: "Figlet-style text art",
    factory: makeAsciiBanner,
  },
  {
    label: "Custom Markdown",
    description: "Any raw Markdown section",
    factory: makeMarkdownCustom,
  },
];

// ------------------------------------------------------------------
// Tabs
// ------------------------------------------------------------------
type Tab = "blocks" | "style" | "ai";

const TABS: { id: Tab; label: string }[] = [
  { id: "blocks", label: "Blocks" },
  { id: "style", label: "Style" },
  { id: "ai", label: "IA / BYOK" },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function EditorSidebar() {
  const { addBlock } = useEditorStore();
  const [activeTab, setActiveTab] = useState<Tab>("blocks");

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-[var(--border-subtle)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-3 py-3 font-mono text-xs transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-[var(--border-focus)] text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        {activeTab === "blocks" && (
          <div className="flex flex-col gap-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Add a block
            </p>
            {BLOCK_CATALOG.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => addBlock(item.factory())}
                className="flex flex-col items-start rounded-md border border-[var(--border-subtle)] bg-transparent px-3 py-2.5 text-left hover:border-[var(--border-focus)] hover:bg-[var(--bg-surface-hover)] focus-visible:border-[var(--border-focus)] focus-visible:outline-none"
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {item.label}
                </span>
                <span className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "style" && (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Style
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Visual customization coming in Phase 5.
            </p>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              AI / BYOK
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              AI-powered generation with your own API key — coming in Phase 6.
            </p>
          </div>
        )}
      </div>

      {/* Security badge (DESIGN.md §4.2) */}
      <div className="border-t border-[var(--border-subtle)] px-4 py-3">
        <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
      </div>
    </div>
  );
}

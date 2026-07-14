"use client";

import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { cn } from "@/lib/cn";
import type { Block } from "@/types/ast";

// Block-specific form imports
import { HeroBioForm } from "./forms/HeroBioForm";
import { TechStackForm } from "./forms/TechStackForm";
import { GithubStatsForm } from "./forms/GithubStatsForm";
import { AsciiBannerForm } from "./forms/AsciiBannerForm";
import { MarkdownCustomForm } from "./forms/MarkdownCustomForm";

// ------------------------------------------------------------------
// Block catalog (same as before)
// ------------------------------------------------------------------
function makeId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const BLOCK_CATALOG: { label: string; description: string; factory: () => Block }[] = [
  {
    label: "Hero / Bio",
    description: "Name, tagline & avatar",
    factory: () => ({
      id: makeId(),
      kind: "hero-bio",
      content: { name: "", tagline: "", avatarUrl: "" },
    }),
  },
  {
    label: "Tech Stack",
    description: "Badge grid of technologies",
    factory: () => ({
      id: makeId(),
      kind: "tech-stack",
      content: { technologies: ["TypeScript", "React", "Next.js"] },
    }),
  },
  {
    label: "GitHub Stats",
    description: "Dynamic stats card",
    factory: () => ({
      id: makeId(),
      kind: "github-stats",
      content: { username: "", showPrivate: false },
    }),
  },
  {
    label: "ASCII Banner",
    description: "Figlet-style text art",
    factory: () => ({
      id: makeId(),
      kind: "ascii-banner",
      content: { text: "FOLIOX", font: "banner" },
    }),
  },
  {
    label: "Custom Markdown",
    description: "Any raw Markdown section",
    factory: () => ({
      id: makeId(),
      kind: "markdown-custom",
      content: { markdown: "<!-- Write your custom Markdown here -->\n\n## Section Title\n\nYour content..." },
    }),
  },
];

// ------------------------------------------------------------------
// Human-readable kind labels
// ------------------------------------------------------------------
const KIND_LABELS: Record<Block["kind"], string> = {
  "hero-bio": "Hero / Bio",
  "tech-stack": "Tech Stack",
  "github-stats": "GitHub Stats",
  "ascii-banner": "ASCII Banner",
  "markdown-custom": "Custom Markdown",
};

// ------------------------------------------------------------------
// Form dispatcher
// ------------------------------------------------------------------
function BlockForm({ block }: { block: Block }) {
  switch (block.kind) {
    case "hero-bio":      return <HeroBioForm block={block} />;
    case "tech-stack":   return <TechStackForm block={block} />;
    case "github-stats": return <GithubStatsForm block={block} />;
    case "ascii-banner": return <AsciiBannerForm block={block} />;
    case "markdown-custom": return <MarkdownCustomForm block={block} />;
  }
}

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
  const { blocks, selectedBlockId, selectBlock, addBlock, removeBlock } =
    useEditorStore();
  const [activeTab, setActiveTab] = useState<Tab>("blocks");

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  return (
    <div className="flex h-full flex-col">
      {/* ── Tab bar ── */}
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

      {/* ── Tab content ── */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">

        {/* ── BLOCKS tab ── */}
        {activeTab === "blocks" && (
          <>
            {/* When a block is selected: show its edit form */}
            {selectedBlock ? (
              <div className="flex flex-col gap-4">
                {/* Header: back button + label */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectBlock(null)}
                    aria-label="Back to block catalog"
                    className="flex h-6 w-6 items-center justify-center rounded-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    {KIND_LABELS[selectedBlock.kind]}
                  </span>
                </div>

                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <BlockForm block={selectedBlock} />
                </div>

                {/* Remove block */}
                <div className="mt-auto border-t border-[var(--border-subtle)] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      removeBlock(selectedBlock.id);
                      selectBlock(null);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--border-subtle)] px-3 py-2 font-mono text-xs text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    <Trash2 size={12} />
                    Remove block
                  </button>
                </div>
              </div>
            ) : (
              /* No block selected: show add catalog */
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
          </>
        )}

        {/* ── STYLE tab ── */}
        {activeTab === "style" && (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Style
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Visual customization coming in Phase 6.
            </p>
          </div>
        )}

        {/* ── AI tab ── */}
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

      {/* ── Security badge ── */}
      <div className="border-t border-[var(--border-subtle)] px-4 py-3">
        <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { AiBYOKPanel } from "./AiBYOKPanel";
import { StylePanel } from "./StylePanel";
import { cn } from "@/lib/cn";
import type { Block } from "@/types/ast";

// Block-specific form imports
import { HeroBioForm } from "./forms/HeroBioForm";
import { TechStackForm } from "./forms/TechStackForm";
import { GithubStatsForm } from "./forms/GithubStatsForm";
import { AsciiBannerForm } from "./forms/AsciiBannerForm";
import { AsciiImageForm } from "./forms/AsciiImageForm";
import { SocialLinksForm } from "./forms/SocialLinksForm";
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
    label: "ASCII Image",
    description: "Convert image file to ASCII art",
    factory: () => ({
      id: makeId(),
      kind: "ascii-image",
      content: { asciiArt: "", width: 60, colorMode: "mono" },
    }),
  },
  {
    label: "Social Links",
    description: "Connect social media badges",
    factory: () => ({
      id: makeId(),
      kind: "social-links",
      content: { links: [] },
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
  "ascii-image": "ASCII Image",
  "social-links": "Social Links",
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
    case "ascii-image":  return <AsciiImageForm block={block} />;
    case "social-links": return <SocialLinksForm block={block} />;
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
                ? "border-b-2 border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-b-2 hover:border-[var(--border-subtle)]",
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
                  <span className="font-mono text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    {KIND_LABELS[selectedBlock.kind]} <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">█</span>
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
                    className="flex flex-col items-start rounded-sm border border-[var(--border-subtle)] bg-transparent px-3 py-2.5 text-left hover:border-[var(--accent-phosphor)] hover:bg-[var(--bg-canvas)] focus-visible:border-[var(--accent-phosphor)] focus-visible:outline-none transition-colors group"
                  >
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-phosphor)] transition-colors">
                      {item.label}
                    </span>
                    <span className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STYLE tab ── */}
        {activeTab === "style" && <StylePanel />}

        {/* ── AI tab ── */}
        {activeTab === "ai" && <AiBYOKPanel />}
      </div>

      {/* ── Security badge ── */}
      <div className="border-t border-[var(--border-subtle)] px-4 py-3">
        <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
      </div>
    </div>
  );
}

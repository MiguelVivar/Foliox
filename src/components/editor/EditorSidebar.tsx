"use client";

import { useState, useEffect } from "react";
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
import { RichMediaForm } from "./forms/RichMediaForm";
import { MarkdownCustomForm } from "./forms/MarkdownCustomForm";
import { TypingHeaderForm } from "./forms/TypingHeaderForm";
import { CapsuleBannerForm } from "./forms/CapsuleBannerForm";

import { useAuthStore } from "@/store/useAuthStore";

// ------------------------------------------------------------------
// Block catalog (same as before)
// ------------------------------------------------------------------
function makeId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const BLOCK_CATALOG: { label: string; description: string; factory: (username: string) => Block }[] = [
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
    factory: (username: string) => ({
      id: makeId(),
      kind: "github-stats",
      content: { username: username || "MiguelVivar", showPrivate: false, showLangs: false, showTrophies: false, showVisitorCounter: false },
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
    label: "Rich Media",
    description: "Images, videos & embeds",
    factory: () => ({
      id: makeId(),
      kind: "rich-media",
      content: { url: "", mediaType: "image", align: "left" },
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
  {
    label: "Typing Header",
    description: "Animated typing/deleting headline",
    factory: () => ({
      id: makeId(),
      kind: "typing-header",
      content: {
        lines: ["Hi there, I'm..."],
        speed: 50,
        pauseMs: 1000,
        color: "#36BCF7",
        fontSize: 24,
      },
    }),
  },
  {
    label: "Capsule Banner",
    description: "Wave/gradient header or footer banner",
    factory: () => ({
      id: makeId(),
      kind: "capsule-banner",
      content: {
        type: "waving",
        color: "#0d1117",
        text: "",
        height: 200,
        fontColor: "#ffffff",
        section: "header",
      },
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
  "rich-media": "Rich Media",
  "markdown-custom": "Custom Markdown",
  "typing-header": "Typing Header",
  "capsule-banner": "Capsule Banner",
};

import { BlockStyleForm } from "./forms/BlockStyleForm";

import { translations } from "@/lib/translations";

// ------------------------------------------------------------------
// Form dispatcher
// ------------------------------------------------------------------
function BlockForm({ block }: { block: Block }) {
  const formElement = (() => {
    switch (block.kind) {
      case "hero-bio":      return <HeroBioForm block={block} />;
      case "tech-stack":   return <TechStackForm block={block} />;
      case "github-stats": return <GithubStatsForm block={block} />;
      case "ascii-banner": return <AsciiBannerForm block={block} />;
      case "ascii-image":  return <AsciiImageForm block={block} />;
      case "social-links": return <SocialLinksForm block={block} />;
      case "rich-media":   return <RichMediaForm block={block} />;
      case "markdown-custom": return <MarkdownCustomForm block={block} />;
      case "typing-header": return <TypingHeaderForm block={block} />;
      case "capsule-banner": return <CapsuleBannerForm block={block} />;
    }
  })();

  return (
    <div className="flex flex-col gap-2">
      {formElement}
      <BlockStyleForm block={block} />
    </div>
  );
}

// ------------------------------------------------------------------
// Tabs
// ------------------------------------------------------------------
type Tab = "blocks" | "style" | "ai";

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export function EditorSidebar() {
  const { blocks, selectedBlockId, selectBlock, addBlock, removeBlock, lang } =
    useEditorStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("blocks");

  const defaultUsername = user?.name ? user.name.replace(/\s+/g, "") : "MiguelVivar";

  useEffect(() => {
    if (selectedBlockId) {
      setActiveTab("blocks");
    }
  }, [selectedBlockId]);

  const t = translations[lang] || translations.en;

  const TABS: { id: Tab; label: string }[] = [
    { id: "blocks", label: t.editor.tabs.blocks },
    { id: "style", label: t.editor.tabs.style },
    { id: "ai", label: t.editor.tabs.aiByok },
  ];

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
                    onClick={() => addBlock(item.factory(defaultUsername))}
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

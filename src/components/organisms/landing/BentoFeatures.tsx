"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { FlatBentoCard } from "@/components/atoms/FlatBentoCard";
import {
  LayoutGrid,
  Key,
  Palette,
  Play,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface BentoFeaturesProps {
  lang: Language;
}

export function BentoFeatures({ lang }: BentoFeaturesProps) {
  const t = translations[lang].features;

  // Card 1 AST interactive mock state
  const [astBlocks, setAstBlocks] = useState([
    "[HeaderBlock]",
    "[SkillsBlock]",
    "[StatsBlock]",
  ]);
  const [isCompiling, setIsCompiling] = useState(false);
  const compileAST = () => {
    setIsCompiling(true);
    setTimeout(() => setIsCompiling(false), 800);
  };

  // Card 2 BYOK simulated key state
  const [keyInput, setKeyInput] = useState("");

  // Card 3 Deploy mock state
  const [deployStep, setDeployStep] = useState<
    "idle" | "oauth" | "push" | "done"
  >("idle");
  const triggerDeploy = () => {
    setDeployStep("oauth");
    setTimeout(() => {
      setDeployStep("push");
      setTimeout(() => {
        setDeployStep("done");
        setTimeout(() => setDeployStep("idle"), 3000);
      }, 1200);
    }, 800);
  };

  // Card 4 ASCII representation density
  const [asciiDensity, setAsciiDensity] = useState<"low" | "mid" | "high">(
    "mid",
  );
  const getAsciiArt = () => {
    switch (asciiDensity) {
      case "low":
        return ` .--. \n/    \\\n| () |\n\\    /\n '--' `;
      case "mid":
        return `  @@@@  \n @@@@@@ \n@@    @@\n @@@@@@ \n  @@@@  `;
      case "high":
        return ` %%%%%%%% \n%%%%%%%%%%\n%%  %%%%%%\n%%%%%%%%%%\n %%%%%%%% `;
    }
  };

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl border-b border-[var(--border-subtle)] px-6 py-24"
    >
      {/* Header */}
      <SectionHeader
        badge={t.sectionBadge}
        title={t.sectionTitle}
        description={t.sectionDesc}
        className="mb-16"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Drag & Drop AST Architecture (Span 2 cols on desktop) */}
        <FlatBentoCard className="flex min-h-[380px] flex-col justify-between md:col-span-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] p-1.5">
                <LayoutGrid size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                [Core Compiler]
              </span>
            </div>
            <h3 className="mt-3 font-sans text-lg font-bold text-[var(--text-primary)]">
              {t.astTitle}
            </h3>
            <p className="max-w-lg font-sans text-sm text-[var(--text-muted)]">
              {t.astDesc}
            </p>
          </div>

          {/* Interactive AST Simulator */}
          <div className="mt-6 flex flex-col gap-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-[10px] text-[var(--text-muted)]">
              <span>AST NODES (DRAGGABLE SIMULATION)</span>
              <button
                onClick={compileAST}
                disabled={isCompiling}
                className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              >
                <RefreshCw
                  size={10}
                  className={isCompiling ? "animate-spin" : ""}
                />
                Compile
              </button>
            </div>

            <div className="flex flex-wrap gap-2 py-1">
              {astBlocks.map((block, i) => (
                <div
                  key={block}
                  onClick={() => {
                    const next = [...astBlocks];
                    // Cycle nodes position on click to simulate drag-and-drop AST shifting
                    const shifted = next.shift();
                    if (shifted) next.push(shifted);
                    setAstBlocks(next);
                  }}
                  className="cursor-pointer rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[var(--text-primary)] transition-all select-none hover:border-[var(--border-focus)] active:scale-95"
                >
                  {block}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
              <div>Output Markdown:</div>
              <pre className="overflow-x-auto rounded-sm bg-[var(--bg-surface)] p-2 text-[var(--accent-phosphor)]">
                {isCompiling
                  ? "// Compiling to AST..."
                  : `${astBlocks.join(" -> ")} compiled successfully`}
              </pre>
            </div>
          </div>
        </FlatBentoCard>

        {/* Card 2: AI BYOK (Span 1 col) */}
        <FlatBentoCard className="flex min-h-[380px] flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] p-1.5">
                <Key size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                [Local Privacy]
              </span>
            </div>
            <h3 className="mt-3 font-sans text-lg font-bold text-[var(--text-primary)]">
              {t.aiTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)]">
              {t.aiDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 font-mono text-[10px]">
            <span className="text-[var(--text-muted)]">
              // CONFIG_AI_PROVIDER:
            </span>
            <input
              type="password"
              placeholder="sk-••••••••••••••••••••"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none"
            />
            <div className="text-[9px] tracking-wide text-[var(--accent-phosphor)] uppercase">
              [✓ LOCAL STORAGE ONLY - SECURE ENVIRONMENT]
            </div>
          </div>
        </FlatBentoCard>

        {/* Card 3: One-Click Deploy to GitHub (Span 1 col) */}
        <FlatBentoCard className="flex min-h-[380px] flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--text-primary)]"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </span>
              <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                [Deployment Pipeline]
              </span>
            </div>
            <h3 className="mt-3 font-sans text-lg font-bold text-[var(--text-primary)]">
              {t.deployTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)]">
              {t.deployDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
            <button
              onClick={triggerDeploy}
              disabled={deployStep !== "idle"}
              className="w-full rounded-sm bg-[var(--bg-brand-cta)] py-2 text-center font-mono text-xs font-semibold text-[var(--text-brand-cta)] transition-all hover:opacity-90 active:scale-95"
            >
              {deployStep === "idle" &&
                (lang === "en"
                  ? "[Deploy Profile README]"
                  : "[Desplegar Perfil README]")}
              {deployStep === "oauth" &&
                (lang === "en"
                  ? "Connecting Appwrite OAuth..."
                  : "Conectando OAuth de Appwrite...")}
              {deployStep === "push" &&
                (lang === "en"
                  ? "Pushing to username/username..."
                  : "Haciendo push a username/username...")}
              {deployStep === "done" && "✓ Completed!"}
            </button>

            {deployStep !== "idle" && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-[var(--bg-surface)]">
                <div
                  className={`h-full bg-[var(--accent-phosphor)] transition-all duration-1000 ${
                    deployStep === "oauth"
                      ? "w-1/3"
                      : deployStep === "push"
                        ? "w-2/3"
                        : "w-full"
                  }`}
                />
              </div>
            )}
          </div>
        </FlatBentoCard>

        {/* Card 4: ASCII Art Engine & Asset Forge (Span 2 cols on desktop) */}
        <FlatBentoCard className="flex min-h-[380px] flex-col justify-between md:col-span-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] p-1.5">
                <Palette size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                [Media Engine]
              </span>
            </div>
            <h3 className="mt-3 font-sans text-lg font-bold text-[var(--text-primary)]">
              {t.asciiTitle}
            </h3>
            <p className="max-w-lg font-sans text-sm text-[var(--text-muted)]">
              {t.asciiDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-6 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 md:flex-row">
            <div className="flex w-full flex-col gap-2 md:w-auto">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                // Character density selector:
              </span>
              <div className="flex gap-2 font-mono text-[10px]">
                {(["low", "mid", "high"] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => setAsciiDensity(density)}
                    className={`rounded-sm border px-2 py-1 ${
                      asciiDensity === density
                        ? "border-[var(--border-focus)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                        : "border-transparent text-[var(--text-muted)]"
                    }`}
                  >
                    [{density.toUpperCase()}]
                  </button>
                ))}
              </div>
            </div>

            {/* ASCII Output Rendering */}
            <pre className="min-w-[120px] rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-center font-mono text-[9px] leading-tight tracking-widest text-[var(--accent-phosphor)] select-none">
              {getAsciiArt()}
            </pre>
          </div>
        </FlatBentoCard>
      </div>
    </section>
  );
}

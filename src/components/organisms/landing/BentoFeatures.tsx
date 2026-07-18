"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { FlatBentoCard } from "@/components/atoms/FlatBentoCard";
import { LayoutGrid, Key, Palette, Play, CheckCircle2, RefreshCw } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface BentoFeaturesProps {
  lang: Language;
}

export function BentoFeatures({ lang }: BentoFeaturesProps) {
  const t = translations[lang].features;

  // Card 1 AST interactive mock state
  const [astBlocks, setAstBlocks] = useState(["[HeaderBlock]", "[SkillsBlock]", "[StatsBlock]"]);
  const [isCompiling, setIsCompiling] = useState(false);
  const compileAST = () => {
    setIsCompiling(true);
    setTimeout(() => setIsCompiling(false), 800);
  };

  // Card 2 BYOK simulated key state
  const [keyInput, setKeyInput] = useState("");
  
  // Card 3 Deploy mock state
  const [deployStep, setDeployStep] = useState<"idle" | "oauth" | "push" | "done">("idle");
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
  const [asciiDensity, setAsciiDensity] = useState<"low" | "mid" | "high">("mid");
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
    <section id="features" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      {/* Header */}
      <SectionHeader
        badge={t.sectionBadge}
        title={t.sectionTitle}
        description={t.sectionDesc}
        className="mb-16"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Drag & Drop AST Architecture (Span 2 cols on desktop) */}
        <FlatBentoCard className="md:col-span-2 flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-[var(--bg-surface-hover)] p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
                <LayoutGrid size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                [Core Compiler]
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)] mt-3">
              {t.astTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] max-w-lg">
              {t.astDesc}
            </p>
          </div>

          {/* Interactive AST Simulator */}
          <div className="mt-6 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 rounded-sm font-mono text-xs flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] border-b border-[var(--border-subtle)] pb-2 text-[var(--text-muted)]">
              <span>AST NODES (DRAGGABLE SIMULATION)</span>
              <button
                onClick={compileAST}
                disabled={isCompiling}
                className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              >
                <RefreshCw size={10} className={isCompiling ? "animate-spin" : ""} />
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
                  className="px-2.5 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-focus)] rounded-sm cursor-pointer select-none text-[var(--text-primary)] transition-all active:scale-95"
                >
                  {block}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-[var(--text-muted)] flex flex-col gap-1">
              <div>Output Markdown:</div>
              <pre className="bg-[var(--bg-surface)] p-2 rounded-sm text-[var(--accent-phosphor)] overflow-x-auto">
                {isCompiling ? "// Compiling to AST..." : `${astBlocks.join(" -> ")} compiled successfully`}
              </pre>
            </div>
          </div>
        </FlatBentoCard>

        {/* Card 2: AI BYOK (Span 1 col) */}
        <FlatBentoCard className="flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-[var(--bg-surface-hover)] p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
                <Key size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                [Local Privacy]
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)] mt-3">
              {t.aiTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)]">
              {t.aiDesc}
            </p>
          </div>

          <div className="mt-6 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 rounded-sm font-mono text-[10px] flex flex-col gap-2">
            <span className="text-[var(--text-muted)]">// CONFIG_AI_PROVIDER:</span>
            <input
              type="password"
              placeholder="sk-••••••••••••••••••••"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
            />
            <div className="text-[9px] text-[var(--accent-phosphor)] uppercase tracking-wide">
              [✓ LOCAL STORAGE ONLY - SECURE ENVIRONMENT]
            </div>
          </div>
        </FlatBentoCard>

        {/* Card 3: One-Click Deploy to GitHub (Span 1 col) */}
        <FlatBentoCard className="flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-[var(--bg-surface-hover)] p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
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
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                [Deployment Pipeline]
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)] mt-3">
              {t.deployTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)]">
              {t.deployDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center p-4 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] rounded-sm">
            <button
              onClick={triggerDeploy}
              disabled={deployStep !== "idle"}
              className="w-full text-center py-2 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-mono text-xs font-semibold rounded-sm hover:opacity-90 active:scale-95 transition-all"
            >
              {deployStep === "idle" && (lang === "en" ? "[Deploy Profile README]" : "[Desplegar Perfil README]")}
              {deployStep === "oauth" && (lang === "en" ? "Connecting Appwrite OAuth..." : "Conectando OAuth de Appwrite...")}
              {deployStep === "push" && (lang === "en" ? "Pushing to username/username..." : "Haciendo push a username/username...")}
              {deployStep === "done" && "✓ Completed!"}
            </button>
            
            {deployStep !== "idle" && (
              <div className="w-full bg-[var(--bg-surface)] h-1.5 mt-2 rounded overflow-hidden">
                <div
                  className={`h-full bg-[var(--accent-phosphor)] transition-all duration-1000 ${
                    deployStep === "oauth" ? "w-1/3" : deployStep === "push" ? "w-2/3" : "w-full"
                  }`}
                />
              </div>
            )}
          </div>
        </FlatBentoCard>

        {/* Card 4: ASCII Art Engine & Asset Forge (Span 2 cols on desktop) */}
        <FlatBentoCard className="md:col-span-2 flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-[var(--bg-surface-hover)] p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
                <Palette size={16} className="text-[var(--text-primary)]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                [Media Engine]
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)] mt-3">
              {t.asciiTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] max-w-lg">
              {t.asciiDesc}
            </p>
          </div>

          <div className="mt-6 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 rounded-sm flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">// Character density selector:</span>
              <div className="flex gap-2 font-mono text-[10px]">
                {(["low", "mid", "high"] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => setAsciiDensity(density)}
                    className={`px-2 py-1 border rounded-sm ${
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
            <pre className="font-mono text-[9px] leading-tight text-[var(--accent-phosphor)] bg-[var(--bg-canvas)] p-3 rounded-sm border border-[var(--border-subtle)] tracking-widest min-w-[120px] text-center select-none">
              {getAsciiArt()}
            </pre>
          </div>
        </FlatBentoCard>

      </div>
    </section>
  );
}

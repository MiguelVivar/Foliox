"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sliders, ShieldAlert, Cpu } from "lucide-react";
import { DotGrid } from "@/components/atoms/DotGrid";

export default function SettingsPage() {
  const [openAiKey, setOpenAiKey] = useState("••••••••••••••••••••");
  const [geminiKey, setGeminiKey] = useState("");
  const [deepSeekKey, setDeepSeekKey] = useState("");
  const [activeTheme, setActiveTheme] = useState("dark");
  const [activeFont, setActiveFont] = useState("geist-mono");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] px-6 py-12 md:py-24">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 font-mono text-xs text-[var(--text-primary)]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-8 select-none">
          <Link href="/editor" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={12} />
            <span>Back to Editor</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sliders size={12} className="text-[var(--text-muted)]" />
            <span className="font-bold uppercase tracking-wider text-[var(--text-muted)]">SYSTEM CONFIG</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Section 1: AI Provider Keys */}
          <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Cpu size={14} />
              <span className="font-bold text-sm">// AI MODEL PROVIDERS (BYOK)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[var(--text-muted)]">OpenAI API Key:</span>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[var(--text-muted)]">Gemini API Key:</span>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="sk-or-google-key-••••••••"
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-[var(--text-muted)]">DeepSeek API Key:</span>
                <input
                  type="password"
                  value={deepSeekKey}
                  onChange={(e) => setDeepSeekKey(e.target.value)}
                  placeholder="ds-••••••••••••••••"
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Editor Style Options */}
          <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="font-bold text-sm">// EDITOR PREFERENCES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[var(--text-muted)]">Visual Theme:</span>
                <select
                  value={activeTheme}
                  onChange={(e) => setActiveTheme(e.target.value)}
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] font-mono"
                >
                  <option value="dark">Flat Dark (Swiss OKLCH)</option>
                  <option value="light">Flat Light (Pure White)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[var(--text-muted)]">Default Typography:</span>
                <select
                  value={activeFont}
                  onChange={(e) => setActiveFont(e.target.value)}
                  className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] font-mono"
                >
                  <option value="geist-mono">Geist Mono (High Precision)</option>
                  <option value="geist-sans">Geist Sans (UI Regular)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Privacy warning */}
          <div className="rounded-sm border border-yellow-800 bg-yellow-950/20 p-4 text-[11px] text-yellow-600 flex items-start gap-2">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold">LOCAL PERSISTENCE ONLY</span>
              <span>All keys entered on this form are stored exclusively within local cookies/localStorage inside this computer. No telemetry is logged.</span>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-[10px] text-emerald-400">
              {isSaved ? "✓ SETTINGS COMMITTED" : ""}
            </span>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] px-4 py-2 font-bold rounded-sm border border-transparent hover:opacity-90 active:scale-95 transition-all"
            >
              <Save size={12} />
              <span>COMMIT CONFIG</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

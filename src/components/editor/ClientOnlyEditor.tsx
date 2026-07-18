"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Columns2, LayoutTemplate, Home, Settings, User } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { cn } from "@/lib/cn";

export function ClientOnlyEditor() {
  const { splitView, toggleSplitView } = useEditorStore();
  const [selectedProfile, setSelectedProfile] = useState("architect-cv");

  return (
    <main className="crt-scanlines flex flex-col md:flex-row flex-1 overflow-hidden bg-[var(--bg-canvas)]">
      {/* ── Canvas zone ── */}
      <section
        className={cn(
          "relative flex flex-col overflow-hidden transition-none",
          splitView ? "w-full md:w-[60%]" : "flex-1",
        )}
      >
        {/* Glassmorphic Premium Toolbar Strip */}
        <div className="crt-glass flex items-center justify-between px-4 py-3 font-mono text-[10px] select-none border-b border-[var(--accent-phosphor)]/20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[var(--accent-phosphor)] hover:text-white border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] bg-[var(--accent-phosphor)]/10 rounded-sm px-2.5 py-1 transition-all uppercase tracking-widest font-bold crt-glowing-glow"
            >
              <Home size={11} />
              <span>Home</span>
            </Link>

            <span className="text-[var(--accent-phosphor)]/30">|</span>

            {/* Profile switching dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)] uppercase tracking-wider text-[9px]">Workspace:</span>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="bg-[var(--bg-canvas)] border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] px-2 py-1 rounded-sm text-[var(--accent-phosphor)] focus:outline-none focus:border-[var(--accent-phosphor)] font-mono text-[9px] uppercase tracking-widest transition-all"
              >
                <option value="architect-cv">Systems Architect CV</option>
                <option value="github-readme">GitHub Special README</option>
                <option value="devto-bio">Dev.to custom Bio</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[var(--text-muted)]">
              <User size={11} className="text-[var(--accent-phosphor)]" />
              <span className="font-bold text-[var(--text-primary)]">JANE_DOE</span>
              <span className="bg-[var(--accent-phosphor)]/20 text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)]/50 px-1.5 py-0.5 rounded-sm text-[8px] tracking-widest uppercase animate-pulse font-extrabold shadow-[0_0_8px_var(--glow-color)]">PRO</span>
            </div>

            <Link
              href="/settings"
              className="p-1.5 border border-[var(--accent-phosphor)]/30 hover:border-[var(--accent-phosphor)] bg-[var(--bg-canvas)] rounded-sm text-[var(--accent-phosphor)] hover:text-white transition-all hover:shadow-[0_0_8px_var(--glow-color)]"
              title="Configurations"
            >
              <Settings size={12} />
            </Link>

            <button
              type="button"
              onClick={toggleSplitView}
              aria-label={
                splitView ? "Close Markdown preview" : "Open Markdown preview"
              }
              aria-pressed={splitView}
              className={cn(
                "flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all font-bold cursor-pointer",
                splitView
                  ? "border-[var(--accent-phosphor)] bg-[var(--accent-phosphor)]/20 text-[var(--accent-phosphor)] shadow-[0_0_10px_var(--glow-color)]"
                  : "border-[var(--accent-phosphor)]/30 text-[var(--accent-phosphor)] hover:border-[var(--accent-phosphor)] hover:bg-[var(--accent-phosphor)]/10 hover:shadow-[0_0_8px_var(--glow-color)]",
              )}
            >
              {splitView ? (
                <LayoutTemplate size={11} />
              ) : (
                <Columns2 size={11} />
              )}
              {splitView ? "Canvas only" : "Split view"}
            </button>
          </div>
        </div>

        <EditorCanvas />
      </section>

      {/* ── Markdown preview (split view only) ── */}
      {splitView && (
        <section className="flex w-full md:w-[40%] flex-col overflow-hidden border-t md:border-t-0 md:border-l border-[var(--accent-phosphor)]/20 bg-[var(--bg-canvas)]/90 backdrop-blur-md">
          <MarkdownPreview />
        </section>
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-full md:w-80 flex-shrink-0 flex-col overflow-y-auto border-t md:border-t-0 md:border-l border-[var(--accent-phosphor)]/20 bg-[var(--bg-surface)]/95 backdrop-blur-md">
        <EditorSidebar />
      </aside>
    </main>
  );
}

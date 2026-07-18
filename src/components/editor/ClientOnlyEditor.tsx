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
    <main className="flex flex-col md:flex-row flex-1 overflow-hidden bg-[var(--bg-canvas)]">
      {/* ── Canvas zone ── */}
      <section
        className={cn(
          "relative flex flex-col overflow-hidden transition-none",
          splitView ? "w-full md:w-[60%]" : "flex-1",
        )}
      >
        {/* Flat Swiss Premium Toolbar Strip */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2 font-mono text-[10px] bg-[var(--bg-canvas)] select-none">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent-phosphor)] border border-transparent hover:border-[var(--border-subtle)] rounded-sm px-1.5 py-0.5 transition-colors uppercase tracking-widest"
            >
              <Home size={11} />
              <span>Home</span>
            </Link>

            <span className="text-[var(--border-subtle)]">|</span>

            {/* Profile switching dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)]">Profile:</span>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="bg-[var(--bg-canvas)] border border-[var(--border-subtle)] px-1.5 py-0.5 rounded-sm text-[var(--accent-phosphor)] focus:outline-none focus:border-[var(--accent-phosphor)] font-mono text-[10px] uppercase tracking-widest"
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
              <User size={11} />
              <span>Jane Doe</span>
              <span className="bg-[var(--bg-canvas)] text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)] px-1 rounded-sm text-[8px] tracking-widest uppercase animate-pulse">PRO</span>
            </div>

            <Link
              href="/settings"
              className="p-1 border border-[var(--border-subtle)] hover:border-[var(--accent-phosphor)] rounded-sm text-[var(--text-muted)] hover:text-[var(--accent-phosphor)] transition-colors"
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
                "flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-phosphor)]",
                splitView
                  ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-phosphor)] hover:text-[var(--accent-phosphor)]",
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
        <section className="flex w-full md:w-[40%] flex-col overflow-hidden border-t md:border-t-0 md:border-l border-[var(--border-subtle)]">
          <MarkdownPreview />
        </section>
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-full md:w-80 flex-shrink-0 flex-col overflow-y-auto border-t md:border-t-0 md:border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <EditorSidebar />
      </aside>
    </main>
  );
}

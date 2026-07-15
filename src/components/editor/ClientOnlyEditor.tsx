"use client";

/**
 * ClientOnlyEditor — renders only on the client (ssr: false).
 *
 * Motivation: the editor tree depends on:
 *   • Zustand `persist` (localStorage — not available in Node)
 *   • Appwrite SDK (initialised at module load in @/config/appwrite.ts,
 *     which can throw when evaluated server-side)
 *   • @dnd-kit sensors that require browser events
 *
 * Wrapping the full editor in a dynamic import with ssr:false keeps the
 * route server-renderable (for metadata / layout) while guaranteeing all
 * browser-only code runs after hydration.
 */

import { Columns2, LayoutTemplate } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { cn } from "@/lib/cn";

export function ClientOnlyEditor() {
  const { splitView, toggleSplitView } = useEditorStore();

  return (
    <main className="flex flex-1 overflow-hidden">
      {/* ── Canvas zone ── */}
      <section
        className={cn(
          "relative flex flex-col overflow-hidden transition-none",
          splitView ? "w-[60%]" : "flex-1",
        )}
      >
        {/* Toolbar strip */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            Canvas
          </span>
          <button
            type="button"
            onClick={toggleSplitView}
            aria-label={
              splitView ? "Close Markdown preview" : "Open Markdown preview"
            }
            aria-pressed={splitView}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]",
              splitView
                ? "border-[var(--border-focus)] text-[var(--text-primary)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)]",
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

        <EditorCanvas />
      </section>

      {/* ── Markdown preview (split view only) ── */}
      {splitView && (
        <section className="flex w-[40%] flex-col overflow-hidden">
          <MarkdownPreview />
        </section>
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <EditorSidebar />
      </aside>
    </main>
  );
}

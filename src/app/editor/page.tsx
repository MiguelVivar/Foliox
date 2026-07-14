import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorSidebar } from "@/components/editor/EditorSidebar";

export default function EditorPage() {
  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Left: Bento canvas (70%) */}
      <section className="relative flex flex-1 flex-col overflow-hidden">
        <EditorCanvas />
      </section>

      {/* Right: Sidebar (fixed w-80) */}
      <aside className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <EditorSidebar />
      </aside>
    </main>
  );
}

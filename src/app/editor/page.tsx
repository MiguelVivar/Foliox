"use client";

/**
 * /editor page — Client Component so that `next/dynamic` with `ssr: false`
 * is allowed. The `"use client"` boundary here is intentional and necessary:
 * `ssr: false` is only valid inside Client Components in Next.js App Router.
 *
 * All browser-only code (Zustand persist, Appwrite SDK, dnd-kit) lives inside
 * `ClientOnlyEditor`, which is dynamically imported to prevent any of it from
 * running during server-side rendering.
 */

import dynamic from "next/dynamic";

// Minimal placeholder shown while the JS bundle is loading
function EditorSkeleton() {
  return (
    <main className="flex flex-1 items-center justify-center overflow-hidden">
      <span className="animate-pulse font-mono text-xs text-[var(--text-muted)]">
        Loading editor…
      </span>
    </main>
  );
}

const ClientOnlyEditor = dynamic(
  () =>
    import("@/components/editor/ClientOnlyEditor").then(
      (m) => m.ClientOnlyEditor,
    ),
  { ssr: false, loading: EditorSkeleton },
);

export default function EditorPage() {
  return <ClientOnlyEditor />;
}

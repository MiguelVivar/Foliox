# Foliox — Block Editor Overhaul

**Date:** 2026-07-18
**Status:** Approved

## Context

The block editor (`src/components/editor/`) lets users build a GitHub profile
README from composable blocks (Hero/Bio, Tech Stack, GitHub Stats, ASCII
Banner, ASCII Image, Social Links, Rich Media, Custom Markdown). A prior
session attempted free 2D positioning for blocks but reverted to a fixed
vertical stack (`flex-col`) after running into overlap/scrollbar bugs — the
`Position { x, y, w, h }` type still exists on `Block` but is currently
unused for layout.

This overhaul addresses five problems reported directly against the current
editor:

1. GitHub Stats images silently fail to load with no feedback (uses the
   public `github-readme-stats.vercel.app` instance, which is known to be
   flaky/rate-limited).
2. Tech Stack is a single comma-separated text input — no visual picker.
3. ASCII Banner preview renders cramped and small.
4. ASCII Image conversion produces low-quality output (weak character ramp,
   no contrast normalization).
5. The canvas only supports a fixed top-to-bottom stack — no free
   positioning, resizing, or layout freedom.

## Goals

- Replace the fixed block stack with a free-form drag/resize canvas that
  never lets blocks overlap.
- Make GitHub Stats failures visible and recoverable without a backend.
- Replace the Tech Stack comma-separated input with a searchable catalog
  picker that still allows arbitrary custom entries.
- Visually polish ASCII Banner rendering.
- Improve ASCII Image conversion quality (algorithm only, not the surrounding UI).
- Keep the exported Markdown valid, GitHub-renderable, and always linear
  (top-to-bottom) — canvas freedom is an editing convenience, not a 2D
  export.

## Non-Goals

- No HTML-table-based multi-column export layout. Canvas position maps to
  export order via sort, not to visual 2D placement in the README.
- No backend proxy/cache for GitHub Stats images (stays 100% client-side,
  consistent with the "LOCAL STORAGE ONLY — ZERO DATA LOGGING" guarantee
  the app already advertises).
- No new configurable options for ASCII Image (charset presets, dithering
  toggles) — one improved, fixed algorithm.
- No mobile/touch-optimized canvas editing; the editor remains a
  desktop-oriented tool like the rest of the app today.

## Design

### 1. Data model (`src/types/ast.ts`, `src/store/useEditorStore.ts`)

- `Position { x, y, w, h }` becomes the real layout unit consumed by
  `react-grid-layout` (grid columns/rows), not unused metadata.
- `GithubStatsBlock.content` gains `theme?: string` (default `"dark"`),
  restricted to the themes github-readme-stats officially supports: `dark`,
  `radical`, `merko`, `gruvbox`, `tokyonight`, `dracula`, `onedark`,
  `cobalt`.
- `TechStackBlock.content` is unchanged (`technologies: string[]`) — only
  the editing UI changes.
- `reorderBlocks` is removed from `useEditorStore`. It has no live
  consumer today (grep confirms it's only referenced from the old
  self-check and planning docs) and becomes conceptually obsolete once
  export order is derived from canvas position instead of array index.
  Its self-check assertions in `useEditorStore.selfcheck.ts` are removed
  with it.

### 2. Free canvas (`EditorCanvas.tsx`, `BentoCard.tsx`)

- New dependency: `react-grid-layout`. It is purpose-built for
  drag+resize+collision-avoiding grids and directly replaces what would
  otherwise be a hand-rolled (and previously buggy) collision/compaction
  algorithm.
- `EditorCanvas` renders `react-grid-layout`'s `GridLayout` via a dynamic
  import with `ssr: false` (it touches `window`, and the app is Next.js
  App Router).
- Grid config: 12 columns, `compactType: "vertical"` (auto-push, no gaps,
  no overlap — this is the "snap to grid + auto-push" behavior chosen
  over free/unrestricted or masonry layouts), `preventCollision: false`,
  `resizeHandles: ["se"]` (bottom-right corner only, per the "resize
  handle in the corner" requirement), drag handle scoped to the block's
  existing header bar (not the full card, so content stays clickable).
- New blocks are added with `y: Infinity` so `react-grid-layout`
  auto-places them in the first open slot below existing content.
- `onLayoutChange` writes the new `{x,y,w,h}` back into each block's
  `position` field in the store (one batched update, not one `updateBlock`
  call per block per drag frame).
- `BentoCard`'s unused `index` / `totalBlocks` props are removed (dead
  code — the component body never read them).
- The surrounding "README.md" framed box (border + filename label) is
  unchanged; it now wraps the grid instead of a `flex-col` list.

### 3. Markdown export ordering (`src/lib/markdownSerializer.ts`)

- `serializeBlocks` sorts a *copy* of the blocks array by `position.y`
  (ascending), using `position.x` as a tiebreak, before mapping to
  Markdown. The underlying `blocks` array order in the store is
  otherwise irrelevant to export — this is what makes canvas position
  the single source of truth for both editing layout and Markdown order,
  without needing `reorderBlocks` or HTML tables.

### 4. GitHub Stats robustness (`GithubStatsBlockView.tsx`, `GithubStatsForm.tsx`, serializer)

- Each remote image (main stats card, top-langs, trophies) is wrapped in
  a small `<StatsImage>` helper with local `loading | loaded | error`
  state (via `onLoad`/`onError`), replacing the current "hide on error"
  behavior.
- On `error`: show an inline message ("No se pudo cargar — la API pública
  puede estar limitada") with a **Reintentar** button (re-fetches by
  appending a cache-busting `&_r=${Date.now()}` query param) and an
  "abrir en nueva pestaña" link to the raw image URL.
- `GithubStatsForm` gains a theme `<select>` populated from the same
  fixed theme list used in the type. Changing it updates
  `content.theme` and both the live preview and the exported Markdown
  URLs use it (today the theme is hardcoded to `"dark"` in both places —
  this fixes the drift between preview and export as a side effect).

### 5. Tech Stack catalog picker (`TechStackForm.tsx`, new `src/lib/techCatalog.ts`)

- The `TECH_BADGE_META` map currently private to `markdownSerializer.ts`
  (18 entries) moves to a shared `src/lib/techCatalog.ts` and grows to
  ~70-90 common technologies across languages, frontend/backend
  frameworks, databases, and cloud/devops tools — reusing the same
  simple-icons slugs shields.io already consumes, so no new icon
  infrastructure is needed. Both the serializer and the form import this
  one catalog.
- `TechStackForm` replaces the single comma-separated `<input>` with a
  combobox: typing filters the catalog (label + rendered icon swatch),
  clicking a result appends it as a chip (reusing the existing `Badge`
  component, now with a remove affordance). If the typed text matches no
  catalog entry, the dropdown offers "Add '<text>' as custom badge",
  preserving the serializer's existing fallback path for arbitrary
  strings (grey badge, no logo).
- `content.technologies` stays `string[]` of display labels — no
  migration needed for existing saved drafts.

### 6. ASCII Banner visual polish (`AsciiBannerBlockView.tsx`)

- Presentation-only changes: larger font size, corrected `leading` so
  glyphs aren't clipped or cramped, phosphor-green accent color
  consistent with the app's existing terminal aesthetic, centered
  within its card. No changes to `AsciiBannerForm.tsx` or the
  serializer — figlet output and font list are unaffected.

### 7. ASCII Image algorithm quality (`AsciiImageForm.tsx`)

- `convertImageToAscii` gets a perceptually-calibrated character ramp
  replacing the current `"@%#*+=-:. "`, plus a contrast-stretch pass
  (normalize the sampled luminance range to span the full 0-255 range
  before mapping to characters) so low-contrast source photos don't
  collapse onto 2-3 repeated glyphs. Scope is intentionally limited to
  this function — width/invert options and the block's rendering CSS are
  unchanged, per the explicitly chosen scope.

## Testing

- `useEditorStore.selfcheck.ts`: remove the now-deleted `reorderBlocks`
  assertions; no new store assertions needed since layout mutation is
  driven by `react-grid-layout` callbacks, not new store actions.
- `markdownSerializer.selfcheck` (new or extended): assert that two
  blocks with `position.y` values swapped relative to their array order
  serialize in `y` order, not array order.
- Manual verification in-browser (per project convention, since this is
  UI-heavy): drag/resize/add/remove blocks on the canvas and confirm no
  overlap is possible; trigger a GitHub Stats load failure (e.g. invalid
  username or offline) and confirm the retry UI appears; add a few tech
  badges via the new picker and confirm the exported Markdown badge URLs
  are unchanged for catalog entries and still work for custom text.

## Open Risks

- `react-grid-layout` has no official React 19 typings guarantee; if its
  peer-dependency range rejects React 19, a `--legacy-peer-deps`-style
  install workaround (or a maintained fork) may be needed. Verified
  during implementation, not blocking the design.

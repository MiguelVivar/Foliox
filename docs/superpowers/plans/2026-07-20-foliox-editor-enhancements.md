# Foliox Editor Enhancements — Phase 2

**Goal:** Fix GitHub Stats, ASCII Banner, and ASCII Image with professional-grade integrations.

**Status:** Planning  
**Created:** 2026-07-20  
**Priority:** High (user-facing features broken/ugly)

---

## Global Constraints

- **No new dependencies** unless absolutely necessary
- **Backward compatible** with existing blocks
- **Client-side first** — avoid external API calls where possible
- **Performance** — all conversions < 1s
- **Type-safe** — maintain strict TypeScript

---

## Tasks

### Task 1: Integrate Metrics API (GitHub Stats Replacement)

**Why:** Current GitHub Stats uses simple Shields.io + github-readme-stats, both rate-limited.  
**Solution:** Use `lowlighter/metrics` to generate rich GitHub profile metrics as SVG.

**What to change:**
- `src/types/ast.ts` — add `metricsTemplate`, `metricsOptions` to `GithubStatsBlock`
- `src/lib/metricsBuilder.ts` (new) — construct metrics API URL
- `src/components/editor/blocks/GithubStatsBlockView.tsx` — render SVG from metrics
- `src/components/editor/forms/GithubStatsForm.tsx` — add template selector + options

**Acceptance:**
- Renders metrics SVG without rate limiting
- User can choose templates (default, compact, minimalist)
- Preview updates as config changes

---

### Task 2: Personalize ASCII Banner

**Why:** Current banner is hard-coded style.  
**Solution:** Add inputs for text color, size, font-style, effects (glow, shadow).

**What to change:**
- `src/types/ast.ts` — extend `AsciiBannerBlock.content` with: `fontSize` (10-20), `fontColor` (hex), `glowColor`, `shadowEnabled`, `fontStyle`
- `src/components/editor/blocks/AsciiBannerBlockView.tsx` — use inline styles from content
- `src/components/editor/forms/AsciiBannerForm.tsx` — add UI: color picker, size slider, effects

**Acceptance:**
- User can adjust all visual properties
- Preview updates in real-time
- Exports with chosen styling

---

### Task 3: Improve ASCII Image (Dithering)

**Why:** Current algorithm produces pixelated output.  
**Solution:** Add ordered dithering (Bayer matrix) + better luminance mapping.

**What to change:**
- `src/lib/asciiArt.ts` — add `ditherOrderedBayer()` function
- `src/lib/asciiArt.ts` — improve `luminanceToAscii()` with dithering parameter
- `src/components/editor/forms/AsciiImageForm.tsx` — add checkbox: "Enable Dithering"
- `src/lib/asciiArt.selfcheck.ts` — add dithering tests

**Acceptance:**
- Dithering option produces smoother ASCII art
- Algorithm handles edge cases
- No performance regression

---

### Task 4: Integrate markdown-badges Repository

**Why:** Manual tech catalog is limited.  
**Solution:** Import badge data from markdown-badges (1000+ curated badges).

**What to change:**
- `src/lib/markdownBadges.ts` (new) — fetch/cache badge data
- `src/lib/techCatalog.ts` — merge with badge data
- `src/components/editor/forms/TechStackForm.tsx` — search 1000+ badges
- `src/lib/markdownBadges.selfcheck.ts` — verify catalog

**Acceptance:**
- Tech Stack picker searches 1000+ badges
- Badges render correctly
- Fallback to manual catalog if API unavailable

---

## Implementation Order

1. **Task 2** (ASCII Banner) — quick win
2. **Task 3** (ASCII Image dithering) — visual improvement
3. **Task 4** (markdown-badges) — data integration
4. **Task 1** (Metrics API) — complex API change

---

## Success Criteria

- ✅ GitHub Stats via metrics API
- ✅ ASCII Banner customizable
- ✅ ASCII Image with dithering
- ✅ markdown-badges integrated (1000+)
- ✅ All type-safe, backward compatible
- ✅ Build passes

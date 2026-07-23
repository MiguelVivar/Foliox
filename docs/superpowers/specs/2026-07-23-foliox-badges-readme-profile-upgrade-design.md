# Foliox: Full-Catalog Badges + GitHub Profile Upgrade — Design

**Date:** 2026-07-23
**Status:** Approved (pending spec review)
**Purpose:** Fix the badge-catalog drift bug, expand tech badges to virtually all technologies, finish the half-built GitHub Stats block, and add the two most common README elements Foliox is currently missing (animated typing header, capsule-render banner) — based on research into what top GitHub profile READMEs actually use in 2025/2026.

---

## Research Summary (firecrawl)

Searched for current GitHub profile README trends and tooling. Consistent findings across sources (dev.to tool comparison, `abhisheknaiidu/awesome-github-profile-readme`, multiple 2025 how-to guides):

- **Simple Icons** is the de facto badge icon source (shields.io already reads its slugs) — confirms the catalog-expansion approach needs no new runtime dependency.
- **Skill Icons** (`tandpfun/skill-icons`) is a widely-used alternative badge style — rounded, transparent, no colored background — distinct from shields.io's flat badges.
- **readme-typing-svg** (animated typing/deleting headline) appears in nearly every "how to build a standout profile" guide as step 1.
- **capsule-render** (wave/gradient header & footer banners) is the standard way profiles get a polished visual top section.
- **github-readme-streak-stats** and **github-profile-trophy** are standard companions to github-readme-stats — Foliox already generates their URLs in the markdown serializer but never exposes toggles for them in the UI.
- **Visitor/profile-view counters** remain common as a small vanity badge.

This confirms the design below rather than introducing speculative scope.

---

## Problem 1: Badge catalog drift (bug) + limited coverage

**Current state:**
- `src/lib/markdownBadges.ts` — 50 hardcoded badges, used by `TechStackPicker`/`TechStackGrid`/`TechStackBlockView` (the picker UI and live preview).
- `src/lib/techCatalog.ts` — 80 hardcoded badges, used only by `markdownSerializer.ts` (the actual exported markdown).
- These two catalogs already disagree (e.g. React's `backgroundColor` differs) and have non-overlapping entries. What a user sees in the picker/preview is not guaranteed to match what gets exported.
- Only ~50-80 of the ~3,200 technologies simple-icons covers are available at all.

**Fix:**
- Delete `markdownBadges.ts` and `techCatalog.ts`. Replace both with a single generated data file, `src/lib/techCatalogData.json`, containing `{ slug, title, hex }` for every simple-icons brand (~3,200 entries, ~150KB).
- Generation is a one-off script (`scripts/generate-tech-catalog.mjs`, run manually via `node`, not part of the build) that fetches `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/data/simple-icons.json`, extracts the needed fields, and writes the JSON file. Committed to the repo like any static asset — no runtime dependency added, nothing fetched at request time.
- `src/lib/techCatalog.ts` (kept, slimmed down) becomes the single module exporting `findTechMeta(label)`, `searchTech(query)`, and `POPULAR_TECH` (a curated ~60-label list — the current 50 entries' labels, reused for the picker's default view) — reading from `techCatalogData.json`.
- `TechStackPicker`, `TechStackGrid`, `TechStackBlockView`, and `markdownSerializer.ts` all import from this one module. Drift becomes structurally impossible.
- `TechStackGrid` behavior: with an empty search query, renders `POPULAR_TECH` only (~60 badges, same cost as today). Typing a query searches the full ~3,200-entry catalog by label substring match, capped at 60 rendered results with a "refine your search" hint if truncated — avoids ever mounting thousands of `<img>` tags.

**Acceptance:**
- Picking a tech in the editor and exporting the README always produces the same color/logo.
- Searching "godot", "solidity", "zig", or any simple-icons-supported brand returns a match.
- No badge-related regression for the 50 previously-supported labels (their exact hex/logo values are preserved since simple-icons is the authority both old catalogs already sourced from).

---

## Problem 2: No alternative badge visual style

**Current state:** Tech Stack block only renders shields.io flat badges (colored rectangle background).

**Fix:**
- Add `badgeStyle?: "shields" | "skill-icons"` to `TechStackBlock["content"]` (default `"shields"`, backward compatible — existing saved blocks with no field behave exactly as today).
- New helper `buildSkillIconsUrl(slugs: string[]): string` in `techCatalog.ts` → `https://skillicons.dev/icons?i=${slugs.join(",")}`. Skill Icons has its own slightly different slug set for a subset of ~200 popular technologies; `findTechMeta` gains a `skillIconsSlug` optional field populated only for entries with a known Skill Icons equivalent (mapped by hand for the ~150 most common — anything without a mapping falls back to `shields` rendering for that one badge, mixed styles never break the export).
- `TechStackBlockView` and the serializer both branch on `badgeStyle`: `skill-icons` renders **one combined image** (Skill Icons batches all selected techs into a single SVG request — that's how the tool works, not a Foliox limitation), `shields` renders one `<img>` per tech as today.
- `TechStackForm` gets a two-option style toggle (radio/segmented control matching existing form patterns).

**Acceptance:**
- Toggling style updates preview and export.
- Old blocks without `badgeStyle` still render as `shields` badges, unchanged.

---

## Problem 3: GitHub Stats block is half-built

**Current state:**
- `GithubStatsBlock["content"]` already has `showTrophies` and `showVisitorCounter`. `markdownSerializer.ts` already conditionally emits their embed URLs. But `GithubStatsForm.tsx` has no checkboxes for either — dead fields, unreachable from the UI.
- Streak stats are unconditionally always exported (no way to turn off).
- The live preview (`GithubStatsDisplay.tsx`) doesn't render stats/streak/trophies/visitor-counter SVGs at all — it independently fetches GitHub's REST API and hand-builds a card showing followers/bio/location/company, none of which appear anywhere in the actual exported markdown. Preview and export are visually unrelated.

**Fix:**
- Add the missing checkboxes to `GithubStatsForm.tsx`: "Show Trophies", "Show Visitor Counter", "Show Streak Stats" (new `showStreak?: boolean`, default `true` to preserve current export behavior for existing blocks).
- Rewrite `GithubStatsBlockView`/`GithubStatsDisplay` to render `<img>` tags pointing at the exact same URLs `markdownSerializer.ts` generates (stats card, streak card, top-langs card, trophy row, visitor counter — each conditional on its toggle, matching the serializer's conditions exactly). This makes the editor preview a true WYSIWYG match of the exported README.
- Delete `src/lib/githubStatsApi.ts` and its test — it becomes unused once the preview stops calling the GitHub REST API directly. (Verified: it has no other callers.)
- To avoid duplicating the URL-building logic between the preview and the serializer, extract it: new `src/lib/githubStatsUrls.ts` exporting `buildStatsUrl`, `buildStreakUrl`, `buildLangsUrl`, `buildTrophyUrl`, `buildVisitorCounterUrl` (pure functions, username+theme in, URL out). Both `markdownSerializer.ts` and the block view import from here — same drift-proofing pattern as Problem 1.

**Acceptance:**
- Every toggle in the form immediately shows/hides the corresponding card in the live preview.
- The exported markdown and the live preview show the identical set of GitHub-stats visuals for any given toggle combination.
- No network call to GitHub's REST API from the stats block anymore (all rendering is `<img src>` to public SVG-generator endpoints, same as tech badges already do).

---

## Problem 4: Missing animated typing header block

**New block kind:** `"typing-header"`

```ts
type TypingHeaderBlock = {
  id: string;
  kind: "typing-header";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    lines: string[];       // one or more phrases it cycles through
    speed?: number;        // ms per character, default 50
    pauseMs?: number;      // pause before deleting, default 1000
    color?: string;        // hex, no #, default "36BCF7"
    fontSize?: number;     // default 24
  };
};
```

- New `src/lib/typingHeaderUrl.ts`: `buildTypingSvgUrl(content)` → `https://readme-typing-svg.demolab.com?font=Fira+Code&size=${fontSize}&pause=${pauseMs}&color=${color}&center=true&vCenter=true&multiline=true&lines=${lines.map(encodeURIComponent).join(";")}`.
- New `TypingHeaderBlockView.tsx` (renders the `<img>`), `TypingHeaderForm.tsx` (line list editor — add/remove/reorder lines, color picker, speed slider), serializer case (`<div align="center"><img src="..." /></div>`).
- Follows the exact same file/pattern shape as every other block — no new architectural concept introduced.

**Acceptance:** Adding the block, typing 1-3 lines, and exporting produces a working typing-svg embed; empty `lines` renders the same "empty" placeholder pattern other blocks use (e.g. `<!-- typing-header: empty -->`).

---

## Problem 5: Missing capsule-render banner block

**New block kind:** `"capsule-banner"`

```ts
type CapsuleBannerBlock = {
  id: string;
  kind: "capsule-banner";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    text?: string;
    type: "waving" | "rect" | "cylinder" | "egg";  // capsule-render's `type` param
    color: string;           // hex or gradient spec, no #
    height?: number;         // default 200
    fontColor?: string;
    section?: "header" | "footer";
  };
};
```

- New `src/lib/capsuleBannerUrl.ts`: `buildCapsuleUrl(content)` → `https://capsule-render.vercel.app/api?type=${type}&color=${color}&height=${height}&section=${section}&text=${encodeURIComponent(text)}&fontColor=${fontColor}`.
- `CapsuleBannerBlockView.tsx`, `CapsuleBannerForm.tsx` (type selector, color input, text input, header/footer toggle), serializer case.
- Same pattern as Problem 4 — no shared abstraction needed between the two new "SVG-embed" blocks since each has a genuinely different parameter shape; forcing a shared base would be premature (YAGNI) for two blocks.

**Acceptance:** Same as Problem 4, capsule-render-specific parameters.

---

## Problem 6: Templates don't reflect any of the above

**Fix:**
- Update `MINIMAL_TEMPLATE`, `DEVELOPER_TEMPLATE`, `PROJECT_TEMPLATE` block content where they reference tech names — no structural change needed since they already just use label strings, which the new unified catalog still resolves.
- Add a new `VISUAL_TEMPLATE` to `README_TEMPLATES`: `typing-header` (hero greeting) → `capsule-banner` (waving header) → `tech-stack` (skill-icons style) → `github-stats` (with trophies + streak + langs all on) → `social-links` — demonstrating the full new capability set as the "showcase" template option.

**Acceptance:** All 4 templates apply cleanly via `applyTemplate()` and produce valid, non-empty exported markdown.

---

## Files Touched (summary)

**New:**
- `scripts/generate-tech-catalog.mjs`
- `src/lib/techCatalogData.json` (generated)
- `src/lib/githubStatsUrls.ts`
- `src/lib/typingHeaderUrl.ts`
- `src/lib/capsuleBannerUrl.ts`
- `src/components/editor/blocks/TypingHeaderBlockView.tsx`, `CapsuleBannerBlockView.tsx`
- `src/components/editor/forms/TypingHeaderForm.tsx`, `CapsuleBannerForm.tsx`
- Matching `.test.ts`/`.test.tsx` for every new module (TDD, per project constraints)

**Modified:**
- `src/lib/techCatalog.ts` (rewritten to read from the JSON data file)
- `src/lib/markdownSerializer.ts` (tech-stack badge-style branch, github-stats streak toggle, two new block-kind cases)
- `src/types/ast.ts` (`badgeStyle` on `TechStackBlock`, `showStreak` on `GithubStatsBlock`, two new block types added to the `Block` union)
- `src/components/editor/forms/TechStackForm.tsx` (style toggle)
- `src/components/editor/forms/GithubStatsForm.tsx` (three new checkboxes)
- `src/components/editor/blocks/GithubStatsBlockView.tsx` / `GithubStatsDisplay.tsx` (rewritten to render embed URLs instead of fetching REST API)
- `src/components/editor/blocks/TechStackBlockView.tsx` (skill-icons branch)
- `src/lib/readmeTemplates.ts` (new `VISUAL_TEMPLATE`)
- Wherever block kinds are registered for the editor palette/toolbar (block-picker UI, canvas renderer switch) — new cases for `typing-header` and `capsule-banner`

**Deleted:**
- `src/lib/markdownBadges.ts` (+ its test, if any)
- `src/lib/githubStatsApi.ts` + `githubStatsApi.test.ts`

---

## Out of Scope

- Spotify/WakaTime/Medium/dev.to live-activity integrations (mentioned in research but require the user's own API keys/OAuth — separate feature, not "badges + profile polish").
- GitHub contribution snake animation (requires a GitHub Action running in the user's own repo, not something Foliox's client-side editor can generate as a static embed).
- Bundling actual SVG assets locally for any badge style — everything stays as hosted `<img src>` URLs (shields.io / skillicons.dev / capsule-render.vercel.app / readme-typing-svg.demolab.com / github-readme-stats.vercel.app), consistent with Foliox's existing zero-backend-rendering approach.

---

## Testing

- Unit tests for every new pure URL-builder (`techCatalog.ts`, `githubStatsUrls.ts`, `typingHeaderUrl.ts`, `capsuleBannerUrl.ts`) — deterministic input → output string assertions, including edge cases (empty strings, special characters needing `encodeURIComponent`).
- `techCatalog.selfcheck` style test asserting the generated JSON has no duplicate slugs and every entry has a 6-hex-digit color.
- Serializer tests extended for the two new block kinds and the new toggles/branches on existing ones.
- Component tests for the two new forms and the rewritten `GithubStatsForm` checkboxes (RTL, matching existing form test patterns).
- Manual verification: apply the new Visual template, export markdown, paste into a scratch GitHub repo README to confirm all embeds actually render (this can't be unit-tested since it depends on third-party services being reachable).

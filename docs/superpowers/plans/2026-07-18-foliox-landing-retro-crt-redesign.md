# Foliox Landing Page Redesign (Retro CRT/ASCII) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the Foliox landing page (`LandingTemplate` + `organisms/landing/*`) from the current
"flat-swiss" mauve/neutral theme to a Retro CRT/ASCII aesthetic (dark: near-black + phosphor green;
light: thermal-paper/dot-matrix), scoped only to the landing page, and merge the About + Open Source
sections into one "Philosophy" section.

**Architecture:** All landing components already consume semantic CSS custom properties
(`var(--bg-canvas)`, `var(--text-primary)`, etc.) defined in `src/app/app.css`. A new scoped block
under a `.landing-retro` wrapper class overrides those same variable names with CRT values, so most
components need **zero code changes** — they re-theme automatically via cascade. The only code
changes needed are: (1) the small number of places that hardcode Tailwind color utilities
(`emerald-400`, `neutral-800`, `neutral-950`, decorative status dots) instead of using the tokens,
(2) the About/Open-Source merge, (3) the Navbar link removal, (4) one small ASCII motif addition in
the Hero, and (5) making `DotGrid` optionally render scanlines without affecting its other 5 call
sites (editor, login, profile, register, settings).

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 (`@theme`/CSS custom properties),
`lucide-react` icons. No new dependencies.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-18-foliox-landing-retro-crt-redesign-design.md`. Every
  requirement in that file is authoritative; this plan implements it task by task.
- **Scope: landing page only.** `/editor`, `/login`, `/profile`, `/register`, `/settings` must keep
  their current mauve/neutral theme and current `DotGrid` (no scanlines) untouched.
- **No new dependencies.** No ASCII art library (`figlet` is already installed and unrelated — used
  by the ASCII Banner editor block, not by this redesign), no CRT/shader library, no canvas/WebGL.
- **No copy tone changes.** Keep existing copy professional/clear (confirmed by user) — only new
  copy needed is the small `community.md` file content merged from `OpenSourceSection`.
- **Testing approach for this plan (deliberate, matches project convention):** this codebase has no
  test framework installed (`package.json` has no jest/vitest/playwright/testing-library) and uses
  assert-based `*.selfcheck.ts` files (see `src/lib/githubCommit.selfcheck.ts`) only for files with
  real branching logic. This plan is a visual reskin plus a static-content merge — there is no
  branching logic worth unit-testing. Each task's "test" step is `npx tsc --noEmit` (typecheck) plus
  a concrete manual browser checklist. This is a scoped simplification for this plan, not a project-
  wide precedent — do not read it as "skip tests" for future logic-bearing work.
- Follow existing code conventions in every file touched (2-space indent, double quotes, existing
  Tailwind class ordering style) — do not reformat unrelated lines.
- **Deviation from the spec's literal wording, noted for the record:** the spec says the merged
  `community.md` copy should move into `translations.ts` "for consistency with the rest of the
  file." Re-reading `AboutSection.tsx` during planning showed its own 3 existing file entries
  (`manifesto`, `architecture`, `privacy`) already store their bilingual content as local template
  literals inside the component, not in `translations.ts` — only the section header strings
  (`sectionBadge`/`sectionTitle`/etc.) come from `translations.ts`. Task 2 below follows that
  narrower, already-established local pattern instead, which is a smaller and more consistent diff.
  `translations.ts` is still touched, but only to remove the now-dead `openSource` key (Task 3).
- **Resolved from the spec's "to verify" item:** `FlatBentoCard.tsx`, `SectionHeader.tsx`, and
  `Button.tsx` were read during planning — none hardcode colors outside the semantic tokens, so no
  task modifies them. Same for `TechTicker.tsx` and `CommandPalette.tsx` — both already consume only
  `var(--token)` classes, so they re-theme automatically via the Task 1 cascade with no code change.

---

### Task 1: CRT theme tokens + scope the landing page

**Files:**
- Modify: `src/app/app.css` (append new block after the existing `:root[data-theme="light"]` block,
  before the `@media print` block — i.e. after line 93)
- Modify: `src/components/atoms/DotGrid.tsx`
- Modify: `src/components/templates/LandingTemplate.tsx`

**Interfaces:**
- Produces: CSS custom properties `--accent-phosphor` and `--glow-color` (new tokens), plus CRT-
  themed values for the existing token names (`--bg-canvas`, `--bg-surface`, `--bg-surface-hover`,
  `--border-subtle`, `--border-focus`, `--text-primary`, `--text-muted`, `--bg-brand-cta`,
  `--text-brand-cta`) — all scoped under a `.landing-retro` class. Produces CSS utility classes
  `.crt-scanlines` and `.crt-glow`. Produces `DotGrid`'s new optional prop `scanlines?: boolean`
  (default `false` — every existing call site keeps rendering exactly as before).
- Consumes: nothing from other tasks (this is the foundation task).

- [ ] **Step 1: Append the scoped CRT theme block to `app.css`**

Insert this block immediately after line 93 (`}` closing `:root[data-theme="light"]`) and before the
`/* ─── Print / PDF Export ─────... */` comment on line 95:

```css
/* ─── Landing Page: Retro CRT/ASCII theme scope (spec 2026-07-18) ──────── */
.landing-retro {
  --accent-phosphor: #6ee7a7;
  --glow-color: rgba(110, 231, 167, 0.35);
  --bg-canvas: #0a0b0d;
  --bg-surface: #101317;
  --bg-surface-hover: #171b20;
  --border-subtle: #1c1f24;
  --border-focus: #2a2e35;
  --text-primary: #f2f0ea;
  --text-muted: #8b9089;
  --bg-brand-cta: var(--accent-phosphor);
  --text-brand-cta: #061109;
}

@media (prefers-color-scheme: light) {
  .landing-retro {
    --accent-phosphor: #1f3a24;
    --glow-color: transparent;
    --bg-canvas: #f2ede1;
    --bg-surface: #ece5d5;
    --bg-surface-hover: #e3dbc7;
    --border-subtle: #c9c0aa;
    --border-focus: #1f3a24;
    --text-primary: #1f3a24;
    --text-muted: #5a6b57;
    --bg-brand-cta: var(--accent-phosphor);
    --text-brand-cta: #f2ede1;
  }
}

:root[data-theme="dark"] .landing-retro {
  --accent-phosphor: #6ee7a7;
  --glow-color: rgba(110, 231, 167, 0.35);
  --bg-canvas: #0a0b0d;
  --bg-surface: #101317;
  --bg-surface-hover: #171b20;
  --border-subtle: #1c1f24;
  --border-focus: #2a2e35;
  --text-primary: #f2f0ea;
  --text-muted: #8b9089;
  --bg-brand-cta: var(--accent-phosphor);
  --text-brand-cta: #061109;
}

:root[data-theme="light"] .landing-retro {
  --accent-phosphor: #1f3a24;
  --glow-color: transparent;
  --bg-canvas: #f2ede1;
  --bg-surface: #ece5d5;
  --bg-surface-hover: #e3dbc7;
  --border-subtle: #c9c0aa;
  --border-focus: #1f3a24;
  --text-primary: #1f3a24;
  --text-muted: #5a6b57;
  --bg-brand-cta: var(--accent-phosphor);
  --text-brand-cta: #f2ede1;
}

.crt-scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.035) 0px,
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px,
    transparent 3px
  );
}

.crt-glow {
  text-shadow: 0 0 12px var(--glow-color);
}

@media (prefers-reduced-motion: reduce) {
  .crt-glow {
    text-shadow: none;
  }
}
```

- [ ] **Step 2: Give `DotGrid` an optional `scanlines` prop (non-breaking)**

Replace the full contents of `src/components/atoms/DotGrid.tsx`:

```tsx
interface DotGridProps {
  scanlines?: boolean;
}

export function DotGrid({ scanlines = false }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`dot-grid pointer-events-none absolute inset-0 -z-10 ${
        scanlines ? "crt-scanlines" : ""
      }`}
    />
  );
}
```

- [ ] **Step 3: Scope `LandingTemplate` with `.landing-retro` and enable scanlines**

In `src/components/templates/LandingTemplate.tsx`, change:

```tsx
    <div className="relative min-h-screen w-full bg-[var(--bg-canvas)] overflow-x-hidden flex flex-col">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>
```

to:

```tsx
    <div className="landing-retro relative min-h-screen w-full bg-[var(--bg-canvas)] overflow-x-hidden flex flex-col">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid scanlines />
      </div>
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (the `scanlines` prop is optional, so the 5 other `<DotGrid />` call sites in
`login/page.tsx`, `profile/page.tsx`, `register/page.tsx`, `settings/page.tsx`, and
`editor/EditorCanvas.tsx` still type-check unchanged).

- [ ] **Step 5: Manual check**

Run `npm run dev` (or `pnpm dev`), open `/` and confirm the canvas background, surfaces, and text
are now near-black with a faint scanline+dot texture (dark mode), and switching the system theme to
light (or toggling `ThemeToggle`) switches it to the cream "thermal paper" palette. Open `/editor`,
`/login`, `/profile`, `/settings` and confirm they are **unchanged** (still mauve/neutral, no
scanlines).

- [ ] **Step 6: Commit**

```bash
git add src/app/app.css src/components/atoms/DotGrid.tsx src/components/templates/LandingTemplate.tsx
git commit -m "feat(landing): scope retro CRT theme tokens to landing page"
```

---

### Task 2: Merge Open Source into the Philosophy (About) section

**Files:**
- Modify: `src/components/organisms/landing/AboutSection.tsx`
- Delete: `src/components/organisms/landing/OpenSourceSection.tsx`
- Modify: `src/components/templates/LandingTemplate.tsx`

**Interfaces:**
- Consumes: nothing from Task 1 directly (this task is content-only; the new CRT tokens apply
  automatically via cascade once Task 1 lands).
- Produces: `AboutSection`'s `FileKey` type gains a 4th member `"community"`; the file-explorer now
  has 4 tabs (`manifesto.md`, `architecture.json`, `security.txt`, `community.md`). Later tasks that
  retheme `AboutSection.tsx` colors (Task 3) must operate on this updated file.

- [ ] **Step 1: Add the `community` file entry and its CTA link in `AboutSection.tsx`**

In `src/components/organisms/landing/AboutSection.tsx`, change the type declaration:

```tsx
type FileKey = "manifesto" | "architecture" | "privacy";
```

to:

```tsx
type FileKey = "manifesto" | "architecture" | "privacy" | "community";
```

Then add a 4th entry to the `files` object, right after the `privacy` entry (after its closing
`` ` , `` and before the final `};` that closes the `files` object):

```tsx
    community: {
      name: "community.md",
      content: lang === "en" ? `
[COMMUNITY & LICENSE]

Repository: github.com/MiguelVivar/Foliox
★ Stars: 1,420+
⑂ Forks: 184
⇄ Pull Requests: 42 Open

License: MIT (permissive)
✓ Commercial use permitted
✓ Modification permitted
✓ Distribution permitted
✓ Private use permitted

100% Open Source. No vendor lock-in — audit it, run it, self-host it forever.
      ` : `
[COMUNIDAD Y LICENCIA]

Repositorio: github.com/MiguelVivar/Foliox
★ Estrellas: 1,420+
⑂ Forks: 184
⇄ Pull Requests: 42 Abiertos

Licencia: MIT (permisiva)
✓ Uso comercial permitido
✓ Modificación permitida
✓ Distribución permitida
✓ Uso privado permitido

100% Código Abierto. Sin dependencia de proveedor — audítalo, ejecútalo, auto-alójalo para siempre.
      `,
    },
```

- [ ] **Step 2: Add the "Explore Repository" CTA link, shown only for the `community` tab**

In the same file, find the closing of the workspace card:

```tsx
          </div>
        </div>
      </div>
    </section>
  );
}
```

(this is the end of the `lg:col-span-7` workspace `<div>`, right before the closing of the grid
`<div>` and the `</section>`). Replace it with:

```tsx
          </div>

          {activeFile === "community" && (
            <a
              href="https://github.com/MiguelVivar/Foliox"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] hover:border-[var(--border-focus)] transition-colors"
            >
              {lang === "en" ? "Explore Repository" : "Explorar Repositorio"} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add a 4th tab button**

The sidebar tab list already iterates `(Object.keys(files) as FileKey[]).map(...)` — no change
needed there, it will automatically render a 4th `community.md` button once the `files` object has
the new key from Step 1.

- [ ] **Step 4: Delete `OpenSourceSection.tsx` and remove it from `LandingTemplate.tsx`**

Delete the file:

```bash
rm src/components/organisms/landing/OpenSourceSection.tsx
```

In `src/components/templates/LandingTemplate.tsx`, remove the import:

```tsx
import { OpenSourceSection } from "@/components/organisms/landing/OpenSourceSection";
```

and remove its usage:

```tsx
          <AboutSection lang={lang} />
          <OpenSourceSection lang={lang} />
          <PricingSection lang={lang} />
```

becomes:

```tsx
          <AboutSection lang={lang} />
          <PricingSection lang={lang} />
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (If `OpenSourceSectionProps`/unused-import errors appear, confirm the import
and JSX usage were both removed from `LandingTemplate.tsx`.)

- [ ] **Step 6: Manual check**

Open `/` (both `es` and `en` via the navbar language toggle), scroll to the "Philosophy" section,
click through all 4 tabs including the new `community.md`, and confirm the "Explore Repository" link
appears only on that tab and points to `https://github.com/MiguelVivar/Foliox`. Confirm the page no
longer has a separate Open Source section between Philosophy and Pricing.

- [ ] **Step 7: Commit**

```bash
git add src/components/organisms/landing/AboutSection.tsx src/components/templates/LandingTemplate.tsx
git rm src/components/organisms/landing/OpenSourceSection.tsx
git commit -m "feat(landing): merge Open Source section into Philosophy file explorer"
```

---

### Task 3: Remove the Open Source navbar link

**Files:**
- Modify: `src/components/organisms/landing/Navbar.tsx`
- Modify: `src/lib/translations.ts`

**Interfaces:**
- Consumes: nothing (independent of Tasks 1-2, but logically follows the Task 2 merge).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Remove the desktop nav link**

In `src/components/organisms/landing/Navbar.tsx`, change:

```tsx
          <a
            href="#philosophy"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {t.philosophy}
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#open-source"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {t.openSource}
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#pricing"
```

to:

```tsx
          <a
            href="#philosophy"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {t.philosophy}
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#pricing"
```

- [ ] **Step 2: Remove the mobile drawer link**

In the same file, change:

```tsx
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // {t.philosophy}
            </a>
            <a
              href="#open-source"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // {t.openSource}
            </a>
            <a
              href="#pricing"
```

to:

```tsx
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // {t.philosophy}
            </a>
            <a
              href="#pricing"
```

- [ ] **Step 3: Remove the now-unused `openSource` translation key**

In `src/lib/translations.ts`, remove line 8 (`en.navbar.openSource`):

```ts
      openSource: "Open Source",
```

and remove the equivalent line in `es.navbar` (`"Código Abierto"`):

```ts
      openSource: "Código Abierto",
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual check**

Open `/` and confirm the navbar (desktop) shows `Features | Philosophy | Pricing` with no "Open
Source" link, in both languages. Open the mobile menu (narrow viewport) and confirm the same.

- [ ] **Step 6: Commit**

```bash
git add src/components/organisms/landing/Navbar.tsx src/lib/translations.ts
git commit -m "feat(landing): remove Open Source navbar link after section merge"
```

---

### Task 4: Retheme hardcoded accent colors to the phosphor token

**Files:**
- Modify: `src/components/organisms/landing/BentoFeatures.tsx`
- Modify: `src/components/organisms/landing/AboutSection.tsx`
- Modify: `src/components/organisms/landing/PricingSection.tsx`
- Modify: `src/components/organisms/landing/Footer.tsx`

**Interfaces:** none (pure class-name substitution, no prop/type changes).

These files currently hardcode `emerald-400`/`neutral-800`/`neutral-950` Tailwind utilities instead
of the semantic tokens. In dark mode this happens to look similar to the new phosphor green, but in
the new light "thermal paper" mode these hardcoded values would stay dark-mode-colored and look
broken (e.g. a near-black `neutral-950` box on a cream background). Replace them with the
`--accent-phosphor` token (which resolves to green in dark mode and dark ink in light mode) and the
existing `--bg-surface-hover` / `--bg-canvas` tokens.

- [ ] **Step 1: `BentoFeatures.tsx` — icon badge backgrounds**

Replace all 4 occurrences of:

```tsx
              <span className="rounded-sm bg-neutral-800 p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
```

with:

```tsx
              <span className="rounded-sm bg-[var(--bg-surface-hover)] p-1.5 border border-[var(--border-subtle)] flex items-center justify-center">
```

(Use `replace_all` — the string is identical at all 4 call sites: the AST card, the BYOK card, the
Deploy card, and the ASCII card icon wrappers.)

- [ ] **Step 2: `BentoFeatures.tsx` — compiled markdown output color**

Replace:

```tsx
              <pre className="bg-[var(--bg-surface)] p-2 rounded-sm text-emerald-400 overflow-x-auto">
```

with:

```tsx
              <pre className="bg-[var(--bg-surface)] p-2 rounded-sm text-[var(--accent-phosphor)] overflow-x-auto">
```

- [ ] **Step 3: `BentoFeatures.tsx` — BYOK "local storage" label**

Replace:

```tsx
            <div className="text-[9px] text-emerald-400 uppercase tracking-wide">
```

with:

```tsx
            <div className="text-[9px] text-[var(--accent-phosphor)] uppercase tracking-wide">
```

- [ ] **Step 4: `BentoFeatures.tsx` — deploy progress bar fill**

Replace:

```tsx
                  className={`h-full bg-emerald-400 transition-all duration-1000 ${
```

with:

```tsx
                  className={`h-full bg-[var(--accent-phosphor)] transition-all duration-1000 ${
```

- [ ] **Step 5: `BentoFeatures.tsx` — ASCII output block**

Replace:

```tsx
            <pre className="font-mono text-[9px] leading-tight text-emerald-400 bg-neutral-950 p-3 rounded-sm border border-[var(--border-subtle)] tracking-widest min-w-[120px] text-center select-none">
```

with:

```tsx
            <pre className="font-mono text-[9px] leading-tight text-[var(--accent-phosphor)] bg-[var(--bg-canvas)] p-3 rounded-sm border border-[var(--border-subtle)] tracking-widest min-w-[120px] text-center select-none">
```

- [ ] **Step 6: `AboutSection.tsx` — workspace status label**

Replace:

```tsx
                <span className="text-emerald-400">[READY]</span>
```

with:

```tsx
                <span className="text-[var(--accent-phosphor)]">[READY]</span>
```

- [ ] **Step 7: `PricingSection.tsx` — checkmark icons**

Replace all 10 occurrences of:

```tsx
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
```

with (use `replace_all` — identical string at all 10 call sites across both pricing plans):

```tsx
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
```

- [ ] **Step 8: `Footer.tsx` — status dot**

Replace:

```tsx
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
```

with:

```tsx
          <span className="h-2 w-2 rounded-full bg-[var(--accent-phosphor)] shrink-0" />
```

- [ ] **Step 9: Verify no stray occurrences remain**

Run: `grep -rn "emerald-400\|neutral-800\|neutral-950" src/components/organisms/landing/`
Expected: no matches (the only remaining decorative hardcoded color in the landing folder should be
`Navbar.tsx`'s `text-yellow-500 fill-yellow-500` GitHub star icon, which is intentionally left as-is
— it mirrors GitHub's own star color and isn't a "success/accent" indicator).

- [ ] **Step 10: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 11: Manual check**

Open `/` in dark mode: confirm the AST "compiled successfully" output, the BYOK storage label, the
deploy progress bar, the ASCII art preview, the About "[READY]" badge, the Pricing checkmarks, and
the Footer status dot are all phosphor-green. Switch to light mode: confirm the same elements are
now dark ink (not neon green, not stuck on a black box) and readable against the cream background.

- [ ] **Step 12: Commit**

```bash
git add src/components/organisms/landing/BentoFeatures.tsx src/components/organisms/landing/AboutSection.tsx src/components/organisms/landing/PricingSection.tsx src/components/organisms/landing/Footer.tsx
git commit -m "feat(landing): retheme hardcoded accent colors to the phosphor token"
```

---

### Task 5: Reskin the Hero — retheme accents + add ASCII motif

**Files:**
- Modify: `src/components/organisms/landing/HeroSection.tsx`

**Interfaces:** none.

- [ ] **Step 1: Retheme the badge pulse dot**

Replace:

```tsx
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
```

with:

```tsx
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-phosphor)] motion-safe:animate-pulse" />
```

(`motion-safe:` ensures the pulse animation is skipped under `prefers-reduced-motion`, per the
spec's accessibility constraint on animated glow/blink effects.)

- [ ] **Step 2: Retheme the GitHub stars readout**

Replace:

```tsx
                      <div className="font-mono text-[10px] text-emerald-400 mt-2">
```

with:

```tsx
                      <div className="font-mono text-[10px] text-[var(--accent-phosphor)] mt-2">
```

- [ ] **Step 3: Add a small ASCII motif next to the badge**

Change the badge block:

```tsx
          <div className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-phosphor)] motion-safe:animate-pulse" />
            <span>{t.tag}</span>
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
```

to:

```tsx
          <div className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-phosphor)] motion-safe:animate-pulse" />
            <span>{t.tag}</span>
          </div>

          <pre
            aria-hidden="true"
            className="font-mono text-[8px] leading-none text-[var(--accent-phosphor)] opacity-70 select-none"
          >
{`>_ foliox --init`}
          </pre>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-[var(--text-primary)] crt-glow sm:text-5xl md:text-6xl">
```

(This adds a one-line terminal-prompt motif between the badge and the headline, and applies the
`.crt-glow` utility from Task 1 to the headline only — matching the spec's constraint that glow is
restricted to short headline/accent text, never long paragraph copy.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual check**

Open `/` in dark mode: confirm the `>_ foliox --init` line renders between the badge and the
headline, the headline has a subtle green glow, and the badge dot / stars readout are phosphor
green. Switch to light mode: confirm the glow disappears (per the `--glow-color: transparent`
override from Task 1) and the motif/readout render in dark ink instead of neon green. Enable
"reduce motion" in OS settings and confirm the badge dot no longer pulses.

- [ ] **Step 6: Commit**

```bash
git add src/components/organisms/landing/HeroSection.tsx
git commit -m "feat(landing): retheme hero accents and add terminal ASCII motif"
```

---

### Task 6: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full typecheck and build**

Run: `npx tsc --noEmit`
Run: `npm run build` (or `pnpm build`)
Expected: both complete with no errors.

- [ ] **Step 2: Full manual walkthrough (dark mode, `es`)**

Open `/`, confirm `ThemeToggle` shows dark mode active. Walk through: Hero (standard/minimal layout
toggle), TechTicker (marquee scrolls, pauses on hover), Bento Features (Compile button, BYOK key
input, Deploy simulation button through all 3 states, ASCII density selector), Philosophy (all 4
file tabs incl. `community.md` with its GitHub link), Pricing (monthly/lifetime toggle), Footer
links, Command Palette (press `Ctrl+K` / `Cmd+K`, run each command). Confirm no console errors.

- [ ] **Step 3: Repeat in light mode and in `en`**

Toggle to light mode via `ThemeToggle` and repeat the same walkthrough. Switch language to `en` via
the navbar globe button and confirm every section's copy updates (no missing-translation blanks),
including the new `community.md` tab content.

- [ ] **Step 4: Confirm theme isolation**

Open `/editor`, `/login`, `/profile`, `/register`, `/settings` and confirm all five still render the
original mauve/neutral theme with the plain dot-grid background (no scanlines, no phosphor green).

- [ ] **Step 5: Commit (if any fixups were needed)**

```bash
git add -A
git commit -m "fix(landing): address issues found in final verification pass"
```

(Skip this step if no fixups were needed.)

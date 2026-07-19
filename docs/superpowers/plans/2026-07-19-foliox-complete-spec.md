# Foliox Editor - Complete Feature Specification & Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional README generator with a free drag-drop canvas, real-time block editing, GitHub stats integration, tech badge showcase, ASCII art, and one-click export to markdown.

**Architecture:** 
- **Frontend:** Next.js 16 + React + Zustand store + react-grid-layout for free positioning
- **Data Layer:** TypeScript AST (Abstract Syntax Tree) for block definitions, markdown serializer for export
- **APIs:** GitHub API (direct stats fetch, no rate-limit relay), README generators (research + integration), markdown-badges library (50+ curated tech badges)
- **Export:** Markdown → clipboard/download with proper formatting

**Tech Stack:** 
- Next.js 16, React 19, TypeScript 5.6, Zustand, TailwindCSS, lucide-react, react-grid-layout v1.5.3, shields.io (dynamic badges), GitHub API

---

## Global Constraints

- React 19 (Server/Client boundary: `"use client"` only for interactive components)
- Zustand for client state (editor store, block positions, content)
- TypeScript strict mode (no `any`, immutable patterns required)
- All user input sanitized (encodeURIComponent for badges, no XSS via dangerouslySetInnerHTML)
- Minimum 80% test coverage for new features (TDD required)
- DRY principle: shared catalogs (tech badges, theme configs) extracted to libs
- Frequent commits after each task (no mega-commits)

---

## Current Status

**Completed:**
- ✅ Grid canvas (react-grid-layout v1.5.3, free drag/resize)
- ✅ Block types: Hero Bio, Tech Stack, GitHub Stats, ASCII Banner, ASCII Image, Social Links, Rich Media, Markdown Custom
- ✅ Tech badge catalog (50 badges with logos via shields.io)
- ✅ ASCII art conversion (luminance-to-ASCII with contrast stretch + optional dithering)
- ✅ Markdown export with position-based sorting
- ✅ Zustand store with immutable updates

**Broken / Incomplete:**
- ❌ Tech Stack: Missing visual grid showing ALL 50 badges (currently search-only)
- ❌ GitHub Stats: Metrics API (metrics.lecoq.io) returning empty/broken SVG
- ❌ README Generators: Not researched/integrated yet
- ❌ No README generation automation (manual block editing only)

---

## Phase 1: Tech Stack UI Overhaul (Fix Tech Display)

### Task 1: Build TechStackPicker Component with Badge Grid

**Files:**
- Create: `src/components/editor/forms/TechStackPicker.tsx`
- Create: `src/components/editor/forms/TechStackGrid.tsx`
- Modify: `src/components/editor/forms/TechStackForm.tsx`
- Test: `src/components/editor/forms/__tests__/TechStackPicker.test.tsx`

**Interfaces:**
- Consumes: `getBadgeByLabel()`, `searchBadges()` from `src/lib/markdownBadges.ts`
- Produces: `TechStackPicker` component accepting `{selectedTechs: string[], onAdd: (tech: string) => void, onRemove: (tech: string) => void}`

**Key Requirements:**
1. Display ALL 50+ badges in a scrollable grid
2. Search input filters badges by label (case-insensitive)
3. Click badge to toggle selection (visual ring indicator)
4. Use shields.io dynamic badge images
5. Complete test coverage (TDD: write tests first)
6. Type-safe with no `any` types

---

## Phase 2: GitHub Stats Fix (Replace Metrics API)

### Task 2: Implement GitHub API Direct Stats Fetch (Replace metrics.lecoq.io)

**Files:**
- Create: `src/lib/githubStatsApi.ts`
- Create: `src/lib/githubStatsApi.test.ts`
- Modify: `src/components/editor/blocks/GithubStatsBlockView.tsx`
- Modify: `src/components/editor/forms/GithubStatsForm.tsx`

**Interfaces:**
- Consumes: GitHub REST API (public, no auth needed for basic queries)
- Produces: `fetchGithubStats(username: string): Promise<GitHubUserStats | null>`, `GithubStatsDisplay` component rendering real GitHub data

**Key Requirements:**
1. Fetch user stats directly from GitHub API (no metrics.lecoq.io)
2. Display repositories, followers, following, joined date, top languages
3. Cache responses 1 hour (next.js revalidate)
4. Error handling for rate limits / non-existent users
5. Real data only (no placeholder SVGs)

---

## Phase 3: README Generator Research & Integration

### Task 3: Research README Generators with Firecrawl

**Files:**
- Create: `docs/RESEARCH_README_GENERATORS.md`
- Create: `src/lib/readmeGenerators.ts`

**Key Requirements:**
1. Document 5-10 popular README generators
2. Analyze APIs and integration patterns
3. Recommend integration approach
4. No actual API calls needed (research only)

---

### Task 4: Create README Template System (Auto-Generation)

**Files:**
- Create: `src/lib/readmeTemplates.ts`
- Create: `src/components/editor/TemplateLibrary.tsx`
- Create: `src/lib/readmeTemplates.test.ts`

**Interfaces:**
- Consumes: MARKDOWN_BADGES, fetchGithubStats, AST block types
- Produces: `README_TEMPLATES`, `applyTemplate(templateId: string): Block[]` returning pre-filled blocks

**Key Requirements:**
1. Define 3-5 curated README templates (minimal, developer, project)
2. Each template pre-fills blocks (hero-bio, tech-stack, github-stats, markdown-custom)
3. "Load Template" button in editor applies template to canvas
4. Unique block IDs + grid positions on apply
5. Full test coverage

---

## Phase 4: Polish & Export Enhancement

### Task 5: Improve Markdown Export Formatting

**Files:**
- Modify: `src/lib/markdownSerializer.ts`
- Create: `src/lib/markdownSerializer.test.ts`

**Key Requirements:**
1. Export hero-bio as `# Name` with tagline
2. Export tech-stack as inline badge images
3. Export github-stats as profile links + real data
4. Proper spacing between sections (\n\n\n)
5. Follow Best README Template structure
6. Full test coverage with real-world examples

---

## End-of-Spec Checklist

All tasks must satisfy:
- [ ] Tests written first (RED → GREEN → REFACTOR)
- [ ] 80% coverage minimum
- [ ] No `any` types, strict TypeScript
- [ ] XSS safe (encodeURIComponent, no dangerouslySetInnerHTML)
- [ ] Immutable state patterns (no mutations)
- [ ] One commit per task
- [ ] Self-review before handoff to task reviewer

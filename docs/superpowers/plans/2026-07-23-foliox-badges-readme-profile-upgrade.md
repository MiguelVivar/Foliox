# Foliox Badges + GitHub Profile Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Foliox's two drifted badge catalogs into one ~3,200-technology catalog (simple-icons-backed, shields.io-rendered), finish the half-wired GitHub Stats block (trophies/streak/visitor-counter toggles + WYSIWYG preview), and add the two GitHub-profile elements research shows nearly every standout profile uses but Foliox currently lacks: an animated typing header and a capsule-render banner.

**Architecture:** Every new visual (badges, stats cards, typing header, banner) stays a hosted `<img src>` URL built by a small pure function — no new runtime dependency, no locally-bundled SVGs, no backend rendering. Two existing drifted data sources (`markdownBadges.ts` + `techCatalog.ts`) collapse into one `techCatalog.ts` reading a generated static JSON. Two new block kinds (`typing-header`, `capsule-banner`) follow the exact file/pattern shape every existing block already uses (type in `ast.ts`, `*BlockView.tsx`, `*Form.tsx`, a serializer case, wiring in `BentoCard.tsx` + `EditorSidebar.tsx`).

**Tech Stack:** Next.js 16, React 19, TypeScript 5.6 (strict), Zustand, Vitest + React Testing Library, `simple-icons` (devDependency only, used by a one-off generation script — never imported by app code).

## Global Constraints

- React 19 Server/Client boundary: `"use client"` only on components that use state, effects, or the Zustand store — presentational SVG-URL components stay directive-free.
- TypeScript strict mode, no `any`.
- All URLs built with `encodeURIComponent`/`URLSearchParams` — never raw string concatenation of user input into a URL.
- No `dangerouslySetInnerHTML` anywhere in this plan.
- Zero new runtime dependencies. `simple-icons` is a devDependency used only by `scripts/generate-tech-catalog.mjs`.
- 80%+ test coverage for every new/modified pure function and component (TDD: failing test → minimal implementation → passing test).
- DRY: one catalog (`techCatalog.ts`) and one GitHub-stats-URL module (`githubStatsUrls.ts`) — both the live preview and the markdown export import the same functions, so they cannot drift again.
- One commit per task.

---

## File Structure Overview

**New:**
- `scripts/generate-tech-catalog.mjs` — one-off generator, run manually
- `src/lib/techCatalogData.json` — generated data (~3,200 entries)
- `src/lib/githubStatsUrls.ts` — pure URL builders shared by preview + export
- `src/lib/typingHeaderUrl.ts`, `src/lib/capsuleBannerUrl.ts` — pure URL builders for the two new blocks
- `src/components/editor/blocks/TypingHeaderBlockView.tsx`, `CapsuleBannerBlockView.tsx`
- `src/components/editor/forms/TypingHeaderForm.tsx`, `CapsuleBannerForm.tsx`
- Matching `*.test.ts(x)` for everything above

**Modified:**
- `src/lib/techCatalog.ts` — rewritten as the single tech-badge data module
- `src/lib/markdownSerializer.ts` — tech-stack + github-stats branches updated, two new block-kind cases
- `src/types/ast.ts` — `iconStyle` on `TechStackBlock`, `showStreak` on `GithubStatsBlock`, two new block types
- `src/components/editor/forms/TechStackForm.tsx`, `GithubStatsForm.tsx`
- `src/components/editor/blocks/TechStackBlockView.tsx`, `GithubStatsBlockView.tsx`, `GithubStatsDisplay.tsx`
- `src/components/editor/BentoCard.tsx`, `src/components/editor/EditorSidebar.tsx` — new block-kind wiring
- `src/lib/readmeTemplates.ts` — new `VISUAL_TEMPLATE`
- `src/components/editor/forms/__tests__/TechStackPicker.test.tsx`, `src/components/editor/forms/TechStackGrid.tsx`, `TechStackPicker.tsx`
- `src/lib/markdownSerializer.selfcheck.ts` — new assertions appended

**Deleted:**
- `src/lib/markdownBadges.ts`
- `src/lib/githubStatsApi.ts` + `src/lib/githubStatsApi.test.ts`

---

### Task 1: Generate the Unified Tech Catalog Data

**Files:**
- Create: `scripts/generate-tech-catalog.mjs`
- Create: `src/lib/techCatalogData.json` (generated output, committed)
- Test: `src/lib/techCatalogData.test.ts`

**Interfaces:**
- Produces: `techCatalogData.json` — a JSON array of `{ label: string; slug: string; hex: string }`, one per simple-icons brand (~3,200 entries), sorted alphabetically by `label`.

- [ ] **Step 1: Install simple-icons as a devDependency**

```bash
npm install -D simple-icons
```

- [ ] **Step 2: Write the generation script**

`scripts/generate-tech-catalog.mjs`:

```js
#!/usr/bin/env node
// One-off generator: reads the simple-icons npm package (a devDependency,
// never imported by app code) and emits a slim static JSON catalog of
// { label, slug, hex } for every brand. Re-run manually after
// `npm update simple-icons` to pick up new/renamed brands.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as simpleIcons from "simple-icons";

const icons = Object.values(simpleIcons).filter(
  (v) => v && typeof v === "object" && typeof v.title === "string",
);

const catalog = icons
  .map((icon) => ({
    label: icon.title,
    slug: icon.slug,
    hex: icon.hex,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "techCatalogData.json",
);

writeFileSync(outPath, JSON.stringify(catalog), "utf8");
console.log(`Wrote ${catalog.length} entries to ${outPath}`);
```

- [ ] **Step 3: Run the generator**

Run: `node scripts/generate-tech-catalog.mjs`
Expected output: `Wrote 3450 entries to .../src/lib/techCatalogData.json` (exact count may drift slightly as simple-icons adds/removes brands — anything comfortably above 3000 is correct).

- [ ] **Step 4: Write the failing validation test**

`src/lib/techCatalogData.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import catalog from "./techCatalogData.json";

type CatalogEntry = { label: string; slug: string; hex: string };

describe("techCatalogData.json", () => {
  it("contains at least 3000 entries", () => {
    expect((catalog as CatalogEntry[]).length).toBeGreaterThan(3000);
  });

  it("has no duplicate slugs", () => {
    const slugs = (catalog as CatalogEntry[]).map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has a 6-hex-digit color with no '#' prefix", () => {
    for (const entry of catalog as CatalogEntry[]) {
      expect(entry.hex).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  it("includes well-known brands like React and TypeScript", () => {
    const labels = (catalog as CatalogEntry[]).map((entry) => entry.label);
    expect(labels).toContain("React");
    expect(labels).toContain("TypeScript");
  });
});
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/techCatalogData.test.ts`
Expected: PASS (the file was already generated in Step 3, so this test is GREEN on first run — there is no separate implementation step because the "implementation" is the generated data file itself).

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-tech-catalog.mjs src/lib/techCatalogData.json src/lib/techCatalogData.test.ts package.json package-lock.json
git commit -m "feat: generate unified tech catalog data from simple-icons"
```

---

### Task 2: Rewrite `techCatalog.ts` as the Single Catalog Module

**Files:**
- Modify: `src/lib/techCatalog.ts` (full rewrite)
- Test: `src/lib/techCatalog.test.ts`

**Interfaces:**
- Consumes: `techCatalogData.json` (Task 1)
- Produces: `TechCatalogEntry` type; `findTechMeta(label: string): TechCatalogEntry | undefined`; `searchTech(query: string, limit?: number): TechCatalogEntry[]`; `getPopularTech(): TechCatalogEntry[]`; `POPULAR_TECH: string[]`; `contrastColorFor(hex: string): "black" | "white"`; `buildShieldsUrl(label: string, style?: string): string`; `buildSkillIconsUrl(labels: string[]): string`

Cross-checked all ~85 unique labels from the two legacy catalogs against the real simple-icons dataset. 8 labels don't cleanly resolve (simple-icons dropped AWS/Azure after trademark takedown requests; Java's real icon is titled "OpenJDK"; a few labels use a shorter name than simple-icons' official title) — these get a small hand-written override table so no previously-working label regresses.

- [ ] **Step 1: Write the failing tests**

`src/lib/techCatalog.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  findTechMeta,
  searchTech,
  getPopularTech,
  contrastColorFor,
  buildShieldsUrl,
  buildSkillIconsUrl,
  POPULAR_TECH,
} from "./techCatalog";

describe("techCatalog", () => {
  describe("findTechMeta", () => {
    it("finds a simple-icons-backed entry case-insensitively", () => {
      expect(findTechMeta("react")?.slug).toBe("react");
      expect(findTechMeta("REACT")?.slug).toBe("react");
    });

    it("finds legacy-override entries not present in simple-icons", () => {
      expect(findTechMeta("AWS")).toEqual({
        label: "AWS",
        slug: "amazonaws",
        hex: "232F3E",
        skillIconsSlug: "aws",
      });
      expect(findTechMeta("Java")?.slug).toBe("openjdk");
    });

    it("returns undefined for an unknown label", () => {
      expect(findTechMeta("Definitely Not A Real Technology")).toBeUndefined();
    });
  });

  describe("searchTech", () => {
    it("matches by case-insensitive substring", () => {
      const results = searchTech("script");
      expect(results.some((r) => r.label === "JavaScript")).toBe(true);
      expect(results.some((r) => r.label === "TypeScript")).toBe(true);
    });

    it("caps results at the given limit", () => {
      const results = searchTech("a", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getPopularTech", () => {
    it("resolves every POPULAR_TECH label to a real catalog entry", () => {
      const popular = getPopularTech();
      expect(popular.length).toBe(POPULAR_TECH.length);
      for (const entry of popular) {
        expect(entry.hex).toMatch(/^[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe("contrastColorFor", () => {
    it("picks black text for light backgrounds", () => {
      expect(contrastColorFor("F7DF1E")).toBe("black"); // JS yellow
    });

    it("picks white text for dark backgrounds", () => {
      expect(contrastColorFor("000000")).toBe("white");
    });
  });

  describe("buildShieldsUrl", () => {
    it("includes the encoded label, brand color, and logo slug", () => {
      const url = buildShieldsUrl("React");
      expect(url).toContain("React-61DAFB");
      expect(url).toContain("logo=react");
      expect(url).toContain("logoColor=black");
    });

    it("falls back to a neutral gray badge with no logo for unknown labels", () => {
      const url = buildShieldsUrl("Definitely Not Real");
      expect(url).toContain("555555");
      expect(url).toContain("logo=&");
    });

    it("applies the requested badge style", () => {
      const url = buildShieldsUrl("React", "for-the-badge");
      expect(url).toContain("style=for-the-badge");
    });
  });

  describe("buildSkillIconsUrl", () => {
    it("joins known skill-icons slugs with commas", () => {
      const url = buildSkillIconsUrl(["React", "TypeScript", "Docker"]);
      expect(url).toBe("https://skillicons.dev/icons?i=react,ts,docker");
    });

    it("drops labels with no known skill-icons mapping", () => {
      const url = buildSkillIconsUrl(["React", "Definitely Not Real"]);
      expect(url).toBe("https://skillicons.dev/icons?i=react");
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/techCatalog.test.ts`
Expected: FAIL — `techCatalog.ts` still exports the old `TechCatalogEntry`/`findTechMeta` shape (no `searchTech`, `getPopularTech`, `contrastColorFor`, `buildShieldsUrl`, `buildSkillIconsUrl`, `POPULAR_TECH`).

- [ ] **Step 3: Rewrite the implementation**

`src/lib/techCatalog.ts` (full file):

```ts
import catalogData from "./techCatalogData.json";

export type TechCatalogEntry = {
  label: string;
  slug: string;
  hex: string;
  skillIconsSlug?: string;
};

// Brands simple-icons has dropped (AWS, Azure — removed after trademark
// takedown requests) or that use a different slug/title than our legacy
// labels (Java -> the OpenJDK mark, VS Code -> "Visual Studio Code", GitLab
// CI -> the GitLab mark). Preserves pre-unification behavior exactly for
// labels users may already have saved in stored/exported blocks.
const LEGACY_OVERRIDES: Record<string, TechCatalogEntry> = {
  java: { label: "Java", slug: "openjdk", hex: "ED8B00" },
  "c#": { label: "C#", slug: "csharp", hex: "239120", skillIconsSlug: "cs" },
  aws: { label: "AWS", slug: "amazonaws", hex: "232F3E", skillIconsSlug: "aws" },
  azure: { label: "Azure", slug: "microsoftazure", hex: "0078D4", skillIconsSlug: "azure" },
  heroku: { label: "Heroku", slug: "heroku", hex: "430098", skillIconsSlug: "heroku" },
  "vs code": { label: "VS Code", slug: "visualstudiocode", hex: "007ACC", skillIconsSlug: "vscode" },
  "gitlab ci": { label: "GitLab CI", slug: "gitlab", hex: "FC6D26", skillIconsSlug: "gitlab" },
};

// skillicons.dev ships its own curated ~400-file icon set
// (github.com/tandpfun/skill-icons/tree/main/icons) with slugs that
// sometimes diverge from simple-icons. Only entries with a confirmed
// skillicons.dev file get a mapping; anything else silently falls back to
// the shields.io render for that one badge in `buildSkillIconsUrl`.
const SKILL_ICONS_SLUGS: Record<string, string> = {
  javascript: "js", typescript: "ts", python: "python", go: "golang",
  rust: "rust", cplusplus: "cpp", php: "php", swift: "swift", kotlin: "kotlin",
  react: "react", vuedotjs: "vuejs", angular: "angular", svelte: "svelte",
  nextdotjs: "nextjs", nuxtdotjs: "nuxtjs", nodedotjs: "nodejs",
  express: "expressjs", nestjs: "nestjs", django: "django", flask: "flask",
  fastapi: "fastapi", springboot: "spring", postgresql: "postgresql",
  mysql: "mysql", mongodb: "mongodb", firebase: "firebase",
  supabase: "supabase", redis: "redis", elasticsearch: "elasticsearch",
  graphql: "graphql", docker: "docker", kubernetes: "kubernetes",
  jenkins: "jenkins", githubactions: "githubactions", googlecloud: "gcp",
  github: "github", vercel: "vercel", netlify: "netlify", git: "git",
  linux: "linux", figma: "figma", webpack: "webpack", vite: "vite",
  jest: "jest", cypress: "cypress", html5: "html", css3: "css",
  tailwindcss: "tailwindcss", bootstrap: "bootstrap", sass: "sass",
  redux: "redux", c: "c", ruby: "ruby", dart: "dart", scala: "scala",
  haskell: "haskell", lua: "lua", r: "r", solidity: "solidity",
  laravel: "laravel", terraform: "terraform", tensorflow: "tensorflow",
  pytorch: "pytorch", unity: "unity", unrealengine: "unrealengine",
  postman: "postman", notion: "notion",
};

const BASE_CATALOG: TechCatalogEntry[] = (catalogData as TechCatalogEntry[]).map(
  (entry) => {
    const skillIconsSlug = SKILL_ICONS_SLUGS[entry.slug];
    return skillIconsSlug ? { ...entry, skillIconsSlug } : entry;
  },
);

const CATALOG_BY_LABEL: Map<string, TechCatalogEntry> = new Map(
  BASE_CATALOG.map((entry) => [entry.label.toLowerCase(), entry]),
);

for (const [key, entry] of Object.entries(LEGACY_OVERRIDES)) {
  CATALOG_BY_LABEL.set(key, entry);
}

/** The curated subset shown by default before the user searches. */
export const POPULAR_TECH: string[] = [
  "TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "C++", "C#",
  "PHP", "Swift", "Kotlin", "React", "Vue.js", "Angular", "Svelte",
  "Next.js", "Nuxt", "Node.js", "Express", "NestJS", "Django", "Flask",
  "FastAPI", "Spring Boot", "PostgreSQL", "MySQL", "MongoDB", "Firebase",
  "Supabase", "Redis", "Elasticsearch", "GraphQL", "Docker", "Kubernetes",
  "Jenkins", "GitHub Actions", "GitLab CI", "AWS", "Google Cloud", "Azure",
  "GitHub", "Vercel", "Netlify", "Heroku", "Git", "Linux", "VS Code",
  "Figma", "Webpack", "Vite", "Jest", "Cypress",
];

/** Case-insensitive catalog lookup by display label. */
export function findTechMeta(label: string): TechCatalogEntry | undefined {
  return CATALOG_BY_LABEL.get(label.toLowerCase());
}

/**
 * Searches the full ~3,200-entry catalog by label substring, capped at
 * `limit` results so the picker never renders thousands of badges at once.
 */
export function searchTech(query: string, limit = 60): TechCatalogEntry[] {
  const lowerQuery = query.toLowerCase();
  const results: TechCatalogEntry[] = [];
  for (const entry of BASE_CATALOG) {
    if (entry.label.toLowerCase().includes(lowerQuery)) {
      results.push(entry);
      if (results.length >= limit) break;
    }
  }
  return results;
}

/** The curated default view: full metadata for each POPULAR_TECH label. */
export function getPopularTech(): TechCatalogEntry[] {
  return POPULAR_TECH.map((label) => findTechMeta(label)).filter(
    (entry): entry is TechCatalogEntry => entry !== undefined,
  );
}

/**
 * Picks readable logo text color for a shields.io badge background using
 * relative luminance (WCAG formula), so light brand colors (JS yellow,
 * white logos) get black text instead of unreadable white-on-white.
 */
export function contrastColorFor(hex: string): "black" | "white" {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "black" : "white";
}

/** Builds a shields.io badge URL for one technology label. */
export function buildShieldsUrl(label: string, style = "flat-square"): string {
  const meta = findTechMeta(label);
  const color = meta?.hex ?? "555555";
  const logo = meta?.slug ?? "";
  const logoColor = contrastColorFor(color);
  const encodedLabel = encodeURIComponent(label);
  return `https://img.shields.io/badge/${encodedLabel}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor}`;
}

/**
 * Builds a single combined skillicons.dev image URL for a list of tech
 * labels. Labels without a known Skill Icons slug are silently dropped from
 * this URL (they still render individually via `buildShieldsUrl` elsewhere).
 */
export function buildSkillIconsUrl(labels: string[]): string {
  const slugs = labels
    .map((label) => findTechMeta(label)?.skillIconsSlug)
    .filter((slug): slug is string => Boolean(slug));
  return `https://skillicons.dev/icons?i=${slugs.join(",")}`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/techCatalog.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/techCatalog.ts src/lib/techCatalog.test.ts
git commit -m "feat: rewrite techCatalog as the single simple-icons-backed catalog"
```

---

### Task 3: Point the Picker UI at the Unified Catalog, Delete `markdownBadges.ts`

**Files:**
- Modify: `src/components/editor/forms/TechStackGrid.tsx`
- Modify: `src/components/editor/forms/TechStackPicker.tsx`
- Modify: `src/components/editor/blocks/TechStackBlockView.tsx`
- Modify: `src/components/editor/forms/__tests__/TechStackPicker.test.tsx`
- Delete: `src/lib/markdownBadges.ts`

**Interfaces:**
- Consumes: `getPopularTech`, `searchTech`, `buildShieldsUrl`, `TechCatalogEntry` from `@/lib/techCatalog` (Task 2)

This is the fix for the original drift bug: the picker/preview and the exported markdown now read from the exact same module.

- [ ] **Step 1: Update the failing/changed tests first**

`src/components/editor/forms/__tests__/TechStackPicker.test.tsx` (full file):

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechStackPicker } from "../TechStackPicker";
import { TechStackGrid } from "../TechStackGrid";
import { getPopularTech, type TechCatalogEntry } from "@/lib/techCatalog";

describe("TechStackPicker Component", () => {
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
    mockOnRemove.mockClear();
  });

  describe("Rendering", () => {
    it("should render search input with placeholder", () => {
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      expect(screen.getByPlaceholderText(/search technologies/i)).toBeInTheDocument();
    });

    it("should display the popular badges in grid by default", () => {
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      const badges = screen.getAllByRole("button", {
        name: /typescript|javascript|python/i,
      });
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });

    it("should render TechStackGrid component", () => {
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      expect(screen.getByTestId("tech-stack-grid")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should filter badges by search query (case-insensitive) across the full catalog", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      await user.type(screen.getByPlaceholderText(/search technologies/i), "godot");
      expect(screen.getByRole("button", { name: /godot/i })).toBeInTheDocument();
    });

    it("should be case-insensitive", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      await user.type(screen.getByPlaceholderText(/search technologies/i), "TYPESCRIPT");
      expect(screen.getByRole("button", { name: /typescript/i })).toBeInTheDocument();
    });

    it("should show the popular badges again when search is cleared", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      const input = screen.getByPlaceholderText(/search technologies/i) as HTMLInputElement;
      await user.type(input, "react");
      await user.clear(input);
      expect(input.value).toBe("");
      expect(screen.getByTestId("tech-stack-grid")).toBeInTheDocument();
    });
  });

  describe("Selection Behavior", () => {
    it("should call onAdd when clicking an unselected badge", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      await user.click(screen.getByRole("button", { name: /typescript/i }));
      expect(mockOnAdd).toHaveBeenCalledWith("TypeScript");
    });

    it("should call onRemove when clicking a selected badge", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={["TypeScript"]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );
      await user.click(screen.getByRole("button", { name: /typescript/i }));
      expect(mockOnRemove).toHaveBeenCalledWith("TypeScript");
    });

    it("should show visual ring on selected badges", () => {
      render(
        <TechStackPicker
          selectedTechs={["TypeScript"]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );
      expect(screen.getByRole("button", { name: /typescript/i })).toHaveClass(
        "ring-2",
        "ring-green-400",
      );
    });
  });

  describe("Badge Images", () => {
    it("should render shields.io images for badges", () => {
      render(
        <TechStackPicker selectedTechs={[]} onAdd={mockOnAdd} onRemove={mockOnRemove} />,
      );
      const images = screen.getAllByRole("img") as HTMLImageElement[];
      expect(images.length).toBeGreaterThan(0);
      expect(images.some((img) => img.src.includes("img.shields.io"))).toBe(true);
    });
  });
});

describe("TechStackGrid Component", () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe("Grid Rendering", () => {
    it("should render all provided entries", () => {
      const entries = getPopularTech().slice(0, 5);
      render(
        <TechStackGrid entries={entries} selectedTechs={[]} onSelect={mockOnSelect} />,
      );
      entries.forEach((entry: TechCatalogEntry) => {
        expect(
          screen.getByRole("button", { name: new RegExp(entry.label, "i") }),
        ).toBeInTheDocument();
      });
    });

    it("should apply selected class to selected badges", () => {
      const entries = getPopularTech().slice(0, 2);
      render(
        <TechStackGrid
          entries={entries}
          selectedTechs={[entries[0].label]}
          onSelect={mockOnSelect}
        />,
      );
      expect(
        screen.getByRole("button", { name: new RegExp(entries[0].label, "i") }),
      ).toHaveClass("ring-2", "ring-green-400");
      expect(
        screen.getByRole("button", { name: new RegExp(entries[1].label, "i") }),
      ).not.toHaveClass("ring-2", "ring-green-400");
    });

    it("should render responsive grid layout", () => {
      const entries = getPopularTech().slice(0, 20);
      const { container } = render(
        <TechStackGrid entries={entries} selectedTechs={[]} onSelect={mockOnSelect} />,
      );
      expect(
        container.querySelector('[data-testid="tech-stack-grid"]'),
      ).toHaveClass("grid");
    });
  });

  describe("Selection Callbacks", () => {
    it("should call onSelect when badge is clicked", async () => {
      const user = userEvent.setup();
      const entry = getPopularTech()[0];
      render(<TechStackGrid entries={[entry]} selectedTechs={[]} onSelect={mockOnSelect} />);
      await user.click(screen.getByRole("button", { name: new RegExp(entry.label, "i") }));
      expect(mockOnSelect).toHaveBeenCalledWith(entry.label);
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/editor/forms/__tests__/TechStackPicker.test.tsx`
Expected: FAIL — `TechStackGrid`/`TechStackPicker` still use the old `badges` prop name and `markdownBadges.ts`.

- [ ] **Step 3: Rewrite `TechStackGrid.tsx`**

```tsx
"use client";

import { buildShieldsUrl, type TechCatalogEntry } from "@/lib/techCatalog";

interface TechStackGridProps {
  entries: TechCatalogEntry[];
  selectedTechs: string[];
  onSelect: (label: string) => void;
}

export function TechStackGrid({ entries, selectedTechs, onSelect }: TechStackGridProps) {
  const isSelected = (label: string): boolean =>
    selectedTechs.some((tech) => tech.toLowerCase() === label.toLowerCase());

  return (
    <div
      data-testid="tech-stack-grid"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {entries.map((entry) => {
        const selected = isSelected(entry.label);
        return (
          <button
            key={entry.label}
            type="button"
            onClick={() => onSelect(entry.label)}
            className={`flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-150 ${
              selected
                ? "ring-2 ring-green-400 ring-offset-1 ring-offset-[var(--bg-canvas)]"
                : "hover:bg-[var(--bg-surface-hover)]"
            }`}
            aria-label={entry.label}
          >
            <img
              src={buildShieldsUrl(entry.label)}
              alt={entry.label}
              className="h-auto w-full max-w-[100px]"
              loading="lazy"
            />
            <span className="text-center text-xs font-medium text-[var(--text-primary)]">
              {entry.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `TechStackPicker.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { getPopularTech, searchTech } from "@/lib/techCatalog";
import { TechStackGrid } from "./TechStackGrid";

interface TechStackPickerProps {
  selectedTechs: string[];
  onAdd: (tech: string) => void;
  onRemove: (tech: string) => void;
}

export function TechStackPicker({ selectedTechs, onAdd, onRemove }: TechStackPickerProps) {
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return getPopularTech();
    return searchTech(query);
  }, [query]);

  const handleSelect = (label: string) => {
    const isSelected = selectedTechs.some(
      (tech) => tech.toLowerCase() === label.toLowerCase(),
    );
    if (isSelected) onRemove(label);
    else onAdd(label);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tech-search"
          className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase"
        >
          Search technologies (3,000+)
        </label>
        <input
          id="tech-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies (React, Docker, PostgreSQL…)"
          className="w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
        />
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        <TechStackGrid entries={filteredEntries} selectedTechs={selectedTechs} onSelect={handleSelect} />
      </div>

      {filteredEntries.length === 0 && query.trim() && (
        <p className="text-center font-mono text-xs text-[var(--text-muted)]">
          No technologies found matching &quot;{query}&quot;
        </p>
      )}

      {filteredEntries.length === 60 && query.trim() && (
        <p className="text-center font-mono text-[10px] text-[var(--text-muted)]">
          Showing first 60 results — refine your search for more.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Rewrite `TechStackBlockView.tsx`**

```tsx
import type { TechStackBlock } from "@/types/ast";
import { buildShieldsUrl } from "@/lib/techCatalog";

type Props = { block: TechStackBlock };

export function TechStackBlockView({ block }: Props) {
  const { technologies } = block.content;

  if (technologies.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        No technologies added yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => (
        <a
          key={tech}
          href={buildShieldsUrl(tech, "for-the-badge")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <img src={buildShieldsUrl(tech, "for-the-badge")} alt={tech} className="h-8" />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Delete the old catalog**

```bash
git rm src/lib/markdownBadges.ts
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/components/editor/forms/__tests__/TechStackPicker.test.tsx`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "fix: point tech-stack picker/preview at the unified catalog, delete markdownBadges.ts"
```

---

### Task 4: Update the Markdown Export to Use the Unified Catalog

**Files:**
- Modify: `src/lib/markdownSerializer.ts`
- Modify: `src/lib/markdownSerializer.selfcheck.ts`

**Interfaces:**
- Consumes: `buildShieldsUrl` from `@/lib/techCatalog` (Task 2)

This closes the drift bug from the export side: the export now literally calls the same function the preview calls.

- [ ] **Step 1: Add a regression-guard assertion to the selfcheck script**

Append to `src/lib/markdownSerializer.selfcheck.ts` (after the existing "Tech Stack - shields.io badges" block):

```ts
// ============================================================================
// Test: Tech Stack - unified catalog color (regression guard for the old
// markdownBadges.ts vs techCatalog.ts drift bug)
// ============================================================================

const reactTechOutput = serializeBlocks([makeTechBlock("tech-react", 0, ["React"])]);
assert.ok(
  reactTechOutput.includes("61DAFB"),
  "Tech stack should use the unified catalog's simple-icons hex for React (61DAFB), matching the picker/preview exactly",
);
```

- [ ] **Step 2: Run the script to verify it fails**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: FAIL/throw — the current serializer uses the old `techCatalog.ts` entry for React (`color: "20232A"`), not `61DAFB`.

- [ ] **Step 3: Update `serializeTechStack` in `markdownSerializer.ts`**

Replace the `findTechMeta` import with:

```ts
import { buildShieldsUrl } from "./techCatalog";
```

Replace the `serializeTechStack` function body:

```ts
function serializeTechStack(
  block: TechStackBlock,
  opts: Required<SerializeOptions>,
): string {
  const { technologies } = block.content;
  if (technologies.length === 0) return `<!-- tech-stack: empty -->`;

  const badges = technologies
    .map((tech) => `![${tech}](${buildShieldsUrl(tech, opts.badgeStyle)})`)
    .join(" ");

  return `## Tech Stack\n\n${badges}`;
}
```

- [ ] **Step 4: Run the script and the vitest suite to verify everything passes**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: `markdownSerializer selfcheck: all assertions passed`

Run: `npx vitest run`
Expected: all existing suites still PASS (the exported badge URL shape is unchanged — style, label, `logo=`, `logoColor=` — only the source of `color`/`logo` values changed).

- [ ] **Step 5: Commit**

```bash
git add src/lib/markdownSerializer.ts src/lib/markdownSerializer.selfcheck.ts
git commit -m "fix: markdown export reads tech badges from the unified catalog"
```

---

### Task 5: Add `iconStyle` to `TechStackBlock` + Style Toggle in the Form

**Files:**
- Modify: `src/types/ast.ts`
- Modify: `src/components/editor/forms/TechStackForm.tsx`
- Test: `src/components/editor/forms/__tests__/TechStackForm.test.tsx`

**Interfaces:**
- Produces: `TechStackBlock["content"]["iconStyle"]?: "shields" | "skill-icons"` (optional, default behavior = `"shields"`, so every existing saved block is unaffected)

Named `iconStyle`, not `badgeStyle` — `useEditorStore.ts` already exports a `BadgeStyle` type (`"flat-square" | "flat" | "for-the-badge" | "plastic"`, the shields.io *rendering* style). Reusing that name for a completely different concept (which *renderer* to use) would be confusing for whoever reads this code next.

- [ ] **Step 1: Write the failing test**

`src/components/editor/forms/__tests__/TechStackForm.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechStackForm } from "../TechStackForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { TechStackBlock } from "@/types/ast";

function makeBlock(overrides: Partial<TechStackBlock["content"]> = {}): TechStackBlock {
  return {
    id: "tech-1",
    kind: "tech-stack",
    content: { technologies: ["React"], ...overrides },
  };
}

describe("TechStackForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("defaults to Shields.io icon style", () => {
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TechStackForm block={block} />);
    expect(screen.getByRole("button", { name: "Shields.io" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches to Skill Icons style and updates the store", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TechStackForm block={block} />);

    await user.click(screen.getByRole("button", { name: "Skill Icons" }));

    const stored = useEditorStore
      .getState()
      .blocks.find((b) => b.id === "tech-1") as TechStackBlock;
    expect(stored.content.iconStyle).toBe("skill-icons");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/editor/forms/__tests__/TechStackForm.test.tsx`
Expected: FAIL — no "Shields.io"/"Skill Icons" buttons exist yet.

- [ ] **Step 3: Add `iconStyle` to the type**

In `src/types/ast.ts`, change `TechStackBlock`:

```ts
export type TechStackBlock = {
  id: string;
  kind: "tech-stack";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    technologies: string[];
    iconStyle?: "shields" | "skill-icons";
  };
};
```

- [ ] **Step 4: Update `TechStackForm.tsx`**

```tsx
"use client";

import { X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { TechStackPicker } from "./TechStackPicker";
import type { TechStackBlock } from "@/types/ast";

type Props = { block: TechStackBlock };

export function TechStackForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const selected = block.content.technologies;
  const iconStyle = block.content.iconStyle ?? "shields";

  function setTechnologies(technologies: string[]) {
    updateBlock(block.id, (b) =>
      b.kind === "tech-stack" ? { ...b, content: { ...b.content, technologies } } : b,
    );
  }

  function setIconStyle(style: "shields" | "skill-icons") {
    updateBlock(block.id, (b) =>
      b.kind === "tech-stack" ? { ...b, content: { ...b.content, iconStyle: style } } : b,
    );
  }

  function addTech(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (selected.some((tech) => tech.toLowerCase() === trimmed.toLowerCase())) return;
    setTechnologies([...selected, trimmed]);
  }

  function removeTech(label: string) {
    setTechnologies(selected.filter((tech) => tech !== label));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
          Icon Style
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIconStyle("shields")}
            aria-pressed={iconStyle === "shields"}
            className={`flex-1 rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              iconStyle === "shields"
                ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Shields.io
          </button>
          <button
            type="button"
            onClick={() => setIconStyle("skill-icons")}
            aria-pressed={iconStyle === "skill-icons"}
            className={`flex-1 rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              iconStyle === "skill-icons"
                ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Skill Icons
          </button>
        </div>
      </div>

      <TechStackPicker selectedTechs={selected} onAdd={addTech} onRemove={removeTech} />

      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
            Selected technologies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-1.5 rounded-sm bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)]"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  aria-label={`Remove ${tech}`}
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/editor/forms/__tests__/TechStackForm.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/types/ast.ts src/components/editor/forms/TechStackForm.tsx src/components/editor/forms/__tests__/TechStackForm.test.tsx
git commit -m "feat: add Skill Icons style toggle to Tech Stack block"
```

---

### Task 6: Render Skill Icons in the Preview + Export

**Files:**
- Modify: `src/components/editor/blocks/TechStackBlockView.tsx`
- Modify: `src/lib/markdownSerializer.ts`
- Test: `src/components/editor/blocks/__tests__/TechStackBlockView.test.tsx`
- Modify: `src/lib/markdownSerializer.selfcheck.ts`

**Interfaces:**
- Consumes: `buildSkillIconsUrl` from `@/lib/techCatalog` (Task 2), `iconStyle` from `TechStackBlock["content"]` (Task 5)

- [ ] **Step 1: Write the failing component test**

`src/components/editor/blocks/__tests__/TechStackBlockView.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechStackBlockView } from "../TechStackBlockView";
import type { TechStackBlock } from "@/types/ast";

describe("TechStackBlockView", () => {
  it("renders one shields.io image per technology by default", () => {
    const block: TechStackBlock = {
      id: "t1",
      kind: "tech-stack",
      content: { technologies: ["React", "TypeScript"] },
    };
    render(<TechStackBlockView block={block} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images).toHaveLength(2);
    expect(images[0].src).toContain("img.shields.io");
  });

  it("renders a single combined image when iconStyle is skill-icons", () => {
    const block: TechStackBlock = {
      id: "t2",
      kind: "tech-stack",
      content: { technologies: ["React", "TypeScript"], iconStyle: "skill-icons" },
    };
    render(<TechStackBlockView block={block} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images).toHaveLength(1);
    expect(images[0].src).toContain("skillicons.dev/icons?i=react,ts");
  });

  it("shows an empty-state message when no technologies are selected", () => {
    const block: TechStackBlock = { id: "t3", kind: "tech-stack", content: { technologies: [] } };
    render(<TechStackBlockView block={block} />);
    expect(screen.getByText(/no technologies added yet/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/editor/blocks/__tests__/TechStackBlockView.test.tsx`
Expected: FAIL — no skill-icons branch exists yet.

- [ ] **Step 3: Update `TechStackBlockView.tsx`**

```tsx
import type { TechStackBlock } from "@/types/ast";
import { buildShieldsUrl, buildSkillIconsUrl } from "@/lib/techCatalog";

type Props = { block: TechStackBlock };

export function TechStackBlockView({ block }: Props) {
  const { technologies, iconStyle = "shields" } = block.content;

  if (technologies.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        No technologies added yet
      </p>
    );
  }

  if (iconStyle === "skill-icons") {
    return (
      <img
        src={buildSkillIconsUrl(technologies)}
        alt={technologies.join(", ")}
        className="max-w-full"
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech) => (
        <a
          key={tech}
          href={buildShieldsUrl(tech, "for-the-badge")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <img src={buildShieldsUrl(tech, "for-the-badge")} alt={tech} className="h-8" />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Update `serializeTechStack` in `markdownSerializer.ts`**

```ts
import { buildShieldsUrl, buildSkillIconsUrl } from "./techCatalog";
```

```ts
function serializeTechStack(
  block: TechStackBlock,
  opts: Required<SerializeOptions>,
): string {
  const { technologies, iconStyle = "shields" } = block.content;
  if (technologies.length === 0) return `<!-- tech-stack: empty -->`;

  if (iconStyle === "skill-icons") {
    return `## Tech Stack\n\n![Skills](${buildSkillIconsUrl(technologies)})`;
  }

  const badges = technologies
    .map((tech) => `![${tech}](${buildShieldsUrl(tech, opts.badgeStyle)})`)
    .join(" ");

  return `## Tech Stack\n\n${badges}`;
}
```

- [ ] **Step 5: Add a selfcheck assertion**

Append to `src/lib/markdownSerializer.selfcheck.ts`:

```ts
// ============================================================================
// Test: Tech Stack - Skill Icons style
// ============================================================================

const skillIconsBlock: TechStackBlock = {
  id: "tech-skill",
  kind: "tech-stack",
  position: { x: 0, y: 0, w: 12, h: 4 },
  content: { technologies: ["React", "TypeScript"], iconStyle: "skill-icons" },
};
const skillIconsTechOutput = serializeBlocks([skillIconsBlock]);
assert.ok(
  skillIconsTechOutput.includes("skillicons.dev/icons?i=react,ts"),
  "Tech stack should render a single combined skillicons.dev image when iconStyle is skill-icons",
);
```

- [ ] **Step 6: Run everything to verify it passes**

Run: `npx vitest run src/components/editor/blocks/__tests__/TechStackBlockView.test.tsx`
Expected: PASS

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: `markdownSerializer selfcheck: all assertions passed`

- [ ] **Step 7: Commit**

```bash
git add src/components/editor/blocks/TechStackBlockView.tsx src/components/editor/blocks/__tests__/TechStackBlockView.test.tsx src/lib/markdownSerializer.ts src/lib/markdownSerializer.selfcheck.ts
git commit -m "feat: render Skill Icons style in preview and export"
```

---

### Task 7: Pure GitHub Stats URL Builders

**Files:**
- Create: `src/lib/githubStatsUrls.ts`
- Test: `src/lib/githubStatsUrls.test.ts`

**Interfaces:**
- Consumes: `GithubStatsTheme` from `@/types/ast`
- Produces: `buildStatsUrl`, `buildStreakUrl`, `buildLangsUrl`, `buildTrophyUrl`, `buildVisitorCounterUrl` — all `(username: string, theme?: GithubStatsTheme) => string` (theme-less ones take only `username`)

- [ ] **Step 1: Write the failing test**

`src/lib/githubStatsUrls.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "./githubStatsUrls";

describe("githubStatsUrls", () => {
  it("builds the stats card URL with the given username and theme", () => {
    expect(buildStatsUrl("octocat", "dracula")).toBe(
      "https://github-readme-stats.vercel.app/api?username=octocat&show_icons=true&theme=dracula&hide_border=true",
    );
  });

  it("defaults to the dark theme", () => {
    expect(buildStatsUrl("octocat")).toContain("theme=dark");
  });

  it("builds the streak card URL", () => {
    expect(buildStreakUrl("octocat", "radical")).toBe(
      "https://github-readme-streak-stats.herokuapp.com/?user=octocat&theme=radical&hide_border=true",
    );
  });

  it("builds the top-languages card URL", () => {
    expect(buildLangsUrl("octocat")).toBe(
      "https://github-readme-stats.vercel.app/api/top-langs/?username=octocat&layout=compact&theme=dark&hide_border=true",
    );
  });

  it("builds the trophy row URL", () => {
    expect(buildTrophyUrl("octocat")).toBe(
      "https://github-profile-trophy.vercel.app/?username=octocat&theme=onedark&column=5&no-background=true&no-border=true",
    );
  });

  it("builds the visitor counter URL", () => {
    expect(buildVisitorCounterUrl("octocat")).toBe(
      "https://profile-counter.glitch.me/octocat/count.svg",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/githubStatsUrls.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

`src/lib/githubStatsUrls.ts`:

```ts
import type { GithubStatsTheme } from "@/types/ast";

export function buildStatsUrl(username: string, theme: GithubStatsTheme = "dark"): string {
  return `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true`;
}

export function buildStreakUrl(username: string, theme: GithubStatsTheme = "dark"): string {
  return `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=true`;
}

export function buildLangsUrl(username: string, theme: GithubStatsTheme = "dark"): string {
  return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true`;
}

export function buildTrophyUrl(username: string): string {
  return `https://github-profile-trophy.vercel.app/?username=${username}&theme=onedark&column=5&no-background=true&no-border=true`;
}

export function buildVisitorCounterUrl(username: string): string {
  return `https://profile-counter.glitch.me/${username}/count.svg`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/githubStatsUrls.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/githubStatsUrls.ts src/lib/githubStatsUrls.test.ts
git commit -m "feat: extract pure GitHub stats URL builders"
```

---

### Task 8: `showStreak` Toggle + Serializer Refactor

**Files:**
- Modify: `src/types/ast.ts`
- Modify: `src/lib/markdownSerializer.ts`
- Modify: `src/lib/markdownSerializer.selfcheck.ts`

**Interfaces:**
- Consumes: `githubStatsUrls.ts` builders (Task 7)
- Produces: `GithubStatsBlock["content"]["showStreak"]?: boolean` (default: on, matching current always-on behavior for existing blocks)

- [ ] **Step 1: Add failing selfcheck assertions**

Append to `src/lib/markdownSerializer.selfcheck.ts`:

```ts
// ============================================================================
// Test: GitHub Stats - Streak can be disabled
// ============================================================================

const githubNoStreak: GithubStatsBlock = {
  id: "github-no-streak",
  kind: "github-stats",
  position: { x: 0, y: 0, w: 12, h: 10 },
  content: { username: "octocat", showPrivate: false, showStreak: false },
};
const noStreakOutput = serializeBlocks([githubNoStreak]);
assert.ok(
  !noStreakOutput.includes("streak-stats"),
  "GitHub stats should omit the streak card when showStreak is false",
);

const githubDefaultStreak: GithubStatsBlock = {
  id: "github-default-streak",
  kind: "github-stats",
  position: { x: 0, y: 0, w: 12, h: 10 },
  content: { username: "octocat", showPrivate: false },
};
const defaultStreakOutput = serializeBlocks([githubDefaultStreak]);
assert.ok(
  defaultStreakOutput.includes("streak-stats"),
  "GitHub stats should include the streak card by default (showStreak undefined)",
);
```

- [ ] **Step 2: Run the script to verify it fails**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: FAIL — `showStreak` does not exist on the type yet, and there's no way to disable the streak card.

- [ ] **Step 3: Add `showStreak` to the type**

In `src/types/ast.ts`, add to `GithubStatsBlock["content"]`:

```ts
export type GithubStatsBlock = {
  id: string;
  kind: "github-stats";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    username: string;
    showPrivate: boolean;
    showLangs?: boolean;
    showStreak?: boolean;
    showTrophies?: boolean;
    showVisitorCounter?: boolean;
    theme?: GithubStatsTheme;
    useMetrics?: boolean;
    metricsTemplate?: "default" | "compact" | "minimalist";
  };
};
```

- [ ] **Step 4: Refactor `serializeGithubStats` to use the shared URL builders**

In `markdownSerializer.ts`, add the import:

```ts
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "./githubStatsUrls";
```

Replace the `serializeGithubStats` function:

```ts
function serializeGithubStats(block: GithubStatsBlock): string {
  const { username, showLangs, showTrophies, showVisitorCounter, showStreak, theme } =
    block.content;
  if (!username) return `<!-- github-stats: no username set -->`;

  const safeTheme = theme || "dark";
  const lines: string[] = [`## GitHub Stats`, ``];

  if (showVisitorCounter) {
    lines.push(
      `<div align="center">`,
      `  <img src="${buildVisitorCounterUrl(username)}" alt="Visitor Count" />`,
      `</div>`,
      ``,
    );
  }

  const statsRow = [
    `  <img src="${buildStatsUrl(username, safeTheme)}" alt="${username} GitHub stats" />`,
  ];
  if (showStreak !== false) {
    statsRow.push(
      `  <img src="${buildStreakUrl(username, safeTheme)}" alt="${username} streak" />`,
    );
  }
  lines.push(`<div align="center">`, ...statsRow, `</div>`, ``);

  if (showLangs) {
    lines.push(
      `<div align="center">`,
      `  <img src="${buildLangsUrl(username, safeTheme)}" alt="Top Languages" />`,
      `</div>`,
      ``,
    );
  }

  if (showTrophies) {
    lines.push(
      `<div align="center">`,
      `  <img src="${buildTrophyUrl(username)}" alt="GitHub Trophies" />`,
      `</div>`,
      ``,
    );
  }

  return lines.join("\n").trimEnd();
}
```

- [ ] **Step 5: Run the script to verify it passes**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: `markdownSerializer selfcheck: all assertions passed`

Run: `npx vitest run`
Expected: all suites PASS (URL shapes are byte-identical to before, just built via the shared module)

- [ ] **Step 6: Commit**

```bash
git add src/types/ast.ts src/lib/markdownSerializer.ts src/lib/markdownSerializer.selfcheck.ts
git commit -m "feat: add showStreak toggle, refactor GitHub stats export onto shared URL builders"
```

---

### Task 9: Wire Up the Missing Form Checkboxes

**Files:**
- Modify: `src/components/editor/forms/GithubStatsForm.tsx`
- Test: `src/components/editor/forms/__tests__/GithubStatsForm.test.tsx`

**Interfaces:**
- Consumes: `showTrophies`, `showVisitorCounter`, `showStreak` from `GithubStatsBlock["content"]` (already typed; `showStreak` added in Task 8)

`showTrophies` and `showVisitorCounter` have existed on the type and in the export since before this plan — this task only adds the missing UI to reach them.

- [ ] **Step 1: Write the failing test**

`src/components/editor/forms/__tests__/GithubStatsForm.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GithubStatsForm } from "../GithubStatsForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { GithubStatsBlock } from "@/types/ast";

function makeBlock(overrides: Partial<GithubStatsBlock["content"]> = {}): GithubStatsBlock {
  return {
    id: "gh-1",
    kind: "github-stats",
    content: { username: "octocat", showPrivate: false, ...overrides },
  };
}

describe("GithubStatsForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("shows Show Trophies unchecked by default and toggles it on", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    const trophiesCheckbox = screen.getByRole("checkbox", { name: /show trophies/i });
    expect(trophiesCheckbox).not.toBeChecked();
    await user.click(trophiesCheckbox);

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showTrophies).toBe(true);
  });

  it("shows Show Visitor Counter unchecked by default and toggles it on", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    await user.click(screen.getByRole("checkbox", { name: /show visitor counter/i }));

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showVisitorCounter).toBe(true);
  });

  it("shows Show Streak Stats checked by default and can be toggled off", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    const streakCheckbox = screen.getByRole("checkbox", { name: /show streak stats/i });
    expect(streakCheckbox).toBeChecked();
    await user.click(streakCheckbox);

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showStreak).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/editor/forms/__tests__/GithubStatsForm.test.tsx`
Expected: FAIL — no such checkboxes exist yet.

- [ ] **Step 3: Update `GithubStatsForm.tsx`**

Add three checkboxes to the "Display Options" section (after the existing "Show Top Languages" checkbox):

```tsx
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={block.content.showStreak !== false}
            onChange={(e) => patch({ showStreak: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            Show Streak Stats
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.showTrophies}
            onChange={(e) => patch({ showTrophies: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            Show Trophies
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!block.content.showVisitorCounter}
            onChange={(e) => patch({ showVisitorCounter: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent-phosphor)]"
          />
          <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
            Show Visitor Counter
          </span>
        </label>
```

(Insert immediately before the closing `</div>` of the "Display Options" block, i.e. right after the existing "Show Top Languages" `<label>`.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/editor/forms/__tests__/GithubStatsForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/editor/forms/GithubStatsForm.tsx src/components/editor/forms/__tests__/GithubStatsForm.test.tsx
git commit -m "feat: wire up Trophies/Visitor Counter/Streak checkboxes in GitHub Stats form"
```

---

### Task 10: WYSIWYG GitHub Stats Preview (Delete `githubStatsApi.ts`)

**Files:**
- Modify: `src/components/editor/blocks/GithubStatsDisplay.tsx`
- Modify: `src/components/editor/blocks/GithubStatsBlockView.tsx`
- Test: `src/components/editor/blocks/__tests__/GithubStatsDisplay.test.tsx`
- Delete: `src/lib/githubStatsApi.ts`, `src/lib/githubStatsApi.test.ts`

**Interfaces:**
- Consumes: `githubStatsUrls.ts` builders (Task 7)

Makes the live editor preview render the exact same set of embed images the export produces, for any combination of toggles. Removes the REST-API-fetching code path entirely (`githubStatsApi.ts` has no other callers), since nothing in the exported README ever showed the bio/location/company data it fetched.

- [ ] **Step 1: Write the failing test**

`src/components/editor/blocks/__tests__/GithubStatsDisplay.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GithubStatsDisplay } from "../GithubStatsDisplay";

describe("GithubStatsDisplay", () => {
  it("always renders the stats card and streak card by default", () => {
    render(<GithubStatsDisplay username="octocat" />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("github-readme-stats"))).toBe(true);
    expect(images.some((img) => img.src.includes("streak-stats"))).toBe(true);
  });

  it("omits the streak card when showStreak is false", () => {
    render(<GithubStatsDisplay username="octocat" showStreak={false} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("streak-stats"))).toBe(false);
  });

  it("renders the trophy row only when showTrophies is true", () => {
    render(<GithubStatsDisplay username="octocat" showTrophies />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("trophy"))).toBe(true);
  });

  it("renders the visitor counter only when showVisitorCounter is true", () => {
    render(<GithubStatsDisplay username="octocat" showVisitorCounter />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("profile-counter"))).toBe(true);
  });

  it("renders nothing when username is empty", () => {
    const { container } = render(<GithubStatsDisplay username="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/editor/blocks/__tests__/GithubStatsDisplay.test.tsx`
Expected: FAIL — current component fetches from the GitHub REST API and renders a follower/bio card, not these image URLs.

- [ ] **Step 3: Rewrite `GithubStatsDisplay.tsx`**

```tsx
import { GitBranch } from "lucide-react";
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "@/lib/githubStatsUrls";
import type { GithubStatsTheme } from "@/types/ast";

type Props = {
  username: string;
  theme?: GithubStatsTheme;
  showLanguages?: boolean;
  showStreak?: boolean;
  showTrophies?: boolean;
  showVisitorCounter?: boolean;
};

export function GithubStatsDisplay({
  username,
  theme = "dark",
  showLanguages,
  showStreak = true,
  showTrophies,
  showVisitorCounter,
}: Props) {
  if (!username) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-[#8b949e]" />
          <span className="font-mono text-xs text-[#8b949e]">GitHub Stats ({username})</span>
        </div>
      </div>

      {showVisitorCounter && (
        <img src={buildVisitorCounterUrl(username)} alt="Visitor Count" className="mx-auto" />
      )}

      <div className="flex flex-wrap items-start justify-center gap-3">
        <img src={buildStatsUrl(username, theme)} alt={`${username} GitHub stats`} />
        {showStreak && <img src={buildStreakUrl(username, theme)} alt={`${username} streak`} />}
      </div>

      {showLanguages && (
        <img src={buildLangsUrl(username, theme)} alt="Top Languages" className="mx-auto" />
      )}

      {showTrophies && (
        <img src={buildTrophyUrl(username)} alt="GitHub Trophies" className="mx-auto" />
      )}

      <p className="font-mono text-[10px] text-[#6e7681]">
        Live preview — matches the exported README exactly
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Update `GithubStatsBlockView.tsx`**

```tsx
"use client";

import type { GithubStatsBlock } from "@/types/ast";
import { GithubStatsDisplay } from "./GithubStatsDisplay";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, theme, showLangs, showStreak, showTrophies, showVisitorCounter } =
    block.content;

  return (
    <GithubStatsDisplay
      username={username || "MiguelVivar"}
      theme={theme}
      showLanguages={showLangs}
      showStreak={showStreak !== false}
      showTrophies={showTrophies}
      showVisitorCounter={showVisitorCounter}
    />
  );
}
```

- [ ] **Step 5: Delete the now-unused REST API module**

```bash
git rm src/lib/githubStatsApi.ts src/lib/githubStatsApi.test.ts
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/editor/blocks/__tests__/GithubStatsDisplay.test.tsx`
Expected: PASS

Run: `npx vitest run`
Expected: no other suite references `githubStatsApi`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: GitHub Stats preview renders the same embeds as the export (WYSIWYG), remove unused REST API client"
```

---

### Task 11: `TypingHeaderBlock` Type + URL Builder

**Files:**
- Modify: `src/types/ast.ts`
- Create: `src/lib/typingHeaderUrl.ts`
- Test: `src/lib/typingHeaderUrl.test.ts`

**Interfaces:**
- Produces: `TypingHeaderBlock` type; `buildTypingSvgUrl(content: TypingHeaderBlock["content"]): string`

- [ ] **Step 1: Write the failing test**

`src/lib/typingHeaderUrl.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildTypingSvgUrl } from "./typingHeaderUrl";

describe("buildTypingSvgUrl", () => {
  it("joins multiple lines with a semicolon (percent-encoded)", () => {
    const url = buildTypingSvgUrl({ lines: ["Hello", "World"] });
    expect(url).toContain("lines=Hello%3BWorld");
  });

  it("applies defaults for speed, pause, color, and font size", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"] });
    expect(url).toContain("pause=1000");
    expect(url).toContain("color=36BCF7");
    expect(url).toContain("size=24");
    expect(url).toContain("speed=50");
  });

  it("strips a leading # from a supplied color", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"], color: "#FF0000" });
    expect(url).toContain("color=FF0000");
    expect(url).not.toContain("%23");
  });

  it("respects custom speed, pause, and font size", () => {
    const url = buildTypingSvgUrl({ lines: ["Hi"], speed: 80, pauseMs: 2000, fontSize: 32 });
    expect(url).toContain("speed=80");
    expect(url).toContain("pause=2000");
    expect(url).toContain("size=32");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/typingHeaderUrl.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Add the type to `ast.ts`**

Add `"typing-header"` to `BlockKind`:

```ts
export type BlockKind =
  | "hero-bio"
  | "tech-stack"
  | "github-stats"
  | "ascii-banner"
  | "ascii-image"
  | "social-links"
  | "rich-media"
  | "markdown-custom"
  | "typing-header"
  | "capsule-banner";
```

Add the block type (place after `AsciiImageBlock`):

```ts
export type TypingHeaderBlock = {
  id: string;
  kind: "typing-header";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    lines: string[];
    speed?: number;
    pauseMs?: number;
    color?: string;
    fontSize?: number;
  };
};
```

Add it to the `Block` union (final change to `ast.ts` lands in Task 14 once `CapsuleBannerBlock` also exists — for this task, add only `TypingHeaderBlock`):

```ts
export type Block =
  | HeroBioBlock
  | TechStackBlock
  | GithubStatsBlock
  | AsciiBannerBlock
  | AsciiImageBlock
  | SocialLinksBlock
  | RichMediaBlock
  | MarkdownCustomBlock
  | TypingHeaderBlock;
```

- [ ] **Step 4: Write the implementation**

`src/lib/typingHeaderUrl.ts`:

```ts
import type { TypingHeaderBlock } from "@/types/ast";

export function buildTypingSvgUrl(content: TypingHeaderBlock["content"]): string {
  const { lines, speed = 50, pauseMs = 1000, color = "36BCF7", fontSize = 24 } = content;
  const safeColor = color.replace(/^#/, "");

  const params = new URLSearchParams({
    font: "Fira Code",
    size: String(fontSize),
    pause: String(pauseMs),
    color: safeColor,
    center: "true",
    vCenter: "true",
    multiline: "true",
    speed: String(speed),
    lines: lines.join(";"),
  });

  return `https://readme-typing-svg.demolab.com?${params.toString()}`;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/typingHeaderUrl.test.ts`
Expected: PASS

Note: `BlockKind`/`Block` now include `"typing-header"` with no corresponding case in `BentoCard.tsx`'s or `EditorSidebar.tsx`'s exhaustive `switch` statements — this will surface as a TypeScript error until Task 13 adds those cases. That's expected and resolved within this same work session (Task 13 is the very next task in this plan).

- [ ] **Step 6: Commit**

```bash
git add src/types/ast.ts src/lib/typingHeaderUrl.ts src/lib/typingHeaderUrl.test.ts
git commit -m "feat: add TypingHeaderBlock type and readme-typing-svg URL builder"
```

---

### Task 12: `TypingHeaderBlockView` + `TypingHeaderForm`

**Files:**
- Create: `src/components/editor/blocks/TypingHeaderBlockView.tsx`
- Create: `src/components/editor/forms/TypingHeaderForm.tsx`
- Test: `src/components/editor/blocks/__tests__/TypingHeaderBlockView.test.tsx`
- Test: `src/components/editor/forms/__tests__/TypingHeaderForm.test.tsx`

**Interfaces:**
- Consumes: `buildTypingSvgUrl` (Task 11)

- [ ] **Step 1: Write the failing tests**

`src/components/editor/blocks/__tests__/TypingHeaderBlockView.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingHeaderBlockView } from "../TypingHeaderBlockView";
import type { TypingHeaderBlock } from "@/types/ast";

describe("TypingHeaderBlockView", () => {
  it("renders the typing-svg image when at least one line has text", () => {
    const block: TypingHeaderBlock = {
      id: "th1",
      kind: "typing-header",
      content: { lines: ["Hello world"] },
    };
    render(<TypingHeaderBlockView block={block} />);
    expect((screen.getByRole("img") as HTMLImageElement).src).toContain(
      "readme-typing-svg.demolab.com",
    );
  });

  it("shows an empty-state message when there are no lines", () => {
    const block: TypingHeaderBlock = { id: "th2", kind: "typing-header", content: { lines: [] } };
    render(<TypingHeaderBlockView block={block} />);
    expect(screen.getByText(/add at least one line/i)).toBeInTheDocument();
  });

  it("shows an empty-state message when all lines are blank", () => {
    const block: TypingHeaderBlock = {
      id: "th3",
      kind: "typing-header",
      content: { lines: ["", "   "] },
    };
    render(<TypingHeaderBlockView block={block} />);
    expect(screen.getByText(/add at least one line/i)).toBeInTheDocument();
  });
});
```

`src/components/editor/forms/__tests__/TypingHeaderForm.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TypingHeaderForm } from "../TypingHeaderForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { TypingHeaderBlock } from "@/types/ast";

function makeBlock(): TypingHeaderBlock {
  return { id: "th-1", kind: "typing-header", content: { lines: ["Hello"] } };
}

describe("TypingHeaderForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("adds a new blank line when Add line is clicked", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TypingHeaderForm block={block} />);

    await user.click(screen.getByRole("button", { name: /add line/i }));

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "th-1") as TypingHeaderBlock;
    expect(stored.content.lines).toEqual(["Hello", ""]);
  });

  it("removes a line when its remove button is clicked", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<TypingHeaderForm block={block} />);

    await user.click(screen.getByRole("button", { name: /remove line 1/i }));

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "th-1") as TypingHeaderBlock;
    expect(stored.content.lines).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/editor/blocks/__tests__/TypingHeaderBlockView.test.tsx src/components/editor/forms/__tests__/TypingHeaderForm.test.tsx`
Expected: FAIL — neither component exists yet.

- [ ] **Step 3: Write `TypingHeaderBlockView.tsx`**

```tsx
import type { TypingHeaderBlock } from "@/types/ast";
import { buildTypingSvgUrl } from "@/lib/typingHeaderUrl";

type Props = { block: TypingHeaderBlock };

export function TypingHeaderBlockView({ block }: Props) {
  const { lines } = block.content;

  if (lines.length === 0 || lines.every((line) => !line.trim())) {
    return (
      <p className="font-mono text-xs text-[var(--text-muted)] italic">
        Add at least one line of text
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <img src={buildTypingSvgUrl(block.content)} alt={lines.join(" / ")} />
    </div>
  );
}
```

- [ ] **Step 4: Write `TypingHeaderForm.tsx`**

```tsx
"use client";

import { Plus, X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import type { TypingHeaderBlock } from "@/types/ast";

type Props = { block: TypingHeaderBlock };

export function TypingHeaderForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const { lines, speed = 50, pauseMs = 1000, color = "#36BCF7", fontSize = 24 } = block.content;

  function patch(partial: Partial<TypingHeaderBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "typing-header" ? { ...b, content: { ...b.content, ...partial } } : b,
    );
  }

  function setLine(index: number, value: string) {
    patch({ lines: lines.map((line, i) => (i === index ? value : line)) });
  }

  function addLine() {
    patch({ lines: [...lines, ""] });
  }

  function removeLine(index: number) {
    patch({ lines: lines.filter((_, i) => i !== index) });
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Lines</span>
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={line}
              onChange={(e) => setLine(index, e.target.value)}
              placeholder="Hi there, I'm Alex 👋"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeLine(index)}
              aria-label={`Remove line ${index + 1}`}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLine}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-[var(--border-subtle)] px-3 py-2 font-mono text-xs text-[var(--text-muted)] hover:border-[var(--accent-phosphor)] hover:text-[var(--accent-phosphor)]"
        >
          <Plus size={12} /> Add line
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-speed" className={labelClass}>
          Speed ({speed}ms per character)
        </label>
        <input
          id="th-speed"
          type="range"
          min="10"
          max="150"
          value={speed}
          onChange={(e) => patch({ speed: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-pause" className={labelClass}>
          Pause before deleting ({pauseMs}ms)
        </label>
        <input
          id="th-pause"
          type="range"
          min="0"
          max="3000"
          step="100"
          value={pauseMs}
          onChange={(e) => patch({ pauseMs: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-size" className={labelClass}>
          Font Size ({fontSize}px)
        </label>
        <input
          id="th-size"
          type="range"
          min="12"
          max="48"
          value={fontSize}
          onChange={(e) => patch({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="th-color" className={labelClass}>
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="th-color"
            type="color"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className={inputClass}
            placeholder="#36BCF7"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/components/editor/blocks/__tests__/TypingHeaderBlockView.test.tsx src/components/editor/forms/__tests__/TypingHeaderForm.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/editor/blocks/TypingHeaderBlockView.tsx src/components/editor/forms/TypingHeaderForm.tsx src/components/editor/blocks/__tests__/TypingHeaderBlockView.test.tsx src/components/editor/forms/__tests__/TypingHeaderForm.test.tsx
git commit -m "feat: add Typing Header block view and form"
```

---

### Task 13: Wire the Typing Header Block into the Editor

**Files:**
- Modify: `src/components/editor/BentoCard.tsx`
- Modify: `src/components/editor/EditorSidebar.tsx`
- Modify: `src/lib/markdownSerializer.ts`
- Modify: `src/lib/markdownSerializer.selfcheck.ts`

**Interfaces:**
- Consumes: `TypingHeaderBlockView` (Task 12), `TypingHeaderForm` (Task 12), `buildTypingSvgUrl` (Task 11)

This is the task that resolves the TypeScript exhaustiveness gap left at the end of Task 11.

- [ ] **Step 1: Add a failing selfcheck assertion**

Append to `src/lib/markdownSerializer.selfcheck.ts` (add `TypingHeaderBlock` to the type-only import list at the top of the file):

```ts
// ============================================================================
// Test: Typing Header
// ============================================================================

const typingBlock: TypingHeaderBlock = {
  id: "typing1",
  kind: "typing-header",
  position: { x: 0, y: 0, w: 12, h: 4 },
  content: { lines: ["Hello there"] },
};
const typingOutput = serializeBlocks([typingBlock]);
assert.ok(
  typingOutput.includes("readme-typing-svg.demolab.com"),
  "Typing header should embed a readme-typing-svg image",
);

const emptyTypingOutput = serializeBlocks([
  { ...typingBlock, id: "typing2", content: { lines: [] } },
]);
assert.ok(
  emptyTypingOutput.includes("<!-- typing-header: empty -->"),
  "Empty typing header should have empty comment",
);
```

- [ ] **Step 2: Run the script to verify it fails**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: compile/type error — `"typing-header"` isn't a handled case in `serializeBlocks`'s switch yet.

- [ ] **Step 3: Add the serializer case**

In `markdownSerializer.ts`, add the import:

```ts
import { buildTypingSvgUrl } from "./typingHeaderUrl";
import type { TypingHeaderBlock } from "@/types/ast";
```

(Add `TypingHeaderBlock` alongside the other block type imports at the top of the file.)

Add the function (near the other `serialize*` functions):

```ts
function serializeTypingHeader(block: TypingHeaderBlock): string {
  const { lines } = block.content;
  if (lines.length === 0 || lines.every((line) => !line.trim())) {
    return `<!-- typing-header: empty -->`;
  }
  return `<div align="center">\n  <img src="${buildTypingSvgUrl(block.content)}" alt="Typing SVG" />\n</div>`;
}
```

Add the switch case inside `serializeBlocks`:

```ts
        case "typing-header":
          serialized = serializeTypingHeader(block);
          break;
```

- [ ] **Step 4: Add the BentoCard render case**

In `BentoCard.tsx`, add the import:

```ts
import { TypingHeaderBlockView } from "./blocks/TypingHeaderBlockView";
```

Add to `KIND_LABELS`:

```ts
  "typing-header": "Typing Header",
```

Add to the `renderBlockContent` switch:

```ts
      case "typing-header":
        return <TypingHeaderBlockView block={block} />;
```

- [ ] **Step 5: Add the EditorSidebar wiring**

In `EditorSidebar.tsx`, add the import:

```ts
import { TypingHeaderForm } from "./forms/TypingHeaderForm";
```

Add to `BLOCK_CATALOG`:

```ts
  {
    label: "Typing Header",
    description: "Animated typing/deleting headline",
    factory: () => ({
      id: makeId(),
      kind: "typing-header",
      content: {
        lines: ["Hi there, I'm..."],
        speed: 50,
        pauseMs: 1000,
        color: "#36BCF7",
        fontSize: 24,
      },
    }),
  },
```

Add to `KIND_LABELS`:

```ts
  "typing-header": "Typing Header",
```

Add to the `BlockForm` switch:

```ts
      case "typing-header": return <TypingHeaderForm block={block} />;
```

- [ ] **Step 6: Run everything to verify it passes**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: `markdownSerializer selfcheck: all assertions passed`

Run: `npx vitest run`
Expected: all suites PASS

Run: `npx tsc --noEmit`
Expected: no errors (confirms the `Block` union exhaustiveness gap from Task 11 is now closed)

- [ ] **Step 7: Commit**

```bash
git add src/components/editor/BentoCard.tsx src/components/editor/EditorSidebar.tsx src/lib/markdownSerializer.ts src/lib/markdownSerializer.selfcheck.ts
git commit -m "feat: wire Typing Header block into canvas, sidebar, and markdown export"
```

---

### Task 14: `CapsuleBannerBlock` Type + URL Builder

**Files:**
- Modify: `src/types/ast.ts`
- Create: `src/lib/capsuleBannerUrl.ts`
- Test: `src/lib/capsuleBannerUrl.test.ts`

**Interfaces:**
- Produces: `CapsuleBannerBlock` type, `CAPSULE_TYPES` const array; `buildCapsuleUrl(content: CapsuleBannerBlock["content"]): string`

- [ ] **Step 1: Write the failing test**

`src/lib/capsuleBannerUrl.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildCapsuleUrl } from "./capsuleBannerUrl";

describe("buildCapsuleUrl", () => {
  it("builds a URL with the given type, color, and text", () => {
    const url = buildCapsuleUrl({ type: "waving", color: "0d1117", text: "Welcome" });
    expect(url).toContain("type=waving");
    expect(url).toContain("color=0d1117");
    expect(url).toContain("text=Welcome");
  });

  it("strips leading # from color and fontColor", () => {
    const url = buildCapsuleUrl({ type: "rect", color: "#123456", fontColor: "#abcdef" });
    expect(url).toContain("color=123456");
    expect(url).toContain("fontColor=abcdef");
  });

  it("defaults height to 200 and section to header", () => {
    const url = buildCapsuleUrl({ type: "cylinder", color: "000000" });
    expect(url).toContain("height=200");
    expect(url).toContain("section=header");
  });

  it("respects a custom height and footer section", () => {
    const url = buildCapsuleUrl({ type: "egg", color: "000000", height: 300, section: "footer" });
    expect(url).toContain("height=300");
    expect(url).toContain("section=footer");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/capsuleBannerUrl.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Add the type to `ast.ts`**

Add near `GITHUB_STATS_THEMES`:

```ts
export const CAPSULE_TYPES = ["waving", "rect", "cylinder", "egg"] as const;
export type CapsuleType = (typeof CAPSULE_TYPES)[number];
```

Add the block type (after `TypingHeaderBlock`):

```ts
export type CapsuleBannerBlock = {
  id: string;
  kind: "capsule-banner";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    text?: string;
    type: CapsuleType;
    color: string;
    height?: number;
    fontColor?: string;
    section?: "header" | "footer";
  };
};
```

Add it to the `Block` union:

```ts
export type Block =
  | HeroBioBlock
  | TechStackBlock
  | GithubStatsBlock
  | AsciiBannerBlock
  | AsciiImageBlock
  | SocialLinksBlock
  | RichMediaBlock
  | MarkdownCustomBlock
  | TypingHeaderBlock
  | CapsuleBannerBlock;
```

- [ ] **Step 4: Write the implementation**

`src/lib/capsuleBannerUrl.ts`:

```ts
import type { CapsuleBannerBlock } from "@/types/ast";

export function buildCapsuleUrl(content: CapsuleBannerBlock["content"]): string {
  const { text = "", type, color, height = 200, fontColor = "ffffff", section = "header" } = content;

  const params = new URLSearchParams({
    type,
    color: color.replace(/^#/, ""),
    height: String(height),
    section,
    fontColor: fontColor.replace(/^#/, ""),
    text,
  });

  return `https://capsule-render.vercel.app/api?${params.toString()}`;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/capsuleBannerUrl.test.ts`
Expected: PASS

Note: as in Task 11, `BlockKind`/`Block` now reference `"capsule-banner"` with no matching switch case anywhere yet — resolved in Task 16, the next task.

- [ ] **Step 6: Commit**

```bash
git add src/types/ast.ts src/lib/capsuleBannerUrl.ts src/lib/capsuleBannerUrl.test.ts
git commit -m "feat: add CapsuleBannerBlock type and capsule-render URL builder"
```

---

### Task 15: `CapsuleBannerBlockView` + `CapsuleBannerForm`

**Files:**
- Create: `src/components/editor/blocks/CapsuleBannerBlockView.tsx`
- Create: `src/components/editor/forms/CapsuleBannerForm.tsx`
- Test: `src/components/editor/blocks/__tests__/CapsuleBannerBlockView.test.tsx`
- Test: `src/components/editor/forms/__tests__/CapsuleBannerForm.test.tsx`

**Interfaces:**
- Consumes: `buildCapsuleUrl`, `CAPSULE_TYPES` (Task 14)

- [ ] **Step 1: Write the failing tests**

`src/components/editor/blocks/__tests__/CapsuleBannerBlockView.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CapsuleBannerBlockView } from "../CapsuleBannerBlockView";
import type { CapsuleBannerBlock } from "@/types/ast";

describe("CapsuleBannerBlockView", () => {
  it("renders a capsule-render image", () => {
    const block: CapsuleBannerBlock = {
      id: "cb1",
      kind: "capsule-banner",
      content: { type: "waving", color: "0d1117", text: "Welcome" },
    };
    render(<CapsuleBannerBlockView block={block} />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("capsule-render.vercel.app");
    expect(img.src).toContain("type=waving");
  });
});
```

`src/components/editor/forms/__tests__/CapsuleBannerForm.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CapsuleBannerForm } from "../CapsuleBannerForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { CapsuleBannerBlock } from "@/types/ast";

function makeBlock(): CapsuleBannerBlock {
  return { id: "cb-1", kind: "capsule-banner", content: { type: "waving", color: "#0d1117" } };
}

describe("CapsuleBannerForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("updates the shape when a new option is selected", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<CapsuleBannerForm block={block} />);

    await user.selectOptions(screen.getByLabelText(/shape/i), "rect");

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.type).toBe("rect");
  });

  it("updates banner text as the user types", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<CapsuleBannerForm block={block} />);

    await user.type(screen.getByLabelText(/banner text/i), "Hi");

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "cb-1") as CapsuleBannerBlock;
    expect(stored.content.text).toBe("Hi");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/editor/blocks/__tests__/CapsuleBannerBlockView.test.tsx src/components/editor/forms/__tests__/CapsuleBannerForm.test.tsx`
Expected: FAIL — neither component exists yet.

- [ ] **Step 3: Write `CapsuleBannerBlockView.tsx`**

```tsx
import type { CapsuleBannerBlock } from "@/types/ast";
import { buildCapsuleUrl } from "@/lib/capsuleBannerUrl";

type Props = { block: CapsuleBannerBlock };

export function CapsuleBannerBlockView({ block }: Props) {
  return (
    <div className="flex justify-center">
      <img src={buildCapsuleUrl(block.content)} alt={block.content.text || "Banner"} className="w-full" />
    </div>
  );
}
```

- [ ] **Step 4: Write `CapsuleBannerForm.tsx`**

```tsx
"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { CAPSULE_TYPES } from "@/types/ast";
import type { CapsuleBannerBlock } from "@/types/ast";

type Props = { block: CapsuleBannerBlock };

export function CapsuleBannerForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const { text = "", type, color, height = 200, fontColor = "#ffffff", section = "header" } =
    block.content;

  function patch(partial: Partial<CapsuleBannerBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "capsule-banner" ? { ...b, content: { ...b.content, ...partial } } : b,
    );
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-text" className={labelClass}>
          Banner Text
        </label>
        <input
          id="cb-text"
          type="text"
          value={text}
          onChange={(e) => patch({ text: e.target.value })}
          placeholder="Welcome to my profile"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-type" className={labelClass}>
          Shape
        </label>
        <select
          id="cb-type"
          value={type}
          onChange={(e) => patch({ type: e.target.value as CapsuleBannerBlock["content"]["type"] })}
          className={inputClass}
        >
          {CAPSULE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-section" className={labelClass}>
          Position
        </label>
        <select
          id="cb-section"
          value={section}
          onChange={(e) => patch({ section: e.target.value as "header" | "footer" })}
          className={inputClass}
        >
          <option value="header">Header</option>
          <option value="footer">Footer</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-height" className={labelClass}>
          Height ({height}px)
        </label>
        <input
          id="cb-height"
          type="range"
          min="100"
          max="400"
          value={height}
          onChange={(e) => patch({ height: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-color" className={labelClass}>
          Banner Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="cb-color"
            type="color"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => patch({ color: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-fontcolor" className={labelClass}>
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="cb-fontcolor"
            type="color"
            value={fontColor}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-sm border border-[var(--border-subtle)]"
          />
          <input
            type="text"
            value={fontColor}
            onChange={(e) => patch({ fontColor: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/components/editor/blocks/__tests__/CapsuleBannerBlockView.test.tsx src/components/editor/forms/__tests__/CapsuleBannerForm.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/editor/blocks/CapsuleBannerBlockView.tsx src/components/editor/forms/CapsuleBannerForm.tsx src/components/editor/blocks/__tests__/CapsuleBannerBlockView.test.tsx src/components/editor/forms/__tests__/CapsuleBannerForm.test.tsx
git commit -m "feat: add Capsule Banner block view and form"
```

---

### Task 16: Wire the Capsule Banner Block into the Editor

**Files:**
- Modify: `src/components/editor/BentoCard.tsx`
- Modify: `src/components/editor/EditorSidebar.tsx`
- Modify: `src/lib/markdownSerializer.ts`
- Modify: `src/lib/markdownSerializer.selfcheck.ts`

**Interfaces:**
- Consumes: `CapsuleBannerBlockView`, `CapsuleBannerForm` (Task 15), `buildCapsuleUrl` (Task 14)

Same wiring pattern as Task 13, closing the exhaustiveness gap left at the end of Task 14.

- [ ] **Step 1: Add a failing selfcheck assertion**

Append to `src/lib/markdownSerializer.selfcheck.ts` (add `CapsuleBannerBlock` to the top-of-file type imports):

```ts
// ============================================================================
// Test: Capsule Banner
// ============================================================================

const capsuleBlock: CapsuleBannerBlock = {
  id: "capsule1",
  kind: "capsule-banner",
  position: { x: 0, y: 0, w: 12, h: 4 },
  content: { type: "waving", color: "0d1117" },
};
const capsuleOutput = serializeBlocks([capsuleBlock]);
assert.ok(
  capsuleOutput.includes("capsule-render.vercel.app"),
  "Capsule banner should embed a capsule-render image",
);
```

- [ ] **Step 2: Run the script to verify it fails**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: compile/type error — `"capsule-banner"` isn't a handled case yet.

- [ ] **Step 3: Add the serializer case**

In `markdownSerializer.ts`, add the imports:

```ts
import { buildCapsuleUrl } from "./capsuleBannerUrl";
import type { CapsuleBannerBlock } from "@/types/ast";
```

Add the function:

```ts
function serializeCapsuleBanner(block: CapsuleBannerBlock): string {
  return `<div align="center">\n  <img src="${buildCapsuleUrl(block.content)}" alt="Banner" />\n</div>`;
}
```

Add the switch case:

```ts
        case "capsule-banner":
          serialized = serializeCapsuleBanner(block);
          break;
```

- [ ] **Step 4: Add the BentoCard render case**

In `BentoCard.tsx`:

```ts
import { CapsuleBannerBlockView } from "./blocks/CapsuleBannerBlockView";
```

```ts
  "capsule-banner": "Capsule Banner",
```

```ts
      case "capsule-banner":
        return <CapsuleBannerBlockView block={block} />;
```

- [ ] **Step 5: Add the EditorSidebar wiring**

In `EditorSidebar.tsx`:

```ts
import { CapsuleBannerForm } from "./forms/CapsuleBannerForm";
```

```ts
  {
    label: "Capsule Banner",
    description: "Wave/gradient header or footer banner",
    factory: () => ({
      id: makeId(),
      kind: "capsule-banner",
      content: {
        type: "waving",
        color: "0d1117",
        text: "",
        height: 200,
        fontColor: "ffffff",
        section: "header",
      },
    }),
  },
```

```ts
  "capsule-banner": "Capsule Banner",
```

```ts
      case "capsule-banner": return <CapsuleBannerForm block={block} />;
```

- [ ] **Step 6: Run everything to verify it passes**

Run: `node --experimental-strip-types src/lib/markdownSerializer.selfcheck.ts`
Expected: `markdownSerializer selfcheck: all assertions passed`

Run: `npx vitest run && npx tsc --noEmit`
Expected: all suites PASS, zero type errors

- [ ] **Step 7: Commit**

```bash
git add src/components/editor/BentoCard.tsx src/components/editor/EditorSidebar.tsx src/lib/markdownSerializer.ts src/lib/markdownSerializer.selfcheck.ts
git commit -m "feat: wire Capsule Banner block into canvas, sidebar, and markdown export"
```

---

### Task 17: "Visual" README Template

**Files:**
- Modify: `src/lib/readmeTemplates.ts`
- Test: `src/lib/readmeTemplates.visual.test.ts`

**Interfaces:**
- Consumes: `typing-header`, `capsule-banner`, `tech-stack` (with `iconStyle: "skill-icons"`), `github-stats` (all toggles on), `social-links` — all block kinds from prior tasks
- Produces: a 4th entry in `README_TEMPLATES`, `id: "visual"`

- [ ] **Step 1: Write the failing test**

`src/lib/readmeTemplates.visual.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { applyTemplate, getTemplateIds } from "./readmeTemplates";

describe("Visual template", () => {
  it("is registered alongside the existing templates", () => {
    expect(getTemplateIds()).toContain("visual");
  });

  it("applies with unique ids and stacked positions for all 5 blocks", () => {
    const blocks = applyTemplate("visual");
    expect(blocks).toHaveLength(5);
    expect(blocks.map((b) => b.kind)).toEqual([
      "typing-header",
      "capsule-banner",
      "tech-stack",
      "github-stats",
      "social-links",
    ]);
    const ids = blocks.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/readmeTemplates.visual.test.ts`
Expected: FAIL — `getTemplateIds()` does not yet include `"visual"`.

- [ ] **Step 3: Add `VISUAL_TEMPLATE`**

In `readmeTemplates.ts`, add before the `README_TEMPLATES` export:

```ts
/**
 * Visual template: typing header, wave banner, skill-icons tech stack, and
 * full GitHub stats (trophies + streak + languages). Showcases every block
 * added in this plan.
 */
const VISUAL_TEMPLATE: ReadmeTemplate = {
  id: "visual",
  name: "Visual",
  description: "Animated header, wave banner, and full GitHub stats showcase",
  blocks: [
    {
      id: "block-visual-typing",
      kind: "typing-header",
      content: {
        lines: ["Hi, I'm your name 👋", "Welcome to my GitHub profile"],
        speed: 50,
        pauseMs: 1000,
        color: "#36BCF7",
        fontSize: 24,
      },
    },
    {
      id: "block-visual-capsule",
      kind: "capsule-banner",
      content: {
        type: "waving",
        color: "0d1117",
        text: "",
        height: 180,
        fontColor: "ffffff",
        section: "header",
      },
    },
    {
      id: "block-visual-tech",
      kind: "tech-stack",
      content: {
        technologies: ["TypeScript", "React", "Node.js", "Docker", "PostgreSQL"],
        iconStyle: "skill-icons",
      },
    },
    {
      id: "block-visual-stats",
      kind: "github-stats",
      content: {
        username: "your-github-username",
        showPrivate: false,
        showLangs: true,
        showStreak: true,
        showTrophies: true,
        showVisitorCounter: true,
        theme: "dark",
      },
    },
    {
      id: "block-visual-links",
      kind: "social-links",
      content: {
        links: [
          { platform: "github", username: "yourname" },
          { platform: "linkedin", username: "yourname" },
        ],
      },
    },
  ],
};
```

Update the exported array:

```ts
export const README_TEMPLATES: ReadmeTemplate[] = [
  MINIMAL_TEMPLATE,
  DEVELOPER_TEMPLATE,
  PROJECT_TEMPLATE,
  VISUAL_TEMPLATE,
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/readmeTemplates.visual.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full suite and typecheck one last time**

Run: `npx vitest run && npx tsc --noEmit`
Expected: all suites PASS, zero type errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/readmeTemplates.ts src/lib/readmeTemplates.visual.test.ts
git commit -m "feat: add Visual README template showcasing typing header, capsule banner, and full GitHub stats"
```

---

## Manual Verification (not unit-testable)

After Task 17, apply the "Visual" template in the running app, fill in a real GitHub username, export the markdown, and paste it into a scratch repository's `README.md` on github.com to confirm every third-party embed (shields.io, skillicons.dev, capsule-render.vercel.app, readme-typing-svg.demolab.com, github-readme-stats.vercel.app, github-readme-streak-stats.herokuapp.com, github-profile-trophy.vercel.app, profile-counter.glitch.me) actually renders — this depends on those services being reachable and cannot be covered by a unit test.

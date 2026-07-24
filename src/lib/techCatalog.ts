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
  aws: {
    label: "AWS",
    slug: "amazonaws",
    hex: "232F3E",
    skillIconsSlug: "aws",
  },
  azure: {
    label: "Azure",
    slug: "microsoftazure",
    hex: "0078D4",
    skillIconsSlug: "azure",
  },
  heroku: {
    label: "Heroku",
    slug: "heroku",
    hex: "430098",
    skillIconsSlug: "heroku",
  },
  "vs code": {
    label: "VS Code",
    slug: "visualstudiocode",
    hex: "007ACC",
    skillIconsSlug: "vscode",
  },
  "gitlab ci": {
    label: "GitLab CI",
    slug: "gitlab",
    hex: "FC6D26",
    skillIconsSlug: "gitlab",
  },
};

// skillicons.dev ships its own curated ~400-file icon set
// (github.com/tandpfun/skill-icons/tree/main/icons) with slugs that
// sometimes diverge from simple-icons. Only entries with a confirmed
// skillicons.dev file get a mapping; anything else silently falls back to
// the shields.io render for that one badge in `buildSkillIconsUrl`.
const SKILL_ICONS_SLUGS: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "python",
  go: "golang",
  rust: "rust",
  cplusplus: "cpp",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  react: "react",
  vuedotjs: "vuejs",
  angular: "angular",
  svelte: "svelte",
  nextdotjs: "nextjs",
  nuxtdotjs: "nuxtjs",
  nodedotjs: "nodejs",
  express: "expressjs",
  nestjs: "nestjs",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  springboot: "spring",
  postgresql: "postgresql",
  mysql: "mysql",
  mongodb: "mongodb",
  firebase: "firebase",
  supabase: "supabase",
  redis: "redis",
  elasticsearch: "elasticsearch",
  graphql: "graphql",
  docker: "docker",
  kubernetes: "kubernetes",
  jenkins: "jenkins",
  githubactions: "githubactions",
  googlecloud: "gcp",
  github: "github",
  vercel: "vercel",
  netlify: "netlify",
  git: "git",
  linux: "linux",
  figma: "figma",
  webpack: "webpack",
  vite: "vite",
  jest: "jest",
  cypress: "cypress",
  html5: "html",
  css3: "css",
  tailwindcss: "tailwindcss",
  bootstrap: "bootstrap",
  sass: "sass",
  redux: "redux",
  c: "c",
  ruby: "ruby",
  dart: "dart",
  scala: "scala",
  haskell: "haskell",
  lua: "lua",
  r: "r",
  solidity: "solidity",
  laravel: "laravel",
  terraform: "terraform",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  unity: "unity",
  unrealengine: "unrealengine",
  postman: "postman",
  notion: "notion",
};

const BASE_CATALOG: TechCatalogEntry[] = (
  catalogData as TechCatalogEntry[]
).map((entry) => {
  const skillIconsSlug = SKILL_ICONS_SLUGS[entry.slug];
  return skillIconsSlug ? { ...entry, skillIconsSlug } : entry;
});

const CATALOG_BY_LABEL: Map<string, TechCatalogEntry> = new Map(
  BASE_CATALOG.map((entry) => [entry.label.toLowerCase(), entry]),
);

for (const [key, entry] of Object.entries(LEGACY_OVERRIDES)) {
  CATALOG_BY_LABEL.set(key, entry);
}

/** The curated subset shown by default before the user searches. */
export const POPULAR_TECH: string[] = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "C#",
  "PHP",
  "Swift",
  "Kotlin",
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt",
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Firebase",
  "Supabase",
  "Redis",
  "Elasticsearch",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "AWS",
  "Google Cloud",
  "Azure",
  "GitHub",
  "Vercel",
  "Netlify",
  "Heroku",
  "Git",
  "Linux",
  "VS Code",
  "Figma",
  "Webpack",
  "Vite",
  "Jest",
  "Cypress",
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

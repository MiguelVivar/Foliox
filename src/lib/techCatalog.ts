export type TechCatalogEntry = {
  label: string;
  color: string;
  logo: string;
};

// Brand metadata using the same simple-icons slugs shields.io badges already
// consume (https://simpleicons.org). Both markdownSerializer.ts and
// TechStackForm.tsx read from this one catalog so they can never drift.
export const TECH_CATALOG: TechCatalogEntry[] = [
  // Languages
  { label: "TypeScript", color: "3178C6", logo: "typescript" },
  { label: "JavaScript", color: "F7DF1E", logo: "javascript" },
  { label: "Python", color: "3776AB", logo: "python" },
  { label: "Java", color: "ED8B00", logo: "openjdk" },
  { label: "Kotlin", color: "7F52FF", logo: "kotlin" },
  { label: "Swift", color: "F05138", logo: "swift" },
  { label: "C", color: "A8B9CC", logo: "c" },
  { label: "C++", color: "00599C", logo: "cplusplus" },
  { label: "C#", color: "239120", logo: "csharp" },
  { label: "PHP", color: "777BB4", logo: "php" },
  { label: "Ruby", color: "CC342D", logo: "ruby" },
  { label: "Rust", color: "000000", logo: "rust" },
  { label: "Go", color: "00ADD8", logo: "go" },
  { label: "Dart", color: "0175C2", logo: "dart" },
  { label: "Scala", color: "DC322F", logo: "scala" },
  { label: "Haskell", color: "5D4F85", logo: "haskell" },
  { label: "Elixir", color: "4B275F", logo: "elixir" },
  { label: "Lua", color: "2C2D72", logo: "lua" },
  { label: "R", color: "276DC3", logo: "r" },
  { label: "Solidity", color: "363636", logo: "solidity" },

  // Frontend
  { label: "HTML5", color: "E34F26", logo: "html5" },
  { label: "CSS3", color: "1572B6", logo: "css3" },
  { label: "React", color: "20232A", logo: "react" },
  { label: "Next.js", color: "000000", logo: "nextdotjs" },
  { label: "Vue.js", color: "4FC08D", logo: "vuedotjs" },
  { label: "Nuxt", color: "00DC82", logo: "nuxtdotjs" },
  { label: "Angular", color: "DD0031", logo: "angular" },
  { label: "Svelte", color: "FF3E00", logo: "svelte" },
  { label: "Astro", color: "BC52EE", logo: "astro" },
  { label: "Tailwind CSS", color: "06B6D4", logo: "tailwindcss" },
  { label: "Bootstrap", color: "7952B3", logo: "bootstrap" },
  { label: "Sass", color: "CC6699", logo: "sass" },
  { label: "Redux", color: "764ABC", logo: "redux" },
  { label: "Vite", color: "646CFF", logo: "vite" },
  { label: "Webpack", color: "8DD6F9", logo: "webpack" },

  // Backend
  { label: "Node.js", color: "339933", logo: "nodedotjs" },
  { label: "Express", color: "000000", logo: "express" },
  { label: "NestJS", color: "E0234E", logo: "nestjs" },
  { label: "Django", color: "092E20", logo: "django" },
  { label: "Flask", color: "000000", logo: "flask" },
  { label: "FastAPI", color: "009688", logo: "fastapi" },
  { label: "Spring", color: "6DB33F", logo: "spring" },
  { label: "Laravel", color: "FF2D20", logo: "laravel" },
  { label: "GraphQL", color: "E10098", logo: "graphql" },
  { label: "Prisma", color: "2D3748", logo: "prisma" },

  // Databases
  { label: "PostgreSQL", color: "4169E1", logo: "postgresql" },
  { label: "MySQL", color: "4479A1", logo: "mysql" },
  { label: "MongoDB", color: "47A248", logo: "mongodb" },
  { label: "Redis", color: "DC382D", logo: "redis" },
  { label: "SQLite", color: "003B57", logo: "sqlite" },
  { label: "Supabase", color: "3ECF8E", logo: "supabase" },
  { label: "Firebase", color: "FFCA28", logo: "firebase" },
  { label: "Elasticsearch", color: "005571", logo: "elasticsearch" },

  // Cloud & DevOps
  { label: "Docker", color: "2496ED", logo: "docker" },
  { label: "Kubernetes", color: "326CE5", logo: "kubernetes" },
  { label: "AWS", color: "232F3E", logo: "amazonaws" },
  { label: "Google Cloud", color: "4285F4", logo: "googlecloud" },
  { label: "Azure", color: "0078D4", logo: "microsoftazure" },
  { label: "Vercel", color: "000000", logo: "vercel" },
  { label: "Netlify", color: "00C7B7", logo: "netlify" },
  { label: "Terraform", color: "7B42BC", logo: "terraform" },
  { label: "Ansible", color: "EE0000", logo: "ansible" },
  { label: "Jenkins", color: "D24939", logo: "jenkins" },
  { label: "GitHub Actions", color: "2088FF", logo: "githubactions" },
  { label: "Nginx", color: "009639", logo: "nginx" },
  { label: "Git", color: "F05032", logo: "git" },
  { label: "Linux", color: "FCC624", logo: "linux" },

  // Tools & misc
  { label: "Figma", color: "F24E1E", logo: "figma" },
  { label: "Postman", color: "FF6C37", logo: "postman" },
  { label: "Jest", color: "C21325", logo: "jest" },
  { label: "Cypress", color: "17202C", logo: "cypress" },
  { label: "ESLint", color: "4B32C3", logo: "eslint" },
  { label: "Jira", color: "0052CC", logo: "jira" },
  { label: "Notion", color: "000000", logo: "notion" },

  // Data / ML
  { label: "TensorFlow", color: "FF6F00", logo: "tensorflow" },
  { label: "PyTorch", color: "EE4C2C", logo: "pytorch" },
  { label: "Pandas", color: "150458", logo: "pandas" },
  { label: "NumPy", color: "013243", logo: "numpy" },
  { label: "Jupyter", color: "F37626", logo: "jupyter" },

  // Game dev
  { label: "Unity", color: "FFFFFF", logo: "unity" },
  { label: "Unreal Engine", color: "0E1128", logo: "unrealengine" },
];

const CATALOG_BY_LABEL: Map<string, TechCatalogEntry> = new Map(
  TECH_CATALOG.map((entry) => [entry.label.toLowerCase(), entry]),
);

/** Case-insensitive catalog lookup by display label. */
export function findTechMeta(label: string): TechCatalogEntry | undefined {
  return CATALOG_BY_LABEL.get(label.toLowerCase());
}

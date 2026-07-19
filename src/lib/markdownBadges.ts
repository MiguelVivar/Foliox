export interface Badge {
  label: string;
  logo: string;
  logoColor?: string;
  backgroundColor?: string;
  alt: string;
  url?: string;
}

export const MARKDOWN_BADGES: Badge[] = [
  { label: "JavaScript", logo: "javascript", logoColor: "000", backgroundColor: "F7DF1E", alt: "JavaScript" },
  { label: "TypeScript", logo: "typescript", logoColor: "fff", backgroundColor: "3178C6", alt: "TypeScript" },
  { label: "Python", logo: "python", logoColor: "fff", backgroundColor: "3776AB", alt: "Python" },
  { label: "Java", logo: "java", logoColor: "fff", backgroundColor: "007396", alt: "Java" },
  { label: "Go", logo: "go", logoColor: "fff", backgroundColor: "00ADD8", alt: "Go" },
  { label: "Rust", logo: "rust", logoColor: "fff", backgroundColor: "CE422B", alt: "Rust" },
  { label: "C++", logo: "cplusplus", logoColor: "fff", backgroundColor: "00599C", alt: "C++" },
  { label: "C#", logo: "csharp", logoColor: "fff", backgroundColor: "239120", alt: "C#" },
  { label: "PHP", logo: "php", logoColor: "fff", backgroundColor: "777BB4", alt: "PHP" },
  { label: "Swift", logo: "swift", logoColor: "fff", backgroundColor: "FA7343", alt: "Swift" },
  { label: "Kotlin", logo: "kotlin", logoColor: "fff", backgroundColor: "7F52FF", alt: "Kotlin" },
  { label: "React", logo: "react", logoColor: "61DAFB", backgroundColor: "000", alt: "React" },
  { label: "Vue.js", logo: "vuedotjs", logoColor: "fff", backgroundColor: "4FC08D", alt: "Vue.js" },
  { label: "Angular", logo: "angular", logoColor: "fff", backgroundColor: "E23237", alt: "Angular" },
  { label: "Svelte", logo: "svelte", logoColor: "fff", backgroundColor: "FF3E00", alt: "Svelte" },
  { label: "Next.js", logo: "nextdotjs", logoColor: "fff", backgroundColor: "000", alt: "Next.js" },
  { label: "Nuxt", logo: "nuxtdotjs", logoColor: "fff", backgroundColor: "00DC82", alt: "Nuxt" },
  { label: "Node.js", logo: "nodedotjs", logoColor: "fff", backgroundColor: "339933", alt: "Node.js" },
  { label: "Express", logo: "express", logoColor: "fff", backgroundColor: "000", alt: "Express" },
  { label: "NestJS", logo: "nestjs", logoColor: "fff", backgroundColor: "E0234E", alt: "NestJS" },
  { label: "Django", logo: "django", logoColor: "fff", backgroundColor: "092E20", alt: "Django" },
  { label: "Flask", logo: "flask", logoColor: "fff", backgroundColor: "000", alt: "Flask" },
  { label: "FastAPI", logo: "fastapi", logoColor: "fff", backgroundColor: "009688", alt: "FastAPI" },
  { label: "Spring Boot", logo: "springboot", logoColor: "fff", backgroundColor: "6DB33F", alt: "Spring Boot" },
  { label: "PostgreSQL", logo: "postgresql", logoColor: "fff", backgroundColor: "336791", alt: "PostgreSQL" },
  { label: "MySQL", logo: "mysql", logoColor: "fff", backgroundColor: "4479A1", alt: "MySQL" },
  { label: "MongoDB", logo: "mongodb", logoColor: "fff", backgroundColor: "13AA52", alt: "MongoDB" },
  { label: "Firebase", logo: "firebase", logoColor: "fff", backgroundColor: "FFCA28", alt: "Firebase" },
  { label: "Supabase", logo: "supabase", logoColor: "fff", backgroundColor: "3ECF8E", alt: "Supabase" },
  { label: "Redis", logo: "redis", logoColor: "fff", backgroundColor: "DC382D", alt: "Redis" },
  { label: "Elasticsearch", logo: "elasticsearch", logoColor: "fff", backgroundColor: "005571", alt: "Elasticsearch" },
  { label: "GraphQL", logo: "graphql", logoColor: "fff", backgroundColor: "E10098", alt: "GraphQL" },
  { label: "Docker", logo: "docker", logoColor: "fff", backgroundColor: "2496ED", alt: "Docker" },
  { label: "Kubernetes", logo: "kubernetes", logoColor: "fff", backgroundColor: "326CE5", alt: "Kubernetes" },
  { label: "Jenkins", logo: "jenkins", logoColor: "fff", backgroundColor: "D24939", alt: "Jenkins" },
  { label: "GitHub Actions", logo: "github", logoColor: "fff", backgroundColor: "181717", alt: "GitHub Actions" },
  { label: "GitLab CI", logo: "gitlab", logoColor: "fff", backgroundColor: "FC6D26", alt: "GitLab CI" },
  { label: "AWS", logo: "amazonaws", logoColor: "fff", backgroundColor: "232F3E", alt: "AWS" },
  { label: "Google Cloud", logo: "googlecloud", logoColor: "fff", backgroundColor: "4285F4", alt: "Google Cloud" },
  { label: "Azure", logo: "microsoftazure", logoColor: "fff", backgroundColor: "0078D4", alt: "Azure" },
  { label: "GitHub", logo: "github", logoColor: "fff", backgroundColor: "181717", alt: "GitHub" },
  { label: "Vercel", logo: "vercel", logoColor: "000", backgroundColor: "fff", alt: "Vercel" },
  { label: "Netlify", logo: "netlify", logoColor: "fff", backgroundColor: "00C7B7", alt: "Netlify" },
  { label: "Heroku", logo: "heroku", logoColor: "fff", backgroundColor: "430098", alt: "Heroku" },
  { label: "Git", logo: "git", logoColor: "fff", backgroundColor: "F1502F", alt: "Git" },
  { label: "Linux", logo: "linux", logoColor: "fff", backgroundColor: "FCC624", alt: "Linux" },
  { label: "VS Code", logo: "visualstudiocode", logoColor: "fff", backgroundColor: "007ACC", alt: "VS Code" },
  { label: "JetBrains", logo: "jetbrains", logoColor: "fff", backgroundColor: "000", alt: "JetBrains" },
  { label: "Figma", logo: "figma", logoColor: "fff", backgroundColor: "F24E1E", alt: "Figma" },
  { label: "Webpack", logo: "webpack", logoColor: "fff", backgroundColor: "8DD6F9", alt: "Webpack" },
  { label: "Vite", logo: "vite", logoColor: "fff", backgroundColor: "646CFF", alt: "Vite" },
  { label: "Jest", logo: "jest", logoColor: "fff", backgroundColor: "C21325", alt: "Jest" },
  { label: "Cypress", logo: "cypress", logoColor: "fff", backgroundColor: "17202C", alt: "Cypress" },
];

export function getBadgeByLabel(label: string): Badge | undefined {
  return MARKDOWN_BADGES.find((b) => b.label.toLowerCase() === label.toLowerCase());
}

export function searchBadges(query: string): Badge[] {
  const lowerQuery = query.toLowerCase();
  return MARKDOWN_BADGES.filter((b) => b.label.toLowerCase().includes(lowerQuery));
}

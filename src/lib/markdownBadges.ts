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
  { label: "React", logo: "react", logoColor: "61DAFB", backgroundColor: "000", alt: "React" },
  { label: "Vue.js", logo: "vuedotjs", logoColor: "fff", backgroundColor: "4FC08D", alt: "Vue.js" },
  { label: "Angular", logo: "angular", logoColor: "fff", backgroundColor: "E23237", alt: "Angular" },
  { label: "Node.js", logo: "nodedotjs", logoColor: "fff", backgroundColor: "339933", alt: "Node.js" },
  { label: "Express", logo: "express", logoColor: "fff", backgroundColor: "000", alt: "Express" },
  { label: "Django", logo: "django", logoColor: "fff", backgroundColor: "092E20", alt: "Django" },
  { label: "Flask", logo: "flask", logoColor: "fff", backgroundColor: "000", alt: "Flask" },
  { label: "PostgreSQL", logo: "postgresql", logoColor: "fff", backgroundColor: "336791", alt: "PostgreSQL" },
  { label: "MongoDB", logo: "mongodb", logoColor: "fff", backgroundColor: "13AA52", alt: "MongoDB" },
  { label: "Redis", logo: "redis", logoColor: "fff", backgroundColor: "DC382D", alt: "Redis" },
  { label: "Docker", logo: "docker", logoColor: "fff", backgroundColor: "2496ED", alt: "Docker" },
  { label: "Kubernetes", logo: "kubernetes", logoColor: "fff", backgroundColor: "326CE5", alt: "Kubernetes" },
  { label: "AWS", logo: "amazonaws", logoColor: "fff", backgroundColor: "232F3E", alt: "AWS" },
  { label: "GitHub", logo: "github", logoColor: "fff", backgroundColor: "181717", alt: "GitHub" },
];

export function getBadgeByLabel(label: string): Badge | undefined {
  return MARKDOWN_BADGES.find((b) => b.label.toLowerCase() === label.toLowerCase());
}

export function searchBadges(query: string): Badge[] {
  const lowerQuery = query.toLowerCase();
  return MARKDOWN_BADGES.filter((b) => b.label.toLowerCase().includes(lowerQuery));
}

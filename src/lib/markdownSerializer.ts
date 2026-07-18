import figlet from "figlet";
import type {
  Block,
  HeroBioBlock,
  TechStackBlock,
  GithubStatsBlock,
  AsciiBannerBlock,
  AsciiImageBlock,
  SocialLinksBlock,
  RichMediaBlock,
  MarkdownCustomBlock,
} from "@/types/ast";
import type { BadgeStyle } from "@/store/useEditorStore";

// ---------------------------------------------------------------------------
// Serialization options
// ---------------------------------------------------------------------------

export type SerializeOptions = {
  badgeStyle?: BadgeStyle;
  sectionSeparator?: boolean;
};

const DEFAULT_OPTIONS: Required<SerializeOptions> = {
  badgeStyle: "flat-square",
  sectionSeparator: false,
};

const SOCIAL_METADATA: Record<string, { label: string; color: string; logo: string; url: (username: string) => string }> = {
  github: { label: "GitHub", color: "181717", logo: "github", url: (u) => `https://github.com/${u}` },
  linkedin: { label: "LinkedIn", color: "0077B5", logo: "linkedin", url: (u) => `https://linkedin.com/in/${u}` },
  twitter: { label: "Twitter", color: "1DA1F2", logo: "twitter", url: (u) => `https://twitter.com/${u}` },
  instagram: { label: "Instagram", color: "E4405F", logo: "instagram", url: (u) => `https://instagram.com/${u}` },
  devto: { label: "Dev.to", color: "0A0A0A", logo: "devdotto", url: (u) => `https://dev.to/${u}` },
  huggingface: { label: "Hugging Face", color: "FFD21E", logo: "huggingface", url: (u) => `https://huggingface.co/${u}` },
};

// ---------------------------------------------------------------------------
// Per-kind serializers
// ---------------------------------------------------------------------------

// Brand metadata from Ileriayo/markdown-badges spec
const TECH_BADGE_META: Record<string, { color: string; logo: string }> = {
  typescript: { color: "3178C6", logo: "typescript" },
  javascript: { color: "F7DF1E", logo: "javascript" },
  react: { color: "20232A", logo: "react" },
  "next.js": { color: "000000", logo: "nextdotjs" },
  node: { color: "339933", logo: "nodedotjs" },
  "node.js": { color: "339933", logo: "nodedotjs" },
  docker: { color: "2496ED", logo: "docker" },
  python: { color: "3776AB", logo: "python" },
  rust: { color: "000000", logo: "rust" },
  go: { color: "00ADD8", logo: "go" },
  html5: { color: "E34F26", logo: "html5" },
  css3: { color: "1572B6", logo: "css3" },
  git: { color: "F05032", logo: "git" },
  aws: { color: "232F3E", logo: "amazon-aws" },
  supabase: { color: "3ECF8E", logo: "supabase" },
  postgresql: { color: "4169E1", logo: "postgresql" },
  mysql: { color: "4479A1", logo: "mysql" },
  mongodb: { color: "47A248", logo: "mongodb" },
};

function serializeHeroBio(block: HeroBioBlock): string {
  const { name, tagline, avatarUrl } = block.content;
  const lines: string[] = [];

  if (avatarUrl) {
    lines.push(
      `<div align="center">`,
      `  <img src="${avatarUrl}" width="100" height="100" alt="${name || "avatar"}" style="border-radius:50%" />`,
      `</div>`,
      ``,
    );
  }

  if (name) lines.push(`# ${name}`, ``);
  if (tagline) lines.push(`> ${tagline}`, ``);

  return lines.join("\n").trimEnd();
}

function serializeTechStack(
  block: TechStackBlock,
  opts: Required<SerializeOptions>,
): string {
  const { technologies } = block.content;
  if (technologies.length === 0) return `<!-- tech-stack: empty -->`;

  const badges = technologies
    .map((tech) => {
      const lower = tech.toLowerCase();
      const meta = TECH_BADGE_META[lower];
      if (meta) {
        const logoColor = meta.color === "F7DF1E" ? "black" : "white";
        return `![${tech}](https://img.shields.io/badge/${tech}-${meta.color}?style=${opts.badgeStyle}&logo=${meta.logo}&logoColor=${logoColor})`;
      }
      const encoded = encodeURIComponent(tech);
      return `![${tech}](https://img.shields.io/badge/${encoded}-555555?style=${opts.badgeStyle})`;
    })
    .join(" ");

  return `## Tech Stack\n\n${badges}`;
}

function serializeGithubStats(block: GithubStatsBlock): string {
  const { username, showLangs, showTrophies, showVisitorCounter } = block.content;
  if (!username) return `<!-- github-stats: no username set -->`;

  const lines: string[] = [`## GitHub Stats`, ``];

  if (showVisitorCounter) {
    lines.push(
      `<div align="center">`,
      `  <img src="https://profile-counter.glitch.me/${username}/count.svg" alt="Visitor Count" />`,
      `</div>`,
      ``,
    );
  }

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=dark&hide_border=true`;
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true`;

  lines.push(
    `<div align="center">`,
    `  <img src="${statsUrl}" alt="${username} GitHub stats" />`,
    `  <img src="${streakUrl}" alt="${username} streak" />`,
    `</div>`,
    ``,
  );

  if (showLangs) {
    const langsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=dark&hide_border=true`;
    lines.push(
      `<div align="center">`,
      `  <img src="${langsUrl}" alt="Top Languages" />`,
      `</div>`,
      ``,
    );
  }

  if (showTrophies) {
    const trophiesUrl = `https://github-profile-trophy.vercel.app/?username=${username}&theme=onedark&column=5&no-background=true&no-border=true`;
    lines.push(
      `<div align="center">`,
      `  <img src="${trophiesUrl}" alt="GitHub Trophies" />`,
      `</div>`,
      ``,
    );
  }

  return lines.join("\n").trimEnd();
}

function serializeAsciiBanner(block: AsciiBannerBlock): string {
  const { text, font } = block.content;
  if (!text) return `<!-- ascii-banner: empty -->`;

  try {
    // figlet.textSync is synchronous and safe to call in the serializer
    // (runs only when user clicks Copy/Download, not on every keystroke).
    const art = figlet.textSync(text, {
      font: font as figlet.Fonts,
      horizontalLayout: "default",
    });
    return "```\n" + art + "\n```";
  } catch {
    // Fallback if font isn't pre-loaded
    const border = `+${"─".repeat(text.length + 4)}+`;
    const middle = `|  ${text}  |`;
    return "```\n" + `${border}\n${middle}\n${border}` + "\n```";
  }
}

function serializeAsciiImage(block: AsciiImageBlock): string {
  const { asciiArt } = block.content;
  if (!asciiArt) return `<!-- ascii-image: empty -->`;
  return "```\n" + asciiArt + "\n```";
}

function serializeSocialLinks(block: SocialLinksBlock, opts: Required<SerializeOptions>): string {
  const { links } = block.content;
  if (links.length === 0) return `<!-- social-links: empty -->`;

  const badges = links
    .map(({ platform, username }) => {
      const meta = SOCIAL_METADATA[platform.toLowerCase()];
      if (!meta) return "";
      const badgeUrl = `https://img.shields.io/badge/${meta.label}-${meta.color}?style=${opts.badgeStyle}&logo=${meta.logo}&logoColor=${meta.color === "FFD21E" ? "black" : "white"}`;
      return `[![${meta.label}](${badgeUrl})](${meta.url(username)})`;
    })
    .filter(Boolean)
    .join(" ");

  return `## Connect with me\n\n${badges}`;
}

function serializeRichMedia(block: RichMediaBlock): string {
  const { url, mediaType, align, width, height } = block.content;
  if (!url) return "<!-- rich-media: empty -->";

  const wAttr = width ? ` width="${width}"` : "";
  const hAttr = height ? ` height="${height}"` : "";

  let tag = "";
  if (mediaType === "video") {
    tag = `<video src="${url}" controls${wAttr}${hAttr} />`;
  } else {
    tag = `<img src="${url}" alt="media"${wAttr}${hAttr} />`;
  }

  if (align === "center" || align === "right") {
    return `<div align="${align}">\n  ${tag}\n</div>`;
  }
  return tag;
}

function serializeMarkdownCustom(block: MarkdownCustomBlock): string {
  return block.content.markdown.trimEnd();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts the editor AST block array into a valid GitHub-flavored Markdown string.
 * Pass `options` to customize badge style and section separators.
 */
export function serializeBlocks(
  blocks: Block[],
  options: SerializeOptions = {},
): string {
  if (blocks.length === 0) return "";

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const separator = opts.sectionSeparator ? "\n\n---\n\n" : "\n\n";

  return blocks
    .map((block) => {
      switch (block.kind) {
        case "hero-bio":
          return serializeHeroBio(block);
        case "tech-stack":
          return serializeTechStack(block, opts);
        case "github-stats":
          return serializeGithubStats(block);
        case "ascii-banner":
          return serializeAsciiBanner(block);
        case "ascii-image":
          return serializeAsciiImage(block);
        case "social-links":
          return serializeSocialLinks(block, opts);
        case "rich-media":
          return serializeRichMedia(block);
        case "markdown-custom":
          return serializeMarkdownCustom(block);
      }
    })
    .join(separator);
}

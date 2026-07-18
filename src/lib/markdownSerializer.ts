import figlet from "figlet";
import type {
  Block,
  HeroBioBlock,
  TechStackBlock,
  GithubStatsBlock,
  AsciiBannerBlock,
  AsciiImageBlock,
  SocialLinksBlock,
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
      const encoded = encodeURIComponent(tech);
      return `![${tech}](https://img.shields.io/badge/${encoded}-555555?style=${opts.badgeStyle})`;
    })
    .join(" ");

  return `## Tech Stack\n\n${badges}`;
}

function serializeGithubStats(block: GithubStatsBlock): string {
  const { username } = block.content;
  if (!username) return `<!-- github-stats: no username set -->`;

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=dark&hide_border=true`;
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true`;

  return [
    `## GitHub Stats`,
    ``,
    `<div align="center">`,
    `  <img src="${statsUrl}" alt="${username} GitHub stats" />`,
    `  <img src="${streakUrl}" alt="${username} streak" />`,
    `</div>`,
  ].join("\n");
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
        case "markdown-custom":
          return serializeMarkdownCustom(block);
      }
    })
    .join(separator);
}

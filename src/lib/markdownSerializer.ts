import figlet from "figlet";

// figlet's ambient types declare `Fonts` on a UMD namespace, but the
// published package only ships a default ESM export — a bare namespace or
// named type import of "figlet" doesn't resolve under Turbopack. Extracting
// the type from a real member's signature works with either module system.
type FigletFonts = Parameters<typeof figlet.loadFontSync>[0];
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
  TypingHeaderBlock,
  CapsuleBannerBlock,
} from "@/types/ast";
import type { BadgeStyle } from "@/store/useEditorStore";
import { buildShieldsUrl, buildSkillIconsUrl } from "./techCatalog";
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "./githubStatsUrls";
import { buildTypingSvgUrl } from "./typingHeaderUrl";
import { buildCapsuleUrl } from "./capsuleBannerUrl";

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

const SOCIAL_METADATA: Record<
  string,
  {
    label: string;
    color: string;
    logo: string;
    url: (username: string) => string;
  }
> = {
  github: {
    label: "GitHub",
    color: "181717",
    logo: "github",
    url: (u) => `https://github.com/${u}`,
  },
  linkedin: {
    label: "LinkedIn",
    color: "0077B5",
    logo: "linkedin",
    url: (u) => `https://linkedin.com/in/${u}`,
  },
  twitter: {
    label: "Twitter",
    color: "1DA1F2",
    logo: "twitter",
    url: (u) => `https://twitter.com/${u}`,
  },
  instagram: {
    label: "Instagram",
    color: "E4405F",
    logo: "instagram",
    url: (u) => `https://instagram.com/${u}`,
  },
  devto: {
    label: "Dev.to",
    color: "0A0A0A",
    logo: "devdotto",
    url: (u) => `https://dev.to/${u}`,
  },
  huggingface: {
    label: "Hugging Face",
    color: "FFD21E",
    logo: "huggingface",
    url: (u) => `https://huggingface.co/${u}`,
  },
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

function serializeGithubStats(block: GithubStatsBlock): string {
  const {
    username,
    showLangs,
    showTrophies,
    showVisitorCounter,
    showStreak,
    theme,
  } = block.content;
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

function serializeAsciiBanner(block: AsciiBannerBlock): string {
  const { text, font } = block.content;
  if (!text) return `<!-- ascii-banner: empty -->`;

  try {
    // figlet.textSync is synchronous and safe to call in the serializer
    // (runs only when user clicks Copy/Download, not on every keystroke).
    const art = figlet.textSync(text, {
      font: font as FigletFonts,
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

function serializeSocialLinks(
  block: SocialLinksBlock,
  opts: Required<SerializeOptions>,
): string {
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

function serializeTypingHeader(block: TypingHeaderBlock): string {
  const { lines } = block.content;
  if (lines.length === 0 || lines.every((line) => !line.trim())) {
    return `<!-- typing-header: empty -->`;
  }
  return `<div align="center">\n  <img src="${buildTypingSvgUrl(block.content)}" alt="Typing SVG" />\n</div>`;
}

function serializeCapsuleBanner(block: CapsuleBannerBlock): string {
  return `<div align="center">\n  <img src="${buildCapsuleUrl(block.content)}" alt="Banner" />\n</div>`;
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
  const separator = opts.sectionSeparator ? "\n\n---\n\n" : "\n\n\n";

  const orderedBlocks = [...blocks].sort((a, b) => {
    const ay = a.position?.y ?? 0;
    const by = b.position?.y ?? 0;
    if (ay !== by) return ay - by;
    const ax = a.position?.x ?? 0;
    const bx = b.position?.x ?? 0;
    return ax - bx;
  });

  return orderedBlocks
    .map((block) => {
      let serialized = "";
      switch (block.kind) {
        case "hero-bio":
          serialized = serializeHeroBio(block);
          break;
        case "tech-stack":
          serialized = serializeTechStack(block, opts);
          break;
        case "github-stats":
          serialized = serializeGithubStats(block);
          break;
        case "ascii-banner":
          serialized = serializeAsciiBanner(block);
          break;
        case "ascii-image":
          serialized = serializeAsciiImage(block);
          break;
        case "social-links":
          serialized = serializeSocialLinks(block, opts);
          break;
        case "rich-media":
          serialized = serializeRichMedia(block);
          break;
        case "markdown-custom":
          serialized = serializeMarkdownCustom(block);
          break;
        case "typing-header":
          serialized = serializeTypingHeader(block);
          break;
        case "capsule-banner":
          serialized = serializeCapsuleBanner(block);
          break;
      }
      if (block.style?.hasBorder && serialized.trim()) {
        return `<div style="border: 1px solid #30363d; border-radius: 6px; padding: 16px;">\n\n${serialized}\n\n</div>`;
      }
      return serialized;
    })
    .join(separator);
}

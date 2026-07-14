import type {
  Block,
  HeroBioBlock,
  TechStackBlock,
  GithubStatsBlock,
  AsciiBannerBlock,
  MarkdownCustomBlock,
} from "@/types/ast";

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

function serializeTechStack(block: TechStackBlock): string {
  const { technologies } = block.content;
  if (technologies.length === 0) return `<!-- tech-stack: empty -->`;

  // Shields.io badge per technology (flat-square style, neutral colors)
  const badges = technologies
    .map((tech) => {
      const encoded = encodeURIComponent(tech);
      return `![${tech}](https://img.shields.io/badge/${encoded}-555555?style=flat-square)`;
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
  const { text } = block.content;
  if (!text) return `<!-- ascii-banner: empty -->`;

  // Simple decorative frame — full figlet integration is Phase 6 (Web Worker)
  const border = `+${"─".repeat(text.length + 4)}+`;
  const middle = `|  ${text}  |`;

  return "```\n" + `${border}\n${middle}\n${border}` + "\n```";
}

function serializeMarkdownCustom(block: MarkdownCustomBlock): string {
  return block.content.markdown.trimEnd();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts the editor AST block array into a valid GitHub-flavored Markdown string.
 * Blocks are separated by a blank line.
 */
export function serializeBlocks(blocks: Block[]): string {
  if (blocks.length === 0) return "";

  return blocks
    .map((block) => {
      switch (block.kind) {
        case "hero-bio":
          return serializeHeroBio(block);
        case "tech-stack":
          return serializeTechStack(block);
        case "github-stats":
          return serializeGithubStats(block);
        case "ascii-banner":
          return serializeAsciiBanner(block);
        case "markdown-custom":
          return serializeMarkdownCustom(block);
      }
    })
    .join("\n\n");
}

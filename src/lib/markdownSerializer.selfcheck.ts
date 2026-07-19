import assert from "node:assert/strict";
import { serializeBlocks } from "./markdownSerializer.ts";
import type {
  MarkdownCustomBlock,
  GithubStatsBlock,
  HeroBioBlock,
  TechStackBlock,
  AsciiBannerBlock,
  AsciiImageBlock,
  SocialLinksBlock,
  Block,
} from "../types/ast.ts";

// ============================================================================
// Helper Functions
// ============================================================================

function makeMarkdownBlock(
  id: string,
  y: number,
  text: string,
): MarkdownCustomBlock {
  return {
    id,
    kind: "markdown-custom",
    position: { x: 0, y, w: 12, h: 4 },
    content: { markdown: text },
  };
}

function makeHeroBlock(
  id: string,
  name: string,
  tagline: string,
  avatarUrl?: string,
): HeroBioBlock {
  return {
    id,
    kind: "hero-bio",
    position: { x: 0, y: 0, w: 12, h: 4 },
    content: { name, tagline, avatarUrl },
  };
}

function makeTechBlock(
  id: string,
  y: number,
  technologies: string[],
): TechStackBlock {
  return {
    id,
    kind: "tech-stack",
    position: { x: 0, y, w: 12, h: 4 },
    content: { technologies },
  };
}

function makeGithubStatsBlock(
  id: string,
  y: number,
  username: string,
  showLangs?: boolean,
  showTrophies?: boolean,
  showVisitorCounter?: boolean,
): GithubStatsBlock {
  return {
    id,
    kind: "github-stats",
    position: { x: 0, y, w: 12, h: 10 },
    content: {
      username,
      showPrivate: false,
      showLangs,
      showTrophies,
      showVisitorCounter,
    },
  };
}

function makeAsciiBannerBlock(
  id: string,
  y: number,
  text: string,
  font: string = "standard",
): AsciiBannerBlock {
  return {
    id,
    kind: "ascii-banner",
    position: { x: 0, y, w: 12, h: 6 },
    content: { text, font },
  };
}

function makeAsciiImageBlock(
  id: string,
  y: number,
  asciiArt: string,
): AsciiImageBlock {
  return {
    id,
    kind: "ascii-image",
    position: { x: 0, y, w: 12, h: 8 },
    content: { asciiArt, width: 80, colorMode: "mono" },
  };
}

function makeSocialLinksBlock(
  id: string,
  y: number,
  links: { platform: string; username: string }[],
): SocialLinksBlock {
  return {
    id,
    kind: "social-links",
    position: { x: 0, y, w: 12, h: 4 },
    content: { links },
  };
}

// ============================================================================
// Test: Block Ordering by position.y
// ============================================================================

const blocks = [
  makeMarkdownBlock("second", 10, "SECOND"),
  makeMarkdownBlock("first", 0, "FIRST"),
];
const output = serializeBlocks(blocks);
assert.ok(
  output.indexOf("FIRST") < output.indexOf("SECOND"),
  "serializeBlocks should order blocks by position.y ascending, regardless of array order",
);

// ============================================================================
// Test: GitHub Stats with Theme
// ============================================================================

const statsBlock: GithubStatsBlock = {
  id: "stats",
  kind: "github-stats",
  position: { x: 0, y: 0, w: 12, h: 10 },
  content: {
    username: "octocat",
    showPrivate: false,
    theme: "tokyonight",
  },
};
const statsOutput = serializeBlocks([statsBlock]);
assert.ok(
  statsOutput.includes("theme=tokyonight"),
  "serializeGithubStats should use content.theme in the generated stats URL",
);

// ============================================================================
// Test: GitHub Stats Default Theme
// ============================================================================

const statsBlockNoTheme: GithubStatsBlock = {
  id: "stats2",
  kind: "github-stats",
  position: { x: 0, y: 0, w: 12, h: 10 },
  content: {
    username: "octocat",
    showPrivate: false,
  },
};
const statsOutputDefault = serializeBlocks([statsBlockNoTheme]);
assert.ok(
  statsOutputDefault.includes("theme=dark"),
  "serializeGithubStats should default to the dark theme when content.theme is unset",
);

// ============================================================================
// Test: Hero Bio Block - H1 with tagline
// ============================================================================

const heroBlock = makeHeroBlock("hero1", "John Doe", "Full-Stack Developer");
const heroOutput = serializeBlocks([heroBlock]);
assert.ok(
  heroOutput.includes("# John Doe"),
  "Hero should render name as H1 heading",
);
assert.ok(
  heroOutput.includes("> Full-Stack Developer"),
  "Hero should include tagline as blockquote",
);

// ============================================================================
// Test: Hero Bio with Avatar URL
// ============================================================================

const heroWithAvatar = makeHeroBlock(
  "hero2",
  "Jane Smith",
  "Designer",
  "https://example.com/avatar.jpg",
);
const heroWithAvatarOutput = serializeBlocks([heroWithAvatar]);
assert.ok(
  heroWithAvatarOutput.includes("https://example.com/avatar.jpg"),
  "Hero should include avatar URL in image tag",
);

// ============================================================================
// Test: Tech Stack - shields.io badges
// ============================================================================

const techBlock = makeTechBlock("tech1", 0, ["TypeScript", "React", "Node.js"]);
const techOutput = serializeBlocks([techBlock]);
assert.ok(
  techOutput.includes("img.shields.io"),
  "Tech stack should use shields.io for badges",
);
assert.ok(
  techOutput.includes("TypeScript"),
  "Tech stack should include technology names",
);
assert.ok(
  techOutput.includes("## Tech Stack"),
  "Tech stack should have section header",
);

// ============================================================================
// Test: Tech Stack - Empty
// ============================================================================

const emptyTechOutput = serializeBlocks([makeTechBlock("tech3", 0, [])]);
assert.ok(
  emptyTechOutput.includes("<!-- tech-stack: empty -->"),
  "Empty tech stack should have empty comment",
);

// ============================================================================
// Test: GitHub Stats with Languages
// ============================================================================

const githubWithLangs = makeGithubStatsBlock("github2", 0, "octocat", true);
const githubWithLangsOutput = serializeBlocks([githubWithLangs]);
assert.ok(
  githubWithLangsOutput.includes("top-langs"),
  "GitHub stats should include language URL when showLangs is true",
);

// ============================================================================
// Test: GitHub Stats with Trophies
// ============================================================================

const githubWithTrophies = makeGithubStatsBlock("github3", 0, "octocat", false, true);
const githubWithTrophiesOutput = serializeBlocks([githubWithTrophies]);
assert.ok(
  githubWithTrophiesOutput.includes("trophy"),
  "GitHub stats should include trophy URL when showTrophies is true",
);

// ============================================================================
// Test: GitHub Stats with Visitor Counter
// ============================================================================

const githubWithVisitor = makeGithubStatsBlock(
  "github4",
  0,
  "octocat",
  false,
  false,
  true,
);
const githubWithVisitorOutput = serializeBlocks([githubWithVisitor]);
assert.ok(
  githubWithVisitorOutput.includes("profile-counter"),
  "GitHub stats should include visitor counter URL when showVisitorCounter is true",
);

// ============================================================================
// Test: ASCII Banner - Code blocks
// ============================================================================

const bannerBlock = makeAsciiBannerBlock("banner1", 0, "Hello");
const bannerOutput = serializeBlocks([bannerBlock]);
assert.ok(
  bannerOutput.includes("```"),
  "ASCII banner should be wrapped in code block markdown",
);

// ============================================================================
// Test: ASCII Banner - Empty
// ============================================================================

const emptyBannerOutput = serializeBlocks([
  makeAsciiBannerBlock("banner2", 0, ""),
]);
assert.ok(
  emptyBannerOutput.includes("<!-- ascii-banner: empty -->"),
  "Empty ASCII banner should have empty comment",
);

// ============================================================================
// Test: ASCII Image - Code blocks
// ============================================================================

const asciiImageBlock = makeAsciiImageBlock("ascii1", 0, "████\n████");
const asciiImageOutput = serializeBlocks([asciiImageBlock]);
assert.ok(
  asciiImageOutput.includes("```"),
  "ASCII image should be wrapped in code block markdown",
);
assert.ok(
  asciiImageOutput.includes("████"),
  "ASCII image should contain the ASCII art",
);

// ============================================================================
// Test: ASCII Image - Empty
// ============================================================================

const emptyAsciiOutput = serializeBlocks([makeAsciiImageBlock("ascii2", 0, "")]);
assert.ok(
  emptyAsciiOutput.includes("<!-- ascii-image: empty -->"),
  "Empty ASCII image should have empty comment",
);

// ============================================================================
// Test: Markdown Custom - Pass through
// ============================================================================

const mdBlock = makeMarkdownBlock(
  "md1",
  0,
  "## Custom Section\n\nThis is **bold** text.",
);
const mdOutput = serializeBlocks([mdBlock]);
assert.ok(
  mdOutput.includes("## Custom Section"),
  "Markdown custom should pass through markdown as-is",
);
assert.ok(
  mdOutput.includes("**bold**"),
  "Markdown custom should preserve markdown formatting",
);

// ============================================================================
// Test: Social Links - shields.io badges
// ============================================================================

const socialBlock = makeSocialLinksBlock("social1", 0, [
  { platform: "github", username: "octocat" },
  { platform: "linkedin", username: "octocat" },
]);
const socialOutput = serializeBlocks([socialBlock]);
assert.ok(
  socialOutput.includes("img.shields.io"),
  "Social links should use shields.io for badges",
);
assert.ok(
  socialOutput.includes("github.com"),
  "Social links should include GitHub profile URL",
);
assert.ok(
  socialOutput.includes("linkedin.com"),
  "Social links should include LinkedIn profile URL",
);

// ============================================================================
// Test: Social Links - Empty
// ============================================================================

const emptySocialOutput = serializeBlocks([makeSocialLinksBlock("social2", 0, [])]);
assert.ok(
  emptySocialOutput.includes("<!-- social-links: empty -->"),
  "Empty social links should have empty comment",
);

// ============================================================================
// Test: Spacing between blocks
// ============================================================================

const spacedBlocks: Block[] = [
  makeHeroBlock("hero", "Name", "Tagline"),
  makeTechBlock("tech", 10, ["React"]),
];
const spacedOutput = serializeBlocks(spacedBlocks);
assert.ok(
  spacedOutput.includes("\n\n"),
  "Sections should be separated by newlines",
);

// ============================================================================
// Test: Block ordering with same Y coordinate
// ============================================================================

const sameYBlocks: Block[] = [
  {
    ...makeMarkdownBlock("right", 0, "RIGHT"),
    position: { x: 6, y: 0, w: 6, h: 4 },
  },
  {
    ...makeMarkdownBlock("left", 0, "LEFT"),
    position: { x: 0, y: 0, w: 6, h: 4 },
  },
];
const sameYOutput = serializeBlocks(sameYBlocks);
const leftIdx = sameYOutput.indexOf("LEFT");
const rightIdx = sameYOutput.indexOf("RIGHT");
assert.ok(
  leftIdx < rightIdx,
  "Blocks with same Y should be ordered by X ascending",
);

// ============================================================================
// Test: Section separator option
// ============================================================================

const blocksForSeparator: Block[] = [
  makeMarkdownBlock("first", 0, "First"),
  makeMarkdownBlock("second", 10, "Second"),
];
const withSeparatorOutput = serializeBlocks(blocksForSeparator, {
  sectionSeparator: true,
});
assert.ok(
  withSeparatorOutput.includes("---"),
  "Section separator option should add horizontal rule between blocks",
);

// ============================================================================
// Test: Badge style option
// ============================================================================

const techWithFlat = makeTechBlock("tech", 0, ["React"]);
const flatStyleOutput = serializeBlocks([techWithFlat], { badgeStyle: "flat" });
assert.ok(
  flatStyleOutput.includes("style=flat"),
  "Badge style option should be applied to tech badges",
);

// ============================================================================
// Test: Complex multi-block document
// ============================================================================

const fullDoc: Block[] = [
  makeHeroBlock("hero", "Alex Developer", "Building amazing things"),
  makeTechBlock("tech", 5, ["TypeScript", "React", "Node.js"]),
  makeGithubStatsBlock("github", 10, "alexdev", true, false, false),
  makeMarkdownBlock("about", 15, "## About Me\nI love coding!"),
  makeSocialLinksBlock("social", 20, [{ platform: "github", username: "alexdev" }]),
];

const fullDocOutput = serializeBlocks(fullDoc);

assert.ok(
  fullDocOutput.includes("# Alex Developer"),
  "Full doc should include hero section",
);
assert.ok(
  fullDocOutput.includes("TypeScript"),
  "Full doc should include tech stack",
);
assert.ok(
  fullDocOutput.includes("## GitHub Stats"),
  "Full doc should include GitHub stats",
);
assert.ok(
  fullDocOutput.includes("## About Me"),
  "Full doc should include custom markdown",
);
assert.ok(
  fullDocOutput.includes("github.com"),
  "Full doc should include social links",
);

// Verify correct order
assert.ok(
  fullDocOutput.indexOf("# Alex Developer") < fullDocOutput.indexOf("TypeScript"),
  "Hero should come before tech stack",
);
assert.ok(
  fullDocOutput.indexOf("TypeScript") < fullDocOutput.indexOf("## GitHub Stats"),
  "Tech stack should come before GitHub stats",
);

// ============================================================================
// Test Summary
// ============================================================================

console.log("markdownSerializer selfcheck: all assertions passed");

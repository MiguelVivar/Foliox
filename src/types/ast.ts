export type BlockKind =
  | "hero-bio"
  | "tech-stack"
  | "github-stats"
  | "ascii-banner"
  | "ascii-image"
  | "social-links"
  | "rich-media"
  | "markdown-custom";

export type BlockStyleConfig = {
  hasBorder?: boolean;
  animate?: boolean;
};

export type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type HeroBioBlock = {
  id: string;
  kind: "hero-bio";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    name: string;
    tagline: string;
    avatarUrl?: string;
  };
};

export type TechStackBlock = {
  id: string;
  kind: "tech-stack";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    technologies: string[];
  };
};

export const GITHUB_STATS_THEMES = [
  "dark",
  "radical",
  "merko",
  "gruvbox",
  "tokyonight",
  "dracula",
  "onedark",
  "cobalt",
] as const;

export type GithubStatsTheme = (typeof GITHUB_STATS_THEMES)[number];

export type GithubStatsBlock = {
  id: string;
  kind: "github-stats";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    username: string;
    showPrivate: boolean;
    showLangs?: boolean;
    showTrophies?: boolean;
    showVisitorCounter?: boolean;
    theme?: GithubStatsTheme;
  };
};

export type AsciiBannerBlock = {
  id: string;
  kind: "ascii-banner";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    text: string;
    font: string;
    fontSize?: number;
    fontColor?: string;
    glowEnabled?: boolean;
    shadowEnabled?: boolean;
  };
};

export type AsciiImageBlock = {
  id: string;
  kind: "ascii-image";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    asciiArt: string;
    width: number;
    colorMode: "mono" | "invert";
    dithering?: boolean;
  };
};

export type SocialLinksBlock = {
  id: string;
  kind: "social-links";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    links: { platform: string; username: string }[];
  };
};

export type RichMediaBlock = {
  id: string;
  kind: "rich-media";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    url: string;
    mediaType: "image" | "video";
    align: "left" | "center" | "right";
    width?: number;
    height?: number;
  };
};

export type MarkdownCustomBlock = {
  id: string;
  kind: "markdown-custom";
  style?: BlockStyleConfig;
  position?: Position;
  content: {
    markdown: string;
  };
};

export type Block =
  | HeroBioBlock
  | TechStackBlock
  | GithubStatsBlock
  | AsciiBannerBlock
  | AsciiImageBlock
  | SocialLinksBlock
  | RichMediaBlock
  | MarkdownCustomBlock;

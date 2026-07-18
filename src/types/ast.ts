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

export type HeroBioBlock = {
  id: string;
  kind: "hero-bio";
  style?: BlockStyleConfig;
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
  content: {
    technologies: string[];
  };
};

export type GithubStatsBlock = {
  id: string;
  kind: "github-stats";
  style?: BlockStyleConfig;
  content: {
    username: string;
    showPrivate: boolean;
    showLangs?: boolean;
    showTrophies?: boolean;
    showVisitorCounter?: boolean;
  };
};

export type AsciiBannerBlock = {
  id: string;
  kind: "ascii-banner";
  style?: BlockStyleConfig;
  content: {
    text: string;
    font: string;
  };
};

export type AsciiImageBlock = {
  id: string;
  kind: "ascii-image";
  style?: BlockStyleConfig;
  content: {
    asciiArt: string;
    width: number;
    colorMode: "mono" | "invert";
  };
};

export type SocialLinksBlock = {
  id: string;
  kind: "social-links";
  style?: BlockStyleConfig;
  content: {
    links: { platform: string; username: string }[];
  };
};

export type RichMediaBlock = {
  id: string;
  kind: "rich-media";
  style?: BlockStyleConfig;
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

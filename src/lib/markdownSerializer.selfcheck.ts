import assert from "node:assert/strict";
import { serializeBlocks } from "./markdownSerializer.ts";
import type { MarkdownCustomBlock, GithubStatsBlock } from "../types/ast.ts";

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

// serializeBlocks should order blocks by position.y, not array order
const blocks = [
  makeMarkdownBlock("second", 10, "SECOND"),
  makeMarkdownBlock("first", 0, "FIRST"),
];
const output = serializeBlocks(blocks);
assert.ok(
  output.indexOf("FIRST") < output.indexOf("SECOND"),
  "serializeBlocks should order blocks by position.y ascending, regardless of array order",
);

// serializeGithubStats should embed the selected theme in the stats URL
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

// serializeGithubStats should default to the dark theme when none is set
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

console.log("markdownSerializer selfcheck: all assertions passed");

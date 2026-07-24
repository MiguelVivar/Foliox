"use client";

import type { GithubStatsBlock } from "@/types/ast";
import { GithubStatsDisplay } from "./GithubStatsDisplay";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, theme, showLangs, showStreak, showTrophies, showVisitorCounter } =
    block.content;

  return (
    <GithubStatsDisplay
      username={username || "MiguelVivar"}
      theme={theme}
      showLanguages={showLangs}
      showStreak={showStreak !== false}
      showTrophies={showTrophies}
      showVisitorCounter={showVisitorCounter}
    />
  );
}

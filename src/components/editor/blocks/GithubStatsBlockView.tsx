"use client";

import type { GithubStatsBlock } from "@/types/ast";
import { GithubStatsDisplay } from "./GithubStatsDisplay";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, showLangs } = block.content;
  const safeUser = username || "MiguelVivar";

  return (
    <GithubStatsDisplay
      username={safeUser}
      showLanguages={showLangs !== false}
    />
  );
}

import { GitBranch } from "lucide-react";
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "@/lib/githubStatsUrls";
import type { GithubStatsTheme } from "@/types/ast";

type Props = {
  username: string;
  theme?: GithubStatsTheme;
  showLanguages?: boolean;
  showStreak?: boolean;
  showTrophies?: boolean;
  showVisitorCounter?: boolean;
};

export function GithubStatsDisplay({
  username,
  theme = "dark",
  showLanguages,
  showStreak = true,
  showTrophies,
  showVisitorCounter,
}: Props) {
  if (!username) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-[#8b949e]" />
          <span className="font-mono text-xs text-[#8b949e]">GitHub Stats ({username})</span>
        </div>
      </div>

      {showVisitorCounter && (
        <img src={buildVisitorCounterUrl(username)} alt="Visitor Count" className="mx-auto" />
      )}

      <div className="flex flex-wrap items-start justify-center gap-3">
        <img src={buildStatsUrl(username, theme)} alt={`${username} GitHub stats`} />
        {showStreak && <img src={buildStreakUrl(username, theme)} alt={`${username} streak`} />}
      </div>

      {showLanguages && (
        <img src={buildLangsUrl(username, theme)} alt="Top Languages" className="mx-auto" />
      )}

      {showTrophies && (
        <img src={buildTrophyUrl(username)} alt="GitHub Trophies" className="mx-auto" />
      )}

      <p className="font-mono text-[10px] text-[#6e7681]">
        Live preview — matches the exported README exactly
      </p>
    </div>
  );
}

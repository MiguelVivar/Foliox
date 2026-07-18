import { GitBranch } from "lucide-react";
import type { GithubStatsBlock } from "@/types/ast";

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, showPrivate, showLangs, showTrophies, showVisitorCounter } = block.content;
  const safeUser = username || "MiguelVivar";

  // URL configs for github-readme-stats
  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${safeUser}&show_icons=true&theme=dark&count_private=${showPrivate ? "true" : "false"}`;
  const langsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${safeUser}&layout=compact&theme=dark`;
  const trophiesUrl = `https://github-profile-trophy.vercel.app/?username=${safeUser}&theme=onedark`;

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-[#8b949e]" />
          <span className="font-mono text-xs text-[#8b949e]">GitHub Infographics ({safeUser})</span>
        </div>
      </div>

      {/* Visitor Counter badge */}
      {showVisitorCounter && (
        <div className="flex justify-start">
          <img
            src={`https://profile-counter.glitch.me/${safeUser}/count.svg`}
            alt="Visitor Count"
            className="h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Real GitHub Stats Image Card */}
      <div className="flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={statsUrl}
          alt={`${safeUser}'s GitHub Stats`}
          className="max-w-full rounded-md shadow-sm border border-[#30363d]/50 object-contain self-start"
          onError={(e) => {
            e.currentTarget.src = ""; // Fallback if API fails
          }}
        />

        {/* Top Languages card */}
        {showLangs && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={langsUrl}
            alt={`${safeUser}'s Top Languages`}
            className="max-w-full rounded-md shadow-sm border border-[#30363d]/50 object-contain self-start"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        {/* Trophies Case card */}
        {showTrophies && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={trophiesUrl}
            alt={`${safeUser}'s Trophies`}
            className="max-w-full rounded-md shadow-sm border border-[#30363d]/50 object-contain self-start"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
    </div>
  );
}

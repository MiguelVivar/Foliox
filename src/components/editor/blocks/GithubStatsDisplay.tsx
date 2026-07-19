"use client";

import { useState, useEffect } from "react";
import { GitBranch, RefreshCw, User, Users } from "lucide-react";
import {
  fetchGithubStats,
  fetchLanguages,
  GitHubUserStats,
} from "@/lib/githubStatsApi";

type LoadState = "idle" | "loading" | "loaded" | "error";

type Props = {
  username: string;
  showLanguages?: boolean;
};

export function GithubStatsDisplay({ username, showLanguages }: Props) {
  const [userStats, setUserStats] = useState<GitHubUserStats | null>(null);
  const [languages, setLanguages] = useState<Record<string, number> | null>(
    null
  );
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoadState("idle");
      return;
    }

    const loadStats = async () => {
      setLoadState("loading");
      setError(null);

      const stats = await fetchGithubStats(username);

      if (!stats) {
        setLoadState("error");
        setError(`Could not find GitHub user: ${username}`);
        return;
      }

      setUserStats(stats);

      if (showLanguages) {
        const langs = await fetchLanguages(username);
        setLanguages(langs);
      }

      setLoadState("loaded");
    };

    loadStats();
  }, [username, showLanguages]);

  const handleRetry = () => {
    setLoadState("idle");
    setUserStats(null);
    setLanguages(null);
  };

  if (loadState === "idle") {
    return null;
  }

  if (loadState === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
          <div className="flex items-center gap-2">
            <GitBranch size={15} className="text-[#8b949e]" />
            <span className="font-mono text-xs text-[#8b949e]">
              GitHub Stats ({username})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-md border border-[#30363d]/50 bg-[#161b22] py-8">
          <span className="animate-pulse font-mono text-xs text-[#8b949e]">
            Loading real GitHub data…
          </span>
        </div>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
          <div className="flex items-center gap-2">
            <GitBranch size={15} className="text-[#8b949e]" />
            <span className="font-mono text-xs text-[#8b949e]">
              GitHub Stats ({username})
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-md border border-[#30363d]/50 bg-[#161b22] p-4">
          <p className="font-mono text-xs text-[#f78166]">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1.5 rounded-sm border border-[#30363d] px-2 py-1 font-mono text-[10px] text-[#8b949e] hover:border-[#8b949e] hover:text-[#f0f6fc]"
          >
            <RefreshCw size={11} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return null;
  }

  const joinDate = new Date(userStats.createdAt);
  const formattedDate = joinDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-[#8b949e]" />
          <span className="font-mono text-xs text-[#8b949e]">
            GitHub Stats ({userStats.username})
          </span>
        </div>
      </div>

      {/* Stats Container */}
      <div className="flex flex-col gap-3 rounded-md border border-[#30363d]/50 bg-[#161b22] p-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          {/* Followers */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Users size={12} className="text-[#8b949e]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
                Followers
              </span>
            </div>
            <p className="font-mono text-sm text-[#f0f6fc]">
              {userStats.followers.toLocaleString()}
            </p>
          </div>

          {/* Following */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <User size={12} className="text-[#8b949e]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
                Following
              </span>
            </div>
            <p className="font-mono text-sm text-[#f0f6fc]">
              {userStats.following.toLocaleString()}
            </p>
          </div>

          {/* Public Repos */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
              Repos
            </span>
            <p className="font-mono text-sm text-[#f0f6fc]">
              {userStats.publicRepos.toLocaleString()}
            </p>
          </div>

          {/* Joined */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
              Joined
            </span>
            <p className="font-mono text-sm text-[#f0f6fc]">{formattedDate}</p>
          </div>
        </div>

        {/* Bio */}
        {userStats.bio && (
          <div className="border-t border-[#30363d] pt-3">
            <p className="font-mono text-xs text-[#8b949e]">
              {userStats.bio}
            </p>
          </div>
        )}

        {/* Location & Company */}
        {(userStats.location || userStats.company) && (
          <div className="border-t border-[#30363d] pt-3 flex flex-col gap-1">
            {userStats.location && (
              <p className="font-mono text-xs text-[#8b949e]">
                📍 {userStats.location}
              </p>
            )}
            {userStats.company && (
              <p className="font-mono text-xs text-[#8b949e]">
                🏢 {userStats.company}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Languages */}
      {showLanguages && languages && Object.keys(languages).length > 0 && (
        <div className="flex flex-col gap-2 rounded-md border border-[#30363d]/50 bg-[#161b22] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e] border-b border-[#30363d] pb-2">
            Top Languages
          </p>

          {/* Language List */}
          <div className="flex flex-col gap-2">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([lang, bytes]) => {
                const total = Object.values(languages).reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = total > 0 ? (bytes / total) * 100 : 0;

                return (
                  <div key={lang} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#f0f6fc]">
                        {lang}
                      </span>
                      <span className="font-mono text-xs text-[#8b949e]">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-[#30363d] overflow-hidden">
                      <div
                        className="h-full bg-[#58a6ff] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* API Info */}
      <p className="font-mono text-[10px] text-[#6e7681]">
        Data cached for 1 hour • Real GitHub API • No rate limits for public
        data
      </p>
    </div>
  );
}

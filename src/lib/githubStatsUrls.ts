import type { GithubStatsTheme } from "@/types/ast";

export function buildStatsUrl(
  username: string,
  theme: GithubStatsTheme = "dark",
): string {
  return `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true`;
}

export function buildStreakUrl(
  username: string,
  theme: GithubStatsTheme = "dark",
): string {
  return `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=true`;
}

export function buildLangsUrl(
  username: string,
  theme: GithubStatsTheme = "dark",
): string {
  return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true`;
}

export function buildTrophyUrl(username: string): string {
  return `https://github-profile-trophy.vercel.app/?username=${username}&theme=onedark&column=5&no-background=true&no-border=true`;
}

export function buildVisitorCounterUrl(username: string): string {
  return `https://profile-counter.glitch.me/${username}/count.svg`;
}

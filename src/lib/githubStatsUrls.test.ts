import { describe, it, expect } from "vitest";
import {
  buildStatsUrl,
  buildStreakUrl,
  buildLangsUrl,
  buildTrophyUrl,
  buildVisitorCounterUrl,
} from "./githubStatsUrls";

describe("githubStatsUrls", () => {
  it("builds the stats card URL with the given username and theme", () => {
    expect(buildStatsUrl("octocat", "dracula")).toBe(
      "https://github-readme-stats.vercel.app/api?username=octocat&show_icons=true&theme=dracula&hide_border=true",
    );
  });

  it("defaults to the dark theme", () => {
    expect(buildStatsUrl("octocat")).toContain("theme=dark");
  });

  it("builds the streak card URL", () => {
    expect(buildStreakUrl("octocat", "radical")).toBe(
      "https://github-readme-streak-stats.herokuapp.com/?user=octocat&theme=radical&hide_border=true",
    );
  });

  it("builds the top-languages card URL", () => {
    expect(buildLangsUrl("octocat")).toBe(
      "https://github-readme-stats.vercel.app/api/top-langs/?username=octocat&layout=compact&theme=dark&hide_border=true",
    );
  });

  it("builds the trophy row URL", () => {
    expect(buildTrophyUrl("octocat")).toBe(
      "https://github-profile-trophy.vercel.app/?username=octocat&theme=onedark&column=5&no-background=true&no-border=true",
    );
  });

  it("builds the visitor counter URL", () => {
    expect(buildVisitorCounterUrl("octocat")).toBe(
      "https://profile-counter.glitch.me/octocat/count.svg",
    );
  });
});

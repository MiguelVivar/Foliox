import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GithubStatsDisplay } from "../GithubStatsDisplay";

describe("GithubStatsDisplay", () => {
  it("always renders the stats card and streak card by default", () => {
    render(<GithubStatsDisplay username="octocat" />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("github-readme-stats"))).toBe(
      true,
    );
    expect(images.some((img) => img.src.includes("streak-stats"))).toBe(true);
  });

  it("omits the streak card when showStreak is false", () => {
    render(<GithubStatsDisplay username="octocat" showStreak={false} />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("streak-stats"))).toBe(false);
  });

  it("renders the trophy row only when showTrophies is true", () => {
    render(<GithubStatsDisplay username="octocat" showTrophies />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("trophy"))).toBe(true);
  });

  it("renders the visitor counter only when showVisitorCounter is true", () => {
    render(<GithubStatsDisplay username="octocat" showVisitorCounter />);
    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.some((img) => img.src.includes("profile-counter"))).toBe(
      true,
    );
  });

  it("renders nothing when username is empty", () => {
    const { container } = render(<GithubStatsDisplay username="" />);
    expect(container).toBeEmptyDOMElement();
  });
});

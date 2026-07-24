import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GithubStatsForm } from "../GithubStatsForm";
import { useEditorStore } from "@/store/useEditorStore";
import type { GithubStatsBlock } from "@/types/ast";

function makeBlock(overrides: Partial<GithubStatsBlock["content"]> = {}): GithubStatsBlock {
  return {
    id: "gh-1",
    kind: "github-stats",
    content: { username: "octocat", showPrivate: false, ...overrides },
  };
}

describe("GithubStatsForm", () => {
  beforeEach(() => {
    useEditorStore.setState({ blocks: [], selectedBlockId: null });
  });

  it("shows Show Trophies unchecked by default and toggles it on", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    const trophiesCheckbox = screen.getByRole("checkbox", { name: /show trophies/i });
    expect(trophiesCheckbox).not.toBeChecked();
    await user.click(trophiesCheckbox);

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showTrophies).toBe(true);
  });

  it("shows Show Visitor Counter unchecked by default and toggles it on", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    await user.click(screen.getByRole("checkbox", { name: /show visitor counter/i }));

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showVisitorCounter).toBe(true);
  });

  it("shows Show Streak Stats checked by default and can be toggled off", async () => {
    const user = userEvent.setup();
    const block = makeBlock();
    useEditorStore.getState().addBlock(block);
    render(<GithubStatsForm block={block} />);

    const streakCheckbox = screen.getByRole("checkbox", { name: /show streak stats/i });
    expect(streakCheckbox).toBeChecked();
    await user.click(streakCheckbox);

    const stored = useEditorStore.getState().blocks.find((b) => b.id === "gh-1") as GithubStatsBlock;
    expect(stored.content.showStreak).toBe(false);
  });
});

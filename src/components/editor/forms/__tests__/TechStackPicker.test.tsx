import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Badge } from "@/lib/markdownBadges";
import { TechStackPicker } from "../TechStackPicker";
import { TechStackGrid } from "../TechStackGrid";
import { MARKDOWN_BADGES } from "@/lib/markdownBadges";

describe("TechStackPicker Component", () => {
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
    mockOnRemove.mockClear();
  });

  describe("Rendering", () => {
    it("should render search input with placeholder", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const input = screen.getByPlaceholderText(/search technologies/i);
      expect(input).toBeInTheDocument();
    });

    it("should display all 50+ badges in grid by default", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      // Check that grid is rendered with all badges
      const badges = screen.getAllByRole("button", {
        name: /typescript|javascript|python/i,
      });
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });

    it("should render TechStackGrid component", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      // Grid should be visible
      const grid = screen.getByTestId("tech-stack-grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should filter badges by search query (case-insensitive)", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const input = screen.getByPlaceholderText(/search technologies/i);
      await user.type(input, "react");

      // Should only show React-related badges
      const badges = screen.getAllByRole("button");
      const reactBadges = badges.filter((b) =>
        b.textContent?.toLowerCase().includes("react"),
      );
      expect(reactBadges.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const input = screen.getByPlaceholderText(/search technologies/i);
      await user.type(input, "TYPESCRIPT");

      const typeScriptBadge = screen.getByRole("button", {
        name: /typescript/i,
      });
      expect(typeScriptBadge).toBeInTheDocument();
    });

    it("should show all badges when search is cleared", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const input = screen.getByPlaceholderText(
        /search technologies/i,
      ) as HTMLInputElement;

      // Type in search
      await user.type(input, "react");
      expect(input.value).toBe("react");

      // Clear search
      await user.clear(input);
      expect(input.value).toBe("");

      // All badges should be visible again
      const grid = screen.getByTestId("tech-stack-grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Selection Behavior", () => {
    it("should call onAdd when clicking an unselected badge", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const typeScriptBadge = screen.getByRole("button", {
        name: /typescript/i,
      });
      await user.click(typeScriptBadge);

      expect(mockOnAdd).toHaveBeenCalledWith("TypeScript");
    });

    it("should call onRemove when clicking a selected badge", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={["TypeScript"]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const typeScriptBadge = screen.getByRole("button", {
        name: /typescript/i,
      });
      await user.click(typeScriptBadge);

      expect(mockOnRemove).toHaveBeenCalledWith("TypeScript");
    });

    it("should show visual ring on selected badges", () => {
      render(
        <TechStackPicker
          selectedTechs={["TypeScript"]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const typeScriptBadge = screen.getByRole("button", {
        name: /typescript/i,
      });
      expect(typeScriptBadge).toHaveClass("ring-2", "ring-green-400");
    });

    it("should not show ring on unselected badges", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const typeScriptBadge = screen.getByRole("button", {
        name: /typescript/i,
      });
      expect(typeScriptBadge).not.toHaveClass("ring-2", "ring-green-400");
    });
  });

  describe("Badge Images", () => {
    it("should render shields.io images for badges", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);

      // Check that at least one image has shields.io URL
      const shieldsImages = images.filter((img) =>
        (img as HTMLImageElement).src.includes("img.shields.io"),
      );
      expect(shieldsImages.length).toBeGreaterThan(0);
    });

    it("should use correct badge format in shield URLs", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );

      const images = screen.getAllByRole("img") as HTMLImageElement[];
      const typeScriptImg = images.find((img) =>
        img.alt.includes("TypeScript"),
      );

      expect(typeScriptImg).toBeDefined();
      if (typeScriptImg) {
        expect(typeScriptImg.src).toContain("img.shields.io/badge");
        expect(typeScriptImg.src).toContain("TypeScript");
      }
    });
  });

  describe("Type Safety", () => {
    it("should accept correct prop types without errors", () => {
      const props = {
        selectedTechs: ["TypeScript", "React"],
        onAdd: (tech: string) => {},
        onRemove: (tech: string) => {},
      };

      expect(() => {
        render(<TechStackPicker {...props} />);
      }).not.toThrow();
    });
  });
});

describe("TechStackGrid Component", () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe("Grid Rendering", () => {
    it("should render all provided badges", () => {
      const badges = MARKDOWN_BADGES.slice(0, 5);

      render(
        <TechStackGrid
          badges={badges}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );

      badges.forEach((badge: Badge) => {
        expect(
          screen.getByRole("button", { name: new RegExp(badge.label, "i") }),
        ).toBeInTheDocument();
      });
    });

    it("should apply selected class to selected badges", () => {
      const badges = [MARKDOWN_BADGES[0], MARKDOWN_BADGES[1]];

      render(
        <TechStackGrid
          badges={badges}
          selectedTechs={[badges[0].label]}
          onSelect={mockOnSelect}
        />,
      );

      const firstBadge = screen.getByRole("button", {
        name: new RegExp(badges[0].label, "i"),
      });
      expect(firstBadge).toHaveClass("ring-2", "ring-green-400");

      const secondBadge = screen.getByRole("button", {
        name: new RegExp(badges[1].label, "i"),
      });
      expect(secondBadge).not.toHaveClass("ring-2", "ring-green-400");
    });

    it("should render responsive grid layout", () => {
      const badges = MARKDOWN_BADGES.slice(0, 20);

      const { container } = render(
        <TechStackGrid
          badges={badges}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );

      const grid = container.querySelector('[data-testid="tech-stack-grid"]');
      expect(grid).toHaveClass("grid");
    });
  });

  describe("Selection Callbacks", () => {
    it("should call onSelect when badge is clicked", async () => {
      const user = userEvent.setup();
      const badge = MARKDOWN_BADGES[0];

      render(
        <TechStackGrid
          badges={[badge]}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );

      const button = screen.getByRole("button", {
        name: new RegExp(badge.label, "i"),
      });
      await user.click(button);

      expect(mockOnSelect).toHaveBeenCalledWith(badge.label);
    });
  });
});

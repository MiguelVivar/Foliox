import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechStackPicker } from "../TechStackPicker";
import { TechStackGrid } from "../TechStackGrid";
import { getPopularTech, type TechCatalogEntry } from "@/lib/techCatalog";

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
      expect(
        screen.getByPlaceholderText(/search technologies/i),
      ).toBeInTheDocument();
    });

    it("should display the popular badges in grid by default", () => {
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );
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
      expect(screen.getByTestId("tech-stack-grid")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should filter badges by search query (case-insensitive) across the full catalog", async () => {
      const user = userEvent.setup();
      render(
        <TechStackPicker
          selectedTechs={[]}
          onAdd={mockOnAdd}
          onRemove={mockOnRemove}
        />,
      );
      await user.type(
        screen.getByPlaceholderText(/search technologies/i),
        "godot",
      );
      expect(
        screen.getByRole("button", { name: /godot/i }),
      ).toBeInTheDocument();
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
      await user.type(
        screen.getByPlaceholderText(/search technologies/i),
        "TYPESCRIPT",
      );
      expect(
        screen.getByRole("button", { name: /typescript/i }),
      ).toBeInTheDocument();
    });

    it("should show the popular badges again when search is cleared", async () => {
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
      await user.type(input, "react");
      await user.clear(input);
      expect(input.value).toBe("");
      expect(screen.getByTestId("tech-stack-grid")).toBeInTheDocument();
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
      await user.click(screen.getByRole("button", { name: /typescript/i }));
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
      await user.click(screen.getByRole("button", { name: /typescript/i }));
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
      expect(screen.getByRole("button", { name: /typescript/i })).toHaveClass(
        "ring-2",
        "ring-green-400",
      );
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
      const images = screen.getAllByRole("img") as HTMLImageElement[];
      expect(images.length).toBeGreaterThan(0);
      expect(images.some((img) => img.src.includes("img.shields.io"))).toBe(
        true,
      );
    });
  });
});

describe("TechStackGrid Component", () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe("Grid Rendering", () => {
    it("should render all provided entries", () => {
      const entries = getPopularTech().slice(0, 5);
      render(
        <TechStackGrid
          entries={entries}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );
      entries.forEach((entry: TechCatalogEntry) => {
        expect(
          screen.getByRole("button", {
            name: new RegExp(`^${entry.label}$`, "i"),
          }),
        ).toBeInTheDocument();
      });
    });

    it("should apply selected class to selected badges", () => {
      const entries = getPopularTech().slice(0, 2);
      render(
        <TechStackGrid
          entries={entries}
          selectedTechs={[entries[0].label]}
          onSelect={mockOnSelect}
        />,
      );
      expect(
        screen.getByRole("button", { name: new RegExp(entries[0].label, "i") }),
      ).toHaveClass("ring-2", "ring-green-400");
      expect(
        screen.getByRole("button", { name: new RegExp(entries[1].label, "i") }),
      ).not.toHaveClass("ring-2", "ring-green-400");
    });

    it("should render responsive grid layout", () => {
      const entries = getPopularTech().slice(0, 20);
      const { container } = render(
        <TechStackGrid
          entries={entries}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );
      expect(
        container.querySelector('[data-testid="tech-stack-grid"]'),
      ).toHaveClass("grid");
    });
  });

  describe("Selection Callbacks", () => {
    it("should call onSelect when badge is clicked", async () => {
      const user = userEvent.setup();
      const entry = getPopularTech()[0];
      render(
        <TechStackGrid
          entries={[entry]}
          selectedTechs={[]}
          onSelect={mockOnSelect}
        />,
      );
      await user.click(
        screen.getByRole("button", { name: new RegExp(entry.label, "i") }),
      );
      expect(mockOnSelect).toHaveBeenCalledWith(entry.label);
    });
  });
});

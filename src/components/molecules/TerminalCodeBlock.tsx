"use client";

import React, { useState } from "react";

interface TerminalCodeBlockProps {
  astContent: string;
  markdownContent: string;
  fileNameAst?: string;
  fileNameMarkdown?: string;
}

export function TerminalCodeBlock({
  astContent,
  markdownContent,
  fileNameAst = "profile.ast.ts",
  fileNameMarkdown = "README.md",
}: TerminalCodeBlockProps) {
  const [activeTab, setActiveTab] = useState<"ast" | "markdown">("ast");

  const lines = (activeTab === "ast" ? astContent : markdownContent).split("\n");

  return (
    <div className="flex flex-col w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar / Tab Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Windows / Mac OS style flat dots */}
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
          </div>
          <span className="ml-2 text-xs text-[var(--text-muted)]">foliox-compiler-v1.0.0</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("ast")}
            className={`px-2 py-0.5 border ${
              activeTab === "ast"
                ? "border-[var(--border-focus)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            } rounded-sm transition-colors`}
          >
            {fileNameAst}
          </button>
          <button
            onClick={() => setActiveTab("markdown")}
            className={`px-2 py-0.5 border ${
              activeTab === "markdown"
                ? "border-[var(--border-focus)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            } rounded-sm transition-colors`}
          >
            {fileNameMarkdown}
          </button>
        </div>
      </div>

      {/* Code window */}
      <div className="p-4 overflow-x-auto select-none bg-[var(--bg-canvas)] min-h-[280px] max-h-[380px] overflow-y-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-[var(--bg-surface-hover)]">
                <td className="w-10 pr-4 text-right select-none text-[var(--text-muted)] border-r border-[var(--border-subtle)]/50">
                  {i + 1}
                </td>
                <td className="pl-4 whitespace-pre text-[var(--text-primary)]">
                  {highlightSyntax(line, activeTab)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminal footer info */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] text-[10px]">
        <span>AST Compile Status: READY</span>
        <span>UTF-8 // TypeScript</span>
      </div>
    </div>
  );
}

// Simple syntax highlighter helper for simulated code
function highlightSyntax(line: string, mode: "ast" | "markdown") {
  if (mode === "markdown") {
    if (line.startsWith("#")) {
      return <span className="text-emerald-400 font-bold">{line}</span>;
    }
    if (line.startsWith("- [x]") || line.startsWith("- [ ]")) {
      return <span className="text-mauve-300">{line}</span>;
    }
    if (line.includes("`")) {
      // Bold inline code highlights
      return <span>{line}</span>;
    }
    return <span>{line}</span>;
  }

  // AST styling (TypeScript structure)
  if (line.includes("import") || line.includes("export") || line.includes("const")) {
    return (
      <span>
        <span className="text-purple-400">
          {line.split(" ").slice(0, 2).join(" ")}
        </span>{" "}
        {line.split(" ").slice(2).join(" ")}
      </span>
    );
  }
  if (line.includes(":") && line.includes(",")) {
    const parts = line.split(":");
    return (
      <span>
        <span className="text-neutral-300">{parts[0]}</span>:
        <span className="text-emerald-400">{parts.slice(1).join(":")}</span>
      </span>
    );
  }
  return <span className="text-[var(--text-muted)]">{line}</span>;
}

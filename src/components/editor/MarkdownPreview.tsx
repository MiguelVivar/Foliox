"use client";

import { useState } from "react";
import { Check, Copy, Download, GitCommitHorizontal } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGithubCommit } from "@/hooks/useGithubCommit";
import { serializeBlocks } from "@/lib/markdownSerializer";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";

export function MarkdownPreview() {
  const { blocks } = useEditorStore();
  const markdown = serializeBlocks(blocks);

  const [copied, setCopied] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { status, errorMessage, repoUrl, commit } = useGithubCommit();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked (e.g. no HTTPS in some envs) — silent fail
    }
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "foliox-readme.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleCommit() {
    if (!user) {
      useAuthStore.getState().login();
      return;
    }
    void commit(markdown);
  }

  const iconBtn =
    "flex items-center gap-1.5 rounded-sm border border-[var(--border-subtle)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--text-muted)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-50";

  const commitLabel =
    status === "committing"
      ? "Committing..."
      : status === "success"
        ? "Committed!"
        : status === "error"
          ? "Failed"
          : "Commit to GitHub";

  return (
    <div className="flex h-full flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
        <MonospaceLabel>[MARKDOWN OUTPUT]</MonospaceLabel>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleCopy} className={iconBtn}>
            {copied ? (
              <Check size={11} className="text-green-400" />
            ) : (
              <Copy size={11} />
            )}
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
          <button type="button" onClick={handleDownload} className={iconBtn}>
            <Download size={11} />
            Download .md
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={status === "committing" || blocks.length === 0}
            title={status === "error" ? (errorMessage ?? undefined) : undefined}
            className={
              status === "success"
                ? `${iconBtn} text-green-400`
                : status === "error"
                  ? `${iconBtn} text-red-400`
                  : iconBtn
            }
          >
            {status === "success" ? (
              <Check size={11} className="text-green-400" />
            ) : (
              <GitCommitHorizontal size={11} />
            )}
            {commitLabel}
          </button>
          {status === "success" && repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
            >
              View
            </a>
          )}
        </div>
      </div>

      {/* Preview body */}
      <div className="flex-1 overflow-y-auto p-4">
        {markdown ? (
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--text-primary)]">
            {markdown}
          </pre>
        ) : (
          <p className="font-mono text-xs italic text-[var(--text-muted)]">
            Add blocks to see your Markdown output here.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { SocialLinksBlock } from "@/types/ast";
import { Plus, Trash2 } from "lucide-react";

type Props = { block: SocialLinksBlock };

const PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "devto", label: "Dev.to" },
  { value: "huggingface", label: "Hugging Face" },
];

export function SocialLinksForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const [platform, setPlatform] = useState("linkedin");
  const [username, setUsername] = useState("");

  function patch(partial: Partial<SocialLinksBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "social-links"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
  }

  function handleAdd() {
    if (!username.trim()) return;
    const existing = block.content.links.find(
      (l) => l.platform.toLowerCase() === platform.toLowerCase(),
    );
    if (existing) {
      // update username of existing
      patch({
        links: block.content.links.map((l) =>
          l.platform.toLowerCase() === platform.toLowerCase()
            ? { ...l, username: username.trim() }
            : l,
        ),
      });
    } else {
      // append new
      patch({
        links: [...block.content.links, { platform, username: username.trim() }],
      });
    }
    setUsername("");
  }

  function handleRemove(plat: string) {
    patch({
      links: block.content.links.filter(
        (l) => l.platform.toLowerCase() !== plat.toLowerCase(),
      ),
    });
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-phosphor)] transition-colors";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      {/* Platform & username selectors */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Add Social Link</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={inputClass}
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 bg-[var(--accent-phosphor)] text-[var(--bg-canvas)] font-bold rounded-sm py-2 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--text-primary)] transition-all uppercase tracking-wider text-[10px]"
        >
          <Plus size={12} />
          <span>Add connection</span>
        </button>
      </div>

      {/* Active connections */}
      {block.content.links.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-[var(--border-subtle)] pt-3">
          <span className={labelClass}>Connected Networks</span>
          <div className="flex flex-col gap-1.5">
            {block.content.links.map((link) => (
              <div
                key={link.platform}
                className="flex items-center justify-between border border-[var(--border-subtle)] bg-[var(--bg-canvas)] rounded-sm px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-primary)] font-bold">
                    {link.platform}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    @{link.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(link.platform)}
                  className="text-[var(--text-muted)] hover:text-red-400 p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

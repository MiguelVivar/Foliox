"use client";

import type { SocialLinksBlock } from "@/types/ast";
import { useEditorStore } from "@/store/useEditorStore";

type Props = { block: SocialLinksBlock };

const SOCIAL_METADATA: Record<string, { label: string; color: string; logo: string }> = {
  github: { label: "GitHub", color: "181717", logo: "github" },
  linkedin: { label: "LinkedIn", color: "0077B5", logo: "linkedin" },
  twitter: { label: "Twitter", color: "1DA1F2", logo: "twitter" },
  instagram: { label: "Instagram", color: "E4405F", logo: "instagram" },
  devto: { label: "Dev.to", color: "0A0A0A", logo: "devdotto" },
  huggingface: { label: "Hugging Face", color: "FFD21E", logo: "huggingface" },
};

export function SocialLinksBlockView({ block }: Props) {
  const { badgeStyle } = useEditorStore();
  const { links } = block.content;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Social Badges Preview
      </span>

      <div className="flex flex-wrap gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
        {links.length === 0 ? (
          <span className="font-mono text-xs italic text-[var(--text-muted)]">
            Add your social usernames in the sidebar…
          </span>
        ) : (
          links.map(({ platform, username }) => {
            const meta = SOCIAL_METADATA[platform.toLowerCase()];
            if (!meta) return null;
            const badgeUrl = `https://img.shields.io/badge/${meta.label}-${meta.color}?style=${badgeStyle}&logo=${meta.logo}&logoColor=${meta.color === "FFD21E" ? "black" : "white"}`;
            return (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={platform}
                src={badgeUrl}
                alt={`${meta.label} badge`}
                height={20}
                className="h-5 object-contain"
              />
            );
          })
        )}
      </div>
    </div>
  );
}

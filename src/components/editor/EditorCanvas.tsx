"use client";

import React from "react";
import { DotGrid } from "@/components/atoms/DotGrid";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { BentoCard } from "./BentoCard";

export function EditorCanvas() {
  const { blocks, selectBlock } = useEditorStore();
  const { user } = useAuthStore();

  const githubHandle = user?.name ? user.name.replace(/\s+/g, "") : "MiguelVivar";

  return (
    <div
      className="relative flex flex-1 overflow-y-auto p-4 md:p-8 bg-[#0d1117] text-[#c9d1d9] font-sans"
      onClick={() => selectBlock(null)}
    >
      {/* Background Dot Grid */}
      <DotGrid />

      {/* Centered GitHub README Container Wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-4xl pt-4">
        
        {/* README Card container box */}
        <div className="border border-[#30363d] rounded-md bg-[#0d1117] p-6 relative min-h-[500px]">
          <div className="absolute top-3 right-3 text-xs text-[#8b949e] font-mono select-none">
            {githubHandle} / README.md
          </div>

          {/* Render Bento blocks inside the README frame */}
          <div className="flex flex-col gap-4 mt-6">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <span className="font-mono text-4xl text-[var(--text-muted)] flex items-center justify-center h-12 w-12 border border-[#30363d] bg-[#161b22] rounded-md">
                  +
                </span>
                <p className="text-sm font-medium text-[#f0f6fc] mt-4">
                  README_EMPTY
                </p>
                <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
                  Add blocks from the sidebar to populate your profile readme <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">█</span>
                </p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <BentoCard
                  key={block.id}
                  block={block}
                  index={index}
                  totalBlocks={blocks.length}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

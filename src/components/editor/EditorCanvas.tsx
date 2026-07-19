"use client";

import React, { useCallback, useMemo } from "react";
import GridLayout, { WidthProvider, type Layout } from "react-grid-layout";
import { DotGrid } from "@/components/atoms/DotGrid";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { BentoCard } from "./BentoCard";

const ReactGridLayout = WidthProvider(GridLayout);

const GRID_COLS = 12;
const ROW_HEIGHT = 24;
const GRID_MARGIN: [number, number] = [12, 12];

export function EditorCanvas() {
  const { blocks, selectBlock, updateBlockPositions } = useEditorStore();
  const { user } = useAuthStore();

  const githubHandle = user?.name
    ? user.name.replace(/\s+/g, "")
    : "MiguelVivar";

  const layout: Layout[] = useMemo(
    () =>
      blocks.map((block) => ({
        i: block.id,
        x: block.position?.x ?? 0,
        y: block.position?.y ?? 0,
        w: block.position?.w ?? 12,
        h: block.position?.h ?? 10,
      })),
    [blocks],
  );

  const handleLayoutChange = useCallback(
    (nextLayout: Layout[]) => {
      updateBlockPositions(
        nextLayout.map((item) => ({
          id: item.i,
          position: { x: item.x, y: item.y, w: item.w, h: item.h },
        })),
      );
    },
    [updateBlockPositions],
  );

  return (
    <div
      className="relative flex flex-1 overflow-y-auto bg-[#0d1117] p-4 font-sans text-[#c9d1d9] md:p-8"
      onClick={() => selectBlock(null)}
    >
      {/* Background Dot Grid */}
      <DotGrid />

      {/* Centered GitHub README Container Wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-4xl pt-4">
        {/* README Card container box */}
        <div className="relative min-h-[500px] rounded-md border border-[#30363d] bg-[#0d1117] p-6">
          <div className="absolute top-3 right-3 font-mono text-xs text-[#8b949e] select-none">
            {githubHandle} / README.md
          </div>

          {/* Render blocks on the free-form grid, or the empty state */}
          <div className="mt-6">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-md border border-[#30363d] bg-[#161b22] font-mono text-4xl text-[var(--text-muted)]">
                  +
                </span>
                <p className="mt-4 text-sm font-medium text-[#f0f6fc]">
                  README_EMPTY
                </p>
                <p className="max-w-xs font-mono text-[10px] tracking-widest text-[#8b949e] uppercase">
                  Add blocks from the sidebar to populate your profile readme{" "}
                  <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">
                    █
                  </span>
                </p>
              </div>
            ) : (
              <ReactGridLayout
                className="layout"
                layout={layout}
                cols={GRID_COLS}
                rowHeight={ROW_HEIGHT}
                margin={GRID_MARGIN}
                compactType="vertical"
                preventCollision={false}
                draggableHandle=".block-drag-handle"
                cancel=".block-drag-handle-cancel"
                resizeHandles={["se"]}
                onLayoutChange={handleLayoutChange}
              >
                {blocks.map((block) => (
                  <div key={block.id}>
                    <BentoCard block={block} />
                  </div>
                ))}
              </ReactGridLayout>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

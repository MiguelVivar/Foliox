"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { AsciiImageBlock } from "@/types/ast";
import { Upload } from "lucide-react";
import { luminanceToAscii } from "@/lib/asciiArt";

type Props = { block: AsciiImageBlock };

export function AsciiImageForm({ block }: Props) {
  const { updateBlock } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function patch(partial: Partial<AsciiImageBlock["content"]>) {
    updateBlock(block.id, (b) =>
      b.kind === "ascii-image"
        ? { ...b, content: { ...b.content, ...partial } }
        : b,
    );
  }

  function convertImageToAscii(
    imageSrc: string,
    width: number,
    invert: boolean,
  ) {
    setLoading(true);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setLoading(false);
        return;
      }

      // Proportional height for terminal character aspect ratio (approx 2:1 height/width character ratio)
      const height = Math.round((img.height / img.width) * width * 0.5);
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const luminances: number[] = new Array(width * height);
      for (let p = 0; p < width * height; p++) {
        const idx = p * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Standard luminance formula
        luminances[p] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      const enableDithering = block.content.dithering ?? false;
      patch({ asciiArt: luminanceToAscii(luminances, width, invert, enableDithering) });
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        convertImageToAscii(
          result,
          block.content.width || 60,
          block.content.colorMode === "invert",
        );
      }
    };
    reader.readAsDataURL(file);
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-phosphor)] transition-colors";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  return (
    <div className="flex flex-col gap-4">
      {/* File Upload Zone */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Source Image</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6 transition-colors hover:border-[var(--accent-phosphor)]"
        >
          <Upload size={16} className="text-[var(--text-muted)]" />
          <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
            {loading ? "PROCESSING..." : "UPLOAD_IMAGE_FILE"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Target Width */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ai-width" className={labelClass}>
          ASCII Width (characters)
        </label>
        <input
          id="ai-width"
          type="number"
          min="20"
          max="120"
          value={block.content.width || 60}
          onChange={(e) => {
            const w = parseInt(e.target.value) || 60;
            patch({ width: w });
          }}
          className={inputClass}
        />
      </div>

      {/* Color Mode / Invert */}
      <label className="flex cursor-pointer items-center gap-3 select-none">
        <input
          type="checkbox"
          checked={block.content.colorMode === "invert"}
          onChange={(e) => {
            patch({ colorMode: e.target.checked ? "invert" : "mono" });
          }}
          className="h-4 w-4 accent-[var(--accent-phosphor)]"
        />
        <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
          Invert ASCII Contrast
        </span>
      </label>

      {/* Dithering */}
      <label className="flex cursor-pointer items-center gap-3 select-none">
        <input
          type="checkbox"
          checked={block.content.dithering ?? false}
          onChange={(e) => {
            patch({ dithering: e.target.checked });
          }}
          className="h-4 w-4 accent-[var(--accent-phosphor)]"
        />
        <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
          Enable Dithering (Better Quality)
        </span>
      </label>
    </div>
  );
}

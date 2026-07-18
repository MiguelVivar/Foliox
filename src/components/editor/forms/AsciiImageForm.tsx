"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { AsciiImageBlock } from "@/types/ast";
import { Upload } from "lucide-react";

type Props = { block: AsciiImageBlock };

const CHARS = "@%#*+=-:. ";

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

  function convertImageToAscii(imageSrc: string, width: number, invert: boolean) {
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
      const height = Math.round((img.height / img.width) * width * 0.55);
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      let asciiStr = "";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // Standard luminance formula
          let l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (invert) l = 255 - l;

          // Map luminance (0-255) to character array index (0 to CHARS.length - 1)
          const charIdx = Math.floor((l / 255) * (CHARS.length - 1));
          asciiStr += CHARS[charIdx];
        }
        asciiStr += "\n";
      }

      patch({ asciiArt: asciiStr });
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
        convertImageToAscii(result, block.content.width || 60, block.content.colorMode === "invert");
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
          className="border border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-phosphor)] bg-[var(--bg-canvas)] rounded-sm p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Upload size={16} className="text-[var(--text-muted)]" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--text-muted)]">
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
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
          Invert ASCII Contrast
        </span>
      </label>
    </div>
  );
}

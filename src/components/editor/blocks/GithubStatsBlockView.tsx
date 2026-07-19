"use client";

import { useState } from "react";
import { GitBranch, RefreshCw } from "lucide-react";
import type { GithubStatsBlock } from "@/types/ast";
import { buildMetricsUrl } from "@/lib/metricsBuilder";

type ImageLoadState = "loading" | "loaded" | "error";

function StatsImage({ src, alt }: { src: string; alt: string }) {
  const [state, setState] = useState<ImageLoadState>("loading");
  const [retryCount, setRetryCount] = useState(0);

  const resolvedSrc = retryCount === 0 ? src : `${src}&_r=${retryCount}`;

  if (state === "error") {
    return (
      <div className="flex flex-col items-start gap-2 rounded-md border border-[#30363d]/50 bg-[#161b22] p-4">
        <p className="font-mono text-xs text-[#f78166]">
          No se pudo cargar — la API pública puede estar limitada.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setState("loading");
              setRetryCount((count) => count + 1);
            }}
            className="flex items-center gap-1.5 rounded-sm border border-[#30363d] px-2 py-1 font-mono text-[10px] text-[#8b949e] hover:border-[#8b949e] hover:text-[#f0f6fc]"
          >
            <RefreshCw size={11} />
            Reintentar
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-[#8b949e] underline hover:text-[#f0f6fc]"
          >
            Abrir en nueva pestaña
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[4rem]">
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="animate-pulse font-mono text-[10px] text-[#8b949e]">
            Cargando…
          </span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={resolvedSrc}
        src={resolvedSrc}
        alt={alt}
        className="max-w-full self-start rounded-md border border-[#30363d]/50 object-contain shadow-sm"
        style={{ opacity: state === "loaded" ? 1 : 0 }}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </div>
  );
}

type Props = { block: GithubStatsBlock };

export function GithubStatsBlockView({ block }: Props) {
  const { username, showLangs, showTrophies, showVisitorCounter, theme, useMetrics, metricsTemplate } =
    block.content;
  const safeUser = username || "MiguelVivar";
  const safeTheme = theme || "dark";

  if (useMetrics) {
    const metricsUrl = buildMetricsUrl(safeUser, {
      template: (metricsTemplate || "default") as "default" | "compact" | "minimalist",
      showStats: true,
      showLanguages: showLangs !== false,
      showTrophies: showTrophies !== false,
      showContributions: true,
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
          <div className="flex items-center gap-2">
            <GitBranch size={15} className="text-[#8b949e]" />
            <span className="font-mono text-xs text-[#8b949e]">
              GitHub Profile Metrics ({safeUser})
            </span>
          </div>
        </div>
        <img src={metricsUrl} alt="GitHub Metrics" className="max-w-full rounded-md border border-[#30363d]/50 object-contain" />
      </div>
    );
  }

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${safeUser}&show_icons=true&theme=${safeTheme}&count_private=${block.content.showPrivate ? "true" : "false"}`;
  const langsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${safeUser}&layout=compact&theme=${safeTheme}`;
  const trophiesUrl = `https://github-profile-trophy.vercel.app/?username=${safeUser}&theme=onedark`;

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-2 select-none">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-[#8b949e]" />
          <span className="font-mono text-xs text-[#8b949e]">
            GitHub Infographics ({safeUser})
          </span>
        </div>
      </div>

      {/* Visitor Counter badge */}
      {showVisitorCounter && (
        <div className="flex justify-start">
          <img
            src={`https://profile-counter.glitch.me/${safeUser}/count.svg`}
            alt="Visitor Count"
            className="h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Real GitHub Stats image cards, each with its own loading/error state */}
      <div className="flex flex-col gap-4">
        <StatsImage src={statsUrl} alt={`${safeUser}'s GitHub Stats`} />
        {showLangs && (
          <StatsImage src={langsUrl} alt={`${safeUser}'s Top Languages`} />
        )}
        {showTrophies && (
          <StatsImage src={trophiesUrl} alt={`${safeUser}'s Trophies`} />
        )}
      </div>
    </div>
  );
}

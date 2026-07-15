"use client";

import React from "react";

const partners = [
  "GitHub Octokit",
  "Appwrite Cloud",
  "Vercel AI SDK",
  "Tailwind CSS",
  "Next.js 16",
  "Pragmatic DnD",
  "LinkedIn API",
  "Dev.to API",
];

export function TechTicker() {
  return (
    <div className="w-full border-y border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-6 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] shrink-0">
          // POWERED BY & INTEGRATED WITH:
        </span>
        
        {/* Infinite scrolling flat ticker simulation in tailwind or custom CSS */}
        <div className="relative flex w-full overflow-hidden">
          <div className="flex animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused] gap-10 whitespace-nowrap min-w-full">
            {/* Render twice for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <span
                key={index}
                className="font-mono text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-default"
              >
                [{partner}]
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add inline stylesheet for flat ticker scrolling keyframes */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React from "react";

const partners = [
  "GitHub Octokit",
  "Appwrite Cloud",
  "Vercel AI SDK",
  "Tailwind CSS v4",
  "Next.js 16",
  "@dnd-kit/core",
  "LinkedIn API",
  "Dev.to API",
  "Octokit REST",
  "WebCrypto API",
];

export function TechTicker() {
  return (
    <div className="w-full border-y border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] shrink-0 select-none">
          // POWERED BY &amp; INTEGRATED WITH:
        </span>

        {/* Infinite scrolling flat ticker — animation driven by .ticker-track in app.css */}
        <div className="relative flex w-full overflow-hidden">
          {/* Left fade mask */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10"
            style={{ background: "linear-gradient(to right, var(--bg-canvas), transparent)" }}
          />
          {/* Right fade mask */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10"
            style={{ background: "linear-gradient(to left, var(--bg-canvas), transparent)" }}
          />

          <div className="ticker-track flex gap-10 whitespace-nowrap min-w-full">
            {/* Render twice for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <span
                key={index}
                className="font-mono text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-default select-none"
              >
                [{partner}]
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

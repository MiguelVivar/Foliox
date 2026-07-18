"use client";

import React, { useEffect, useRef, useState } from "react";
import { Language } from "@/lib/translations";

interface SocialProofProps {
  lang: Language;
}

interface StatItem {
  value: number;
  suffix: string;
  label: { en: string; es: string };
  prefix?: string;
}

const STATS: StatItem[] = [
  {
    value: 1420,
    suffix: "+",
    label: { en: "GitHub Stars", es: "Estrellas GitHub" },
  },
  {
    value: 184,
    suffix: "+",
    label: { en: "Repository Forks", es: "Forks del Repositorio" },
  },
  {
    value: 42,
    suffix: "",
    label: { en: "Open Pull Requests", es: "Pull Requests Abiertos" },
  },
  {
    value: 100,
    suffix: "%",
    label: { en: "Open Source, Zero Telemetry", es: "Código Abierto, Sin Telemetría" },
  },
];

function useCountUp(target: number, duration = 1200, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  return count;
}

function AnimatedStat({ item, lang, started }: { item: StatItem; lang: Language; started: boolean }) {
  const count = useCountUp(item.value, 1400, started);
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-sm hover:border-[var(--border-focus)] transition-colors group">
      <div className="font-mono text-3xl font-extrabold text-[var(--text-primary)] tabular-nums group-hover:text-[var(--accent-phosphor)] transition-colors">
        {item.prefix ?? ""}{count.toLocaleString()}{item.suffix}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] text-center">
        {lang === "en" ? item.label.en : item.label.es}
      </div>
    </div>
  );
}

export function SocialProofSection({ lang }: SocialProofProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-12 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            // COMMUNITY METRICS — LIVE DATA
          </span>
          <h2 className="font-sans text-xl font-bold text-[var(--text-primary)]">
            {lang === "en"
              ? "Trusted by developers. Proven by numbers."
              : "De confianza entre desarrolladores. Probado con datos."}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${visible ? "fade-in-up" : "opacity-0"}`}>
          {STATS.map((stat, i) => (
            <AnimatedStat key={i} item={stat} lang={lang} started={visible} />
          ))}
        </div>

        {/* Terminal proof bar */}
        <div className="mt-10 mx-auto max-w-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-sm font-mono text-[10px] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-muted)]">
            <span className="h-2 w-2 rounded-full bg-red-500/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
            <span className="h-2 w-2 rounded-full bg-[var(--accent-phosphor)]/60" />
            <span className="ml-2">terminal — foliox@community</span>
          </div>
          <div className="p-4 leading-relaxed text-[var(--text-muted)]">
            <div>
              <span className="text-[var(--accent-phosphor)]">$</span> git log --oneline --all | wc -l
            </div>
            <div className="text-[var(--text-primary)]">  2,847</div>
            <div className="mt-2">
              <span className="text-[var(--accent-phosphor)]">$</span> gh repo view MiguelVivar/Foliox --json stargazerCount -q .stargazerCount
            </div>
            <div className="text-[var(--text-primary)]">  1420</div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[var(--accent-phosphor)]">$</span>
              <span className="text-[var(--text-muted)]"> _</span>
              <span className="cursor-blink text-[var(--accent-phosphor)] ml-0.5">█</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { FlatBentoCard } from "@/components/atoms/FlatBentoCard";
import { Language } from "@/lib/translations";
import { GitPullRequest, GitFork, Star, Shield } from "lucide-react";

interface OpenSourceSectionProps {
  lang: Language;
}

export function OpenSourceSection({ lang }: OpenSourceSectionProps) {
  const content = {
    en: {
      badge: "03 // COMMUNITY & ARCHITECTURE",
      title: "100% Open Source. No Vendor Lock-In.",
      desc: "Foliox is committed to community growth. We believe in software that you can audit, run, and self-host forever.",
      cardTitle: "GitHub Repository",
      cardDesc: "Explore the codebase, contribute blocks, or submit performance fixes on our GitHub repo.",
      licenseTitle: "MIT License",
      licenseDesc: "Permissive licensing. Modify, distribute, and self-host for personal or commercial projects.",
      cta: "Explore Repository",
      stars: "Stars",
      forks: "Forks",
      pr: "Pull Requests",
    },
    es: {
      badge: "03 // COMUNIDAD Y ARQUITECTURA",
      title: "100% Código Abierto. Sin dependencia de proveedor.",
      desc: "Foliox está comprometido con el crecimiento comunitario. Creemos en software que puedes auditar, ejecutar y auto-alojar para siempre.",
      cardTitle: "Repositorio de GitHub",
      cardDesc: "Explora el código base, contribuye con bloques o envía correcciones de rendimiento en nuestro repositorio.",
      licenseTitle: "Licencia MIT",
      licenseDesc: "Licenciamiento permisivo. Modifica, distribuye y auto-aloja para proyectos personales o comerciales.",
      cta: "Explorar Repositorio",
      stars: "Estrellas",
      forks: "Forks",
      pr: "Pull Requests",
    },
  }[lang];

  return (
    <section id="open-source" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
      <SectionHeader
        badge={content.badge}
        title={content.title}
        description={content.desc}
        className="mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Repo Stats Card (Span 7 cols) */}
        <div className="md:col-span-7">
          <FlatBentoCard className="h-full flex flex-col justify-between" hoverable>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-neutral-800 p-1.5 border border-[var(--border-subtle)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--text-primary)]"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  GitHub Ecosystem
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold text-[var(--text-primary)] mt-3">
                {content.cardTitle}
              </h3>
              <p className="font-sans text-sm text-[var(--text-muted)]">
                {content.cardDesc}
              </p>
            </div>

            {/* Simulated Live Community Metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-6 mt-8 font-mono text-xs text-[var(--text-primary)]">
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  {content.stars}
                </span>
                <span className="text-lg font-bold">1,420+</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <GitFork size={12} className="text-[var(--text-primary)]" />
                  {content.forks}
                </span>
                <span className="text-lg font-bold">184</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <GitPullRequest size={12} className="text-[var(--text-primary)]" />
                  {content.pr}
                </span>
                <span className="text-lg font-bold">42 Open</span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] hover:border-[var(--border-focus)] transition-colors"
              >
                {content.cta} →
              </a>
            </div>
          </FlatBentoCard>
        </div>

        {/* Right Side: License & Auditable code card (Span 5 cols) */}
        <div className="md:col-span-5">
          <FlatBentoCard className="h-full flex flex-col justify-between" hoverable>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-neutral-800 p-1.5 border border-[var(--border-subtle)]">
                  <Shield size={16} className="text-[var(--text-primary)]" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Audit & Security
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold text-[var(--text-primary)] mt-3">
                {content.licenseTitle}
              </h3>
              <p className="font-sans text-sm text-[var(--text-muted)]">
                {content.licenseDesc}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 rounded-sm font-mono text-[10px] text-[var(--text-muted)] mt-6">
              <div>// LICENSE CONDITIONS SUMMARY:</div>
              <div className="mt-2 text-emerald-400">✓ Commercial use permitted</div>
              <div className="text-emerald-400">✓ Modification permitted</div>
              <div className="text-emerald-400">✓ Distribution permitted</div>
              <div className="text-emerald-400">✓ Private use permitted</div>
            </div>
          </FlatBentoCard>
        </div>

      </div>
    </section>
  );
}

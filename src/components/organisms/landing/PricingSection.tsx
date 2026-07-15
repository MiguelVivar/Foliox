"use client";

import React from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      <SectionHeader
        badge="03 // LICENSING & DEPLOYMENT"
        title="Planes claros. Licencia perpetua."
        description="Elige entre hostearlo localmente de forma gratuita o potenciar tu marca con nuestra nube auto-sincronizada."
        className="mb-16 text-center md:items-center md:text-center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Plan 1: Open Source / Self-Hosted */}
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 flex flex-col justify-between transition-all hover:border-[var(--border-focus)]">
          <div>
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
              [Self-Hosted // Open Source]
            </span>
            <h3 className="font-sans text-2xl font-bold text-[var(--text-primary)] mt-2">
              Free Forever
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] mt-2">
              Todo el motor de edición ejecutándose de forma aislada en tu navegador.
            </p>
            
            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">$0</span>
              <span className="font-mono text-xs text-[var(--text-muted)] ml-2">/ lifetime</span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6">
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Drag & Drop Visual Editor</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Local AST Markdown compiler</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>BYOK Local AI Support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Export to .md & JSON Resume</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero telemetry or tracking</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full text-center py-2.5 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono text-xs font-semibold rounded-sm hover:border-[var(--border-focus)] transition-colors"
            >
              [Start Free in Browser]
            </Link>
          </div>
        </div>

        {/* Plan 2: Pro Cloud (Highlighted) */}
        <div className="rounded-md border-2 border-[var(--text-primary)] bg-[var(--bg-surface)] p-8 flex flex-col justify-between transition-all relative">
          <div className="absolute -top-3 right-6 rounded-sm bg-[var(--text-primary)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--text-brand-cta)] uppercase">
            Recommended
          </div>

          <div>
            <span className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-wider">
              [Foliox Pro Cloud]
            </span>
            <h3 className="font-sans text-2xl font-bold text-[var(--text-primary)] mt-2">
              Lifetime License
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] mt-2">
              Sincronización en la nube nativa y despliegues optimizados en un clic.
            </p>
            
            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">$69</span>
              <span className="font-mono text-xs text-[var(--text-muted)] ml-2">/ one-time payment or $9/mo</span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6">
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">Appwrite Cloud sync (Unlimited Assets)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">1-Click deploy to GitHub via Octokit</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">ATS-friendly PDF Resume Export (No watermark)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">Automatic social network profile scrapers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">Developer Profile Visitor Analytics</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full text-center py-2.5 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-mono text-xs font-semibold rounded-sm border border-transparent hover:opacity-90 transition-colors"
            >
              [Upgrade to Pro Cloud]
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

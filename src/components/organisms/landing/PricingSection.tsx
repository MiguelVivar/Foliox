"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Check } from "lucide-react";
import Link from "next/link";
import { Language, translations } from "@/lib/translations";

interface PricingSectionProps {
  lang: Language;
}

export function PricingSection({ lang }: PricingSectionProps) {
  const t = translations[lang].pricing;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "lifetime">("lifetime");

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      <SectionHeader
        badge={t.sectionBadge}
        title={t.sectionTitle}
        description={t.sectionDesc}
        className="mb-12 text-center md:items-center md:text-center"
      />

      {/* Billing Switcher Toggle */}
      <div className="flex justify-center items-center gap-3 mb-12 font-mono text-xs select-none">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-3 py-1.5 border rounded-sm transition-colors ${
            billingCycle === "monthly"
              ? "border-[var(--border-focus)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t.billingMonthly}
        </button>
        <span className="text-[var(--border-subtle)]">|</span>
        <button
          onClick={() => setBillingCycle("lifetime")}
          className={`px-3 py-1.5 border rounded-sm transition-colors ${
            billingCycle === "lifetime"
              ? "border-[var(--border-focus)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t.billingLifetime} (Save 35%)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Plan 1: Open Source / Self-Hosted */}
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 flex flex-col justify-between transition-all hover:border-[var(--border-focus)]">
          <div>
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
              [Self-Hosted // Open Source]
            </span>
            <h3 className="font-sans text-2xl font-bold text-[var(--text-primary)] mt-2">
              {t.freeTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] mt-2">
              {t.freeDesc}
            </p>
            
            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">$0</span>
              <span className="font-mono text-xs text-[var(--text-muted)] ml-2">{t.freePeriod}</span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6">
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span>{t.features.drag}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span>{t.features.ast}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span>{t.features.byok}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span>{t.features.export}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span>{t.features.telemetry}</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full text-center py-2.5 border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono text-xs font-semibold rounded-sm hover:border-[var(--border-focus)] transition-colors"
            >
              {t.freeCta}
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
              {t.proTitle}
            </h3>
            <p className="font-sans text-sm text-[var(--text-muted)] mt-2">
              {t.proDesc}
            </p>
            
            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">
                {billingCycle === "lifetime" ? "$69" : "$9"}
              </span>
              <span className="font-mono text-xs text-[var(--text-muted)] ml-2">
                {billingCycle === "lifetime" ? t.proPeriod : "/ month"}
              </span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6">
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">{t.features.sync}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">{t.features.deploy}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">{t.features.pdf}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">{t.features.scrapers}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={14} className="text-[var(--accent-phosphor)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)]">{t.features.analytics}</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full text-center py-2.5 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-mono text-xs font-semibold rounded-sm border border-transparent hover:opacity-90 transition-colors"
            >
              {t.proCta}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

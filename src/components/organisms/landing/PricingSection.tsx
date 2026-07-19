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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "lifetime">(
    "lifetime",
  );

  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl border-b border-[var(--border-subtle)] px-6 py-24"
    >
      <SectionHeader
        badge={t.sectionBadge}
        title={t.sectionTitle}
        description={t.sectionDesc}
        className="mb-12 text-center md:items-center md:text-center"
      />

      {/* Billing Switcher Toggle */}
      <div className="mb-12 flex items-center justify-center gap-3 font-mono text-xs select-none">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`rounded-sm border px-3 py-1.5 transition-colors ${
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
          className={`rounded-sm border px-3 py-1.5 transition-colors ${
            billingCycle === "lifetime"
              ? "border-[var(--border-focus)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t.billingLifetime} (Save 35%)
        </button>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
        {/* Plan 1: Open Source / Self-Hosted */}
        <div className="flex flex-col justify-between rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 transition-all hover:border-[var(--border-focus)]">
          <div>
            <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
              [Self-Hosted // Open Source]
            </span>
            <h3 className="mt-2 font-sans text-2xl font-bold text-[var(--text-primary)]">
              {t.freeTitle}
            </h3>
            <p className="mt-2 font-sans text-sm text-[var(--text-muted)]">
              {t.freeDesc}
            </p>

            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">
                $0
              </span>
              <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">
                {t.freePeriod}
              </span>
            </div>

            <ul className="space-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span>{t.features.drag}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span>{t.features.ast}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span>{t.features.byok}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span>{t.features.export}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span>{t.features.telemetry}</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2.5 text-center font-mono text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--border-focus)]"
            >
              {t.freeCta}
            </Link>
          </div>
        </div>

        {/* Plan 2: Pro Cloud (Highlighted) */}
        <div className="relative flex flex-col justify-between rounded-md border-2 border-[var(--text-primary)] bg-[var(--bg-surface)] p-8 transition-all">
          <div className="absolute -top-3 right-6 rounded-sm bg-[var(--text-primary)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--text-brand-cta)] uppercase">
            Recommended
          </div>

          <div>
            <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] uppercase">
              [Foliox Pro Cloud]
            </span>
            <h3 className="mt-2 font-sans text-2xl font-bold text-[var(--text-primary)]">
              {t.proTitle}
            </h3>
            <p className="mt-2 font-sans text-sm text-[var(--text-muted)]">
              {t.proDesc}
            </p>

            <div className="my-6">
              <span className="font-mono text-4xl font-extrabold text-[var(--text-primary)]">
                {billingCycle === "lifetime" ? "$69" : "$9"}
              </span>
              <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">
                {billingCycle === "lifetime" ? t.proPeriod : "/ month"}
              </span>
            </div>

            <ul className="space-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span className="text-[var(--text-primary)]">
                  {t.features.sync}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span className="text-[var(--text-primary)]">
                  {t.features.deploy}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span className="text-[var(--text-primary)]">
                  {t.features.pdf}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span className="text-[var(--text-primary)]">
                  {t.features.scrapers}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent-phosphor)]"
                />
                <span className="text-[var(--text-primary)]">
                  {t.features.analytics}
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/editor"
              className="block w-full rounded-sm border border-transparent bg-[var(--bg-brand-cta)] py-2.5 text-center font-mono text-xs font-semibold text-[var(--text-brand-cta)] transition-colors hover:opacity-90"
            >
              {t.proCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo_foliox.png";
import { Language, translations } from "@/lib/translations";

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-6 py-12 font-mono text-[11px] text-[var(--text-muted)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 bg-[var(--bg-canvas)] md:flex-row">
        {/* Left Side: Logo & copyright */}
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Foliox Logo"
              width={20}
              height={20}
              className="rounded-sm opacity-80"
            />
            <span className="font-sans font-bold text-[var(--text-primary)]">
              FOLIOX
            </span>
          </Link>
          <span>{t.copyright}</span>
        </div>

        {/* Center Side: Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/MiguelVivar/Foliox"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            [GitHub]
          </a>
          <span>/</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            [Twitter]
          </a>
          <span>/</span>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            [Discord]
          </a>
          <span>/</span>
          <a
            href="https://github.com/MiguelVivar/Foliox#readme"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            [Docs]
          </a>
        </div>

        {/* Right Side: Status Badge */}
        <div className="flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[10px] text-[var(--text-primary)]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-phosphor)]" />
          <span>{t.status}</span>
        </div>
      </div>
    </footer>
  );
}

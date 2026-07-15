import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo_foliox.png";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-canvas)] border-t border-[var(--border-subtle)] py-12 px-6 font-mono text-[11px] text-[var(--text-muted)]">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Logo & copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Foliox Logo"
              width={20}
              height={20}
              className="rounded-sm opacity-80"
            />
            <span className="font-sans font-bold text-[var(--text-primary)]">FOLIOX</span>
          </Link>
          <span>© 2026 Foliox. Built for the open-source community.</span>
        </div>

        {/* Center Side: Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="https://github.com" className="hover:text-[var(--text-primary)]">
            [GitHub]
          </a>
          <span>/</span>
          <a href="https://x.com" className="hover:text-[var(--text-primary)]">
            [Twitter]
          </a>
          <span>/</span>
          <a href="https://discord.com" className="hover:text-[var(--text-primary)]">
            [Discord]
          </a>
          <span>/</span>
          <a href="#docs" className="hover:text-[var(--text-primary)]">
            [Docs]
          </a>
        </div>

        {/* Right Side: Status Badge */}
        <div className="rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[10px] text-[var(--text-primary)] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          <span>SYSTEM STATUS: 100% OPERATIONAL - ALL SERVICES NORMAL</span>
        </div>

      </div>
    </footer>
  );
}

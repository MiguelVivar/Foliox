"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Menu, X, Star } from "lucide-react";
import logo from "../../../../public/logo_foliox.png";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stars, setStars] = useState(1420);
  const [isStarring, setIsStarring] = useState(false);

  // Simulate subtle real-time star updates for visual delight
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setStars((prev) => prev + 1);
        setIsStarring(true);
        setTimeout(() => setIsStarring(false), 1000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Foliox Logo"
            width={28}
            height={28}
            className="rounded-sm border border-[var(--border-subtle)]"
          />
          <span className="font-sans text-base font-bold tracking-tight text-[var(--text-primary)]">
            FOLIOX
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono text-[var(--text-muted)]">
          <a
            href="#features"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            [Features]
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#philosophy"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            [Philosophy]
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#open-source"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            [Open Source]
          </a>
          <span className="text-[var(--border-subtle)]">|</span>
          <a
            href="#pricing"
            className="px-3 py-1.5 rounded-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            [Pricing]
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* GitHub Stars Simulator Badge */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)] transition-all hover:border-[var(--border-focus)]"
          >
            <Star
              size={12}
              className={`text-yellow-500 fill-yellow-500 transition-transform duration-300 ${
                isStarring ? "scale-125" : ""
              }`}
            />
            <span>{stars.toLocaleString()} Stars</span>
          </a>

          <ThemeToggle />

          <Link
            href="/editor"
            className="rounded-sm bg-[var(--bg-brand-cta)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--text-brand-cta)] border border-transparent hover:border-[var(--border-focus)] transition-colors"
          >
            [Launch Workspace]
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md border border-[var(--border-subtle)] p-1 text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] md:hidden">
          <div className="flex flex-col gap-4 p-6 font-mono text-xs text-[var(--text-muted)]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // Features
            </a>
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // Philosophy
            </a>
            <a
              href="#open-source"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // Open Source
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[var(--text-primary)]"
            >
              // Pricing
            </a>

            <div className="mt-2 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-2 text-[10px]">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span>{stars.toLocaleString()} Stars on GitHub</span>
              </div>
              <Link
                href="/editor"
                className="w-full text-center rounded-sm bg-[var(--bg-brand-cta)] py-2 text-[var(--text-brand-cta)] font-semibold"
              >
                [Launch Workspace]
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/organisms/landing/Navbar";
import { HeroSection } from "@/components/organisms/landing/HeroSection";
import { TechTicker } from "@/components/organisms/landing/TechTicker";
import { BentoFeatures } from "@/components/organisms/landing/BentoFeatures";
import { AboutSection } from "@/components/organisms/landing/AboutSection";
import { PricingSection } from "@/components/organisms/landing/PricingSection";
import { Footer } from "@/components/organisms/landing/Footer";
import { DotGrid } from "@/components/atoms/DotGrid";
import { Language } from "@/lib/translations";
import { CommandPalette } from "@/components/molecules/CommandPalette";

export function LandingTemplate() {
  const [lang, setLang] = useState<Language>("es");
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="landing-retro relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--bg-canvas)]">
      {/* Background Dot Grid */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <DotGrid scanlines />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar
          lang={lang}
          setLang={setLang}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <main className="flex flex-1 flex-col">
          <HeroSection lang={lang} />
          <TechTicker />
          <BentoFeatures lang={lang} />
          <AboutSection lang={lang} />
          <PricingSection lang={lang} />
        </main>

        <Footer lang={lang} />
      </div>

      {/* Raycast style command menu */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        lang={lang}
        setLang={setLang}
      />
    </div>
  );
}

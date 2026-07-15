import React from "react";
import { Navbar } from "@/components/organisms/landing/Navbar";
import { HeroSection } from "@/components/organisms/landing/HeroSection";
import { TechTicker } from "@/components/organisms/landing/TechTicker";
import { BentoFeatures } from "@/components/organisms/landing/BentoFeatures";
import { AboutSection } from "@/components/organisms/landing/AboutSection";
import { PricingSection } from "@/components/organisms/landing/PricingSection";
import { Footer } from "@/components/organisms/landing/Footer";
import { DotGrid } from "@/components/atoms/DotGrid";

export function LandingTemplate() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-canvas)] overflow-x-hidden flex flex-col">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <HeroSection />
          <TechTicker />
          <BentoFeatures />
          <AboutSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

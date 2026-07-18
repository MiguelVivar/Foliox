"use client";

import React from "react";
import { DotGrid } from "@/components/atoms/DotGrid";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { BentoCard } from "./BentoCard";
import { MapPin, Link as LinkIcon, Users, Mail } from "lucide-react";

export function EditorCanvas() {
  const { blocks, selectBlock } = useEditorStore();
  const { user } = useAuthStore();

  // Find hero bio block content for the left sidebar
  const heroBlock = blocks.find((b) => b.kind === "hero-bio");
  const displayName = heroBlock?.content?.name || user?.name || "Miguel Vivar";
  const displayBio = heroBlock?.content?.tagline || "Hola, soy Miguel Vivar, apasionado del desarrollo web y la programación.";
  const displayAvatar = heroBlock?.content?.avatarUrl || "https://github.com/MiguelVivar.png";
  const githubHandle = user?.name ? user.name.replace(/\s+/g, "") : "MiguelVivar";

  return (
    <div
      className="relative flex flex-1 overflow-y-auto p-4 md:p-8 bg-[#0d1117] text-[#c9d1d9] font-sans"
      onClick={() => selectBlock(null)}
    >
      {/* Background Dot Grid */}
      <DotGrid />

      {/* Centered GitHub Profile Layout Wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-6xl flex flex-col md:flex-row gap-8 pt-4">
        
        {/* LEFT COLUMN: GitHub Profile Sidebar Mockup (width: 280px) */}
        <div className="w-full md:w-[280px] shrink-0 flex flex-col items-center md:items-start select-none">
          {/* Avatar Image circle */}
          <div className="relative group w-48 h-48 md:w-64 md:h-64 rounded-full border border-[#30363d] overflow-hidden bg-[#161b22] mb-4">
            <img
              src={displayAvatar}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Handle */}
          <div className="w-full mb-4 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#f0f6fc] leading-tight">{displayName}</h1>
            <h2 className="text-lg text-[#8b949e] font-light leading-snug">{githubHandle} <span className="text-sm text-[#8b949e]/60">· he/him</span></h2>
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (heroBlock) selectBlock(heroBlock.id);
            }}
            className="w-full text-center py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-semibold text-xs rounded-md border border-[#30363d] transition-all mb-4 cursor-pointer"
          >
            Edit profile
          </button>

          {/* Bio text */}
          <p className="text-sm text-[#f0f6fc] mb-4 text-center md:text-left leading-relaxed">
            {displayBio}
          </p>

          {/* Meta links (Followers, Location, Email, etc.) */}
          <div className="w-full flex flex-col gap-2 text-xs text-[#8b949e] border-t border-[#30363d] pt-4">
            <div className="flex items-center gap-2 hover:text-[#58a6ff] cursor-pointer">
              <Users size={14} />
              <span><strong className="text-[#f0f6fc]">14</strong> followers · <strong className="text-[#f0f6fc]">12</strong> following</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Ica, Perú</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{user?.email || "miguel.vivar@dev.local"}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#58a6ff] cursor-pointer">
              <LinkIcon size={14} />
              <span>github.com/{githubHandle.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: README.md Document mockup */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* GitHub Tabs Navigation Strip Mockup */}
          <div className="flex items-center gap-4 border-b border-[#30363d] pb-2 mb-6 font-semibold text-sm text-[#8b949e] select-none overflow-x-auto whitespace-nowrap">
            <span className="text-[#f0f6fc] border-b-2 border-[#f78166] px-2 py-1.5 cursor-pointer">Overview</span>
            <span className="px-2 py-1.5 hover:text-[#f0f6fc] cursor-pointer">Repositories <span className="bg-[#30363d] text-xs px-1.5 py-0.5 rounded-full">37</span></span>
            <span className="px-2 py-1.5 hover:text-[#f0f6fc] cursor-pointer">Projects</span>
            <span className="px-2 py-1.5 hover:text-[#f0f6fc] cursor-pointer">Packages</span>
            <span className="px-2 py-1.5 hover:text-[#f0f6fc] cursor-pointer">Stars <span className="bg-[#30363d] text-xs px-1.5 py-0.5 rounded-full">332</span></span>
          </div>

          {/* README Card container box */}
          <div className="border border-[#30363d] rounded-md bg-[#0d1117] p-6 relative">
            <div className="absolute top-3 right-3 text-xs text-[#8b949e] font-mono select-none">
              {githubHandle} / README.md
            </div>

            {/* Render Bento blocks inside the README frame */}
            <div className="flex flex-col gap-4 mt-4">
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                  <span className="font-mono text-4xl text-[var(--text-muted)] flex items-center justify-center h-12 w-12 border border-[#30363d] bg-[#161b22] rounded-md">
                    +
                  </span>
                  <p className="text-sm font-medium text-[#f0f6fc] mt-4">
                    README_EMPTY
                  </p>
                  <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
                    Add blocks from the sidebar to populate your profile readme <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">█</span>
                  </p>
                </div>
              ) : (
                blocks
                  // Don't render hero-bio inside the README body since it is already in the left sidebar!
                  .filter((block) => block.kind !== "hero-bio")
                  .map((block, index) => (
                    <BentoCard
                      key={block.id}
                      block={block}
                      index={index}
                      totalBlocks={blocks.length}
                    />
                  ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

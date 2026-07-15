"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Star, Edit3, Settings } from "lucide-react";
import { DotGrid } from "@/components/atoms/DotGrid";

export default function ProfilePage() {
  const [activeProfile, setActiveProfile] = useState("standard-cv");

  const profilesList = [
    { id: "standard-cv", name: "Systems Architect CV", lastCompiled: "2 hours ago" },
    { id: "github-readme", name: "GitHub Special Profile README", lastCompiled: "3 days ago" },
    { id: "devto-bio", name: "Dev.to Custom Biography", lastCompiled: "1 week ago" },
  ];

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] px-6 py-12 md:py-24">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 font-mono text-xs text-[var(--text-primary)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-8 select-none">
          <Link href="/editor" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={12} />
            <span>Back to Editor</span>
          </Link>
          <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">DEV_PROFILE_MANAGER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Basic Meta (Span 5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[var(--border-subtle)] pb-6 md:pb-0 md:pr-6">
            <div className="h-20 w-20 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden flex items-center justify-center font-sans text-2xl font-bold text-[var(--text-primary)]">
              JD
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-sans text-lg font-bold">Jane Doe</span>
              <span className="text-[10px] text-[var(--text-muted)]">Systems Architect</span>
            </div>

            <div className="flex flex-col gap-2 w-full pt-4 border-t border-[var(--border-subtle)]/50 text-[10px] text-[var(--text-muted)]">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={12} />
                <span>jane.doe@dev.local</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>github.com/octocat</span>
              </div>
            </div>

            <div className="flex gap-2 w-full pt-4">
              <Link
                href="/editor"
                className="flex-1 text-center py-2 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-semibold rounded-sm hover:opacity-90 transition-colors"
              >
                Launch Editor
              </Link>
            </div>
          </div>

          {/* Right Column: Profiles switcher list (Span 7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <User size={14} />
                // COMPILED PROFILES
              </span>
              <Link href="/settings" className="p-1 border border-[var(--border-subtle)] rounded hover:border-[var(--border-focus)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <Settings size={12} />
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {profilesList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setActiveProfile(profile.id)}
                  className={`p-3 rounded-sm border cursor-pointer transition-colors flex flex-col gap-1 ${
                    activeProfile === profile.id
                      ? "border-[var(--border-focus)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-bold text-xs">{profile.name}</span>
                    {activeProfile === profile.id && (
                      <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 py-0.2 rounded-sm uppercase tracking-wide font-mono">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">Last compiled: {profile.lastCompiled}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

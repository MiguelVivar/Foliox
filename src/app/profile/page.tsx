"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Star, Edit3, Settings } from "lucide-react";
import { DotGrid } from "@/components/atoms/DotGrid";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const [activeProfile, setActiveProfile] = useState("standard-cv");
  const { user, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const profilesList = [
    { id: "standard-cv", name: "Systems Architect CV", lastCompiled: "2 hours ago" },
    { id: "github-readme", name: "GitHub Special Profile README", lastCompiled: "3 days ago" },
    { id: "devto-bio", name: "Dev.to Custom Biography", lastCompiled: "1 week ago" },
  ];

  const displayName = user?.name || "Jane Doe";
  const displayEmail = user?.email || "jane.doe@dev.local";
  const userInitials = displayName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const mockGithubHandle = displayName.toLowerCase().replace(/\s+/g, "");

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] px-6 py-12 md:py-24">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 font-mono text-xs text-[var(--text-primary)] shadow-[6px_6px_0_0_rgba(0,0,0,0.3)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-8 select-none">
          <Link href="/editor" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent-phosphor)] transition-colors group">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>[ BACK_TO_EDITOR ]</span>
          </Link>
          <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider flex items-center gap-1">
            DEV_PROFILE_MANAGER <span className="animate-[blink_1s_step-end_infinite] text-[var(--accent-phosphor)]">█</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Basic Meta (Span 5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[var(--border-subtle)] pb-6 md:pb-0 md:pr-6">
            <div className="h-20 w-20 rounded-sm border border-[var(--accent-phosphor)] bg-[var(--bg-canvas)] overflow-hidden flex items-center justify-center font-mono text-2xl font-bold text-[var(--accent-phosphor)] shadow-[4px_4px_0_0_rgba(0,255,100,0.15)]">
              {userInitials}
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <span className="font-mono text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">{displayName}</span>
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-bold">// Systems Architect</span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-4 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono">
              <div className="flex items-center gap-2 justify-center md:justify-start hover:text-[var(--accent-phosphor)] transition-colors">
                <Mail size={12} />
                <span>{displayEmail}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start hover:text-[var(--accent-phosphor)] transition-colors">
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
                <span>github.com/{mockGithubHandle}</span>
              </div>
            </div>

            <div className="flex gap-2 w-full pt-4">
              <Link
                href="/editor"
                className="flex-1 text-center py-2.5 bg-[var(--accent-phosphor)] text-[var(--bg-canvas)] font-bold rounded-sm border border-[var(--accent-phosphor)] shadow-[3px_3px_0_0_var(--text-primary)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--text-primary)] transition-all uppercase tracking-wider text-[10px]"
              >
                Launch Editor
              </Link>
            </div>
          </div>

          {/* Right Column: Profiles switcher list (Span 7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 text-[var(--text-muted)]">
                <User size={12} />
                // COMPILED PROFILES
              </span>
              <Link href="/settings" className="p-1 border border-[var(--border-subtle)] rounded-sm hover:border-[var(--accent-phosphor)] text-[var(--text-muted)] hover:text-[var(--accent-phosphor)] transition-colors">
                <Settings size={12} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {profilesList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setActiveProfile(profile.id)}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all duration-200 flex flex-col gap-1.5 ${
                    activeProfile === profile.id
                      ? "border-[var(--accent-phosphor)] bg-[var(--bg-canvas)] text-[var(--text-primary)] -translate-y-0.5 shadow-[4px_4px_0_0_var(--accent-phosphor)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-phosphor)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--accent-phosphor)]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs uppercase tracking-wide">{profile.name}</span>
                    {activeProfile === profile.id && (
                      <span className="text-[8px] bg-[var(--accent-phosphor)]/10 text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)]/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--text-muted)]">Last compiled: {profile.lastCompiled}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

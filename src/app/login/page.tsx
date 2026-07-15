"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Mail, Terminal } from "lucide-react";
import { DotGrid } from "@/components/atoms/DotGrid";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg-canvas)] px-6 py-12">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotGrid />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 font-mono text-xs text-[var(--text-primary)]">
        
        {/* Header Back */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)] mb-6 select-none">
          <Link href="/" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={12} />
            <span>Home</span>
          </Link>
          <span className="text-[var(--text-muted)]">foliox-auth-client</span>
        </div>

        {success ? (
          <div className="text-center py-6 flex flex-col gap-4 items-center">
            <span className="h-8 w-8 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-400">✓</span>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm">AUTHENTICATION GRANTED</span>
              <span className="text-[10px] text-[var(--text-muted)]">Redirecting to visual editor...</span>
            </div>
            <Link
              href="/editor"
              className="mt-4 px-4 py-2 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-semibold rounded-sm border border-transparent hover:border-[var(--border-focus)] transition-colors"
            >
              Continue to Workspace
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-sans text-xl font-bold tracking-tight mb-1 text-[var(--text-primary)]">
                Login
              </h2>
              <p className="text-[10px] text-[var(--text-muted)]">
                Enter your credentials to access the cloud workspace.
              </p>
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label htmlFor="email" className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Mail size={12} />
                <span>// EMAIL:</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@foliox.dev"
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Key size={12} />
                <span>// PASSWORD:</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full text-center py-2.5 bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)] font-semibold rounded-sm border border-transparent hover:opacity-90 active:scale-95 transition-all"
            >
              {loading ? "AUTHENTICATING..." : "SUBMIT CREDENTIALS"}
            </button>

            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-[10px] text-center text-[var(--text-muted)]">
              <span>Don&apos;t have an account? </span>
              <Link href="/register" className="text-[var(--text-primary)] underline">
                Register here
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

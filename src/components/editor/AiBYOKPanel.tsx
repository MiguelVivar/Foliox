"use client";

import { useId } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/cn";
import { useEditorStore } from "@/store/useEditorStore";
import type { AiProvider } from "@/hooks/useApiKey";

const PROVIDERS: { value: AiProvider; label: string; model: string }[] = [
  { value: "anthropic", label: "Anthropic", model: "claude-3-5-sonnet" },
  { value: "openai", label: "OpenAI", model: "gpt-4o-mini" },
  { value: "deepseek", label: "DeepSeek", model: "deepseek-chat" },
  { value: "google", label: "Google Gemini", model: "gemini-2.5-flash" },
];

const TONES = [
  { value: "technical", label: "Technical & Concise" },
  { value: "linkedin", label: "Executive LinkedIn Bio" },
  { value: "aggressive", label: "Aggressive Dev Branding" },
] as const;

export type WritingTone = (typeof TONES)[number]["value"];

const TONE_KEY = "foliox-ai-tone";

function readStoredTone(): WritingTone {
  if (typeof window === "undefined") return "technical";
  const v = window.localStorage.getItem(TONE_KEY);
  return v === "technical" || v === "linkedin" || v === "aggressive"
    ? v
    : "technical";
}

export function AiBYOKPanel() {
  const { provider, apiKey, setProvider, setApiKey } = useApiKey();
  const [showKey, setShowKey] = useState(false);
  const [tone, setTone] = useState<WritingTone>(readStoredTone);
  const keyId = useId();
  const provId = useId();
  const toneId = useId();

  const hasKey = apiKey.trim().length > 0;

  const inputClass =
    "w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-phosphor)] transition-colors";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  function handleTone(v: WritingTone) {
    window.localStorage.setItem(TONE_KEY, v);
    setTone(v);
  }

  function getPlaceholder() {
    switch (provider) {
      case "openai":
        return "sk-proj-...";
      case "anthropic":
        return "sk-ant-...";
      case "deepseek":
        return "sk-...";
      case "google":
        return "AIzaSy...";
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Provider selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={provId} className={labelClass}>
          AI Provider
        </label>
        <select
          id={provId}
          value={provider}
          onChange={(e) => setProvider(e.target.value as AiProvider)}
          className={inputClass}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} — {p.model}
            </option>
          ))}
        </select>
      </div>

      {/* API Key input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={keyId} className={labelClass}>
          API Key
        </label>
        <div className="relative">
          <input
            id={keyId}
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={getPlaceholder()}
            autoComplete="off"
            spellCheck={false}
            className={cn(inputClass, "pr-9 font-mono text-xs")}
          />
          <button
            type="button"
            aria-label={showKey ? "Hide API key" : "Show API key"}
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        {hasKey && (
          <p className="font-mono text-[10px] text-[var(--accent-phosphor)] uppercase tracking-widest">
            [✓] Key saved to localStorage
          </p>
        )}
      </div>

      {/* Tone selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={toneId} className={labelClass}>
          Writing Tone
        </label>
        <div id={toneId} className="flex flex-col gap-1.5">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTone(t.value)}
              className={cn(
                "rounded-sm border px-3 py-2 text-left font-mono text-xs transition-colors",
                tone === t.value
                  ? "border-[var(--accent-phosphor)] text-[var(--accent-phosphor)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-phosphor)] hover:text-[var(--accent-phosphor)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Usage note */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] leading-relaxed text-[var(--text-muted)]">
          Click{" "}
          <span className="inline-flex items-center gap-0.5 text-[var(--text-primary)]">
            <Sparkles size={9} /> Improve with AI
          </span>{" "}
          inside any <Badge variant="mauve" mono>Hero / Bio</Badge> block to rewrite your tagline using the selected tone.
        </p>
      </div>

      {/* LinkedIn & CV Copywriting Assistant */}
      <LinkedInAssistant />

      {/* Security badge */}
      <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
    </div>
  );
}

function LinkedInAssistant() {
  const { provider, apiKey } = useApiKey();
  const { blocks, badgeStyle, sectionSeparator } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const labelClass =
    "block font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]";

  async function handleGenerate() {
    if (!apiKey) {
      setErrorMsg("ERR: API_KEY_REQUIRED");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const { serializeBlocks } = await import("@/lib/markdownSerializer");
      const profileData = serializeBlocks(blocks, { badgeStyle, sectionSeparator });

      const res = await fetch("/api/ai/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey, profileData }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Generation failed");

      setResult(data.result);
    } catch (err: any) {
      setErrorMsg(err.message || "ERR: GENERATION_FAILED");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-4">
      <span className={labelClass}>LinkedIn & CV Copywriter</span>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center gap-1.5 bg-[var(--accent-phosphor)] text-[var(--bg-canvas)] font-bold rounded-sm py-2 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--text-primary)] transition-all uppercase tracking-wider text-[10px]"
      >
        {loading ? "GENERATING..." : "GENERATE_LINKEDIN_BIO_AND_CV"}
      </button>

      {errorMsg && (
        <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
          [{errorMsg}]
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-2">
          <textarea
            readOnly
            value={result}
            className="w-full h-40 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-sm p-2 font-mono text-[10px] text-[var(--text-primary)] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="text-center font-mono text-[9px] uppercase tracking-widest text-[var(--accent-phosphor)] border border-[var(--accent-phosphor)] rounded-sm py-1.5 hover:bg-[var(--accent-phosphor)]/10"
          >
            {copied ? "[ COPIED_TO_CLIPBOARD ]" : "[ COPY_TO_CLIPBOARD ]"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useApiKey } from "./useApiKey";
import type { GenerateRequestBody } from "@/app/api/ai/generate/route";

export type AiGenerateStatus = "idle" | "loading" | "success" | "error";

export type UseAiGenerateReturn = {
  status: AiGenerateStatus;
  result: string | null;
  errorMessage: string | null;
  generate: (bio: string) => Promise<string | null>;
};

/**
 * Calls the BYOK /api/ai/generate endpoint with the current provider + apiKey
 * from useApiKey (localStorage). Returns the improved bio text on success.
 */
export function useAiGenerate(): UseAiGenerateReturn {
  const { provider, apiKey } = useApiKey();
  const [status, setStatus] = useState<AiGenerateStatus>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generate = useCallback(
    async (bio: string): Promise<string | null> => {
      if (!apiKey) {
        setStatus("error");
        setErrorMessage("No API key configured — add your key in the IA / BYOK tab.");
        return null;
      }
      if (!bio.trim()) {
        setStatus("error");
        setErrorMessage("Write a tagline or bio first so the AI has something to improve.");
        return null;
      }

      setStatus("loading");
      setErrorMessage(null);
      setResult(null);

      const body: GenerateRequestBody = { provider, apiKey, bio };

      try {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = (await response.json()) as
          | { improvedBio: string }
          | { error: string };

        if (!response.ok || "error" in data) {
          const msg = "error" in data ? data.error : "AI request failed";
          setStatus("error");
          setErrorMessage(msg);
          return null;
        }

        setStatus("success");
        setResult(data.improvedBio);
        return data.improvedBio;
      } catch {
        setStatus("error");
        setErrorMessage("Network error — check your connection and try again.");
        return null;
      }
    },
    [provider, apiKey],
  );

  return { status, result, errorMessage, generate };
}

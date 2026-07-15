"use client";

import { useCallback, useState } from "react";

export type AiProvider = "openai" | "anthropic" | "deepseek" | "google";

const PROVIDER_KEY = "foliox-ai-provider";
const API_KEY_KEY = "foliox-ai-key";

function readStoredProvider(): AiProvider {
  if (typeof window === "undefined") return "anthropic";
  const stored = window.localStorage.getItem(PROVIDER_KEY);
  if (
    stored === "openai" ||
    stored === "anthropic" ||
    stored === "deepseek" ||
    stored === "google"
  ) {
    return stored;
  }
  return "anthropic";
}

function readStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(API_KEY_KEY) ?? "";
}

export function useApiKey(): {
  provider: AiProvider;
  apiKey: string;
  setProvider: (provider: AiProvider) => void;
  setApiKey: (apiKey: string) => void;
} {
  const [provider, setProviderState] = useState<AiProvider>(readStoredProvider);
  const [apiKey, setApiKeyState] = useState<string>(readStoredApiKey);

  const setProvider = useCallback((next: AiProvider) => {
    window.localStorage.setItem(PROVIDER_KEY, next);
    setProviderState(next);
  }, []);

  const setApiKey = useCallback((next: string) => {
    window.localStorage.setItem(API_KEY_KEY, next);
    setApiKeyState(next);
  }, []);

  return { provider, apiKey, setProvider, setApiKey };
}

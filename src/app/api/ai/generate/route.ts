import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import type { AiProvider } from "@/hooks/useApiKey";

const SYSTEM_PROMPT =
  "You improve professional bios for developer portfolios. Rewrite the bio the user gives you: " +
  "direct, specific, no filler words, no generic marketing jargon ('passionate', 'synergy', " +
  "'results-driven'). Keep it factual and in first person. Return only the improved bio text, " +
  "no preamble, no quotes.";

export type GenerateRequestBody = {
  provider: AiProvider;
  apiKey: string;
  bio: string;
};

export function resolveModelId(provider: AiProvider): string {
  switch (provider) {
    case "openai":
      return "gpt-4o-mini";
    case "anthropic":
      return "claude-3-5-sonnet-latest";
    case "deepseek":
      return "deepseek-chat";
    case "google":
      return "gemini-2.5-flash";
  }
}

export function validateGenerateRequest(
  body: unknown,
): GenerateRequestBody | { error: string } {
  const candidate = body as Partial<
    Record<keyof GenerateRequestBody, unknown>
  > | null;

  if (typeof candidate?.apiKey !== "string" || candidate.apiKey.length === 0) {
    return { error: "apiKey is required" };
  }
  if (typeof candidate?.bio !== "string" || candidate.bio.length === 0) {
    return { error: "bio is required" };
  }
  if (
    candidate.provider !== "openai" &&
    candidate.provider !== "anthropic" &&
    candidate.provider !== "deepseek" &&
    candidate.provider !== "google"
  ) {
    return { error: "invalid provider" };
  }

  return {
    provider: candidate.provider,
    apiKey: candidate.apiKey,
    bio: candidate.bio,
  };
}

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();
  const validated = validateGenerateRequest(body);

  if ("error" in validated) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const { provider, apiKey, bio } = validated;

  try {
    let model;
    if (provider === "openai") {
      model = createOpenAI({ apiKey })(resolveModelId(provider));
    } else if (provider === "anthropic") {
      model = createAnthropic({ apiKey })(resolveModelId(provider));
    } else if (provider === "deepseek") {
      // DeepSeek is OpenAI API-compatible, override baseURL
      model = createOpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com/v1",
      })(resolveModelId(provider));
    } else {
      model = createGoogleGenerativeAI({ apiKey })(resolveModelId(provider));
    }

    const { text } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: bio,
    });

    return Response.json({ improvedBio: text }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "AI provider request failed",
      error instanceof Error ? error.constructor.name : "unknown error",
    );
    return Response.json(
      { error: "AI provider request failed" },
      { status: 502 },
    );
  }
}

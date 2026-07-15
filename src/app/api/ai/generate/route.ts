import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
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
  return provider === "openai" ? "gpt-4o-mini" : "claude-sonnet-5";
}

export function validateGenerateRequest(
  body: unknown,
): GenerateRequestBody | { error: string } {
  const candidate = body as Partial<GenerateRequestBody> | null;

  if (!candidate?.apiKey) {
    return { error: "apiKey is required" };
  }
  if (!candidate?.bio) {
    return { error: "bio is required" };
  }
  if (candidate.provider !== "openai" && candidate.provider !== "anthropic") {
    return { error: "invalid provider" };
  }

  return { provider: candidate.provider, apiKey: candidate.apiKey, bio: candidate.bio };
}

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();
  const validated = validateGenerateRequest(body);

  if ("error" in validated) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const { provider, apiKey, bio } = validated;

  try {
    const model =
      provider === "openai"
        ? createOpenAI({ apiKey })(resolveModelId(provider))
        : createAnthropic({ apiKey })(resolveModelId(provider));

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
    return Response.json({ error: "AI provider request failed" }, { status: 502 });
  }
}

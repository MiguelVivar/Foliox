import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { resolveModelId } from "../generate/route";
import type { AiProvider } from "@/hooks/useApiKey";

const SYSTEM_PROMPT =
  "You are an expert tech career coach. Create a professional LinkedIn profile and CV template based on the provided developer profile data. " +
  "Generate: " +
  "1. A high-impact LinkedIn Headline (max 220 characters). " +
  "2. A LinkedIn 'About' summary section (written in 1st person, structured, high precision, rich keywords). " +
  "3. A structured markdown CV template ready to copy. " +
  "Return only the generated markdown/text content, clean and well formatted.";

export type LinkedInRequestBody = {
  provider: AiProvider;
  apiKey: string;
  profileData: string;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const { provider, apiKey, profileData } = (await request.json()) as LinkedInRequestBody;

    if (!apiKey || !profileData) {
      return Response.json({ error: "apiKey and profileData are required" }, { status: 400 });
    }

    let model;
    if (provider === "openai") {
      model = createOpenAI({ apiKey })(resolveModelId(provider));
    } else if (provider === "anthropic") {
      model = createAnthropic({ apiKey })(resolveModelId(provider));
    } else if (provider === "deepseek") {
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
      prompt: `Here is my developer profile data:\n${profileData}`,
    });

    return Response.json({ result: text }, { status: 200 });
  } catch (error: unknown) {
    console.error("LinkedIn AI generation failed", error);
    return Response.json({ error: "AI provider request failed" }, { status: 502 });
  }
}

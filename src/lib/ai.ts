import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

const provider = process.env.LLM_PROVIDER || "gemini";

export function getModel() {
  switch (provider) {
    case "anthropic":
      return anthropic("claude-haiku-4-5-20251001");
    case "openai":
      return openai("gpt-4o-mini");
    case "gemini":
    default:
      return google("gemini-2.0-flash");
  }
}

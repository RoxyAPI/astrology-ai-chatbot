/**
 * @fileoverview LLM provider configuration.
 *
 * Selects which model to use for chat completions based on the
 * LLM_PROVIDER environment variable. Each provider needs its own
 * API key set in the environment (see the provider SDK docs).
 *
 * Configuration:
 *  - LLM_PROVIDER — "gemini" (default) | "anthropic" | "openai"
 *
 * API keys (set the one that matches your provider):
 *  - GOOGLE_GENERATIVE_AI_API_KEY — for Gemini
 *  - ANTHROPIC_API_KEY            — for Anthropic / Claude
 *  - OPENAI_API_KEY               — for OpenAI
 *
 * @see https://roxyapi.com/docs — RoxyAPI chatbot starter documentation
 */

import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

const provider = process.env.LLM_PROVIDER || "gemini";

/**
 * Returns the AI SDK model instance for the configured provider.
 *
 * | Provider    | Model                    | Notes                   |
 * |-------------|--------------------------|-------------------------|
 * | gemini      | gemini-2.0-flash         | Free tier available     |
 * | anthropic   | claude-haiku-4-5         | Best quality            |
 * | openai      | gpt-4o-mini              | Most popular            |
 */
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

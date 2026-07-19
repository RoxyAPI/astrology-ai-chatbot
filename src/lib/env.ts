/**
 * @fileoverview Environment validation for first-run setup UX.
 *
 * Checks whether the required API keys are present and not still set
 * to the placeholder values shipped in .env.example. Read by the home
 * page (server component) so a missing-key state can render a setup
 * screen instead of the chat — much friendlier than a generic error
 * banner once the user clicks a suggestion.
 */

export type LlmProvider = "gemini" | "anthropic" | "openai";

export interface MissingKey {
  /** Env var name, e.g. "ROXYAPI_KEY". */
  name: string;
  /** Where to obtain the key. */
  url: string;
  /** Short hint shown beside the link. */
  hint: string;
}

export interface EnvStatus {
  ok: boolean;
  missing: MissingKey[];
  provider: LlmProvider;
}

/** Matches the placeholder strings in .env.example. */
const PLACEHOLDER = /^(your_.+_here|<.+>|placeholder|todo|change[_-]?me)$/i;

function isUnset(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return trimmed.length === 0 || PLACEHOLDER.test(trimmed);
}

const LLM_KEY_INFO: Record<LlmProvider, Omit<MissingKey, "name"> & { envName: string }> = {
  gemini: {
    envName: "GOOGLE_GENERATIVE_AI_API_KEY",
    url: "https://aistudio.google.com/apikey",
    hint: "Free tier. Sign in with any Google account, click \"Create API Key\".",
  },
  anthropic: {
    envName: "ANTHROPIC_API_KEY",
    url: "https://console.anthropic.com/settings/keys",
    hint: "Pay-as-you-go. Add billing in the Anthropic console first.",
  },
  openai: {
    envName: "OPENAI_API_KEY",
    url: "https://platform.openai.com/api-keys",
    hint: "Pay-as-you-go. Add billing in the OpenAI dashboard first.",
  },
};

export function getEnvStatus(): EnvStatus {
  const raw = (process.env.LLM_PROVIDER || "gemini").trim().toLowerCase();
  const provider: LlmProvider = (
    raw === "anthropic" || raw === "openai" || raw === "gemini" ? raw : "gemini"
  );

  const missing: MissingKey[] = [];

  if (isUnset(process.env.ROXYAPI_KEY)) {
    missing.push({
      name: "ROXYAPI_KEY",
      url: "https://roxyapi.com/pricing",
      hint: "Powers all astrology, Vedic, tarot, numerology, and dream readings.",
    });
  }

  const llm = LLM_KEY_INFO[provider];
  if (isUnset(process.env[llm.envName])) {
    missing.push({ name: llm.envName, url: llm.url, hint: llm.hint });
  }

  return { ok: missing.length === 0, missing, provider };
}

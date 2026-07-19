import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getEnvStatus } from '@/lib/env';

const KEYS = [
  'ROXYAPI_KEY',
  'LLM_PROVIDER',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
] as const;

// getEnvStatus reads process.env at call time, so each test owns a clean slate.
let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = {};
  for (const k of KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe('getEnvStatus', () => {
  it('reports ok once the RoxyAPI key and the active provider key are set', () => {
    process.env.ROXYAPI_KEY = 'sk-real';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'g-real';
    const status = getEnvStatus();
    expect(status).toMatchObject({ ok: true, missing: [], provider: 'gemini' });
  });

  it('flags a missing RoxyAPI key', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'g-real';
    const status = getEnvStatus();
    expect(status.ok).toBe(false);
    expect(status.missing.map((m) => m.name)).toContain('ROXYAPI_KEY');
  });

  it('treats .env.example placeholder values as unset', () => {
    process.env.ROXYAPI_KEY = 'your_roxyapi_key_here';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'your_google_api_key_here';
    const status = getEnvStatus();
    expect(status.ok).toBe(false);
    expect(status.missing.map((m) => m.name)).toEqual([
      'ROXYAPI_KEY',
      'GOOGLE_GENERATIVE_AI_API_KEY',
    ]);
  });

  it('checks the key for the selected provider', () => {
    process.env.LLM_PROVIDER = 'anthropic';
    process.env.ROXYAPI_KEY = 'sk-real';
    const status = getEnvStatus();
    expect(status.provider).toBe('anthropic');
    expect(status.missing.map((m) => m.name)).toEqual(['ANTHROPIC_API_KEY']);
  });

  it('matches the provider case-insensitively', () => {
    process.env.LLM_PROVIDER = 'OpenAI';
    process.env.ROXYAPI_KEY = 'sk-real';
    process.env.OPENAI_API_KEY = 'o-real';
    expect(getEnvStatus()).toMatchObject({ ok: true, provider: 'openai' });
  });

  it('falls back to gemini for an unknown provider', () => {
    process.env.LLM_PROVIDER = 'mistral';
    process.env.ROXYAPI_KEY = 'sk-real';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'g-real';
    expect(getEnvStatus()).toMatchObject({ ok: true, provider: 'gemini' });
  });
});

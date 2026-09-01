import { describe, expect, it } from 'vitest';
import { DEFAULT_PRODUCTS, resolveProducts, withCompactResponses } from '@/lib/mcp';

describe('resolveProducts', () => {
  it('falls back to the full catalogue when nothing is supplied', () => {
    expect(resolveProducts()).toEqual(DEFAULT_PRODUCTS);
  });

  it('parses a comma list into trimmed slugs', () => {
    expect(resolveProducts('tarot, astrology, numerology')).toEqual([
      'tarot',
      'astrology',
      'numerology',
    ]);
  });

  it('strips the legacy -api suffix so old slug forms keep working', () => {
    expect(resolveProducts('tarot-api,astrology-api')).toEqual(['tarot', 'astrology']);
  });

  it('drops blank entries left by stray commas', () => {
    expect(resolveProducts('tarot, ,numerology,')).toEqual(['tarot', 'numerology']);
  });

  it('treats an all-blank value as unset and returns the defaults', () => {
    expect(resolveProducts(' , ')).toEqual(DEFAULT_PRODUCTS);
    expect(resolveProducts('')).toEqual(DEFAULT_PRODUCTS);
  });
});

describe('withCompactResponses', () => {
  it('injects compact true into every tool call at execute time', async () => {
    let seen: Record<string, unknown> | null = null;
    const tools = {
      demo: {
        description: 'demo',
        inputSchema: {},
        execute: async (args: Record<string, unknown>) => {
          seen = args;
          return 'ok';
        },
      },
    };
    const wrapped = withCompactResponses(tools as never);
    await wrapped.demo.execute?.({ sign: 'aries' } as never, {} as never);
    expect(seen).toEqual({ sign: 'aries', compact: true });
  });

  it('passes tools without an execute through unchanged', () => {
    const tools = { bare: { description: 'no execute', inputSchema: {} } };
    const wrapped = withCompactResponses(tools as never);
    expect(wrapped.bare).toBe(tools.bare);
  });
});

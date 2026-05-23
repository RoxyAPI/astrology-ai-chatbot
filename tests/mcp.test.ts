import { describe, expect, it } from 'vitest';
import { DEFAULT_PRODUCTS, resolveProducts } from '@/lib/mcp';

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

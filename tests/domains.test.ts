import { describe, expect, it } from 'vitest';
import { DOMAIN_LABELS, OPENERS, domainLabels, openersFor } from '@/lib/domains';
import { DEFAULT_PRODUCTS, resolveProducts } from '@/lib/mcp';

// The header strip and the sidebar tell a reader what the chatbot is connected to. A product added
// to the registry with no name here would show its slug on screen, which is the kind of thing
// nobody notices until a customer does.

describe('domainLabels', () => {
  it('names every product the chatbot ships connected to', () => {
    const unnamed = DEFAULT_PRODUCTS.filter((slug) => !(slug in DOMAIN_LABELS));
    expect(unnamed).toEqual([]);
  });

  it('keeps the order the products were configured in', () => {
    expect(domainLabels(['tarot', 'location'])).toEqual(['Tarot', 'Location']);
  });

  it('shows an unknown slug as itself rather than dropping it from the list', () => {
    expect(domainLabels(['tarot', 'not-a-product'])).toEqual(['Tarot', 'not-a-product']);
  });

  it('names what a trimmed environment resolves to, legacy slug form included', () => {
    expect(domainLabels(resolveProducts('tarot-api, astrology, location'))).toEqual([
      'Tarot',
      'Western astrology',
      'Location',
    ]);
  });
});

// An opening that names a reading the connected set cannot produce spends a first click on a
// fallback paragraph. That is the worst first impression the screen can make, and it is exactly
// what a trimmed ROXYAPI_PRODUCTS used to cause.

describe('openersFor', () => {
  it('offers all four on the products the chatbot ships connected to', () => {
    expect(openersFor(DEFAULT_PRODUCTS)).toHaveLength(4);
  });

  it('drops an opening whose domain is not connected', () => {
    const offered = openersFor(resolveProducts('tarot,astrology,location'));
    expect(offered).toHaveLength(3);
    expect(offered.map((opener) => opener.domain)).not.toContain('numerology');
    expect(offered.map((opener) => opener.text).join(' ')).not.toContain('Life path');
  });

  it('offers only what a single product deployment can answer, once it has two', () => {
    expect(openersFor(['astrology']).map((opener) => opener.domain)).toEqual([
      'astrology',
      'astrology',
    ]);
  });

  it('still shows two on a deployment that matches fewer, rather than a bare screen', () => {
    expect(openersFor(['dreams'])).toHaveLength(2);
    expect(openersFor([])).toHaveLength(2);
  });

  it('names a product that exists, so an opening cannot go stale against the registry', () => {
    const unknown = OPENERS.filter((opener) => !DEFAULT_PRODUCTS.includes(opener.domain));
    expect(unknown).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { DOMAIN_LABELS, domainLabels } from '@/lib/domains';
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

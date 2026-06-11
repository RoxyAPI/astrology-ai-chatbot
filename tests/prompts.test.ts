import { describe, expect, it } from 'vitest';
import { getSystemPrompt } from '@/lib/prompts';
import { DEFAULT_PRODUCTS } from '@/lib/mcp';

// The system prompt is what steers tool selection. Two failure modes have bitten
// real deployments: a chart domain wired into MCP but absent from the prompt (the
// model never offers it), and a missing "resolve location first" rule (the model
// calls a chart tool with no timezone, or tries to geocode a landmark, and the
// chart fails). These assertions are coarse on purpose — they guard the contract,
// not the wording.

describe('getSystemPrompt', () => {
  const prompt = getSystemPrompt().toLowerCase();

  it('embeds the resolved current date so "today" is never guessed from training data', () => {
    expect(getSystemPrompt()).toContain(new Date().toLocaleDateString('en-CA'));
  });

  it('instructs the model to resolve location before calling a chart tool', () => {
    expect(prompt).toContain('location');
    expect(prompt).toContain('timezone');
    expect(prompt).toMatch(/location first|before calling any chart/);
  });

  it('warns against geocoding landmarks instead of the nearest city', () => {
    expect(prompt).toMatch(/landmark|air base|airport|nearest/);
  });

  // The real-world failure was the model resolving the city but calling the chart
  // tool without the timezone, then reporting a "location" problem. The prompt must
  // insist the timezone is always sent and that the model self-corrects on error.
  it('requires the timezone on every chart call and forbids guessing it', () => {
    expect(prompt).toMatch(/required|always include|never omit/);
    expect(prompt).toContain('iana');
  });

  it('tells the model to retry instead of surfacing a tool error', () => {
    expect(prompt).toMatch(/self-correct|retry|do not give up/);
  });

  // Every chart domain connected via MCP must appear in the prompt, or the model
  // will not know the capability exists. Guards the human-design regression.
  it.each(['human design', 'forecast', 'biorhythm', 'vedic', 'western'])(
    'lists the %s capability',
    (domain) => {
      expect(prompt).toContain(domain);
    }
  );

  it('keeps the capability list in sync with the MCP product catalogue', () => {
    // location is the geocoding utility, not a user-facing reading domain.
    const readingDomains = DEFAULT_PRODUCTS.filter((slug) => slug !== 'location');
    for (const slug of readingDomains) {
      const term = slug.replace(/-/g, ' ').replace('iching', 'i-ching');
      expect(prompt, `prompt is missing the "${term}" domain`).toContain(term);
    }
  });
});

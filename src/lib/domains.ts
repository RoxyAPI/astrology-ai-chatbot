/**
 * @fileoverview Reading names for the product slugs this chatbot connects to.
 *
 * The header strip and the sidebar both list what is wired up, and the home page resolves that list
 * from the same environment variable the MCP registry reads, so the connected set on screen is the
 * connected set in the environment rather than a list somebody kept in step by hand. A slug added
 * to the registry without a name here fails a test.
 *
 * Nothing in here reaches for the registry itself: this module is read by the browser, and the
 * registry is a server module holding an API key.
 */

/** Slug to the name a reader would recognise. Keyed by the canonical `/mcp/{slug}` short form. */
export const DOMAIN_LABELS: Record<string, string> = {
  astrology: "Western astrology",
  "vedic-astrology": "Vedic astrology",
  tarot: "Tarot",
  numerology: "Numerology",
  "human-design": "Human design",
  forecast: "Forecast",
  "chinese-astrology": "Chinese astrology",
  "feng-shui": "Feng shui",
  biorhythm: "Biorhythm",
  crystals: "Crystals",
  "angel-numbers": "Angel numbers",
  iching: "I Ching",
  dreams: "Dreams",
  location: "Location",
};

/**
 * Names the given slugs, keeping the order they were configured in.
 *
 * @remarks A slug with no name of its own is shown as itself rather than dropped, so a product
 * added upstream still appears on screen the day it is enabled.
 *
 * @example
 *   domainLabels(["tarot", "location"]) // ["Tarot", "Location"]
 */
export function domainLabels(slugs: readonly string[]): string[] {
  return slugs.map((slug) => DOMAIN_LABELS[slug] ?? slug);
}

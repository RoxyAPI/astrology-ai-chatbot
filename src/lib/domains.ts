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
  forecast: "Forecast",
  "human-design": "Human design",
  "chinese-astrology": "Chinese astrology",
  "feng-shui": "Feng shui",
  "mesoamerican-astrology": "Mesoamerican astrology",
  vastu: "Vastu",
  numerology: "Numerology",
  kabbalah: "Kabbalah",
  tarot: "Tarot",
  biorhythm: "Biorhythm",
  ayurveda: "Ayurveda",
  iching: "I Ching",
  crystals: "Crystals",
  dreams: "Dreams",
  "angel-numbers": "Angel numbers",
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

/** One way in, and the product that answers it. */
export interface Opener {
  text: string;
  /** The product slug that has to be connected for this reading to be possible. */
  domain: string;
}

/** The openings the screen offers, in the order they are shown. */
export const OPENERS: readonly Opener[] = [
  { text: "Draw a card for today", domain: "tarot" },
  { text: "Read my birth chart", domain: "astrology" },
  { text: "Where is the moon right now?", domain: "astrology" },
  { text: "Life path number for 22 March 1995", domain: "numerology" },
];

/** How many openings the screen shows even when very little is connected. */
const MIN_OPENERS = 2;

/**
 * The openings this deployment can actually answer.
 *
 * @remarks Offering a reading the connected set cannot produce spends a first click on a fallback
 * paragraph, which is the worst possible first impression. A deployment trimmed below two matches
 * is topped up in order rather than left with a bare screen: two openings that may not all land
 * beats one, and the model says plainly when a domain is not connected.
 *
 * @example
 *   openersFor(["tarot", "astrology", "location"]) // three, no numerology
 */
export function openersFor(slugs: readonly string[]): Opener[] {
  const connected = new Set(slugs);
  const offered = OPENERS.filter((opener) => connected.has(opener.domain));
  if (offered.length >= MIN_OPENERS) return offered;
  const rest = OPENERS.filter((opener) => !offered.includes(opener));
  return [...offered, ...rest].slice(0, MIN_OPENERS);
}

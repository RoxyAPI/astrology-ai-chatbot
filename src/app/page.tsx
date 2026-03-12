import { ChatPanel } from "@/components/chat";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Insight AI - Free AI Horoscope, Tarot Reading & Astrology Chatbot",
      "url": "https://insight.roxyapi.com",
      "description":
        "Free AI astrology chatbot powered by real astronomical calculations, not AI hallucinations. Get daily horoscopes for all zodiac signs, tarot card readings, numerology life path calculations, birth chart analysis, crystal healing guidance, Vedic astrology (Kundli), I-Ching wisdom, angel number meanings, and dream interpretation. Every reading is computed from verified data, then interpreted by AI. Multilingual.",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "inLanguage": ["en", "hi", "es", "fr", "de", "pt", "ja", "zh"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "creator": {
        "@type": "Organization",
        "name": "RoxyAPI",
        "url": "https://roxyapi.com",
      },
      "featureList": [
        "Daily, weekly, and monthly horoscopes for all 12 zodiac signs",
        "Tarot three-card spreads (Past, Present, Future)",
        "Daily tarot card and yes/no tarot oracle",
        "Numerology Life Path number calculation",
        "Western natal chart analysis with houses and aspects",
        "Moon phase tracking with zodiac position",
        "Crystal and gemstone healing properties lookup",
        "Vedic astrology birth chart (Kundli) readings",
        "Vimshottari Dasha period analysis",
        "Gun Milan / Ashtakoot compatibility matching",
        "Panchang with Tithi, Nakshatra, Yoga, Karana",
        "Angel number spiritual interpretations",
        "I-Ching hexagram readings with changing lines",
        "Dream symbol interpretation for 2000+ symbols",
        "Multilingual: responds in your language",
      ],
      "keywords":
        "horoscope today, daily horoscope, tarot reading, astrology chatbot, numerology, zodiac signs, birth chart, crystal healing, vedic astrology, kundli, angel numbers, dream interpretation, I-Ching, compatibility, life path number",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Vedic birth chart (Kundli)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Vedic birth chart (Kundli) maps planetary positions at your exact time and place of birth using the sidereal zodiac. It reveals insights about personality, career, relationships, and life events through 12 houses and 9 planets (Navagraha). This chatbot calculates your Kundli from verified astronomical data.",
          },
        },
        {
          "@type": "Question",
          "name": "How does an AI tarot reading work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI tarot readings use verified randomization to draw cards from a standard 78-card Rider-Waite deck, then an AI interprets the cards in context of your question. Readings include upright and reversed meanings, positional significance (Past, Present, Future), and personalized spiritual guidance.",
          },
        },
        {
          "@type": "Question",
          "name": "What is a Life Path number in numerology?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your Life Path number is the most important number in numerology. It is calculated by reducing your full birth date to a single digit (or master number 11, 22, 33). It reveals your life purpose, natural talents, challenges, and the overall direction of your journey.",
          },
        },
        {
          "@type": "Question",
          "name": "What are angel numbers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Angel numbers are repeating number sequences like 111, 222, 333, 444, and 1111 that carry spiritual messages. Each sequence has a unique meaning related to guidance, confirmation, or encouragement from the universe. This chatbot interprets any angel number you encounter.",
          },
        },
        {
          "@type": "Question",
          "name": "How do crystals help with healing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Crystals are believed to carry unique vibrational energies that interact with the body's energy field. Each crystal has specific properties: amethyst for calm and intuition, rose quartz for love, citrine for abundance, and black tourmaline for protection. This chatbot can look up healing properties for any crystal or gemstone.",
          },
        },
        {
          "@type": "Question",
          "name": "Are AI horoscope and astrology readings accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most AI astrology chatbots simply make up readings using language models. Insight AI is different: every planetary position, birth chart, and horoscope is computed from real astronomical ephemeris data using verified mathematical engines. The AI then interprets the real calculated data, rather than hallucinating it. This means your birth chart shows actual planet positions at your time of birth, not fabricated ones.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChatPanel />
    </>
  );
}

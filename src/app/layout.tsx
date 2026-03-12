import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarField } from "@/components/StarField";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insight AI | Free AI Horoscope, Tarot Reading & Astrology Chatbot",
  description:
    "Free AI-powered astrology chatbot. Daily horoscopes, tarot card readings, numerology calculator, birth chart analysis, crystal healing, Vedic astrology (Kundli), I-Ching, and dream interpretation. Multilingual. Powered by RoxyAPI.",
  keywords: [
    "horoscope today",
    "daily horoscope",
    "tarot reading online",
    "astrology chatbot",
    "numerology calculator",
    "birth chart reading",
    "zodiac signs",
    "crystal healing",
    "vedic astrology",
    "kundli",
    "angel numbers",
    "dream interpretation",
    "I-Ching reading",
    "life path number",
    "tarot card meaning",
    "compatibility",
  ],
  openGraph: {
    title: "Insight AI | Free AI Horoscope, Tarot Reading & Astrology Chatbot",
    description:
      "Get daily horoscopes, tarot readings, numerology calculations, birth charts, crystal guidance, and more. AI-powered spiritual advisor that speaks your language.",
    type: "website",
    siteName: "Insight AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-space antialiased`}>
        <StarField />
        {children}
      </body>
    </html>
  );
}

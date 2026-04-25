import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarField } from "@/components/StarField";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Astrology Chatbot | Western, Vedic, Tarot, Numerology, Biorhythm",
  description:
    "Open source AI astrology chatbot. Western birth charts, Vedic kundli (Janam Kundli, Vimshottari Dasha, Gun Milan, Panchang, doshas, KP), tarot spreads, numerology, biorhythm, I-Ching, dreams, crystals, angel numbers. 130+ MCP tools verified against NASA JPL Horizons. Multilingual. Powered by RoxyAPI.",
  keywords: [
    "ai astrology chatbot",
    "vedic astrology api",
    "kundli",
    "janam kundli",
    "panchang",
    "gun milan",
    "vimshottari dasha",
    "kp astrology",
    "western birth chart",
    "natal chart",
    "tarot reading",
    "celtic cross",
    "numerology calculator",
    "life path number",
    "biorhythm",
    "i-ching",
    "hexagram",
    "dream interpretation",
    "angel numbers",
    "crystal healing",
    "model context protocol",
    "mcp astrology",
    "roxyapi",
  ],
  openGraph: {
    title: "AI Astrology Chatbot | Western, Vedic, Tarot, Numerology, Biorhythm",
    description:
      "Open source AI chatbot powered by 130+ verified MCP tools. Real Western and Vedic birth charts, tarot, numerology, biorhythm, I-Ching, dreams, crystals, angel numbers. Calculations verified against NASA JPL Horizons. Clone, add keys, deploy in 30 minutes.",
    type: "website",
    siteName: "AI Astrology Chatbot",
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

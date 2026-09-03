import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { StarField } from "@/components/StarField";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

/** Editorial display serif. The wordmark, the welcome, and the title on a drawn result. */
const display = Fraunces({ subsets: ["latin"], variable: "--font-display-var", display: "swap" });

/** Everything read at length: the transcript, the controls, the labels. */
const sans = Inter({ subsets: ["latin"], variable: "--font-sans-var", display: "swap" });

export const metadata: Metadata = {
  title: "AI Astrology Chatbot | Western, Vedic, Tarot, Numerology, Biorhythm",
  description:
    "Open source AI astrology chatbot. Western birth charts, Vedic kundli (Janam Kundli, Vimshottari Dasha, Gun Milan, Panchang, doshas, KP), human design, BaZi four pillars, feng shui, tarot spreads, numerology, biorhythm, I-Ching, dreams, crystals, angel numbers. 200+ MCP tools verified against NASA JPL Horizons. Multilingual. Powered by RoxyAPI.",
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
    "chinese astrology",
    "bazi calculator",
    "four pillars of destiny",
    "feng shui",
    "flying star chart",
    "kua number",
    "model context protocol",
    "mcp astrology",
    "roxyapi",
  ],
  openGraph: {
    title: "AI Astrology Chatbot | Western, Vedic, Tarot, Numerology, Biorhythm",
    description:
      "Open source AI chatbot powered by 200+ verified MCP tools. Real Western and Vedic birth charts, human design, BaZi four pillars, feng shui, tarot, numerology, biorhythm, I-Ching, dreams, crystals, angel numbers. Calculations verified against NASA JPL Horizons. Clone, add keys, deploy in 30 minutes.",
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
    // The theme class is written onto this element before the first paint, which is a difference
    // the server could not have known about, so the warning about it is suppressed here and nowhere
    // else.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} antialiased`}
    >
      <body className="bg-sky min-h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <StarField />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

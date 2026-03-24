# Insight AI - Astrology, Tarot & Numerology Chatbot

[![Get API Key](https://img.shields.io/badge/Get_API_Key-RoxyAPI-teal?style=for-the-badge)](https://roxyapi.com/pricing)
[![Read Docs](https://img.shields.io/badge/Read_Docs-roxyapi.com-blue?style=for-the-badge)](https://roxyapi.com/docs)
[![MCP Docs](https://img.shields.io/badge/MCP_Docs-Integration-purple?style=for-the-badge)](https://roxyapi.com/docs/mcp)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/RoxyAPI/astrology-ai-chatbot&env=ROXYAPI_KEY,GOOGLE_GENERATIVE_AI_API_KEY&envDescription=API%20keys%20for%20RoxyAPI%20and%20your%20LLM%20provider&envLink=https://roxyapi.com/pricing)

An AI chatbot that gives horoscope readings, draws tarot cards, calculates numerology, interprets dreams, and more — backed by real astronomical calculations via [RoxyAPI](https://roxyapi.com), not LLM hallucinations. Ships with MCP tool discovery, multi-provider LLM support, and a space-themed UI.

**Clone. Add keys. Deploy. Production chatbot in 30 minutes.**

![Insight AI - Empty State](screenshots/screenshot-01.png)

![Insight AI - Chat Response](screenshots/screenshot-02.png)

## Why This Exists

Most AI astrology chatbots hallucinate planet positions, make up tarot spreads, and invent numerology results. This one calls [RoxyAPI's 110+ verified endpoints](https://roxyapi.com/docs) via [MCP](https://roxyapi.com/docs/mcp) (Model Context Protocol), gets real computed data from astronomical ephemeris engines and mathematical models, then has the LLM interpret it. Every birth chart, every tarot draw, every Life Path calculation is backed by actual computation.

**8 domains. Auto-discovered tools via MCP. Multilingual. Any LLM.**

| Domain | What You Can Ask |
|--------|-----------------|
| **Horoscopes** | Daily, weekly, monthly horoscopes for all 12 zodiac signs |
| **Tarot** | Three-card spreads, daily card pull, yes/no oracle |
| **Numerology** | Life Path number, expression number, compatibility |
| **Western Astrology** | Natal chart, planetary aspects, moon phases |
| **Vedic Astrology** | Birth chart (Kundli), Vimshottari Dasha, Gun Milan, Panchang |
| **Crystals** | Healing properties, chakra associations, gemstone recommendations |
| **Angel Numbers** | Spiritual meaning of 111, 222, 333, 444, 1111, and more |
| **I-Ching & Dreams** | Hexagram readings, dream symbol interpretation (2,000+ symbols) |

Responds in the user's language automatically — Hindi, Spanish, French, German, Japanese, and more.

## Quick Start

```bash
git clone https://github.com/RoxyAPI/astrology-ai-chatbot.git
cd astrology-ai-chatbot
npm install
cp env.example .env.local
# Add your keys to .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000) and start chatting.

You need two keys:

| Key | Where to get it |
|-----|----------------|
| **RoxyAPI** | [roxyapi.com/pricing](https://roxyapi.com/pricing) — powers all readings and calculations |
| **LLM** | Google, Anthropic, or OpenAI — interprets the data (see below) |

## Choose Your LLM

Swap providers with one env var. All three use Vercel AI SDK's unified interface — same code, different model:

| Provider | Env Var | Model | Cost / 1M tokens |
|----------|---------|-------|-------------------|
| **Google Gemini** (default) | `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini 2.0 Flash | $0.10 / $0.40 — has free tier |
| Anthropic | `ANTHROPIC_API_KEY` | Claude Haiku 4.5 | $1.00 / $5.00 |
| OpenAI | `OPENAI_API_KEY` | GPT-4o Mini | $0.15 / $0.60 |

```env
LLM_PROVIDER=gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

## How It Works

```
User message → LLM picks a tool → MCP calls RoxyAPI → Real data returned → LLM interprets → Streams to user
```

1. User asks a question ("What does my Saturn placement mean?")
2. The LLM selects the right tool from 100+ auto-discovered MCP tools
3. [RoxyAPI](https://roxyapi.com) computes the answer from verified astronomical/mathematical engines
4. The LLM interprets the structured data into a natural, personalized response
5. Response streams back in real-time with markdown formatting

No prompt-stuffing. No fake data. No hardcoded horoscopes.

## MCP Tool Discovery

This chatbot uses [Model Context Protocol (MCP)](https://modelcontextprotocol.io) to automatically discover all available tools from [RoxyAPI](https://roxyapi.com) at runtime. No manual endpoint wiring — all 110+ tools across 8 domains are ready to use out of the box.

### How MCP connections work

MCP connections are initialized **once** and cached automatically. The first request after a deploy takes ~1-2 seconds to set up; every request after that reuses the cached tools instantly.

### Choosing which products to enable

By default all 8 RoxyAPI products are enabled (~110 tools). To use a subset, set the `ROXYAPI_PRODUCTS` env var:

```env
# Enable only tarot and astrology (fewer tools = faster model selection)
ROXYAPI_PRODUCTS=tarot-api,astrology-api
```

Available product slugs: `astrology-api`, `vedic-astrology-api`, `tarot-api`, `numerology-api`, `crystals-api`, `angel-numbers-api`, `iching-api`, `dreams-api`

### Tool count recommendations

| Tool Count | LLM Behavior | Recommendation |
|-----------|--------------|----------------|
| **10-30 tools** | Fast, accurate tool selection | Best for focused use cases (e.g. tarot + astrology only) |
| **30-80 tools** | Good with capable models (Gemini Flash, GPT-4o Mini, Claude Haiku) | Good balance for most deployments |
| **80-120 tools** | Works but slower; model may occasionally pick the wrong tool | Fine with the default setup, increase `MAX_TOOL_STEPS` if needed |
| **120+ tools** | Not recommended — tool descriptions start competing for context | Trim to the products you actually need |

> **Tip**: If you're building a focused product (e.g. a tarot-only app), set `ROXYAPI_PRODUCTS=tarot-api` to give the LLM fewer options and faster, more accurate tool selection.

## Architecture

```
src/
├── app/
│   ├── api/chat/route.ts    # Chat endpoint — streamText + MCP tools
│   ├── layout.tsx            # Root layout, metadata, JSON-LD SEO
│   ├── page.tsx              # Home page with structured data
│   └── globals.css           # Space theme, star animations, glass UI
├── components/
│   ├── chat/
│   │   ├── ChatPanel.tsx     # Main chat container with useChat
│   │   ├── MessageList.tsx   # Messages, typing indicator, suggestions
│   │   ├── MessageBubble.tsx # Markdown rendering for assistant messages
│   │   └── MessageInput.tsx  # Input field + send/stop button
│   └── StarField.tsx         # Animated star background (CSS)
└── lib/
    ├── ai.ts                 # Multi-provider LLM config (Gemini/Claude/GPT)
    ├── mcp.ts                # MCP client — connects to RoxyAPI and caches all tools
    └── prompts.ts            # System prompt — personality, capabilities, multilingual
```

Key design decisions:
- **MCP over REST** — tools are auto-discovered from RoxyAPI's MCP servers. No manual endpoint definitions needed.
- **Persistent MCP connections** — connections are initialized once and cached. No per-request overhead.
- **Server-side only** — all API keys stay in the Next.js API route. Nothing leaks to the client bundle.
- **Model agnostic** — Vercel AI SDK v6 abstracts the LLM. Swap Gemini for Claude or GPT with one env var.
- **SSR + JSON-LD** — structured data and meta tags render server-side for search engine visibility.

## Features

- **Markdown responses** — assistant messages render with full markdown support (headings, bold, lists, code blocks, tables, links)
- **Typing indicator** — animated dots show during the submitted and streaming phases until text arrives
- **Stop button** — cancel a long-running response mid-stream
- **Sticky input** — chat input stays pinned at the bottom; only the message body scrolls
- **Rate limiting** — built-in per-IP rate limiter (20 req/min) to protect LLM API credits
- **Input validation** — request body validation with message count cap to prevent abuse
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Accessible** — ARIA labels on interactive elements, `role="log"` on the message list

## Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| AI | [Vercel AI SDK v6](https://ai-sdk.dev) — streaming, tool calling, multi-provider |
| Data | [RoxyAPI](https://roxyapi.com) — 110+ endpoints, 8 domains, native [MCP](https://roxyapi.com/docs/mcp) |
| Tool Discovery | [MCP](https://modelcontextprotocol.io) via `@ai-sdk/mcp` — auto-discovers tools at runtime |
| UI | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + custom space theme |
| Types | [openapi-typescript](https://openapi-ts.dev) — generated from RoxyAPI OpenAPI spec |
| SEO | Server-rendered JSON-LD (schema.org), Open Graph, keyword meta tags |

## Customize

**AI personality** — edit [`src/lib/prompts.ts`](src/lib/prompts.ts). Make it mystical, clinical, casual, or match your brand.

**Which domains** — set the `ROXYAPI_PRODUCTS` env var, or edit the product list in [`src/lib/mcp.ts`](src/lib/mcp.ts).

**UI theme** — components are in [`src/components/chat/`](src/components/chat/). Star field, colors, and glass effects are in [`globals.css`](src/app/globals.css). Everything is Tailwind — no CSS-in-JS.

**API types** — run `npm run generate:types` to regenerate TypeScript types from the latest [RoxyAPI OpenAPI spec](https://roxyapi.com/docs).

**Tool step limit** — set `MAX_TOOL_STEPS` in your env to control how many tool-call round-trips the LLM can make per message (default: 5).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ROXYAPI_KEY` | Yes | — | Your RoxyAPI API key ([get one](https://roxyapi.com/pricing)) |
| `LLM_PROVIDER` | No | `gemini` | LLM provider: `gemini`, `anthropic`, or `openai` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | If Gemini | — | Google AI API key |
| `ANTHROPIC_API_KEY` | If Anthropic | — | Anthropic API key |
| `OPENAI_API_KEY` | If OpenAI | — | OpenAI API key |
| `ROXYAPI_MCP_URL` | No | `https://roxyapi.com/mcp` | Base URL for MCP endpoints |
| `ROXYAPI_PRODUCTS` | No | All 8 products | Comma-separated list of product slugs to enable |
| `MAX_TOOL_STEPS` | No | `5` | Max tool-call round-trips per message |

## Deploy

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RoxyAPI/astrology-ai-chatbot&env=ROXYAPI_KEY,GOOGLE_GENERATIVE_AI_API_KEY&envDescription=API%20keys%20for%20RoxyAPI%20and%20your%20LLM%20provider&envLink=https://roxyapi.com/pricing)

Or deploy anywhere that runs Node.js:

```bash
npm run build && npm start
```

## Security

- API keys are server-side only — never exposed to the browser
- All RoxyAPI calls happen in the Next.js API route via MCP, not the client
- Per-IP rate limiting on the chat endpoint (20 requests/minute)
- Request body validation with message count limits
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Markdown rendered safely via `react-markdown` (no `dangerouslySetInnerHTML`, HTML is escaped)
- External links use `rel="noopener noreferrer"` to prevent tab-nabbing

## FAQ

### How many tools can the LLM handle?

The default setup exposes ~110 tools from 8 RoxyAPI products. Modern models like Gemini 2.0 Flash, GPT-4o Mini, and Claude Haiku 4.5 handle this well. If you see the model picking the wrong tool or making excessive tool calls, reduce the product count via `ROXYAPI_PRODUCTS` — fewer tools means faster, more accurate selection.

### The chatbot is unstable / sometimes doesn't respond

This is almost always caused by MCP initialization timing out. The default `maxDuration` is 60 seconds, which should be enough. If you're on Vercel's Hobby plan (10s limit), upgrade to Pro or reduce the number of products. Also check that your `ROXYAPI_KEY` is valid.

### Can I use this with my own MCP server?

Yes. Edit [`src/lib/mcp.ts`](src/lib/mcp.ts) — the `PRODUCTS` array and `MCP_BASE` URL are all you need to change. The caching and connection logic works with any Streamable HTTP MCP server.

### Do MCP connections stay open forever?

MCP connections persist for the lifetime of your server process. On Vercel, they're automatically refreshed when your function recycles after a period of inactivity. You don't need to manage connection lifecycle manually.

### Why is the first message slow?

The first request after a deploy (or after your server has been idle for a while) initializes all MCP connections and fetches tool definitions (~1-2 seconds). Every request after that is instant.

### How do I change the AI personality?

Edit the system prompt in [`src/lib/prompts.ts`](src/lib/prompts.ts). The default personality is a warm, knowledgeable spiritual advisor. You can make it more mystical, clinical, casual, or match your brand voice.

### Can I disable specific product domains?

Yes. Set `ROXYAPI_PRODUCTS` in your environment to only include the slugs you want:

```env
ROXYAPI_PRODUCTS=tarot-api,numerology-api
```

### Is this free to use?

The code is free and open source. You'll need a [RoxyAPI key](https://roxyapi.com/pricing) (you can [request a free test key](https://roxyapi.com/contact) to try it out) and an LLM provider key (Gemini has a free tier).

## Links

| Resource | URL |
|----------|-----|
| RoxyAPI Homepage | [roxyapi.com](https://roxyapi.com) |
| API Documentation | [roxyapi.com/docs](https://roxyapi.com/docs) |
| MCP Integration | [roxyapi.com/docs/mcp](https://roxyapi.com/docs/mcp) |
| Pricing | [roxyapi.com/pricing](https://roxyapi.com/pricing) |
| All Products | [roxyapi.com/products](https://roxyapi.com/products) |
| Starter Apps | [roxyapi.com/starters](https://roxyapi.com/starters) |

---

Built with [RoxyAPI](https://roxyapi.com) — the data engine behind real astrology, tarot, and numerology calculations.

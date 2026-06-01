# Agents Guide

This is the RoxyAPI flagship demo, an open source AI astrology chatbot built with Next.js 16 and the Vercel AI SDK. It auto discovers remote RoxyAPI MCP servers at runtime, so the LLM has access to roughly 145 verified tools across 11 spiritual domains plus location geocoding without any hardcoded endpoint wiring.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Copy `env.example` to `.env.local` and set:
  - `ROXYAPI_KEY` for RoxyAPI access
  - One LLM provider key: `GOOGLE_GENERATIVE_AI_API_KEY` (default), `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY`
  - Optional `LLM_PROVIDER` env var: `gemini`, `anthropic`, or `openai`
  - Optional `ROXYAPI_PRODUCTS` to limit which MCP servers connect, for example `tarot,astrology,location`
- Install with `npm install`
- Run with `npm run dev` and open http://localhost:3000

## How to call RoxyAPI
- This chatbot does not call the REST API directly. The LLM picks a tool, the tool runs through MCP, MCP calls RoxyAPI, the LLM streams an interpretation back.
- Base URL when you do need REST: `https://roxyapi.com/api/v2`
- Auth header: `X-API-Key: <key>`
- Live OpenAPI spec: https://roxyapi.com/api/v2/openapi.json
- Live playground: https://roxyapi.com/api-reference

## MCP servers used in this app
- Per product Streamable HTTP MCP servers at `https://roxyapi.com/mcp/{slug}`, for example `/mcp/astrology`, `/mcp/vedic-astrology`, `/mcp/tarot`, `/mcp/numerology`, `/mcp/location`
- All 12 product slugs are available: `astrology`, `vedic-astrology`, `tarot`, `numerology`, `human-design`, `forecast`, `biorhythm`, `crystals`, `angel-numbers`, `iching`, `dreams`, `location`
- Connections are initialized once and cached, so the first request after a deploy takes a second or two and every following request reuses the cached tool list

## Where to extend
- `src/app/api/chat/route.ts` is the chat handler. Streams Vercel AI SDK responses, wires up the LLM and the discovered MCP tools.
- `src/lib/mcp.ts` is the MCP server registry and discovery layer. Add or remove product slugs here.
- `src/lib/ai.ts` is the LLM provider switch. Add a new provider by extending the model factory.
- `src/lib/prompts.ts` is the system prompt. Tune persona and tool selection guidance here.
- `src/app/page.tsx` is the chat UI. Style and layout live here and in `src/components/`.

## Conventions
- Next.js App Router with server components. The chat route is a streaming POST endpoint.
- Tool listings are auto discovered. Do not hardcode endpoint URLs in the chatbot. If a tool is missing, add the product slug to `ROXYAPI_PRODUCTS` or to the MCP registry, do not bypass MCP with raw fetch.
- Verified accuracy claims are cross referenced against NASA JPL Horizons DE441. Never claim the calculation engine is "open source". The public framing is "Roxy Ephemeris".

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP docs: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- Open benchmark: https://github.com/RoxyAPI/astrology-api-benchmark
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing

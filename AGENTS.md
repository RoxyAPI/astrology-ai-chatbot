# Agents Guide

This is an MIT licensed RoxyAPI template: a white label AI astrology chatbot built with Next.js 16 and the Vercel AI SDK, made to be cloned, customised, rebranded, and resold as your own product. It auto discovers remote RoxyAPI MCP servers at runtime, so the LLM reaches 200+ verified tools across 14 domains (13 spiritual plus location geocoding) with no hardcoded endpoint wiring. You are most likely a coding agent helping someone build their own product on top of this template. More templates to fork: https://roxyapi.com/starters

## Canonical RoxyAPI references (use these, do not guess)

Prefer these live sources over memory for any RoxyAPI path, field, SDK method, or limit. They are always current.

- **Docs MCP (no API key):** connect `https://roxyapi.com/mcp/docs` (Streamable HTTP, one tool `search_docs`). Ask it for any endpoint, field, auth detail, or integration step instead of hardcoding a path. `{ "mcpServers": { "roxy-docs": { "type": "http", "url": "https://roxyapi.com/mcp/docs" } } }`
- **Agent playbook:** `https://roxyapi.com/AGENTS.md`, implementation rules for building on RoxyAPI.
- **Discovery context:** `https://roxyapi.com/llms.txt` (concise) and `https://roxyapi.com/llms-full.txt` (deep).
- **Live OpenAPI spec:** `https://roxyapi.com/api/v2/openapi.json`, the source of truth for every field and example. Never invent a response field.
- **Live playground:** `https://roxyapi.com/api-reference`. **Sitemap:** `https://roxyapi.com/sitemap.txt`.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Copy `.env.example` to `.env.local` and set:
  - `ROXYAPI_KEY` for RoxyAPI access
  - One LLM provider key: `GOOGLE_GENERATIVE_AI_API_KEY` (default), `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY`
  - Optional `LLM_PROVIDER`: `gemini`, `anthropic`, or `openai`
  - Optional `ROXYAPI_PRODUCTS` to limit which MCP servers connect, e.g. `astrology,tarot,location`
- `npm install`, then `npm run dev`, then open http://localhost:3000
- `npm test` runs the vitest suite (env resolution, product resolution, system-prompt contract, tool widget mapping)

## How data flows
- This chatbot never calls the REST API directly. The LLM picks a tool, the tool runs through MCP, MCP calls RoxyAPI, the LLM streams an interpretation back.
- Every completed tool call also renders: `src/lib/tool-widgets.ts` reads the `dynamic-tool` parts of the assistant message, asks `componentForTool` from `@roxyapi/ui-react` which component draws that tool name, parses the JSON text block, and `ToolWidget.tsx` mounts it above the interpretation in the same bubble. Nothing is listed per tool: enable a product in `src/lib/mcp.ts` and its results render. A tool no component covers keeps the written answer. Compact results are decoded inside the component, so leave `compact` on. Full pattern: https://roxyapi.com/docs/tutorials/ai-chat-widgets
- When you do need REST: base URL `https://roxyapi.com/api/v2`, auth header `X-API-Key: <key>`.

## Rule: location first, charts second
Every chart tool (Western, Vedic, Human Design, Forecast, Chinese astrology BaZi, Biorhythm) needs a correct `timezone`; most also need `latitude` and `longitude`. BaZi is the exception that still needs the timezone: it reads the hour pillar from the birth clock and takes coordinates only when asked for a solar or local-mean hour. The model must resolve the birthplace with the `location` search tool first, then pass the returned IANA timezone (and coordinates) to the chart tool. Search the nearest well-known city, never a landmark, airport, base, or village. This guidance lives in `src/lib/prompts.ts`. keep it when you customise the persona, or chart calls will fail for users who give a vague birthplace. Keep the `location` slug enabled whenever any chart product is enabled.

## Where to extend
- `src/lib/prompts.ts`, system prompt: persona, capability list, and the location-first rule. Tune tone here; preserve the tool-selection guidance.
- `src/lib/mcp.ts`, MCP server registry and discovery. Add or remove product slugs here.
- `src/lib/ai.ts`, LLM provider switch. Add a provider by extending the model factory.
- `src/app/api/chat/route.ts`, streaming chat handler wiring the LLM to discovered MCP tools.
- `src/lib/tool-widgets.ts`, the map from a completed tool call to the component that draws its result. Pure and unit tested. Change what renders here, not in the view.
- `src/components/chat/ToolWidget.tsx`, renders that list above the prose in the assistant bubble. It is themed by the `--roxy-*` bridge in `src/app/globals.css`, which points every one of those tokens at the app palette, so recolour the palette and never restyle a component. `tests/design-tokens.test.ts` fails if a token is given a colour of its own or stops matching the radius scale. Every token, its light and dark default and what it paints: https://github.com/RoxyAPI/ui/blob/main/packages/ui/THEMING.md
- `src/app/page.tsx` + `src/components/`, chat UI, styling, layout.

## Conventions
- Next.js App Router with server components. The chat route is a streaming POST endpoint. API keys stay server-side, never in the client bundle.
- Tools are auto discovered. Do not hardcode endpoint URLs. If a tool is missing, add the product slug to `ROXYAPI_PRODUCTS` or the registry in `src/lib/mcp.ts`. Never bypass MCP with raw fetch.
- Accuracy is cross referenced against NASA JPL Horizons DE441. Never claim the calculation engine is open source. The public framing is "Roxy Ephemeris".

## Staying in sync with upstream
This repo is a template. When you build your own product on it, keep pulling RoxyAPI's improvements (new domains, prompt fixes, dependency bumps) without losing your customisations.

```bash
git remote add upstream https://github.com/RoxyAPI/astrology-ai-chatbot.git  # one time
git fetch upstream
git merge upstream/main        # or: git rebase upstream/main
```

- Keep your edits concentrated in `src/lib/prompts.ts` (persona) and the UI under `src/app/` and `src/components/` so merges stay clean.
- Treat `src/lib/mcp.ts`, `src/lib/ai.ts`, and `src/app/api/chat/route.ts` as upstream-owned. Prefer env vars (`ROXYAPI_PRODUCTS`, `LLM_PROVIDER`, `MAX_TOOL_STEPS`) over editing them.
- After merging, run `npm install` and `npm test`. The prompt-contract test fails fast if a customised prompt drops a connected domain or the location-first rule.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm `@roxyapi/sdk`) · Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI `roxy-sdk`)
- MCP docs: https://roxyapi.com/docs/mcp · Methodology: https://roxyapi.com/methodology · More starters: https://roxyapi.com/starters · Pricing: https://roxyapi.com/pricing

/**
 * @fileoverview MCP (Model Context Protocol) client manager for RoxyAPI.
 *
 * Maintains persistent MCP connections and caches tool definitions so they
 * are resolved once per server instance instead of on every chat request.
 * On a cold start the first request pays the initialization cost (~1-2 s);
 * every subsequent request reuses the cached tools with zero network overhead.
 *
 * Configuration (via environment variables):
 *  - ROXYAPI_MCP_URL    — Base URL for MCP endpoints (default: https://roxyapi.com/mcp)
 *  - ROXYAPI_KEY         — Your RoxyAPI API key
 *  - ROXYAPI_PRODUCTS    — Comma-separated list of API slugs to enable.
 *                          Defaults to all available products listed below.
 *
 * @example
 *   // .env — enable only tarot and astrology
 *   ROXYAPI_PRODUCTS=tarot-api,astrology-api
 *
 * @see https://roxyapi.com/docs       — RoxyAPI documentation
 * @see https://modelcontextprotocol.io — MCP specification
 */

import { createMCPClient, MCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const MCP_BASE = process.env.ROXYAPI_MCP_URL || "https://roxyapi.com/mcp";
const API_KEY = process.env.ROXYAPI_KEY || "";

if (!API_KEY) {
  console.warn(
    "[mcp] ROXYAPI_KEY is not set — MCP tool calls will fail. " +
      "Get a key at https://roxyapi.com/pricing"
  );
}

/**
 * Full catalogue of RoxyAPI MCP products.
 * Override at runtime with the ROXYAPI_PRODUCTS env var.
 */
const DEFAULT_PRODUCTS = [
  "astrology-api",
  "vedic-astrology-api",
  "tarot-api",
  "numerology-api",
  "crystals-api",
  "angel-numbers-api",
  "iching-api",
  "dreams-api",
];

const PRODUCTS: string[] = process.env.ROXYAPI_PRODUCTS
  ? process.env.ROXYAPI_PRODUCTS.split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_PRODUCTS;

/* ------------------------------------------------------------------ */
/*  Singleton cache                                                    */
/* ------------------------------------------------------------------ */

/** Cached tool map keyed by tool name → AI SDK tool object. */
let toolsCache: ToolSet | null = null;

/** Persistent MCP client instances (one per product). */
let clients: MCPClient[] | null = null;

/** Guards against thundering-herd on concurrent first requests. */
let initPromise: Promise<void> | null = null;

/**
 * Creates MCP clients for every configured product, fetches their tool
 * definitions, and caches the result at module scope.
 *
 * If a single product fails to initialize it is logged and skipped so
 * the remaining products are still available.
 */
async function initialize(): Promise<void> {
  const results = await Promise.allSettled(
    PRODUCTS.map(async (slug) => {
      const client = await createMCPClient({
        transport: {
          type: "http",
          url: `${MCP_BASE}/${slug}`,
          headers: { "X-API-Key": API_KEY },
        },
      });
      const tools = await client.tools();
      return { client, tools };
    })
  );

  const resolvedClients: MCPClient[] = [];
  const mergedTools: ToolSet = {};

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      resolvedClients.push(result.value.client);
      Object.assign(mergedTools, result.value.tools);
    } else {
      console.warn(
        `[mcp] Failed to initialize ${PRODUCTS[i]}:`,
        result.reason
      );
    }
  });

  clients = resolvedClients;
  toolsCache = mergedTools;

  console.log(
    `[mcp] Initialized ${resolvedClients.length}/${PRODUCTS.length} products — ${Object.keys(mergedTools).length} tools cached`
  );
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Returns the cached MCP tools, initializing on first call.
 *
 * Tools are backed by persistent MCP clients that live for the lifetime
 * of the server / lambda instance. There is no `close()` needed per
 * request — connections are reused automatically.
 *
 * @returns An object containing all available MCP tools.
 *
 * @example
 *   const { tools } = await getMCPTools();
 *   const result = streamText({ model, tools, messages });
 */
export async function getMCPTools(): Promise<{ tools: ToolSet }> {
  if (!toolsCache) {
    if (!initPromise) {
      initPromise = initialize().catch((err) => {
        // Reset so the next request retries instead of being stuck.
        initPromise = null;
        throw err;
      });
    }
    await initPromise;
  }

  return { tools: toolsCache! };
}

/**
 * Tears down all cached MCP clients and clears the tool cache.
 * Useful for graceful shutdown or forcing a re-initialization.
 */
export async function resetMCPClients(): Promise<void> {
  if (clients) {
    await Promise.allSettled(clients.map((c) => c.close()));
  }
  clients = null;
  toolsCache = null;
  initPromise = null;
}

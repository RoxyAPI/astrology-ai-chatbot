import { createMCPClient } from "@ai-sdk/mcp";

const MCP_BASE = process.env.ROXYAPI_MCP_URL || "https://roxyapi.com/mcp";
const API_KEY = process.env.ROXYAPI_KEY || "";

const PRODUCTS = [
  "astrology-api",
  "vedic-astrology-api",
  "tarot-api",
  "numerology-api",
  "crystals-api",
  "angel-numbers-api",
  "iching-api",
  "dreams-api",
];

export async function getMCPTools() {
  const clients = await Promise.all(
    PRODUCTS.map((slug) =>
      createMCPClient({
        transport: {
          type: "http",
          url: `${MCP_BASE}/${slug}`,
          headers: { "X-API-Key": API_KEY },
        },
      })
    )
  );

  const toolSets = await Promise.all(clients.map((c) => c.tools()));
  const tools = Object.assign({}, ...toolSets);

  const close = async () => {
    await Promise.all(clients.map((c) => c.close()));
  };

  return { tools, close };
}

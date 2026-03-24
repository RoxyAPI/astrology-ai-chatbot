/**
 * @fileoverview Chat API route — streams AI responses with RoxyAPI MCP tools.
 *
 * Uses the Vercel AI SDK to stream text from the configured LLM provider.
 * MCP tools are loaded once and cached across requests (see lib/mcp.ts).
 *
 * Configuration (via environment variables):
 *  - LLM_PROVIDER       — "gemini" (default) | "anthropic" | "openai"
 *  - MAX_TOOL_STEPS     — Maximum tool-call round-trips per message (default: 5)
 *
 * @see https://sdk.vercel.ai/docs — Vercel AI SDK documentation
 * @see https://roxyapi.com/docs   — RoxyAPI documentation
 */

import {
  convertToModelMessages,
  streamText,
  UIMessage,
  stepCountIs,
} from "ai";
import { getModel } from "@/lib/ai";
import { getMCPTools } from "@/lib/mcp";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

const MAX_TOOL_STEPS = Number(process.env.MAX_TOOL_STEPS) || 5;

/** Maximum number of messages allowed per request to prevent abuse. */
const MAX_MESSAGES = 100;

/** Simple in-memory rate limiter (per lambda instance). */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

/**
 * Returns the client IP from the request headers.
 * Falls back to "unknown" if no identifying header is present.
 */
function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Checks whether the given IP has exceeded the per-window rate limit.
 * Returns true if the request should be rejected.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/**
 * Validates the request body has a messages array with a reasonable size.
 * The AI SDK handles detailed UIMessage type validation internally.
 */
function validateMessages(body: unknown): body is { messages: UIMessage[] } {
  if (typeof body !== "object" || body === null) return false;
  const { messages } = body as Record<string, unknown>;
  return (
    Array.isArray(messages) &&
    messages.length >= 1 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (m: unknown) =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        "parts" in m
    )
  );
}

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: Request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return new Response("Too many requests. Please try again shortly.", {
        status: 429,
      });
    }

    // --- Input validation ---
    const body = await req.json();

    if (!validateMessages(body)) {
      return new Response("Invalid request body.", { status: 400 });
    }

    const { messages } = body;
    const { tools } = await getMCPTools();

    const result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(MAX_TOOL_STEPS),
      onStepFinish: isDev
        ? ({ toolCalls, toolResults, text }) => {
            for (const call of toolCalls) {
              const c = call as Record<string, unknown>;
              console.log(
                `[tool:call] ${c.toolName}`,
                JSON.stringify(c.args, null, 2)
              );
            }
            for (const res of toolResults) {
              const r = res as Record<string, unknown>;
              console.log(
                `[tool:result] ${r.toolName}`,
                JSON.stringify(r.result, null, 2)
              );
            }
            if (text) {
              console.log(
                `[ai:response]`,
                text.slice(0, 200) + (text.length > 200 ? "..." : "")
              );
            }
          }
        : undefined,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat] Unhandled error:", error);
    return new Response("Internal server error.", { status: 500 });
  }
}

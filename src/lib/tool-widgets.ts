"use client";

/**
 * @fileoverview Maps a chat message to the RoxyAPI components that draw its tool results.
 *
 * Every completed tool call carries the name the model used, and `componentForTool`
 * knows which component renders that name, so nothing here lists tools by hand:
 * enable another product in lib/mcp.ts and its results start rendering too.
 *
 * @see https://roxyapi.com/docs/tutorials/ai-chat-widgets for the pattern in full
 */

import { componentForTool } from "@roxyapi/ui-react";
import type { UIMessage } from "ai";

/** One component to draw, resolved from one completed tool call. */
export interface ToolWidgetSpec {
  /** React key. The id of the tool call that produced the result. */
  key: string;
  /** Export name of the wrapper in `@roxyapi/ui-react`. */
  pascal: string;
  /** Config attributes that pick the endpoint on a component covering several. */
  attrs?: Record<string, string>;
  /** The parsed tool result. Components decode the compact shape themselves. */
  data: unknown;
}

/** A tool result: one text block holding the JSON string, plus an error flag. */
interface ToolOutput {
  content?: { text?: string }[];
  isError?: boolean;
}

/**
 * Widgets already built, by tool call id.
 *
 * A streaming message is a new object on every chunk, so parsing again would hand
 * the component a new `data` object each time and redraw the whole chart under the
 * arriving prose. Handing back the same object leaves a finished chart alone. Held
 * in the browser for the length of the conversation, and bounded so a long one
 * cannot grow without limit.
 */
const built = new Map<string, ToolWidgetSpec>();
const MAX_REMEMBERED = 64;

/**
 * Returns the widgets to draw for one message, in the order the tools were called.
 *
 * @remarks
 * Anything the library cannot draw is skipped rather than reported: a lookup tool
 * with no chart, a failed call, or a result that is not JSON all leave the written
 * answer standing on its own.
 *
 * @example
 *   const widgets = toolWidgetsFor(message); // [{ pascal: "RoxyTarotCard", ... }]
 */
export function toolWidgetsFor(message: UIMessage): ToolWidgetSpec[] {
  const widgets: ToolWidgetSpec[] = [];

  for (const part of message.parts) {
    if (part.type !== "dynamic-tool" || part.state !== "output-available") continue;

    const known = built.get(part.toolCallId);
    if (known) {
      widgets.push(known);
      continue;
    }

    const output = part.output as ToolOutput | null;
    if (!output || output.isError) continue;

    const binding = componentForTool(part.toolName);
    if (!binding) continue;

    const text = output.content?.[0]?.text;
    if (typeof text !== "string") continue;

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      continue;
    }

    const widget: ToolWidgetSpec = {
      key: part.toolCallId,
      pascal: binding.pascal,
      attrs: binding.attrs,
      data,
    };

    if (built.size >= MAX_REMEMBERED) {
      const oldest = built.keys().next().value;
      if (oldest) built.delete(oldest);
    }
    built.set(part.toolCallId, widget);
    widgets.push(widget);
  }

  return widgets;
}

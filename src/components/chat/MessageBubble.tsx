"use client";

import type { UIMessage } from "ai";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toolWidgetsFor } from "@/lib/tool-widgets";
import { ToolWidget } from "./ToolWidget";

/**
 * One turn in the transcript.
 *
 * @remarks The person speaks in a box and the reply does not. A reading is the longest thing on the
 * screen and the drawing that comes with it is already a card, so boxing the words around it would
 * put a card inside a card and leave the chart the smaller of the two. The question keeps its box
 * because it is short, and because the eye needs the turns to be countable.
 *
 * A message is an array of parts, not a string. Reaching for a `content` field is the mistake this
 * version of the streaming library invites, and it fails silently by rendering nothing.
 */
export function MessageBubble({ message }: { message: UIMessage }) {
  const isPerson = message.role === "user";

  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const widgets = toolWidgetsFor(message);

  // A drawing arrives before the interpretation still being written, so a message is empty only
  // when it has neither.
  if (!text && widgets.length === 0) return null;

  if (isPerson) {
    return (
      <div className="flex justify-end">
        <p className="bg-card text-card-foreground max-w-[85%] rounded-2xl border px-4 py-2.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div>
      <ToolWidget widgets={widgets} />
      {text ? (
        <div className="prose-reply">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // A wide table scrolls in its own frame instead of widening the reply. Everything
              // else is styled once, in the stylesheet.
              table: ({ children }) => (
                <div className="table-scroll">
                  <table>{children}</table>
                </div>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {text}
          </Markdown>
        </div>
      ) : null}
    </div>
  );
}

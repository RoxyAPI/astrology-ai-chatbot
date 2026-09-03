"use client";

import type { UIMessage } from "ai";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toolWidgetsFor } from "@/lib/tool-widgets";
import { MessageBubble } from "./MessageBubble";

/**
 * Four ways in, filled into the composer rather than sent, so the first thing a reader does is read
 * the question and change it. The lead examples are the ones anybody can answer from their own
 * birthday.
 */
const OPENERS = [
  "Draw a card for today",
  "Read my birth chart",
  "Where is the moon right now?",
  "Life path number for 22 March 1995",
];

interface MessageListProps {
  messages: UIMessage[];
  busy: boolean;
  failed: boolean;
  onOpener: (text: string) => void;
}

export function MessageList({ messages, busy, failed, onOpener }: MessageListProps) {
  const end = useRef<HTMLDivElement>(null);

  // The wait indicator is only for the pause before anything shows. A drawing from a tool call
  // arrives before the words written about it, so it counts as showing something and the indicator
  // gives way to it rather than spinning beside a finished answer.
  const last = messages[messages.length - 1];
  const showing =
    last?.role === "assistant" &&
    (last.parts.some((part) => part.type === "text" && part.text.length > 0) ||
      toolWidgetsFor(last).length > 0);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  if (messages.length === 0) {
    return (
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite">
        {/* Centred in the column rather than pinned to the top of it, so an empty chat reads as a
            composed opening screen instead of a page waiting for the rest of itself. */}
        <div className="flex min-h-full items-center">
          <div className="thread-measure py-10">
            <div className="max-w-xl space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl leading-snug sm:text-3xl">
                  What would you like to look at?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every reading here is measured first and interpreted second, so the chart you get
                  back is the sky as it actually was. Ask anything, or start with one of these.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {OPENERS.map((opener) => (
                  <Button
                    key={opener}
                    variant="outline"
                    size="lg"
                    className="h-auto py-2 text-left whitespace-normal"
                    onClick={() => onOpener(opener)}
                  >
                    {opener}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="thin-scroll min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite">
      <div className="thread-measure py-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {busy && !showing ? (
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Reading
          </p>
        ) : null}

        {failed ? (
          <p className="text-destructive mt-6 text-sm">
            That reply did not come through. Ask again.
          </p>
        ) : null}

        <div ref={end} />
      </div>
    </div>
  );
}

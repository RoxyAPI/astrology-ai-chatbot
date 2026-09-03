"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Opener } from "@/lib/domains";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatPanelProps {
  /** The conversation this transcript belongs to. The shell re-keys on it. */
  id: string;
  /** Turns restored from the browser, if this conversation has been had before. */
  initialMessages?: UIMessage[];
  /** The openings this deployment can answer, shown on an empty screen. */
  openers: Opener[];
  onPersist: (id: string, messages: UIMessage[]) => void;
}

/**
 * One conversation: the transcript, the composer under it, and the attribution below that.
 *
 * @remarks The transport is built once per mount rather than per render, which keeps a strict mode
 * double mount and a hot reload from talking over each other. A turn is written to the browser only
 * once it has finished arriving, so a stream does not write on every chunk.
 */
export function ChatPanel({ id, initialMessages, openers, onPersist }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const composer = useRef<HTMLTextAreaElement>(null);
  const submitting = useRef(false);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, stop, status } = useChat({
    id,
    messages: initialMessages,
    transport,
  });

  const busy = status === "submitted" || status === "streaming";

  // A second submit lands before the status has moved off ready, so the guard is a ref rather than
  // the status: two quick presses of the send key would otherwise start two turns.
  useEffect(() => {
    if (!busy) submitting.current = false;
  }, [busy]);

  useEffect(() => {
    if (status !== "ready" || messages.length === 0) return;
    onPersist(id, messages);
  }, [status, messages, id, onPersist]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy || submitting.current) return;
      submitting.current = true;
      setInput("");
      sendMessage({ text: trimmed });
    },
    [busy, sendMessage],
  );

  const fillComposer = useCallback((text: string) => {
    setInput(text);
    composer.current?.focus();
  }, []);

  return (
    <>
      <MessageList
        openers={openers}
        messages={messages}
        busy={busy}
        failed={status === "error"}
        onOpener={fillComposer}
      />

      <div className="bg-background shrink-0 border-t">
        <div className="thread-measure pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <MessageInput
            ref={composer}
            input={input}
            setInput={setInput}
            onSend={() => send(input)}
            onStop={stop}
            busy={busy}
          />
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Powered by{" "}
            <a
              href="https://roxyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              // Underlined at rest rather than on hover: a link inside a line of text that is only
              // a colour apart from it is one a colour blind reader cannot find.
              className="text-primary underline underline-offset-2"
            >
              RoxyAPI
            </a>
            <span className="hidden sm:inline">
              . Real astronomical calculations, not AI hallucinations.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

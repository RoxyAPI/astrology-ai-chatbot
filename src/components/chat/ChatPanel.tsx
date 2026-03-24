"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Sparkles } from "lucide-react";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, stop, status } = useChat({ transport });

  const isActive = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="relative z-10 flex flex-col h-screen max-w-3xl mx-auto overflow-hidden">
      <header className="shrink-0 flex items-center gap-3 px-6 py-4 header-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-roxy/15 ring-1 ring-roxy/25">
          <Sparkles className="w-5 h-5 text-roxy" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            Insight AI
          </h1>
          <p className="text-sm text-zinc-500">
            Horoscopes, Tarot, Numerology, Astrology & More
          </p>
        </div>
      </header>

      <MessageList
        messages={messages}
        isLoading={isActive}
        onSuggestionClick={(text) => {
          sendMessage({ text });
        }}
      />

      {status === "error" && (
        <div className="shrink-0 px-6 py-2 text-sm text-red-400 bg-red-900/20">
          Something went wrong. Please try again.
        </div>
      )}

      <div className="shrink-0 bottom-panel">
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isActive}
          onStop={stop}
        />

        <footer className="px-6 pb-3 text-center text-xs text-zinc-500 space-y-1">
          <p>
            Powered by{" "}
            <a
              href="https://roxyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-roxy/80 hover:text-roxy transition-colors"
            >
              RoxyAPI
            </a>
            {" · "}
            <a
              href="https://github.com/RoxyAPI/astrology-ai-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              Clone this chatbot
            </a>
          </p>
          <p className="text-zinc-600">
            Real astronomical calculations, not AI hallucinations.
          </p>
        </footer>
      </div>
    </div>
  );
}

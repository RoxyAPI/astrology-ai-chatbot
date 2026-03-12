"use client";

import type { UIMessage } from "ai";
import { Sparkles, User } from "lucide-react";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (!textContent) return null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          isUser
            ? "bg-white/10 ring-1 ring-white/10"
            : "bg-roxy/15 ring-1 ring-roxy/25"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-zinc-400" />
        ) : (
          <Sparkles className="w-4 h-4 text-roxy" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-roxy-dim/80 text-white rounded-tr-md"
            : "bg-white/5 ring-1 ring-white/8 text-zinc-200 rounded-tl-md"
        }`}
      >
        {textContent}
      </div>
    </div>
  );
}

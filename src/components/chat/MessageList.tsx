"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Sparkles, Star, Moon, Sun, Flame, Gem, BookOpen } from "lucide-react";

const suggestions = [
  { icon: Sun, text: "Aries daily horoscope", color: "text-orange-400" },
  { icon: Star, text: "Draw me a tarot card", color: "text-amber-400" },
  { icon: Flame, text: "Life path number for 1995-03-22", color: "text-red-400" },
  { icon: Moon, text: "What moon phase is it?", color: "text-blue-400" },
  { icon: Sparkles, text: "Read my Vedic birth chart", color: "text-teal-400" },
  { icon: Gem, text: "What crystal helps with anxiety?", color: "text-teal-300" },
  { icon: BookOpen, text: "I dreamed about flying", color: "text-emerald-400" },
];

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  onSuggestionClick: (text: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  onSuggestionClick,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-roxy/10 ring-1 ring-roxy/25">
            <Sparkles className="w-8 h-8 text-roxy" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">
            What would you like to explore?
          </h2>
          <p className="text-zinc-500 max-w-md">
            Get your daily horoscope, draw tarot cards, calculate your life path
            number, explore your birth chart, discover crystal properties, or
            interpret a dream.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {suggestions.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => onSuggestionClick(s.text)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300 hover:bg-white/5 hover:border-roxy/30 transition-colors cursor-pointer"
            >
              <s.icon className={`w-4 h-4 ${s.color}`} />
              {s.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-roxy/15 ring-1 ring-roxy/25 shrink-0">
              <Sparkles className="w-4 h-4 text-roxy" />
            </div>
            <div className="flex items-center gap-1 py-3">
              <span className="w-2 h-2 rounded-full bg-roxy/60 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-roxy/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-roxy/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

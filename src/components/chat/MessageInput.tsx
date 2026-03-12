"use client";

import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-6 py-4"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your birth chart, draw a tarot card, interpret a dream..."
        disabled={isLoading}
        autoComplete="off"
        className="flex-1 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-roxy/40 focus:border-roxy/30 disabled:opacity-50 transition-colors"
      />
      <button
        type="submit"
        disabled={isLoading || input.trim().split(/\s+/).filter(Boolean).length < 3}
        className="flex items-center justify-center w-11 h-11 rounded-xl bg-roxy-dim text-white hover:brightness-110 disabled:bg-white/10 disabled:text-zinc-600 transition-all shrink-0 cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}

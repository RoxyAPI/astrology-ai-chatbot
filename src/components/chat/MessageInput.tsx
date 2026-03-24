"use client";

import { Send, Square } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
}

export function MessageInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  onStop,
}: MessageInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-6 py-4"
    >
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <input
        id="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your birth chart, draw a tarot card, interpret a dream..."
        disabled={isLoading}
        autoComplete="off"
        className="flex-1 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-roxy/40 focus:border-roxy/30 disabled:opacity-50 transition-colors"
      />
      {isLoading ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all shrink-0 cursor-pointer"
        >
          <Square className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={input.trim().length === 0}
          aria-label="Send message"
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-roxy-dim text-white hover:brightness-110 disabled:bg-white/10 disabled:text-zinc-600 transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}

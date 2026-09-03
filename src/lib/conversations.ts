/**
 * @fileoverview Recent conversations, kept in the browser and nowhere else.
 *
 * A transcript is stored under one key in local storage, on the device the reader is using. Nothing here
 * reaches the server, there is no account, and clearing site data clears the history. The list is
 * bounded so a heavy day cannot fill the quota and start throwing on every save.
 *
 * The list operations are pure and the storage calls are the only edges that touch the browser,
 * which is what makes the whole file testable and what keeps a private window from breaking the
 * chat: reading and writing both fail closed. On top of those sits a small store, because the
 * saved history is state React does not own, and reading it in an effect would mean rendering the
 * screen once with no history and again with it.
 */

import type { UIMessage } from "ai";

/** One saved transcript. */
export interface StoredConversation {
  /** The chat id, also the React key that re-keys the transcript on a switch. */
  id: string;
  /** Taken from the first thing the person said. */
  title: string;
  /** Epoch milliseconds of the last saved turn. Newest first in the list. */
  updatedAt: number;
  messages: UIMessage[];
}

const STORAGE_KEY = "astrology-chatbot.conversations";

/** How many transcripts are kept. The oldest leaves when a new one arrives. */
export const MAX_CONVERSATIONS = 20;

/** How much of the first message becomes the title. */
const MAX_TITLE_LENGTH = 60;

/**
 * Names a conversation after the first thing the person asked for.
 *
 * @example
 *   titleFor(messages) // "Draw a card for today"
 */
export function titleFor(messages: UIMessage[]): string {
  const first = messages.find((message) => message.role === "user");
  const text = first?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();

  if (!text) return "New conversation";
  return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH).trimEnd()}...` : text;
}

/**
 * Returns the list with this conversation saved at the top, bounded to {@link MAX_CONVERSATIONS}.
 *
 * @remarks Saving an id that is already in the list replaces it and moves it up, so a conversation
 * returned to does not appear twice.
 */
export function upsertConversation(
  list: StoredConversation[],
  conversation: StoredConversation,
): StoredConversation[] {
  const rest = list.filter((entry) => entry.id !== conversation.id);
  return [conversation, ...rest].slice(0, MAX_CONVERSATIONS);
}

/** Returns the list without the conversation of that id. */
export function removeConversation(list: StoredConversation[], id: string): StoredConversation[] {
  return list.filter((entry) => entry.id !== id);
}

/** Reads the saved conversations, newest first. Anything unreadable is treated as an empty list. */
export function loadConversations(): StoredConversation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is StoredConversation =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as StoredConversation).id === "string" &&
        Array.isArray((entry as StoredConversation).messages),
    );
  } catch {
    return [];
  }
}

/** Writes the conversations back. A full or unavailable store leaves the chat working. */
export function saveConversations(list: StoredConversation[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // A private window, a disabled store, or a full quota. The transcript on screen is unaffected.
  }
}

/** A fresh conversation id. */
export function newConversationId(): string {
  return crypto.randomUUID();
}

/* ------------------------------------------------------------------ */
/*  The store                                                          */
/* ------------------------------------------------------------------ */

/** Rendered before the browser has been read, and on the server, where there is nothing to read. */
const NOTHING_YET: StoredConversation[] = [];

let snapshot: StoredConversation[] = NOTHING_YET;
let opened = false;
const listeners = new Set<() => void>();

/** Subscribes to changes in the saved history. */
export function subscribeConversations(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * The saved history as it stands.
 *
 * @remarks The browser is read once and the same array handed back afterwards, because a caller
 * comparing this against the last value it saw would otherwise see a change on every render.
 */
export function conversationsSnapshot(): StoredConversation[] {
  if (!opened) {
    snapshot = loadConversations();
    opened = true;
  }
  return snapshot;
}

/** The server has no browser to read, so it renders the empty list and the browser corrects it. */
export function serverConversationsSnapshot(): StoredConversation[] {
  return NOTHING_YET;
}

/** Replaces the saved history and tells every subscriber. */
export function setConversations(next: StoredConversation[]): void {
  snapshot = next;
  opened = true;
  saveConversations(next);
  for (const listener of listeners) listener();
}

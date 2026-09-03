"use client";

import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatPanel } from "./ChatPanel";
import { ChatSidebar } from "./ChatSidebar";
import {
  conversationsSnapshot,
  newConversationId,
  removeConversation,
  serverConversationsSnapshot,
  setConversations,
  subscribeConversations,
  titleFor,
  upsertConversation,
} from "@/lib/conversations";

interface ChatShellProps {
  /** The reading names of the products this deployment connected to. */
  domains: string[];
}

/**
 * The whole screen: one viewport tall, a header across the top, the conversation list beside the
 * transcript, and nothing else that scrolls.
 *
 * @remarks The transcript is re-keyed by conversation id, so opening a saved conversation builds a
 * fresh chat from its stored turns rather than replaying the previous one into it.
 *
 * The saved history is read through a store rather than in an effect, because it belongs to the
 * browser rather than to React: the server renders an empty list, the browser corrects it in the
 * same commit, and nothing flashes.
 */
export function ChatShell({ domains }: ChatShellProps) {
  const conversations = useSyncExternalStore(
    subscribeConversations,
    conversationsSnapshot,
    serverConversationsSnapshot,
  );
  const [activeId, setActiveId] = useState(newConversationId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawerButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDrawerOpen(false);
      drawerButton.current?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [drawerOpen]);

  const persist = useCallback((id: string, messages: UIMessage[]) => {
    setConversations(
      upsertConversation(conversationsSnapshot(), {
        id,
        title: titleFor(messages),
        updatedAt: Date.now(),
        messages,
      }),
    );
  }, []);

  function startNew() {
    setActiveId(newConversationId());
    setDrawerOpen(false);
  }

  function open(id: string) {
    setActiveId(id);
    setDrawerOpen(false);
  }

  function forget(id: string) {
    setConversations(removeConversation(conversationsSnapshot(), id));
    if (id === activeId) setActiveId(newConversationId());
  }

  const active = conversations.find((entry) => entry.id === activeId);

  return (
    <div className="relative z-10 flex h-svh flex-col overflow-hidden">
      <ChatHeader
        domains={domains}
        drawerOpen={drawerOpen}
        sidebarOpen={sidebarOpen}
        onToggleDrawer={() => setDrawerOpen((open) => !open)}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        drawerButtonRef={drawerButton}
      />

      <div className="flex min-h-0 flex-1">
        <ChatSidebar
          domains={domains}
          conversations={conversations}
          activeId={activeId}
          open={sidebarOpen}
          drawerOpen={drawerOpen}
          onNew={startNew}
          onOpen={open}
          onForget={forget}
          onCloseDrawer={() => {
            setDrawerOpen(false);
            drawerButton.current?.focus();
          }}
        />

        {/* Tapping beside the drawer closes it. Not a button: it would be a second control with the
            same name as the one inside the drawer, and a reader moving by keyboard has that one and
            the escape key already. */}
        {drawerOpen ? (
          <div
            aria-hidden="true"
            className="bg-foreground/40 fixed inset-0 z-30 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col">
          <ChatPanel
            key={activeId}
            id={activeId}
            initialMessages={active?.messages}
            onPersist={persist}
          />
        </main>
      </div>
    </div>
  );
}

"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { StoredConversation } from "@/lib/conversations";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  domains: string[];
  conversations: StoredConversation[];
  activeId: string | null;
  /** Whether the panel is showing on a wide screen. */
  open: boolean;
  /** Whether the drawer is showing on a narrow one. */
  drawerOpen: boolean;
  onNew: () => void;
  onOpen: (id: string) => void;
  onForget: (id: string) => void;
  onCloseDrawer: () => void;
}

/**
 * Where a reader starts a conversation, returns to one, and sees what the chatbot is connected to.
 *
 * @remarks One element serves both widths: a panel in the layout from the medium breakpoint up, and
 * a drawer over the transcript below it. Conversations are held in the browser, so the list is
 * empty on a first visit and on any device the person has not used before.
 */
export function ChatSidebar({
  domains,
  conversations,
  activeId,
  open,
  drawerOpen,
  onNew,
  onOpen,
  onForget,
  onCloseDrawer,
}: ChatSidebarProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (drawerOpen) closeButton.current?.focus();
  }, [drawerOpen]);

  return (
    <aside
      id="chat-sidebar"
      aria-label="Conversations"
      className={cn(
        "bg-background fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform duration-200 md:static md:w-64 md:translate-x-0 md:transition-none",
        drawerOpen ? "translate-x-0" : "-translate-x-full",
        open ? "md:flex" : "md:hidden",
      )}
    >
      <div className="flex items-center gap-2 border-b p-3 md:border-b-0">
        <Button variant="outline" size="lg" className="flex-1 justify-start" onClick={onNew}>
          <Plus className="size-4" />
          New chat
        </Button>
        <Button
          ref={closeButton}
          variant="ghost"
          size="icon-lg"
          className="md:hidden"
          aria-label="Close the conversation list"
          onClick={onCloseDrawer}
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav aria-label="Recent conversations" className="thin-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <p className="eyebrow text-muted-foreground px-2 py-2">Recent</p>
        {conversations.length === 0 ? (
          <p className="text-muted-foreground px-2 text-xs leading-5">
            Nothing saved yet. Ask a question and this conversation is kept here, on this device
            only.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onOpen(conversation.id)}
                  aria-current={conversation.id === activeId ? "true" : undefined}
                  className={cn(
                    "focus-visible:ring-ring/50 w-full truncate rounded-md py-2 pr-9 pl-2 text-left text-sm transition-colors outline-none focus-visible:ring-3",
                    conversation.id === activeId
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {conversation.title}
                </button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${conversation.title}`}
                  onClick={() => onForget(conversation.id)}
                  className="text-muted-foreground hover:text-destructive absolute top-1/2 right-1 -translate-y-1/2 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="border-t px-4 py-3">
        <p className="eyebrow text-muted-foreground pb-1.5">Connected</p>
        <p className="text-foreground-soft text-xs leading-5">{domains.join(" · ")}</p>
      </div>
    </aside>
  );
}

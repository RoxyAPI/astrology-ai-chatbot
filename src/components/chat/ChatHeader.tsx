"use client";

import { Menu, PanelLeft, PanelLeftClose, Sparkles } from "lucide-react";
import type { RefObject } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  drawerOpen: boolean;
  sidebarOpen: boolean;
  onToggleDrawer: () => void;
  onToggleSidebar: () => void;
  drawerButtonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The wordmark and the controls that change the view. What the chatbot is connected to lives in the
 * sidebar, once.
 *
 * @remarks Two separate buttons rather than one that behaves differently by width: only one is ever
 * on screen, so each can say exactly what it does and report its own state honestly. One control
 * that means two things cannot.
 */
export function ChatHeader({
  drawerOpen,
  sidebarOpen,
  onToggleDrawer,
  onToggleSidebar,
  drawerButtonRef,
}: ChatHeaderProps) {
  return (
    <header className="bg-background z-20 h-[var(--header-h)] shrink-0 border-b">
      <div className="flex h-full items-center gap-2 px-2 sm:gap-3 sm:px-4">
        <Button
          ref={drawerButtonRef}
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open the conversation list"
          aria-controls="chat-sidebar"
          aria-expanded={drawerOpen}
          onClick={onToggleDrawer}
        >
          <Menu className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={sidebarOpen ? "Hide the conversation list" : "Show the conversation list"}
          aria-controls="chat-sidebar"
          aria-expanded={sidebarOpen}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeft className="size-4" />}
        </Button>

        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="bg-primary/12 text-primary ring-primary/25 grid size-7 shrink-0 place-items-center rounded-full ring-1"
          >
            <Sparkles className="size-3.5" />
          </span>
          <h1 className="font-display truncate text-base leading-none tracking-tight sm:text-lg">
            Astrology Chatbot
          </h1>
        </div>

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

"use client";

import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import type { RefObject } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  domains: string[];
  drawerOpen: boolean;
  sidebarOpen: boolean;
  onToggleDrawer: () => void;
  onToggleSidebar: () => void;
  drawerButtonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The wordmark, what the chatbot is connected to, and the two controls that change the view.
 *
 * @remarks Two separate buttons rather than one that behaves differently by width: only one is ever
 * on screen, so each can say exactly what it does and report its own state honestly. One control
 * that means two things cannot.
 */
export function ChatHeader({
  domains,
  drawerOpen,
  sidebarOpen,
  onToggleDrawer,
  onToggleSidebar,
  drawerButtonRef,
}: ChatHeaderProps) {
  const strip = domains.join(" · ");

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

        <h1 className="font-display shrink-0 text-base leading-none tracking-tight sm:text-lg">
          Astrology Chatbot
        </h1>

        {/* What this deployment is wired to, on one line. The rule before it keeps the list from
            reading as part of the name. */}
        {strip ? (
          <p
            className="text-muted-foreground border-border hidden min-w-0 flex-1 truncate border-l pl-3 text-xs md:block"
            title={domains.join(", ")}
          >
            {strip}
          </p>
        ) : null}

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

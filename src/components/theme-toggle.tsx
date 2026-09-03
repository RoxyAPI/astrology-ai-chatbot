"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Renders both icons and lets the dark variant choose between them, then reads the resolved theme
 * only inside the click handler.
 *
 * @remarks The older pattern of a mounted flag set in an effect is a lint error under the current
 * React compiler rules, and it was never necessary: CSS already knows which theme is active at
 * first paint, so there is nothing for JavaScript to decide before hydration. The same reasoning is
 * why the pressed state is written by the same CSS rather than by a value read after mount.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Switch between light and dark"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}

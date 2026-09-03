"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes, never a hand rolled provider. A custom one reads its stored value in an effect,
 * which means the first paint is always the default theme and everyone gets a flash of the wrong
 * one on the way in.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

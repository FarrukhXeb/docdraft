"use client";

import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";

export const THEME_STORAGE_KEY = "docdraft-theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Moon/sun toggle that flips `data-theme` on <html> and persists the choice.
 * The initial value is applied pre-hydration by the inline script in layout.tsx
 * so there is no flash of the wrong theme.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode); the in-page toggle still works.
    }
    setTheme(next);
  }

  const isDark = theme === "dark";
  return (
    <IconButton
      icon={isDark ? "sun" : "moon"}
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="sm"
      onClick={toggle}
    />
  );
}

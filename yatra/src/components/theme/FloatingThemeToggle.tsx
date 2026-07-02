"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

// Rendered once in the root layout so a toggle is available on every
// page, including pages that don't include the main Nav (booking,
// tracking, admin sub-pages, onboarding flow, etc).
export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-[999] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-hover cursor-pointer"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

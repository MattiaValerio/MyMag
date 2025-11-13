"use client"

import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === "dark" ? "light" : "dark"
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="inline-flex h-8 items-center justify-center rounded-md border px-2 text-xs hover:bg-muted"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  )
}

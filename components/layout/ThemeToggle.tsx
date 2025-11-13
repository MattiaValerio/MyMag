"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const next = resolvedTheme === "dark" ? "light" : "dark"
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="inline-flex h-8 items-center justify-center rounded-md border px-2 text-xs hover:bg-muted"
      suppressHydrationWarning
    >
      {mounted ? (resolvedTheme === "dark" ? "Light" : "Dark") : ""}
    </button>
  )
}

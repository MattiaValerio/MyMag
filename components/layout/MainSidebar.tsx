"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowLeftRight,
  Percent,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/articoli", label: "Articoli", Icon: Package },
  { href: "/clienti", label: "Clienti", Icon: Users },
  { href: "/fornitori", label: "Fornitori", Icon: Truck },
  { href: "/movimenti", label: "Movimenti", Icon: ArrowLeftRight },
  { href: "/promozioni", label: "Promozioni", Icon: Percent },
  { href: "/utenti", label: "Utenti", Icon: UserCog },
]

export function MainSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Restore persisted state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebarCollapsed")
      if (stored !== null) setCollapsed(stored === "true")
    } catch {}
    setMounted(true)
  }, [])

  // Persist state on change
  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    try {
      localStorage.setItem("sidebarCollapsed", String(collapsed))
    } catch {}
  }, [collapsed])
  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r bg-card/50 backdrop-blur md:block",
        !mounted && "invisible",
        collapsed ? "w-14" : "w-40"
      )}
    >
      <div className={cn("flex items-center justify-between p-3", collapsed && "justify-center")}>
        <div className={cn("text-base font-semibold", collapsed && "sr-only")}>My Mag</div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
          className={cn("h-7 w-7")}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href)
          const ItemContent = (
            <div
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-muted font-medium" : "hover:bg-muted/60",
                // Mantieni lo stesso padding e allineamento a sinistra anche da collassata
                "justify-start"
              )}
            >
              <item.Icon className="size-4" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          )
          return (
            <div key={item.href}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link className="block" href={item.href}>{ItemContent}</Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link className="block" href={item.href}>{ItemContent}</Link>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

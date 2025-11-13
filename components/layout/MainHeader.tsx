"use client"

import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useMemo, useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { navItems } from "@/components/layout/MainSidebar"

function segmentToLabel(segment: string) {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    articoli: "Articoli",
    clienti: "Clienti",
    movimenti: "Movimenti",
    promozioni: "Promozioni",
    utenti: "Utenti",
    login: "Login",
  }
  if (segment in map) return map[segment]
  const decoded = decodeURIComponent(segment.replace(/\+/g, " "))
  const cleaned = decoded.replace(/-/g, " ")
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export function MainHeader() {
  const pathname = usePathname() || "/"
  const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname])
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    setOverrides({})

    const tasks: Promise<void>[] = []

    // Articles: /articoli/{id}
    tasks.push((async () => {
      const idx = segments.indexOf("articoli")
      const id = idx >= 0 ? segments[idx + 1] : undefined
      if (!id) return
      try {
        const res = await fetch(`/api/articles/${id}`)
        if (!res.ok) return
        const article: { description?: string; code?: string } = await res.json()
        const label = article.description || article.code || id
        if (!cancelled) setOverrides((o) => ({ ...o, [`/articoli/${id}`]: label }))
      } catch {}
    })())

    // Customers: /clienti/{id}
    tasks.push((async () => {
      const idx = segments.indexOf("clienti")
      const id = idx >= 0 ? segments[idx + 1] : undefined
      if (!id) return
      try {
        const res = await fetch(`/api/customers/${id}`)
        if (!res.ok) return
        const customer: { name?: string } = await res.json()
        const label = customer.name || id
        if (!cancelled) setOverrides((o) => ({ ...o, [`/clienti/${id}`]: label }))
      } catch {}
    })())

    // Promotions: /promozioni/{id}
    tasks.push((async () => {
      const idx = segments.indexOf("promozioni")
      const id = idx >= 0 ? segments[idx + 1] : undefined
      if (!id) return
      try {
        const res = await fetch(`/api/promotions/${id}`)
        if (!res.ok) return
        const promotion: { name?: string } = await res.json()
        const label = promotion.name || id
        if (!cancelled) setOverrides((o) => ({ ...o, [`/promozioni/${id}`]: label }))
      } catch {}
    })())

    Promise.all(tasks).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [segments])

  const crumbs = useMemo(() => {
    const acc: { href: string; label: string }[] = []
    let current = ""
    for (const seg of segments) {
      current += `/${seg}`
      acc.push({ href: current, label: segmentToLabel(seg) })
    }
    return acc.length ? acc : [{ href: "/dashboard", label: "Dashboard" }]
  }, [segments])

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur md:h-16 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Apri menu"
              className="md:hidden"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Menu di navigazione</SheetTitle>
            <div className="flex items-center justify-between p-3">
              <div className="text-base font-semibold">My Mag</div>
            </div>
            <nav className="space-y-1 p-2">
              {navItems.map((item) => {
                const active = pathname?.startsWith(item.href)
                return (
                  <SheetClose asChild key={item.href}>
                    <Link className="block" href={item.href}>
                      <div
                        className={
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors " +
                          (active ? "bg-muted font-medium" : "hover:bg-muted/60")
                        }
                      >
                        <item.Icon className="size-4" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1
            const label = overrides[crumb.href] ?? crumb.label
            return (
              <Fragment key={crumb.href}>
                {isLast ? (
                  <span className="text-sm text-muted-foreground">{label}</span>
                ) : (
                  <Link href={crumb.href} className="text-sm font-medium hover:underline">
                    {label}
                  </Link>
                )}
                {!isLast && <span className="text-muted-foreground">/</span>}
              </Fragment>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}

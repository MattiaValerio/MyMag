import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/db"
import { KPICards } from "@/components/dashboard/KPICards"
import { TrendSection } from "@/components/dashboard/TrendSection"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bell, PackagePlus, Plus, UserPlus, ArrowDownCircle, FileText } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const NOW = new Date()
  const startOfToday = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate())
  const endOfToday = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 23, 59, 59, 999)
  const daysBack = 6
  const startOfRange = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - daysBack)
  const LOW_STOCK_THRESHOLD = 5

  const [
    articlesTotal,
    stockAgg,
    todayInAgg,
    todayOutAgg,
    lowStockList,
    lowStockCount,
    recentMovements,
    promotionsExpiringSoonCount,
    pendingOrdersCount,
    articlesForValue,
    movementsRange,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.aggregate({ _sum: { stock: true } }),
    prisma.movement.aggregate({
      where: { date: { gte: startOfToday, lte: endOfToday }, type: "IN" },
      _sum: { quantity: true },
    }),
    prisma.movement.aggregate({
      where: { date: { gte: startOfToday, lte: endOfToday }, type: "OUT" },
      _sum: { quantity: true },
    }),
    prisma.article.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, code: true, description: true, stock: true },
    }),
    prisma.article.count({ where: { stock: { lte: LOW_STOCK_THRESHOLD } } }),
    prisma.movement.findMany({
      orderBy: { date: "desc" },
      take: 8,
      select: {
        id: true,
        date: true,
        type: true,
        quantity: true,
        article: { select: { code: true, description: true } },
        user: { select: { name: true } },
      },
    }),
    prisma.promotion.count({
      where: {
        active: true,
        endDate: { gte: NOW, lte: new Date(NOW.getTime() + 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.article.findMany({ select: { price: true, stock: true } }),
    prisma.movement.findMany({
      where: { date: { gte: startOfRange, lte: endOfToday } },
      select: { date: true, type: true, quantity: true },
      orderBy: { date: "asc" },
    }),
  ])

  const giacenzaTotale = stockAgg._sum.stock ?? 0
  const entrateOggi = todayInAgg._sum.quantity ?? 0
  const usciteOggi = todayOutAgg._sum.quantity ?? 0

  const valoreMagazzino = articlesForValue.reduce((acc, a) => {
    const price = typeof a.price === "object" && a.price !== null && "toString" in a.price ? Number(a.price.toString()) : Number(a.price as any)
    return acc + price * (a.stock ?? 0)
  }, 0)

  const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  const days: string[] = Array.from({ length: daysBack + 1 }).map((_, i) => {
    const d = new Date(startOfRange)
    d.setDate(startOfRange.getDate() + i)
    return dayKey(d)
  })

  const dailyMap = new Map<string, { inQty: number; outQty: number }>()
  days.forEach((k) => dailyMap.set(k, { inQty: 0, outQty: 0 }))
  for (const m of movementsRange) {
    const k = dayKey(new Date(m.date))
    const entry = dailyMap.get(k)
    if (!entry) continue
    if (m.type === "IN") entry.inQty += m.quantity
    if (m.type === "OUT") entry.outQty += m.quantity
  }
  const trendData = days.map((k) => ({ date: k, ...(dailyMap.get(k) as { inQty: number; outQty: number }) }))

  const alertsCount = lowStockCount + promotionsExpiringSoonCount + pendingOrdersCount

  const formatCurrency = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n)

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        actions={(
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Nuovo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/movimenti">
                    <ArrowDownCircle className="h-4 w-4" /> Nuovo movimento
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/articoli">
                    <PackagePlus className="h-4 w-4" /> Aggiungi articolo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clienti">
                    <UserPlus className="h-4 w-4" /> Nuovo cliente
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/promozioni">
                    <FileText className="h-4 w-4" /> Nuova promozione
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="#avvisi" className="relative">
              <Button size="sm" variant="outline">
                <Bell className="mr-2 h-4 w-4" /> Avvisi
                {alertsCount > 0 ? (
                  <Badge variant="destructive" className="ml-2">{alertsCount}</Badge>
                ) : null}
              </Button>
            </Link>

            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button variant="outline" size="sm" type="submit">Esci</Button>
            </form>
          </>
        )}
      />
      <div className="space-y-4 md:space-y-6">
        <KPICards
          articlesTotal={articlesTotal}
          giacenzaTotale={giacenzaTotale}
          entrateOggi={entrateOggi}
          usciteOggi={usciteOggi}
          lowStockCount={lowStockCount}
          valoreMagazzino={valoreMagazzino}
        />

        <TrendSection data={trendData} />

        <RecentActivity items={recentMovements} />

      </div>
    </MainLayout>
  )
}
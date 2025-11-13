import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { redirect } from "next/navigation"
import { MovimentiTable } from "@/features/movimenti/components/MovimentiTable"

export default async function MovimentiPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const movements = await prisma.movement.findMany({
    include: { article: true, customer: true, user: true },
    orderBy: { date: "desc" },
    take: 50,
  })
  return (
    <MainLayout>
      <PageHeader title="Movimenti" />
      <MovimentiTable movements={movements} />
    </MainLayout>
  )
}

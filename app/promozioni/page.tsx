import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { redirect } from "next/navigation"
import { PromozioniTable } from "@/features/promozioni/components/PromozioniTable"

export default async function PromozioniPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const promotions = await prisma.promotion.findMany({ orderBy: { name: "asc" } })
  return (
    <MainLayout>
      <PageHeader title="Promozioni" />
      <PromozioniTable promotions={promotions} />
    </MainLayout>
  )
}

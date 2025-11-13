import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { redirect } from "next/navigation"
import { ClientiTable } from "@/features/clienti/components/ClientiTable"

export default async function ClientiPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } })
  return (
    <MainLayout>
      <PageHeader title="Clienti" />
      <ClientiTable customers={customers} />
    </MainLayout>
  )
}

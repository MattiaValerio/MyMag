import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { FornitoriManager } from "@/features/fornitori/components/FornitoriManager"
import { redirect } from "next/navigation"

export default async function FornitoriPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const suppliers = await prisma.supplier.findMany({
    select: { id: true, name: true, email: true, phone: true, address: true, vatNumber: true },
    orderBy: { name: "asc" },
  })
  return (
    <MainLayout>
      <PageHeader title="Fornitori" />
      <FornitoriManager initialSuppliers={suppliers} />
    </MainLayout>
  )
}
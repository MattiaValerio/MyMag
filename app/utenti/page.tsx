import { auth } from "@/auth"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { redirect } from "next/navigation"

export default async function UtentiPage() {
  const session = await auth()
  if (!session) redirect("/login")
  return (
    <MainLayout>
      <PageHeader title="Utenti" />
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">Prossimamente: gestione utenti</div>
    </MainLayout>
  )
}

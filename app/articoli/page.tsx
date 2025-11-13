import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { MainLayout } from "@/components/layout/MainLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { redirect } from "next/navigation"
import { ArticoliTable } from "@/features/articoli/components/ArticoliTable"

export default async function ArticoliPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const articles = await prisma.article.findMany({ orderBy: { code: "asc" } })
  return (
    <MainLayout>
      <PageHeader title="Articoli" />
      <ArticoliTable articles={articles} />
    </MainLayout>
  )
}

import { prisma } from "@/lib/db"
import { z } from "zod"
import { auth } from "@/auth"

const ArticleSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().optional(),
})

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { code: "asc" } })
  return Response.json(articles)
}

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!role || !["ADMIN", "AGENT"].includes(role)) {
    return new Response("Forbidden", { status: 403 })
  }
  const json = await req.json()
  const parsed = ArticleSchema.safeParse(json)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  }
  const { code, description, price, stock = 0 } = parsed.data
  try {
    const created = await prisma.article.create({ data: { code, description, price, stock } })
    return Response.json(created, { status: 201 })
  } catch (e: any) {
    return new Response("Errore creazione articolo", { status: 500 })
  }
}

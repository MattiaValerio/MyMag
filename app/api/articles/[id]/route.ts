import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { z } from "zod"

const UpdateSchema = z.object({
  code: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) return new Response("Not found", { status: 404 })
  return Response.json(article)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!role || !["ADMIN", "AGENT"].includes(role)) {
    return new Response("Forbidden", { status: 403 })
  }
  const json = await req.json()
  const parsed = UpdateSchema.safeParse(json)
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  try {
    const updated = await prisma.article.update({ where: { id: params.id }, data: parsed.data })
    return Response.json(updated)
  } catch (e) {
    return new Response("Errore aggiornamento", { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!role || role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 })
  }
  try {
    await prisma.article.delete({ where: { id: params.id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    return new Response("Errore eliminazione", { status: 500 })
  }
}

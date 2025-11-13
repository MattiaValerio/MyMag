import { prisma } from "@/lib/db"
import { z } from "zod"
import { auth } from "@/auth"

const MovementSchema = z.object({
  articleId: z.string().cuid(),
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().int().positive(),
  reason: z.string().optional(),
  unitPrice: z.coerce.number().nonnegative().optional(),
  customerId: z.string().cuid().optional(),
  orderId: z.string().cuid().optional(),
  date: z.coerce.date().optional(),
})

export async function GET() {
  const items = await prisma.movement.findMany({
    include: { article: true, customer: true, user: true },
    orderBy: { date: "desc" },
  })
  return Response.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  const userId = (session?.user as any)?.id as string | undefined
  if (!role || !["ADMIN", "AGENT"].includes(role) || !userId) {
    return new Response("Forbidden", { status: 403 })
  }
  const json = await req.json()
  const parsed = MovementSchema.safeParse(json)
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const { articleId, type, quantity, reason, unitPrice, customerId, orderId, date } = parsed.data

  try {
    const result = await prisma.$transaction(async (tx) => {
      const movement = await tx.movement.create({
        data: {
          articleId,
          type,
          quantity,
          reason,
          unitPrice,
          customerId,
          orderId,
          date: date ?? new Date(),
          userId,
        },
      })

      const delta = type === "IN" ? quantity : -quantity
      const updated = await tx.article.update({
        where: { id: articleId },
        data: { stock: { increment: delta } },
      })
      return { movement, article: updated }
    })
    return Response.json(result, { status: 201 })
  } catch (e) {
    return new Response("Errore registrazione movimento", { status: 500 })
  }
}

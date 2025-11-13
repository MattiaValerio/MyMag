import { prisma } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const promotion = await prisma.promotion.findUnique({ where: { id: params.id } })
  if (!promotion) return new Response("Not found", { status: 404 })
  return Response.json(promotion)
}

import { prisma } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({ where: { id: params.id } })
  if (!customer) return new Response("Not found", { status: 404 })
  return Response.json(customer)
}

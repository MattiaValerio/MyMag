import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { z } from "zod"

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  vatNumber: z.string().optional(),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supplier = await prisma.supplier.findUnique({ where: { id: params.id } })
  if (!supplier) return new Response("Not found", { status: 404 })
  return Response.json(supplier)
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
  const data = parsed.data
  try {
    const updated = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        ...data,
        email: data.email !== undefined ? (data.email ? data.email : null) : undefined,
      },
    })
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
    await prisma.supplier.delete({ where: { id: params.id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    return new Response("Errore eliminazione", { status: 500 })
  }
}

import { prisma } from "@/lib/db"
import { z } from "zod"
import { auth } from "@/auth"

const SupplierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  vatNumber: z.string().optional(),
})

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } })
  return Response.json(suppliers)
}

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!role || !["ADMIN", "AGENT"].includes(role)) {
    return new Response("Forbidden", { status: 403 })
  }
  const json = await req.json()
  const parsed = SupplierSchema.safeParse(json)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  }
  const data = parsed.data
  try {
    // Normalize empty strings
    const created = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email ? data.email : null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        vatNumber: data.vatNumber ?? null,
      },
    })
    return Response.json(created, { status: 201 })
  } catch (e: any) {
    return new Response("Errore creazione fornitore", { status: 500 })
  }
}

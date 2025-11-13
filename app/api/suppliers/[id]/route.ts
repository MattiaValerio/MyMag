import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  // Contacts
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  // Anagrafici
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  taxCode: z.string().optional(),
  vatNumber: z.string().optional(),
  // Commerciali
  paymentTerms: z.string().optional(),
  paymentMethod: z.string().optional(),
  iban: z.string().optional(),
  sdiCode: z.string().optional(),
  pecEmail: z.string().email().optional().or(z.literal("")),
  defaultDiscount: z.coerce.number().min(0).max(100).optional(),
  leadTimeDays: z.coerce.number().int().min(0).optional(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  // Notes
  notes: z.string().optional(),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) return new Response("Not found", { status: 404 })
  return Response.json(supplier)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params
    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email !== undefined ? (data.email ? data.email : null) : undefined,
        phone: data.phone,
        phone2: data.phone2,
        mobile: data.mobile,
        website: data.website !== undefined ? (data.website ? data.website : null) : undefined,
        address: data.address,
        city: data.city,
        zip: data.zip,
        country: data.country,
        taxCode: data.taxCode,
        vatNumber: data.vatNumber,
        paymentTerms: data.paymentTerms,
        paymentMethod: data.paymentMethod,
        iban: data.iban,
        sdiCode: data.sdiCode,
        pecEmail: data.pecEmail !== undefined ? (data.pecEmail ? data.pecEmail : null) : undefined,
        defaultDiscount: data.defaultDiscount !== undefined ? new Prisma.Decimal(data.defaultDiscount) : undefined,
        leadTimeDays: data.leadTimeDays,
        contactName: data.contactName,
        contactRole: data.contactRole,
        notes: data.notes,
      },
    })
    return Response.json(updated)
  } catch (e) {
    return new Response("Errore aggiornamento", { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!role || role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 })
  }
  try {
    const { id } = await params
    await prisma.supplier.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e) {
    return new Response("Errore eliminazione", { status: 500 })
  }
}

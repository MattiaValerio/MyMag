import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { auth } from "@/auth"

const SupplierSchema = z.object({
  name: z.string().min(1),
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
  // Notes
  notes: z.string().optional(),
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
        phone2: data.phone2 ?? null,
        mobile: data.mobile ?? null,
        website: data.website ? data.website : null,
        address: data.address ?? null,
        city: data.city ?? null,
        zip: data.zip ?? null,
        country: data.country ?? null,
        taxCode: data.taxCode ?? null,
        vatNumber: data.vatNumber ?? null,
        paymentTerms: data.paymentTerms ?? null,
        paymentMethod: data.paymentMethod ?? null,
        iban: data.iban ?? null,
        sdiCode: data.sdiCode ?? null,
        pecEmail: data.pecEmail ? data.pecEmail : null,
        defaultDiscount: data.defaultDiscount !== undefined ? new Prisma.Decimal(data.defaultDiscount) : null,
        leadTimeDays: data.leadTimeDays ?? null,
        contactName: (data as any).contactName ?? null,
        contactRole: (data as any).contactRole ?? null,
        notes: data.notes ?? null,
      },
    })
    return Response.json(created, { status: 201 })
  } catch (e: any) {
    return new Response("Errore creazione fornitore", { status: 500 })
  }
}

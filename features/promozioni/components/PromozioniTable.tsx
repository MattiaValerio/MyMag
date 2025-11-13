import { type Promotion } from "@prisma/client"

type Props = { promotions: Pick<Promotion, "id" | "name" | "discountType" | "discountValue" | "active">[] }

export function PromozioniTable({ promotions }: Props) {
  const toNumber = (v: unknown) => {
    if (typeof v === "number") return v
    if (typeof v === "bigint") return Number(v)
    if (v && typeof v === "object" && "toString" in v) return Number((v as any).toString())
    return Number(v as any)
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">Tipo</th>
            <th className="px-3 py-2 text-right">Valore</th>
            <th className="px-3 py-2 text-left">Attiva</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-3 py-2">{p.name}</td>
              <td className="px-3 py-2">{p.discountType}</td>
              <td className="px-3 py-2 text-right">{toNumber(p.discountValue).toFixed(2)}</td>
              <td className="px-3 py-2">{p.active ? "Sì" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

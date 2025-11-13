import { type Article } from "@prisma/client"

type Props = {
  articles: Pick<Article, "id" | "code" | "description" | "price" | "stock">[]
}

export function ArticoliTable({ articles }: Props) {
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
            <th className="px-3 py-2 text-left">Codice</th>
            <th className="px-3 py-2 text-left">Descrizione</th>
            <th className="px-3 py-2 text-right">Prezzo</th>
            <th className="px-3 py-2 text-right">Giacenza</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="px-3 py-2">{a.code}</td>
              <td className="px-3 py-2">{a.description}</td>
              <td className="px-3 py-2 text-right">{toNumber(a.price).toFixed(2)} €</td>
              <td className="px-3 py-2 text-right">{a.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

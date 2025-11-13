import { type Movement, type Article, type Customer, type User } from "@prisma/client"

type MovementRow = Pick<Movement, "id" | "date" | "type" | "quantity" | "reason"> & {
  article: Pick<Article, "description">
  customer: Pick<Customer, "name"> | null
  user?: Pick<User, "name"> | null
}

type Props = { movements: MovementRow[] }

export function MovimentiTable({ movements }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Data</th>
            <th className="px-3 py-2 text-left">Articolo</th>
            <th className="px-3 py-2 text-left">Tipo</th>
            <th className="px-3 py-2 text-right">Q.tà</th>
            <th className="px-3 py-2 text-left">Cliente</th>
            <th className="px-3 py-2 text-left">Causale</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="px-3 py-2">{new Date(m.date).toLocaleString()}</td>
              <td className="px-3 py-2">{m.article.description}</td>
              <td className="px-3 py-2">{m.type}</td>
              <td className="px-3 py-2 text-right">{m.quantity}</td>
              <td className="px-3 py-2">{m.customer?.name ?? "—"}</td>
              <td className="px-3 py-2">{m.reason ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

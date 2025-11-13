import { type Customer } from "@prisma/client"

type Props = { customers: Pick<Customer, "id" | "name" | "email" | "phone">[] }

export function ClientiTable({ customers }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Telefono</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-3 py-2">{c.name}</td>
              <td className="px-3 py-2">{c.email ?? "—"}</td>
              <td className="px-3 py-2">{c.phone ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

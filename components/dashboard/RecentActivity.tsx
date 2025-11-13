import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type RecentMovement = {
  id: string
  date: Date | string
  type: "IN" | "OUT"
  quantity: number
  article: { code: string; description: string }
  user: { name: string | null } | null
}

const fmtDate = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d
  return new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(date)
}

export function RecentActivity({ items }: { items: RecentMovement[] }) {
  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Attività recente</CardTitle>
          <CardDescription>Ultimi movimenti registrati</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="h-10 px-2 text-left font-medium">Data</th>
                  <th className="h-10 px-2 text-left font-medium">Articolo</th>
                  <th className="h-10 px-2 text-left font-medium">Qta</th>
                  <th className="h-10 px-2 text-left font-medium">Tipo</th>
                  <th className="h-10 px-2 text-left font-medium">Utente</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="p-2 whitespace-nowrap">{fmtDate(m.date)}</td>
                    <td className="p-2 whitespace-nowrap">{m.article.code} – {m.article.description}</td>
                    <td className="p-2 whitespace-nowrap">{m.quantity}</td>
                    <td className="p-2 whitespace-nowrap">
                      {m.type === "IN" ? (
                        <Badge className="bg-emerald-600 text-white border-transparent">Entrata</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white border-transparent">Uscita</Badge>
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">{m.user?.name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

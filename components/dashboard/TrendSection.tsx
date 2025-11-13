import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryChart } from "./InventoryChart"

type TrendPoint = { date: string; inQty: number; outQty: number }

export function TrendSection({ data }: { data: TrendPoint[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Flussi magazzino (7g)</CardTitle>
          <CardDescription>Entrate e uscite giornaliere</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryChart data={data} />
        </CardContent>
      </Card>
    </section>
  )
}

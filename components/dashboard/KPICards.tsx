import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
  articlesTotal: number
  giacenzaTotale: number
  entrateOggi: number
  usciteOggi: number
  lowStockCount: number
  valoreMagazzino: number
}

const currency = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" })

export function KPICards({
  articlesTotal,
  giacenzaTotale,
  entrateOggi,
  usciteOggi,
  lowStockCount,
  valoreMagazzino,
}: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader>
          <CardDescription>Articoli totali</CardDescription>
          <CardTitle className="text-2xl">{articlesTotal}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Giacenza totale</CardDescription>
          <CardTitle className="text-2xl">{giacenzaTotale}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Movimenti oggi</CardDescription>
          <CardTitle className="text-2xl flex items-center gap-3">
            <span className="text-emerald-600">+{entrateOggi}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-600">-{usciteOggi}</span>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Scorte basse</CardDescription>
          <CardTitle className="text-2xl flex items-center gap-2">
            {lowStockCount}
            {lowStockCount > 0 ? <Badge variant="destructive">critico</Badge> : null}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Valore magazzino</CardDescription>
          <CardTitle className="text-2xl">{currency.format(valoreMagazzino)}</CardTitle>
        </CardHeader>
      </Card>
    </section>
  )
}

"use client"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

type Props = { data: Array<{ date: string; inQty: number; outQty: number }> }

export function InventoryChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="inQty" stroke="#22c55e" strokeWidth={2} dot={false} name="Entrate" />
          <Line type="monotone" dataKey="outQty" stroke="#ef4444" strokeWidth={2} dot={false} name="Uscite" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

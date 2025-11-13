"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/layout/ConfirmDialog"
import { SupplierDialog, supplierSchema, type SupplierFormValues } from "./SupplierDialog"

type SupplierRow = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  vatNumber: string | null
}

type Props = { initialSuppliers: SupplierRow[] }

export function FornitoriManager({ initialSuppliers }: Props) {
  const [suppliers, setSuppliers] = useState<SupplierRow[]>(initialSuppliers)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEditId, setOpenEditId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [openViewId, setOpenViewId] = useState<string | null>(null)

  async function handleCreate(values: SupplierFormValues) {
    setBusy(true)
    try {
      const payload = normalizePayload(values)
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Errore creazione")
      const created = await res.json()
      setSuppliers((s) => [...s, created].sort((a, b) => a.name.localeCompare(b.name)))
      setOpenCreate(false)
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdate(id: string, values: SupplierFormValues) {
    setBusy(true)
    try {
      const payload = normalizePayload(values)
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Errore aggiornamento")
      const updated = await res.json()
      setSuppliers((list) => list.map((s) => (s.id === updated.id ? updated : s)).sort((a, b) => a.name.localeCompare(b.name)))
      setOpenEditId(null)
    } finally {
      setBusy(false)
    }
  }

  async function deleteSupplier(id: string) {
    setBusy(true)
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Errore eliminazione")
      setSuppliers((list) => list.filter((s) => s.id !== id))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Fornitori totali: {suppliers.length}</div>
        <Button onClick={() => setOpenCreate(true)}>Nuovo fornitore</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left">Nome</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Telefono</th>
              <th className="px-3 py-2 text-left">Indirizzo</th>
              <th className="px-3 py-2 text-left">P.IVA</th>
              <th className="px-3 py-2 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.email ?? "—"}</td>
                <td className="px-3 py-2">{s.phone ?? "—"}</td>
                <td className="px-3 py-2">{s.address ?? "—"}</td>
                <td className="px-3 py-2">{s.vatNumber ?? "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setOpenViewId(s.id)}>Dettagli</Button>
                    <Button variant="outline" size="sm" onClick={() => setOpenEditId(s.id)}>Modifica</Button>
                    <ConfirmDialog
                      title="Eliminare il fornitore?"
                      description="Questa azione non può essere annullata"
                      onConfirm={() => deleteSupplier(s.id)}
                      trigger={<Button variant="destructive" size="sm" disabled={busy}>Elimina</Button>}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupplierDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        mode="create"
        onSubmit={handleCreate}
        loading={busy}
      />

      {openEditId && (
        <SupplierDialog
          open={!!openEditId}
          onOpenChange={(o) => !o && setOpenEditId(null)}
          mode="edit"
          // For edit, fetch fresh data or use row minimal fields
          initialValues={suppliers.find((x) => x.id === openEditId) as any}
          onSubmit={(vals) => handleUpdate(openEditId, vals)}
          loading={busy}
        />
      )}

      {openViewId && (
        <SupplierDialog
          open={!!openViewId}
          onOpenChange={(o) => !o && setOpenViewId(null)}
          mode="view"
          initialValues={suppliers.find((x) => x.id === openViewId) as any}
        />
      )}
    </div>
  )
}

function normalizePayload(values: SupplierFormValues) {
  const parsed = supplierSchema.safeParse(values)
  const v: any = parsed.success ? parsed.data : values
  const out: Record<string, any> = {}
  for (const [k, val] of Object.entries(v)) {
    if (k === "name") {
      out[k] = val
      continue
    }
    if (val === "" || val === undefined || val === null) {
      // undefined means "do not update" for PATCH; for POST it's fine
      continue
    }
    out[k] = val
  }
  return out
}

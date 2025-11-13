"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/layout/ConfirmDialog"
import { Supplier } from "@prisma/client"

type SupplierT = { id: string; name: string; email: string | null; phone: string | null; address: string | null; vatNumber: string | null }

type Props = { initialSuppliers: SupplierT[] }

type Editable = Pick<Supplier, "name" | "email" | "phone" | "address" | "vatNumber">

export function FornitoriManager({ initialSuppliers }: Props) {
  const [suppliers, setSuppliers] = useState<SupplierT[]>(initialSuppliers)
  const [creating, setCreating] = useState<Editable>({ name: "", email: "", phone: "", address: "", vatNumber: "" })
  const [editing, setEditing] = useState<(Editable & { id: string }) | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [busy, setBusy] = useState(false)

  async function createSupplier() {
    if (!creating.name.trim()) return
    setBusy(true)
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...creating }),
      })
      if (!res.ok) throw new Error("Errore creazione")
      const created: SupplierT = await res.json()
      setSuppliers((s) => [...s, created].sort((a, b) => a.name.localeCompare(b.name)))
      setCreating({ name: "", email: "", phone: "", address: "", vatNumber: "" })
    } finally {
      setBusy(false)
    }
  }

  async function updateSupplier() {
    if (!editing) return
    if (!editing.name.trim()) return
    setBusy(true)
    try {
      const res = await fetch(`/api/suppliers/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          email: editing.email,
          phone: editing.phone,
          address: editing.address,
          vatNumber: editing.vatNumber,
        }),
      })
      if (!res.ok) throw new Error("Errore aggiornamento")
      const updated: SupplierT = await res.json()
      setSuppliers((list) => list.map((s) => (s.id === updated.id ? updated : s)).sort((a, b) => a.name.localeCompare(b.name)))
      setOpenEdit(false)
      setEditing(null)
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
      <div className="rounded-lg border p-3">
        <div className="grid gap-2 sm:grid-cols-5">
          <Input placeholder="Nome*" value={creating.name} onChange={(e) => setCreating((v) => ({ ...v, name: e.target.value }))} />
          <Input placeholder="Email" value={creating.email ?? ""} onChange={(e) => setCreating((v) => ({ ...v, email: e.target.value }))} />
          <Input placeholder="Telefono" value={creating.phone ?? ""} onChange={(e) => setCreating((v) => ({ ...v, phone: e.target.value }))} />
          <Input placeholder="Indirizzo" value={creating.address ?? ""} onChange={(e) => setCreating((v) => ({ ...v, address: e.target.value }))} />
          <div className="flex gap-2">
            <Input className="flex-1" placeholder="P.IVA" value={creating.vatNumber ?? ""} onChange={(e) => setCreating((v) => ({ ...v, vatNumber: e.target.value }))} />
            <Button onClick={createSupplier} disabled={busy || !creating.name.trim()}>Aggiungi</Button>
          </div>
        </div>
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
                    <Dialog open={openEdit && editing?.id === s.id} onOpenChange={(o) => { setOpenEdit(o); if (!o) setEditing(null) }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => { setEditing({ id: s.id, name: s.name, email: s.email ?? "", phone: s.phone ?? "", address: s.address ?? "", vatNumber: s.vatNumber ?? "" }); setOpenEdit(true) }}>Modifica</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifica fornitore</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-2">
                          <Input placeholder="Nome*" value={editing?.name ?? ""} onChange={(e) => setEditing((v) => v ? { ...v, name: e.target.value } : v)} />
                          <Input placeholder="Email" value={editing?.email ?? ""} onChange={(e) => setEditing((v) => v ? { ...v, email: e.target.value } : v)} />
                          <Input placeholder="Telefono" value={editing?.phone ?? ""} onChange={(e) => setEditing((v) => v ? { ...v, phone: e.target.value } : v)} />
                          <Input placeholder="Indirizzo" value={editing?.address ?? ""} onChange={(e) => setEditing((v) => v ? { ...v, address: e.target.value } : v)} />
                          <Input placeholder="P.IVA" value={editing?.vatNumber ?? ""} onChange={(e) => setEditing((v) => v ? { ...v, vatNumber: e.target.value } : v)} />
                        </div>
                        <DialogFooter>
                          <Button onClick={updateSupplier} disabled={busy || !editing?.name.trim()}>Salva</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
    </div>
  )
}

export async function listClienti() {
  const res = await fetch("/api/customers", { cache: "no-store" })
  if (!res.ok) throw new Error("Errore caricamento clienti")
  return res.json()
}

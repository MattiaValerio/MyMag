export async function listMovimenti() {
  const res = await fetch("/api/movimenti", { cache: "no-store" })
  if (!res.ok) throw new Error("Errore caricamento movimenti")
  return res.json()
}

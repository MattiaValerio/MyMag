export async function listArticoli() {
  const res = await fetch("/api/articles", { cache: "no-store" })
  if (!res.ok) throw new Error("Errore caricamento articoli")
  return res.json()
}

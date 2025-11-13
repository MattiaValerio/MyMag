export async function listPromozioni() {
  const res = await fetch("/api/promotions", { cache: "no-store" })
  if (!res.ok) throw new Error("Errore caricamento promozioni")
  return res.json()
}

export { auth as proxy } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/articoli/:path*",
    "/movimenti/:path*",
    "/clienti/:path*",
    "/promozioni/:path*",
    "/fornitori/:path*",
    "/utenti/:path*",
  ],
}
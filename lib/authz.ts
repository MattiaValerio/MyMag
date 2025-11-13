import type { Session } from "next-auth"

export function hasRole(session: Session | null, roles: Array<"ADMIN" | "AGENT" | "CLIENT">) {
  const role = (session?.user as any)?.role as string | undefined
  return !!role && roles.includes(role as any)
}

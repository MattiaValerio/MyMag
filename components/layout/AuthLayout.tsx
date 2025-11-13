import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthLayoutProps = {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background p-6", className)}>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

import { ReactNode } from "react"
import { MainHeader } from "@/components/layout/MainHeader"
import { MainSidebar } from "@/components/layout/MainSidebar"
import { cn } from "@/lib/utils"

type MainLayoutProps = {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full bg-background text-foreground", className)}>
      <div className="flex h-screen">
        <MainSidebar />
        <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
          <MainHeader />
          <main className="min-w-0 min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

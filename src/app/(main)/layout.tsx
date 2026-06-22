import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="h-full overflow-hidden">
        {/* <header className="flex shrink-0 items-center gap-2 px-4">
          <SidebarTrigger />
        </header> */}
        <main className="flex-1 h-full overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

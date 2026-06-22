import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ComponentsHeader from "@/components/ComponentsHeader";
import ComponentsLenis from "@/components/ComponentsLenis";

export default function InstallationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-svh overflow-hidden bg-white text-[#2a2a2a] border-l-[3px] border-[#2a2a2a]">
        <ComponentsHeader />
        <main
          id="main-scroller"
          className="flex-grow w-full relative overflow-y-auto overflow-x-hidden bg-[#f0eadf] scroll-smooth scrollbar-none"
        >
          {children}
        </main>
        <ComponentsLenis />
      </SidebarInset>
    </SidebarProvider>
  );
}

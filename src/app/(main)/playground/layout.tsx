import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ComponentsHeader from "@/components/ComponentsHeader";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-svh overflow-hidden bg-white text-[#2a2a2a] border-l-[3px] border-[#2a2a2a]">
        <ComponentsHeader />
        <main className="flex-1 min-h-0 w-full relative overflow-hidden bg-[#f0eadf]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

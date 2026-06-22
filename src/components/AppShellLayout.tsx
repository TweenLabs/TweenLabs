"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppShellHeader } from "@/components/AppShellHeader";
import Footer from "@/components/Footer";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  isShellDemoPage,
  isShellPlayground,
} from "@/lib/shell-routes";
import { cn } from "@/lib/utils";

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayground = isShellPlayground(pathname);
  const isDemo = isShellDemoPage(pathname);
  const showFooter = !isDemo && !isPlayground;

  return (
    <SidebarProvider
      className={cn(
        "flex min-h-svh w-full",
        (isPlayground || isDemo) && "h-svh overflow-hidden",
      )}
    >
      <AppSidebar />
      <SidebarInset
        className={cn(
          "flex min-h-svh flex-1 flex-col overflow-hidden bg-[#fafaf9]",
          (isPlayground || isDemo) && "h-svh",
        )}
      >
        <AppShellHeader />
        <div
          id={isDemo ? "main-scroller" : undefined}
          className={cn(
            "flex flex-1 flex-col min-h-0",
            isPlayground && "overflow-hidden",
            isDemo && "overflow-hidden demo-page-container scrollbar-none",
            !isPlayground && !isDemo && "overflow-y-auto",
          )}
        >
          {children}
          {showFooter && <Footer />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "All Components | TweenLabs",
  description:
    "Browse the full collection of premium GSAP components, interactive React templates, and ScrollTrigger animations. Free, production-ready, and copy-paste friendly.",
};

export default function ComponentsPage() {
  return (
    <SidebarProvider className="pt-14 md:pt-16">
      <AppSidebar />
      <SidebarInset className="overflow-y-auto overflow-x-hidden">
        <main className="flex-1 min-h-screen bg-[#f0eadf]" />
      </SidebarInset>
    </SidebarProvider>
  );
}

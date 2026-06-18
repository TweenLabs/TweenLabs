"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { animations } from "@/data/animations";
import { usePathname } from "next/navigation";
import type React from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Normalize path to match animations route structure
  const normalizedPath = pathname ? pathname.replace(/\/$/, "") : "";

  // Check if current page is one of the component demo pages
  const isDemoPage = animations.some((anim) => anim.route === normalizedPath);

  return (
    <>
      <Header />
      <main className={`flex-1 flex flex-col w-full relative ${isDemoPage ? "pt-0 demo-page-container" : "pt-24"}`}>
        {children}
      </main>
      {!isDemoPage && <Footer />}
    </>
  );
}

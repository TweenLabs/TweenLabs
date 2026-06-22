"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  isShellDemoPage,
  isShellPlayground,
  isShellRoute,
} from "@/lib/shell-routes";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLElement>(null);

  const isDemoPage = isShellDemoPage(pathname);
  const isPlayground = isShellPlayground(pathname);
  const isShell = isShellRoute(pathname);

  // Hide scrollbar on the main homepage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (pathname === "/") {
      document.documentElement.classList.add("scrollbar-none");
      document.body.classList.add("scrollbar-none");
    } else {
      document.documentElement.classList.remove("scrollbar-none");
      document.body.classList.remove("scrollbar-none");
    }

    return () => {
      document.documentElement.classList.remove("scrollbar-none");
      document.body.classList.remove("scrollbar-none");
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    if (!isDemoPage && !isShell) {
      // Restore root window scrolling (clean up from any previous demo page)
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";

      // Smooth scroll via Lenis on window for all non-demo pages
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
      });

      const gsapTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(gsapTick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.destroy();
        gsap.ticker.remove(gsapTick);
      };
    }

    if (!isDemoPage) {
      return;
    }

    // ——— BELOW RUNS ONLY ON DEMO PAGES ———

    // Reset window scroll position to top before locking to prevent cut-off header
    window.scrollTo(0, 0);

    // Lock root window scrolling
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    const scrollContainer = isShell
      ? document.getElementById("main-scroller")
      : scrollerRef.current;

    if (!scrollContainer) return;

    // Initialize Lenis smooth scroll on our custom scroller container
    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // Run Lenis tick within GSAP's central requestAnimationFrame ticker
    const gsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Restore root window scrolling
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";

      // Destroy Lenis
      lenis.destroy();
      gsap.ticker.remove(gsapTick);
    };
  }, [isDemoPage, isShell]);

  return (
    <>
      {!isShell && <Header />}
      <main
        ref={scrollerRef}
        id={isDemoPage && !isShell ? "main-scroller" : undefined}
        className={
          isShell
            ? isPlayground || isDemoPage
              ? "flex h-svh w-full flex-col overflow-hidden"
              : "flex min-h-svh w-full flex-col"
            : isDemoPage
              ? "flex-grow w-full relative overflow-y-auto overflow-x-hidden mt-[53px] md:mt-16 demo-page-container"
              : "flex-1 flex flex-col w-full relative pt-[69px] md:pt-24"
        }
        style={
          isDemoPage && !isShell
            ? { height: "calc(100dvh - 53px)" }
            : undefined
        }
      >
        {children}
        {!isDemoPage && !isShell && <Footer />}
      </main>
    </>
  );
}

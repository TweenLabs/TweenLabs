"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { animations } from "@/data/animations";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLElement>(null);

  // Normalize path to match animations route structure
  const normalizedPath = pathname ? pathname.replace(/\/$/, "") : "";

  // Check if current page is one of the component demo pages
  const isDemoPage = animations.some((anim) => anim.route === normalizedPath);

  useEffect(() => {
    if (!scrollerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll on our custom scroller container
    const lenis = new Lenis({
      wrapper: scrollerRef.current,
      content: scrollerRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Run Lenis tick within GSAP's central requestAnimationFrame ticker
    const gsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTick);
    };
  }, []);

  return (
    <>
      <Header />
      <main
        ref={scrollerRef}
        id="main-scroller"
        className={`flex-grow w-full relative overflow-y-auto overflow-x-hidden mt-16 ${
          isDemoPage ? "demo-page-container" : ""
        }`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        {children}
        {!isDemoPage && <Footer />}
      </main>
    </>
  );
}

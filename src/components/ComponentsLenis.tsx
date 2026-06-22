"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ComponentsLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Persistent Lenis instance — lives for the entire components layout lifetime
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.getElementById("main-scroller");
    if (!scroller) return;

    // Reset scroll position to top
    scroller.scrollTop = 0;

    // Initialize Lenis smooth scroll on the sidebar main content scroller container.
    // CRITICAL: eventsTarget must be scoped to the scroller element (not the default window).
    // Without this, Lenis calls preventDefault() on ALL wheel events globally, which
    // kills native overflow-y-auto scroll on every other element — including the sidebar.
    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller,
      eventsTarget: scroller,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.3,
    });

    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Synchronize scroll events with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    const gsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current = null;
      if ((window as unknown as { lenis?: Lenis }).lenis === lenis) {
        (window as unknown as { lenis?: Lenis }).lenis = undefined;
      }
      lenis.destroy();
      gsap.ticker.remove(gsapTick);
    };
  }, []);

  // On route change: tell Lenis to recalculate scroll limits.
  // This fixes "scroll gets stuck" when navigating between components
  // with different content heights (e.g., pinned PageTransition → short ParallaxHero).
  // Does NOT touch ScrollTrigger — each component manages its own triggers via useGSAP.
  useEffect(() => {
    const timer = setTimeout(() => {
      lenisRef.current?.resize();
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

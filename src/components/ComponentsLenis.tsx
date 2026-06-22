"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ComponentsLenis() {
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
    });

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
      lenis.destroy();
      gsap.ticker.remove(gsapTick);
    };
  }, []);

  return null;
}

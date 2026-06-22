"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function ParallaxHeroPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scroller =
        containerRef.current.closest("#main-scroller") || undefined;

      // SplitText headline entrance
      const headingEl =
        containerRef.current.querySelector(".parallax-headline");
      if (headingEl) {
        SplitText.create(headingEl, {
          type: "chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 80 });
            return gsap.to(self.chars, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: { from: "random", each: 0.03 },
              ease: "back.out(1.5)",
              delay: 0.3,
            });
          },
        });
      }

      // Subheadline fade in
      gsap.from(".parallax-sub", {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      });

      // Headline parallax (slow)
      gsap.to(".parallax-headline-wrap", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Subheadline parallax (medium)
      gsap.to(".parallax-sub", {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative min-h-[200vh] bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black overflow-x-hidden font-sans"
      ref={containerRef}
    >
      {/* Dot Grid (background layer) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Main headline */}
        <div className="parallax-headline-wrap z-20 text-center max-w-4xl will-change-transform">
          <h1 className="parallax-headline text-3xl sm:text-5xl md:text-7xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-[0.95]">
            Build Something Beautiful
          </h1>
        </div>

        {/* Subheadline */}
        <p className="parallax-sub z-20 mt-6 max-w-lg text-center text-sm md:text-base font-sans font-medium text-zinc-550 leading-relaxed">
          Multi-layer parallax hero with SplitText character scatter entrance
          and scroll-driven depth motion. Every layer moves at a different
          speed.
        </p>
      </section>
    </div>
  );
}

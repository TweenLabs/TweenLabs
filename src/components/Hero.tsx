"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const scroller =
        sectionRef.current.closest("#main-scroller") || undefined;

      // ─── Badge pill entrance ───────────────────────────
      gsap.from(".hero-badge", {
        autoAlpha: 0,
        y: -30,
        scale: 0.8,
        rotate: -8,
        duration: 0.7,
        ease: "back.out(2)",
        delay: 0.1,
      });

      // ─── SplitText headline character scatter ──────────
      const headingEl = sectionRef.current.querySelector(".hero-headline");
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

      // ─── "GSAP Components" subtitle entrance ──────────
      const subtitleEl =
        sectionRef.current.querySelector(".hero-subtitle");
      if (subtitleEl) {
        SplitText.create(subtitleEl, {
          type: "chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 50 });
            return gsap.to(self.chars, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: { from: "start", each: 0.025 },
              ease: "back.out(1.2)",
              delay: 0.7,
            });
          },
        });
      }

      // ─── Description paragraph fade ────────────────────
      gsap.from(".hero-desc", {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        delay: 1.1,
        ease: "power2.out",
      });

      // ─── Scroll indicator fade ─────────────────────────
      gsap.from(".hero-scroll-indicator", {
        autoAlpha: 0,
        y: 15,
        duration: 0.6,
        delay: 1.5,
        ease: "power2.out",
      });

      // ─── Scroll parallax: headline moves slower ────────
      gsap.to(".hero-headline-wrap", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ─── Scroll parallax: subtitle + desc moves faster ─
      gsap.to(".hero-sub-wrap", {
        y: -140,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ─── Badge floats up even faster on scroll ─────────
      gsap.to(".hero-badge", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center gap-4 md:gap-6 z-10 min-h-[70dvh] md:min-h-[calc(100vh-4rem)]"
    >
      <div className="flex flex-col items-center gap-4 md:gap-6 py-8 md:py-12">
        <div className="hero-badge inline-flex items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right will-change-transform">
          <span>TweenLabs Animation Hub</span>
        </div>

        <div className="hero-headline-wrap will-change-transform">
          <h1 className="hero-headline text-3xl sm:text-4xl md:text-7xl font-serif font-black tracking-tight text-[#2a2a2a] max-w-4xl leading-[1.05]">
            TweenLabs
          </h1>
        </div>

        <div className="hero-sub-wrap will-change-transform">
          <span className="hero-subtitle block text-3xl sm:text-4xl md:text-7xl font-serif font-black tracking-tight text-wtf-orange uppercase leading-[1.05]">
            GSAP Components
          </span>

          <p className="hero-desc max-w-xl text-zinc-700 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-medium px-2 mt-4 md:mt-6 mx-auto">
            A high-fidelity collection of the best GSAP components, interactive
            React templates, and ScrollTrigger animations. Free, production-ready,
            and copy-paste friendly.
          </p>
        </div>
      </div>

      {/* Scroll Down Indicator HUD */}
      <div className="hero-scroll-indicator absolute bottom-4 md:bottom-8 inset-x-0 mx-auto w-fit flex flex-col items-center gap-1 animate-bounce pointer-events-none text-zinc-500 font-mono text-[8px] md:text-[9px] tracking-widest uppercase">
        <span>Scroll to Explore</span>
        <span className="text-wtf-orange font-bold text-xs md:text-sm">↓</span>
      </div>
    </section>
  );
}

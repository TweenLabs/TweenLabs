"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function RevealTextPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      // ── Hero Title: char scatter from center ──
      const heroEl = containerRef.current?.querySelector(".hero-title");
      if (heroEl) {
        SplitText.create(heroEl, {
          type: "chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 60, rotateX: -90 });
            return gsap.to(self.chars, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: { from: "center", each: 0.04 },
              ease: "back.out(1.4)",
              delay: 0.3,
            });
          },
        });
      }

      // ── Hero accent line draw ──
      gsap.from(".hero-line", {
        scaleX: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.inOut",
        transformOrigin: "left center",
      });

      // ── Hero subtitle ──
      gsap.from(".hero-subtitle", {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        delay: 1,
        ease: "power2.out",
      });

      // ── Hero description ──
      gsap.from(".hero-desc", {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        delay: 1.3,
        ease: "power2.out",
      });

      // ── Demo Section title: line-by-line reveal ──
      const sectionTitle =
        containerRef.current?.querySelector(".reveal-line-title");
      if (sectionTitle) {
        SplitText.create(sectionTitle, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            gsap.from(self.lines, {
              y: "100%",
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: sectionTitle,
                scroller,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
          },
        });
      }

      // ── Demo Section description: word-by-word ──
      const sectionDesc =
        containerRef.current?.querySelector(".reveal-word-desc");
      if (sectionDesc) {
        SplitText.create(sectionDesc, {
          type: "words",
          mask: "words",
          wordsClass: "reveal-word",
          autoSplit: true,
          onSplit(self) {
            gsap.from(self.words, {
              y: "100%",
              opacity: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.03,
              scrollTrigger: {
                trigger: sectionDesc,
                scroller,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          },
        });
      }

      // ── Demo Section closing: random char scatter ──
      const closingEl = containerRef.current?.querySelector(
        ".reveal-char-closing",
      );
      if (closingEl) {
        SplitText.create(closingEl, {
          type: "chars",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.chars, { autoAlpha: 0, y: 40 });
            gsap.to(self.chars, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: { from: "random", each: 0.02 },
              ease: "back.out(1.3)",
              scrollTrigger: {
                trigger: closingEl,
                scroller,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#6758a5] selection:text-white min-h-[180vh] font-sans"
      ref={containerRef}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6">
        {/* Tag */}
        <span className="hero-subtitle font-mono text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">
          Component 19 · SplitText Masks
        </span>

        {/* Title */}
        <h1
          className="hero-title text-3xl sm:text-5xl md:text-7xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-[0.95] text-center max-w-5xl"
          style={{ perspective: "600px" }}
        >
          Reveal Text
        </h1>

        {/* Accent line */}
        <div className="hero-line h-[3px] w-20 bg-[#e55b3c] rounded-full my-8" />

        {/* Description */}
        <p className="hero-desc max-w-xl text-center text-sm md:text-base font-sans font-medium text-zinc-500 leading-relaxed">
          Premium line-by-line text reveal using SplitText masks with staggered
          choreography. Every heading, paragraph, and label animates
          independently on scroll.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] uppercase tracking-widest text-[#2a2a2a]/40 animate-bounce pointer-events-none flex flex-col items-center gap-1.5">
          <span>Scroll to Reveal</span>
          <span className="text-[#e55b3c] font-black text-sm">↓</span>
        </div>
      </section>

      {/* ═══════════════════ REVEALS SHOWCASE SECTION ═══════════════════ */}
      <section className="relative px-6 py-28 md:py-36">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {/* 1. Line-by-line reveal showcase */}
          <div className="border-l-4 border-[#e55b3c] pl-6">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#e55b3c] mb-2 block">
              [ Reveal Effect 01 · Line by Line ]
            </span>
            <h2 className="reveal-line-title font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#1c1714] leading-[1.1] tracking-tight">
              Text reveals that feel like they belong to the page — not bolted
              on.
            </h2>
          </div>

          {/* 2. Word-by-word reveal showcase */}
          <div className="border-l-4 border-[#0c9367] pl-6">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#0c9367] mb-2 block">
              [ Reveal Effect 02 · Word by Word ]
            </span>
            <p className="reveal-word-desc font-sans text-sm md:text-base text-zinc-550 leading-relaxed max-w-2xl">
              Each block of text is split into lines, words, or characters using
              GSAP SplitText. A clipping mask ensures text slides up from behind
              an invisible boundary, creating a clean, editorial reveal.
            </p>
          </div>

          {/* 3. Character-by-character random scatter showcase */}
          <div className="border-l-4 border-[#6758a5] pl-6">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#6758a5] mb-2 block">
              [ Reveal Effect 03 · Random Character Scatter ]
            </span>
            <h3 className="reveal-char-closing font-serif font-black text-xl sm:text-2xl md:text-3xl text-[#1c1714] leading-tight">
              Motion with Meaning.
            </h3>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-[10vh]" />
    </div>
  );
}

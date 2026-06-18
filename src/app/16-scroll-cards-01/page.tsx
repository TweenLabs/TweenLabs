"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const cardsData = [
  {
    title: "PLAN & CONCEPT",
    copy: "Aligning architectural frameworks with dynamic visual assets to establish high-fidelity mockups.",
    imgUrl: "/Untitled design.png",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
  },
  {
    title: "CREATIVE SYSTEM",
    copy: "Constructing interactive color tokens, asymmetric border structures, and custom tactile overlays.",
    imgUrl: "/Untitled design (1).png",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
  },
  {
    title: "MOTION PHYSICS",
    copy: "Leveraging spring momentum and coordinate-based tracking to create reactive web experiences.",
    imgUrl: "/Untitled design (2).png",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
  },
  {
    title: "DEPLOY ENGINE",
    copy: "Bundling static layouts and hydration-safe route pipelines to execute at 60 frames per second.",
    imgUrl: "/Untitled design (3).png",
    bgColor: "bg-[#1e1e1e]",
    textColor: "text-white",
  },
];

export default function ScrollCardsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cardEls = gsap.utils.toArray<HTMLElement>(".scroll-card-item");
    if (cardEls.length === 0) return;

    // Pin the intro section
    ScrollTrigger.create({
      trigger: cardEls[0],
      start: "top 35%",
      endTrigger: cardEls[cardEls.length - 1],
      end: "top 30%",
      pin: ".scroll-intro-section",
      pinSpacing: false,
    });

    cardEls.forEach((card, index) => {
      const cardInner = card.querySelector(".scroll-card-inner");

      // Pin each card container in place
      ScrollTrigger.create({
        trigger: card,
        start: "top 35%",
        endTrigger: ".scroll-outro-section",
        end: "top 65%",
        pin: true,
        pinSpacing: false,
      });

      // Slide inner cards up slightly during scroll
      gsap.to(cardInner, {
        y: `-${(cardEls.length - index) * 14}vh`,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 35%",
          endTrigger: ".scroll-outro-section",
          end: "top 65%",
          scrub: true,
        },
      });
    });

  }, { scope: containerRef });

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col selection:bg-wtf-yellow selection:text-black overflow-x-hidden" ref={containerRef}>
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Floating back to dashboard */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-wtf-orange border-b-3 border-[#2a2a2a] flex flex-col items-center justify-center p-8 text-center z-10">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-black uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
            <span>Component 16</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black uppercase text-white leading-none tracking-tight">
            Scroll Stacking Cards
          </h1>
          <p className="text-white text-sm font-mono uppercase tracking-wider animate-bounce mt-8">
            ↓ Scroll Down to View Stack ↓
          </p>
        </div>
      </section>

      {/* Intro Section (will get pinned) */}
      <section className="scroll-intro-section w-full h-screen bg-[#f0eadf] flex items-center justify-center p-8 z-10 border-b-3 border-[#2a2a2a]">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-black uppercase leading-tight">
            Assembling layouts with intentional motion.
          </h2>
        </div>
      </section>

      {/* Cards List Section */}
      <section className="relative w-full flex flex-col z-20">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="scroll-card-item relative w-full h-[80vh] flex justify-center items-center px-4 md:px-8 border-b-3 border-[#2a2a2a]"
            id={`card-${index + 1}`}
          >
            <div
              className={`scroll-card-inner brutalist-card w-full max-w-4xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center will-change-transform ${card.bgColor} ${card.textColor}`}
            >
              <div className="flex-1 flex flex-col gap-4">
                <span className="font-mono text-xs opacity-50 uppercase tracking-widest">[ Step 0{index + 1} ]</span>
                <h3 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="font-sans font-medium text-sm md:text-base leading-relaxed opacity-95">
                  {card.copy}
                </p>
              </div>
              <div className="w-full md:w-80 h-60 relative rounded-xl border-3 border-[#2a2a2a] overflow-hidden shadow-[4px_4px_0px_#2a2a2a] flex-shrink-0">
                <Image
                  src={card.imgUrl}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Outro Section */}
      <section className="scroll-outro-section relative h-screen bg-wtf-green border-b-3 border-[#2a2a2a] flex items-center justify-center p-8 text-center z-10 text-white">
        <div className="max-w-2xl flex flex-col gap-4">
          <h2 className="text-4xl md:text-6xl font-serif font-black uppercase leading-none tracking-tight">
            Stack Completed
          </h2>
          <p className="font-sans font-semibold text-sm opacity-90">
            All structural cards have folded together in viewport coordinate space.
          </p>
        </div>
      </section>

      {/* Footer Ending */}
      <section className="h-screen w-full bg-[#f0eadf] flex flex-col items-center justify-center p-8 text-center z-10">
        <h2 className="text-3xl font-serif font-black uppercase mb-4 text-[#2a2a2a]">
          End of Sandbox
        </h2>
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-4 px-8 rounded-xl uppercase tracking-wider cursor-pointer">
            ← Back to Dashboard
          </button>
        </Link>
      </section>
    </div>
  );
}

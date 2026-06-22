"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CardItem {
  title: string;
  copy: string;
  imgUrl: string;
  bgColor: string;
  textColor: string;
  accentHex: string;
  themeColor: string; // Tailwind class
  statLabel?: string;
}

const cardsData: CardItem[] = [
  {
    title: "PLAN & CONCEPT",
    copy: "Aligning architectural frameworks with dynamic visual assets to establish high-fidelity mockups.",
    imgUrl: "https://tweenlabs.xyz/showcase-1.webp",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "229, 91, 60", // orange
    themeColor: "bg-[#e55b3c]",
  },
  {
    title: "CREATIVE SYSTEM",
    copy: "Constructing interactive color tokens, asymmetric border structures, and custom tactile overlays.",
    imgUrl: "https://tweenlabs.xyz/showcase-2.webp",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "12, 147, 103", // green
    themeColor: "bg-[#0c9367]",
  },
  {
    title: "MOTION PHYSICS",
    copy: "Leveraging spring momentum and coordinate-based tracking to create reactive web experiences.",
    imgUrl: "https://tweenlabs.xyz/showcase-3.webp",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "241, 179, 51", // yellow
    themeColor: "bg-[#f1b333]",
  },
  {
    title: "DEPLOY ENGINE",
    copy: "Bundling static layouts and hydration-safe route pipelines to execute at 60 frames per second.",
    imgUrl: "https://tweenlabs.xyz/showcase-4.webp",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "103, 88, 165", // purple
    themeColor: "bg-[#6758a5]",
  },
];

export default function ScrollCardsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cardEls = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          ".scroll-card-item",
        ) ?? [],
      );
      if (cardEls.length === 0) return;

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      cardEls.forEach((card, index) => {
        // Calculate dynamic pin durations so all cards remain pinned until the last card finishes
        const cardHeight = window.innerHeight * 0.65;
        const baseDuration = 450;
        const pinDuration =
          (cardEls.length - 1 - index) * cardHeight + baseDuration;

        // Pin each card container in place
        ScrollTrigger.create({
          trigger: card,
          scroller: scroller,
          start: "top top",
          end: `+=${pinDuration}`,
          pin: true,
          pinSpacing: false,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col selection:bg-[#f1b333] selection:text-black overflow-x-hidden font-sans"
      ref={containerRef}
    >
      {/* Tactile Grids */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Cards List Section directly (no intro or outro sections) */}
      <section className="relative w-full flex flex-col z-20 pt-28 pb-48">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="scroll-card-item relative w-full h-[65vh] flex justify-center items-center px-4 md:px-8"
            id={`card-${index + 1}`}
          >
            <div
              className={`scroll-card-inner border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] w-full max-w-4xl p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center select-none rounded-2xl relative overflow-hidden ${card.bgColor} ${card.textColor}`}
              style={{
                top: `${index * 44}px`,
              }}
            >
              {/* Step info on left */}
              <div className="flex-1 flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs opacity-50 uppercase tracking-widest">
                    [ Step 0{index + 1} ]
                  </span>
                  <span
                    className={`inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${card.themeColor}`}
                  >
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif font-black uppercase tracking-tight leading-none text-[#2a2a2a]">
                  {card.title}
                </h3>
                <p className="font-sans font-medium text-xs md:text-sm leading-relaxed text-zinc-650 mt-2">
                  {card.copy}
                </p>

                {/* Spec details readout */}
                <div className="border border-zinc-200 bg-zinc-50 p-2.5 rounded-xl flex items-center justify-between font-mono max-w-[200px] mt-2 shadow-[2px_2px_0px_#2a2a2a]">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-zinc-400 font-bold">
                      METRIC INDEX
                    </span>
                    <span className="text-[9px] font-black text-[#2a2a2a]">
                      {card.statLabel || "NODE CHECK // OK"}
                    </span>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${card.themeColor}`}
                  />
                </div>
              </div>

              {/* Framed Image on right */}
              <div className="inner-img-frame w-full md:w-80 h-48 md:h-56 relative rounded-xl border-3 border-[#2a2a2a] overflow-hidden shadow-[4px_4px_0px_#2a2a2a] flex-shrink-0 z-10">
                <img
                  src={card.imgUrl}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

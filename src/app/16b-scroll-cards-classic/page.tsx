"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CardItem {
  title: string;
  copy: string;
  imgUrl: string;
  bgColor: string;
  textColor: string;
  accentHex: string;
  themeColor: string; // Tailwind class
  statLabel: string;
}

const cardsData: CardItem[] = [
  {
    title: "PLAN & CONCEPT",
    copy: "Aligning architectural frameworks with dynamic visual assets to establish high-fidelity mockups.",
    imgUrl: "/Untitled design.png",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "103, 88, 165", // purple
    themeColor: "bg-wtf-purple",
    statLabel: "NODE_01 // COMPILE_OK",
  },
  {
    title: "CREATIVE SYSTEM",
    copy: "Constructing interactive color tokens, asymmetric border structures, and custom tactile overlays.",
    imgUrl: "/Untitled design (1).png",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "12, 147, 103", // green
    themeColor: "bg-wtf-green",
    statLabel: "NODE_02 // SYSTEM_STABLE",
  },
  {
    title: "MOTION PHYSICS",
    copy: "Leveraging spring momentum and coordinate-based tracking to create reactive web experiences.",
    imgUrl: "/Untitled design (2).png",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "241, 179, 51", // yellow
    themeColor: "bg-wtf-yellow",
    statLabel: "NODE_03 // CORE_ONLINE",
  },
  {
    title: "DEPLOY ENGINE",
    copy: "Bundling static layouts and hydration-safe route pipelines to execute at 60 frames per second.",
    imgUrl: "/Untitled design (3).png",
    bgColor: "bg-white",
    textColor: "text-[#2a2a2a]",
    accentHex: "229, 91, 60", // orange
    themeColor: "bg-wtf-orange",
    statLabel: "NODE_04 // SHIPPED_PROD",
  },
];

export default function ScrollCardsClassicPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    const cardEls = gsap.utils.toArray<HTMLElement>(".scroll-card-item");
    if (cardEls.length === 0) return;

    cardEls.forEach((card, index) => {
      const cardInner = card.querySelector(".scroll-card-inner");

      // Calculate dynamic pin durations so all cards remain pinned together and unpin at the end
      const cardHeight = window.innerHeight * 0.65;
      const baseDuration = 450;
      const pinDuration = (cardEls.length - 1 - index) * cardHeight + baseDuration;

      // Pin each card container in place
      ScrollTrigger.create({
        trigger: card,
        start: "top 8%",
        end: `+=${pinDuration}`,
        pin: true,
        pinSpacing: false,
        onToggle: (self) => {
          if (self.isActive) {
            setActiveStep(index);
          }
        },
      });

      // Slide inner cards up slightly during scroll to create the stacking overlap.
      // Maximum offset is -(4 - 1 - index) * 5vh.
      // Card 1 shifts by -15vh, Card 2 shifts by -10vh, Card 3 shifts by -5vh, Card 4 shifts by 0vh.
      // Pinned at top 8%, this keeps all cards completely on-screen inside the DOM viewport boundaries.
      gsap.to(cardInner, {
        y: `-${(cardEls.length - 1 - index) * 5}vh`,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 8%",
          end: `+=${pinDuration}`,
          scrub: true,
        },
      });
    });

  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 3D Card Perspective Tilt
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set custom coordinates on card for pointer spotlight
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 6;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.35,
      overwrite: "auto",
    });

    // Image offset push
    const img = card.querySelector(".inner-img-frame img");
    if (img) {
      const moveX = ((x - rect.width / 2) / rect.width) * 12;
      const moveY = ((y - rect.height / 2) / rect.height) * 12;
      gsap.to(img, {
        x: moveX,
        y: moveY,
        scale: 1.06,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  });

  // Reset 3D Tilt
  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.8,
      overwrite: "auto",
    });

    const img = card.querySelector(".inner-img-frame img");
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1.0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col selection:bg-wtf-yellow selection:text-black overflow-x-hidden font-sans" ref={containerRef}>
      {/* Tactile Grids */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating Dashboard Back Button */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Page Heading readout (absolute right) */}
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 select-none text-right">
        <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 bg-white px-2 py-0.5 rounded">
          Component 16B
        </span>
        <h1 className="font-serif font-black text-lg uppercase text-[#2a2a2a]">
          Classic Parallax Stack
        </h1>
      </div>

      {/* Left-Side Fixed Progress Gauge (Only desktop) */}
      <div className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-6 select-none pointer-events-none">
        <div className="w-[4px] h-48 bg-zinc-300 relative rounded">
          {/* Active progress fill line */}
          <div
            className="absolute top-0 left-0 w-full bg-[#2a2a2a] rounded transition-all duration-300"
            style={{ height: `${(activeStep / (cardsData.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex flex-col gap-5 items-center font-mono text-[10px] font-bold">
          {cardsData.map((card, idx) => (
            <div
              key={idx}
              className={`w-9 h-9 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center transition-all duration-300 shadow-[2px_2px_0px_#2a2a2a] ${
                idx === activeStep ? `${card.themeColor} text-white scale-110` : "bg-white text-zinc-400"
              }`}
            >
              0{idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Cards List Section directly (no intro or outro sections) */}
      <section className="relative w-full flex flex-col z-20 pt-28 pb-48">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="scroll-card-item relative w-full h-[65vh] flex justify-center items-center px-4 md:px-8"
            id={`card-${index + 1}`}
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`scroll-card-inner brutalist-card w-full max-w-4xl p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center select-none cursor-pointer rounded-2xl will-change-transform relative overflow-hidden ${card.bgColor} ${card.textColor}`}
              style={{
                top: `${index * 44}px`,
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              {/* Radial Pointer spotlight glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
                style={{
                  background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${card.accentHex}, 0.08), transparent 85%)`,
                }}
              />

              {/* Step info on left */}
              <div className="flex-1 flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] opacity-70 uppercase tracking-widest">[ Step 0{index + 1} ]</span>
                  <span className={`inline-block border border-black px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${card.themeColor}`}>
                    ACTIVE NODE
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif font-black uppercase tracking-tight leading-none text-[#2a2a2a]">
                  {card.title}
                </h3>
                <p className="font-sans font-medium text-xs md:text-sm leading-relaxed text-zinc-650 mt-2">
                  {card.copy}
                </p>

                {/* Spec details readout */}
                <div className="border border-black/10 bg-black/5 p-2.5 rounded-xl flex items-center justify-between font-mono max-w-[200px] mt-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-black/50 font-bold">METRIC INDEX</span>
                    <span className="text-[9px] font-black text-[#2a2a2a]">{card.statLabel}</span>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${card.themeColor}`} />
                </div>
              </div>

              {/* Framed Image on right */}
              <div
                className="inner-img-frame w-full md:w-80 h-44 md:h-52 relative rounded-xl border-3 border-[#2a2a2a] overflow-hidden shadow-[4px_4px_0px_#2a2a2a] flex-shrink-0 z-10"
                style={{ transform: "translateZ(15px)" }}
              >
                <Image
                  src={card.imgUrl}
                  alt={card.title}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

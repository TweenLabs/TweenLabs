"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CarouselItem {
  id: number;
  num: string;
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  bgColor: string; // Hex color for background transitions
  accentColor: string; // Hex/Tailwind replacement
  textColor: string;
}

const items: CarouselItem[] = [
  {
    id: 0,
    num: "01",
    title: "Quantum Compiler",
    category: "ENGINEERING",
    desc: "A custom LLVM backend translating abstract syntax trees into parallel topological gates.",
    imgUrl: "https://tweenlabs.xyz/showcase-1.webp",
    bgColor: "#e55b3c", // wtf-orange
    accentColor: "bg-[#e55b3c]",
    textColor: "text-white",
  },
  {
    id: 1,
    num: "02",
    title: "Kinetic Geometry",
    category: "GRAPHICS",
    desc: "GPU-accelerated vector fields tracing magnetic flow lines with spring-damper integrations.",
    imgUrl: "https://tweenlabs.xyz/showcase-2.webp",
    bgColor: "#0c9367", // wtf-green
    accentColor: "bg-[#0c9367]",
    textColor: "text-white",
  },
  {
    id: 2,
    num: "03",
    title: "Syntactic Shadow",
    category: "AESTHETICS",
    desc: "High-contrast editorial grid structures utilizing strict monospace matrices and ink traps.",
    imgUrl: "https://tweenlabs.xyz/showcase-3.webp",
    bgColor: "#6758a5", // wtf-purple
    accentColor: "bg-[#6758a5]",
    textColor: "text-white",
  },
  {
    id: 3,
    num: "04",
    title: "Hydra Protocol",
    category: "NETWORKS",
    desc: "A peer-to-peer ledger using ephemeral cryptographic state rings and consensus maps.",
    imgUrl: "https://tweenlabs.xyz/showcase-4.webp",
    bgColor: "#3b82f6", // wtf-blue
    accentColor: "bg-[#3b82f6]",
    textColor: "text-white",
  },
  {
    id: 4,
    num: "05",
    title: "Hyperion Core",
    category: "HARDWARE",
    desc: "FPGA solvers designed for extreme throughput pipelines and multi-threaded register stacks.",
    imgUrl: "https://tweenlabs.xyz/showcase-5.webp",
    bgColor: "#c53b3a", // wtf-red
    accentColor: "bg-[#c53b3a]",
    textColor: "text-white",
  },
  {
    id: 5,
    num: "06",
    title: "Helios Shader",
    category: "RAYTRACING",
    desc: "Real-time volumetric path tracers modeling multi-scatter atmospheric absorption.",
    imgUrl: "https://tweenlabs.xyz/showcase-6.webp",
    bgColor: "#f1b333", // wtf-yellow
    accentColor: "bg-[#f1b333]",
    textColor: "text-black",
  },
];

export default function ThreeDCarouselPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const wrapperBgRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const getHexWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // ScrollTrigger-driven carousel — pinned in flow, scrub drives card rotation
  useGSAP(
    () => {
      const numCards = items.length;

      // Initial state: all cards centered, first card active
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const diff = index; // distance from card 0
        const xStep = 260;
        const zStep = 180;
        const maxRotY = 48;

        const x = diff * xStep;
        const z = -Math.abs(diff) * zStep;
        const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));
        const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
        const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);

        gsap.set(card, {
          x,
          y: 0,
          z,
          rotationY: rotY,
          scale,
          opacity,
          zIndex: Math.round(100 - Math.abs(diff) * 10),
          pointerEvents: Math.abs(diff) < 0.8 ? "auto" : "none",
        });

        // Set initial card inner styles & glow opacity
        const cardInner = cardInnersRef.current[index];
        if (cardInner) {
          const isActive = index === 0;
          gsap.set(cardInner, {
            borderColor: isActive ? "#f1b333" : "#2a2a2a",
            boxShadow: isActive
              ? "12px 12px 0px #2a2a2a"
              : "6px 6px 0px #2a2a2a",
          });
          const glow = cardInner.querySelector(".card-glow");
          if (glow) {
            gsap.set(glow, { opacity: isActive ? 0.4 : 0 });
          }
        }
      });

      // Set initial background
      if (wrapperBgRef.current) {
        gsap.set(wrapperBgRef.current, {
          backgroundColor: getHexWithOpacity(items[0].bgColor, 0.12),
        });
      }

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      // Master scroll-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${(numCards - 1) * 800}`, // 800px of scroll per card
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Map scroll progress (0–1) to card index (0 – numCards-1)
            const smoothRotation = self.progress * (numCards - 1);
            const currentActive = Math.max(
              0,
              Math.min(numCards - 1, Math.round(smoothRotation)),
            );
            setActiveIdx(currentActive);
          },
        },
      });

      // For each card transition, animate the carousel positions
      // We start from targetCard = 1 up to numCards - 1, transition from (targetCard - 1) to targetCard
      for (let targetCard = 1; targetCard < numCards; targetCard++) {
        const startTime = targetCard - 1; // Each transition gets 1 unit of timeline

        // Animate all cards to reposition for this target
        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          const diff = index - targetCard;
          const xStep = 260;
          const zStep = 180;
          const maxRotY = 48;

          const x = diff * xStep;
          const z = -Math.abs(diff) * zStep;
          const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));
          const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
          const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);
          const isClickable = Math.abs(diff) < 0.8;

          tl.to(
            card,
            {
              x,
              y: 0,
              z,
              rotationY: rotY,
              scale,
              opacity,
              zIndex: Math.round(100 - Math.abs(diff) * 10),
              pointerEvents: isClickable ? "auto" : "none",
              duration: 1,
              ease: "none",
            },
            startTime,
          );

          // Animate card borders, shadows, and glow opacities directly in timeline
          const cardInner = cardInnersRef.current[index];
          if (cardInner) {
            const isCurrentActive = index === targetCard;
            tl.to(
              cardInner,
              {
                borderColor: isCurrentActive ? "#f1b333" : "#2a2a2a",
                boxShadow: isCurrentActive
                  ? "12px 12px 0px #2a2a2a"
                  : "6px 6px 0px #2a2a2a",
                duration: 1,
                ease: "none",
              },
              startTime,
            );

            const glow = cardInner.querySelector(".card-glow");
            if (glow) {
              tl.to(
                glow,
                {
                  opacity: isCurrentActive ? 0.4 : 0,
                  duration: 1,
                  ease: "none",
                },
                startTime,
              );
            }
          }
        });

        // Animate background color transition
        if (wrapperBgRef.current) {
          tl.to(
            wrapperBgRef.current,
            {
              backgroundColor: getHexWithOpacity(
                items[targetCard].bgColor,
                0.12,
              ),
              duration: 1,
              ease: "none",
            },
            startTime,
          );
        }
      }
    },
    { scope: containerRef },
  );

  // Card Mouse Hover 3D Tilt Effect
  const handleCardMouseMove = (e: React.MouseEvent, index: number) => {
    if (detailIdx !== null) return;
    if (index !== activeIdx) return;

    const card = cardInnersRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    const rotY = (xPercent - 0.5) * 20;
    const rotX = (yPercent - 0.5) * -20;

    gsap.to(card, {
      rotationY: rotY,
      rotationX: rotX,
      scale: 1.04,
      boxShadow: "12px 12px 0px #2a2a2a",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardInnersRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow:
        index === activeIdx ? "12px 12px 0px #2a2a2a" : "6px 6px 0px #2a2a2a",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const closeDetail = useCallback(() => {
    if (detailIdx === null) return;

    const previousIdx = detailIdx;
    setDetailIdx(null);

    // Re-enable page scrolling
    document.body.style.overflow = "";
    const scroller = containerRef.current?.closest("#main-scroller");
    if (scroller instanceof HTMLElement) {
      scroller.style.overflow = "";
    }

    // Stagger out elements inside detail panel
    if (detailPanelRef.current) {
      gsap.to(detailPanelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }

    // Restore card positions via ScrollTrigger refresh
    const activeItem = items[previousIdx];
    if (wrapperBgRef.current) {
      const targetBg = getHexWithOpacity(activeItem.bgColor, 0.12);
      gsap.to(wrapperBgRef.current, {
        backgroundColor: targetBg,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Restore all cards visibility
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      if (index !== previousIdx) {
        const diff = index - previousIdx;
        const xStep = 260;
        const zStep = 180;
        const maxRotY = 48;

        gsap.to(card, {
          x: diff * xStep,
          z: -Math.abs(diff) * zStep,
          rotationY: Math.max(-maxRotY, Math.min(maxRotY, diff * -35)),
          scale: Math.max(0.68, 1 - Math.abs(diff) * 0.08),
          opacity: Math.max(0.08, 1 - Math.abs(diff) * 0.38),
          pointerEvents: Math.abs(diff) < 0.8 ? "auto" : "none",
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(card, {
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          rotationY: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }, [detailIdx]);

  // Detail Panel Reveal Transition
  const openDetail = useCallback(
    (index: number) => {
      if (index !== activeIdx) return;

      setDetailIdx(index);
      const card = cardsRef.current[index];
      const activeItem = items[index];

      if (!card) return;

      // Lock page scrolling to prevent carousel from shifting while detail panel is open
      document.body.style.overflow = "hidden";
      const scroller = containerRef.current?.closest("#main-scroller");
      if (scroller instanceof HTMLElement) {
        scroller.style.overflow = "hidden";
      }

      // Shift wrapper background to solid active color
      if (wrapperBgRef.current) {
        gsap.to(wrapperBgRef.current, {
          backgroundColor: activeItem.bgColor,
          duration: 0.6,
          ease: "power3.out",
        });
      }

      // Animate active card straight to the viewport left side
      gsap.to(card, {
        x: "-25vw",
        y: 0,
        z: 0,
        scale: 1,
        rotationY: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      // Hide other cards
      cardsRef.current.forEach((otherCard, idx) => {
        if (!otherCard || idx === index) return;
        gsap.to(otherCard, {
          opacity: 0,
          scale: 0.5,
          z: -400,
          x: idx < index ? -600 : 600,
          rotationY: idx < index ? -60 : 60,
          pointerEvents: "none",
          duration: 0.6,
          overwrite: "auto",
        });
      });

      // Stagger in elements inside the detail panel
      if (detailPanelRef.current) {
        gsap.fromTo(
          detailPanelRef.current,
          { x: "100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.7,
            ease: "power3.inOut",
            overwrite: "auto",
          },
        );

        gsap.fromTo(
          detailPanelRef.current.querySelectorAll(".stagger-in"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.3,
            overwrite: "auto",
          },
        );
      }
    },
    [activeIdx],
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden selection:bg-[#f1b333] selection:text-black font-sans"
    >
      {/* Dynamic tactile noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Scroll Indicator HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-xs uppercase tracking-widest text-[#2a2a2a]/60 animate-bounce pointer-events-none flex flex-col items-center gap-1">
        <span>Scroll to Browse</span>
        <span className="text-[#e55b3c] font-bold text-sm">↓</span>
      </div>

      {/* Pinned Scroll Section — in normal document flow */}
      <div
        ref={scrollSectionRef}
        className="h-screen w-full relative overflow-hidden"
      >
        {/* Animated background layer */}
        <div
          ref={wrapperBgRef}
          className="absolute inset-0 transition-colors duration-500 z-0"
        />

        {/* Header Info */}
        <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 select-none text-right">
          <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 bg-white px-2 py-0.5 rounded">
            Component 14
          </span>
          <h1 className="font-serif font-black text-lg md:text-xl uppercase tracking-tight text-[#2a2a2a]">
            3D Coverflow Carousel
          </h1>
          <p className="font-mono text-[9px] text-zinc-500 max-w-[200px]">
            [Scroll to Navigate / Click to Expand]
          </p>
        </div>

        {/* Pagination Dot/Number Bar */}
        <div
          className={`absolute bottom-6 right-6 z-30 flex items-center gap-4 transition-opacity duration-300 ${detailIdx !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="flex gap-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`h-3 rounded-full border-2 border-[#2a2a2a] transition-all duration-300 ${
                  idx === activeIdx ? "w-8 bg-[#f1b333]" : "w-3 bg-white"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs font-bold bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] px-3 py-1 rounded shadow-[2px_2px_0px_#f1b333]">
            0{activeIdx + 1} / 0{items.length}
          </span>
        </div>

        {/* Carousel Main Stage Wrapper */}
        <div
          className="w-full h-full flex items-center justify-center relative select-none z-20"
          style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
        >
          {items.map((item, idx) => {
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={() => openDetail(idx)}
                className="absolute w-[290px] h-[390px] md:w-[340px] md:h-[450px] flex items-center justify-center will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Face container */}
                <div
                  ref={(el) => {
                    cardInnersRef.current[idx] = el;
                  }}
                  onMouseMove={(e) => handleCardMouseMove(e, idx)}
                  onMouseLeave={() => handleCardMouseLeave(idx)}
                  className="w-full h-full p-4 bg-white flex flex-col justify-between cursor-pointer rounded-xl select-none relative overflow-hidden group border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a]"
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                  }}
                >
                  {/* 3D Content Layers */}
                  <div
                    className="flex flex-col gap-3"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-zinc-400">
                        [NODE {item.num}]
                      </span>
                      <span
                        className={`border-2 border-[#2a2a2a] px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase shadow-[1px_1px_0px_#2a2a2a] ${item.accentColor}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none select-none">
                      {item.title}
                    </h2>
                  </div>

                  {/* Card Image Area */}
                  <div
                    className="w-full h-[180px] md:h-[230px] border-3 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-100"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Card Footer */}
                  <div
                    className="flex items-center justify-between mt-2"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <span className="font-mono text-[10px] font-bold text-zinc-500">
                      CLICK TO EXPAND
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-bold text-xs shadow-[1.5px_1.5px_0px_#2a2a2a] transition-colors ${item.accentColor} ${item.textColor}`}
                    >
                      ↗
                    </div>
                  </div>

                  {/* Ambient glow accent (persistent but animated via GSAP) */}
                  <div
                    className="card-glow absolute inset-0 border-3 border-[#f1b333] pointer-events-none rounded-xl opacity-0"
                    style={{ transform: "translateZ(-1px)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Split Detail View Panel */}
        <div
          ref={detailPanelRef}
          className="absolute top-0 right-0 w-full md:w-[50vw] h-full bg-white border-l-4 border-[#2a2a2a] z-40 flex flex-col justify-between p-8 md:p-14 shadow-2xl pointer-events-auto transform translate-x-full opacity-0"
        >
          {detailIdx !== null && (
            <>
              {/* Top Bar inside panel */}
              <div className="flex items-center justify-between stagger-in">
                <span className="font-mono text-xs font-bold text-zinc-400">
                  MODULE 0{items[detailIdx].id + 1} {"//"} DETAIL EXPANSION
                </span>
                <button
                  onClick={closeDetail}
                  className="border-3 border-[#2a2a2a] shadow-[3px_3px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#2a2a2a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#2a2a2a] bg-[#c53b3a] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Core Info details */}
              <div className="flex flex-col gap-6 md:gap-8 my-auto">
                <div className="stagger-in flex items-center gap-3">
                  <span
                    className={`border-2 border-[#2a2a2a] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white uppercase shadow-[2.5px_2.5px_0px_#2a2a2a] ${items[detailIdx].accentColor}`}
                  >
                    {items[detailIdx].category}
                  </span>
                  <span className="font-mono text-sm text-zinc-500 font-semibold">
                    System Active
                  </span>
                </div>

                <h2 className="stagger-in text-4xl md:text-6xl font-serif font-black uppercase text-[#2a2a2a] leading-none tracking-tight">
                  {items[detailIdx].title}
                </h2>

                <p className="stagger-in text-base md:text-lg font-sans font-medium text-zinc-700 leading-relaxed border-l-4 border-[#2a2a2a] pl-6">
                  {items[detailIdx].desc}
                </p>

                {/* Decorative data block specs */}
                <div className="stagger-in grid grid-cols-2 gap-4 mt-4 font-mono">
                  <div className="border-2 border-[#2a2a2a] p-3 rounded-lg bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a]">
                    <span className="text-[10px] text-zinc-400 block font-bold">
                      SOLVER RATE
                    </span>
                    <span className="text-sm font-black text-[#2a2a2a]">
                      60.00 Hz // PASS
                    </span>
                  </div>
                  <div className="border-2 border-[#2a2a2a] p-3 rounded-lg bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a]">
                    <span className="text-[10px] text-zinc-400 block font-bold">
                      LATENCY SYNC
                    </span>
                    <span className="text-sm font-black text-[#2a2a2a]">
                      0.02 ms // SAFE
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer buttons / actions inside panel */}
              <div className="stagger-in flex flex-col md:flex-row gap-4 mt-auto">
                <button
                  className={`border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm uppercase tracking-wider cursor-pointer text-center ${items[detailIdx].accentColor} ${items[detailIdx].textColor}`}
                >
                  Execute Pipeline
                </button>
                <button
                  onClick={closeDetail}
                  className="border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm uppercase tracking-wider bg-white hover:bg-zinc-100 text-[#2a2a2a] cursor-pointer"
                >
                  Close Spec
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

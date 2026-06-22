"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useRef, useState } from "react";
import { ComponentHeader } from "@/components/ComponentHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CarouselItem {
  id: number;
  num: string;
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  bgColor: string;
  accentColor: string;
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
    bgColor: "#e55b3c",
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
    bgColor: "#0c9367",
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
    bgColor: "#6758a5",
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
    bgColor: "#3b82f6",
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
    bgColor: "#c53b3a",
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
    bgColor: "#f1b333",
    accentColor: "bg-[#f1b333]",
    textColor: "text-black",
  },
];

function Carousel3DAnimation() {
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

  useGSAP(
    () => {
      const numCards = items.length;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const diff = index;
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

      if (wrapperBgRef.current) {
        gsap.set(wrapperBgRef.current, {
          backgroundColor: getHexWithOpacity(items[0].bgColor, 0.12),
        });
      }

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${(numCards - 1) * 800}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const smoothRotation = self.progress * (numCards - 1);
            const currentActive = Math.max(
              0,
              Math.min(numCards - 1, Math.round(smoothRotation)),
            );
            setActiveIdx(currentActive);
          },
        },
      });

      for (let targetCard = 1; targetCard < numCards; targetCard++) {
        const startTime = targetCard - 1;

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

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden selection:bg-[#f1b333] selection:text-black font-sans"
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        ref={scrollSectionRef}
        className="h-screen w-full relative overflow-hidden"
      >
        <div
          ref={wrapperBgRef}
          className="absolute inset-0 transition-colors duration-500 z-0"
        />

        <div className="absolute inset-0 flex items-center justify-center perspective">
          <div className="relative w-full max-w-6xl h-[500px]">
            {items.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 will-change-transform"
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
              >
                <div
                  ref={(el) => {
                    cardInnersRef.current[idx] = el;
                  }}
                  className="w-full h-full border-3 border-[#2a2a2a] bg-white rounded-2xl shadow-[6px_6px_0px_#2a2a2a] p-6 flex flex-col justify-between transition-all"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">
                      [{item.category}]
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {item.num}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg border border-zinc-200"
                    />
                  </div>

                  <h3 className="font-serif font-black text-sm text-center text-[#2a2a2a]">
                    {item.title}
                  </h3>

                  <div
                    className="card-glow absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, rgba(241, 179, 51, 0.4), transparent 70%)`,
                      opacity: 0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Carousel3DPage() {
  return (
    <main>
      <ComponentHeader
        title="3D Carousel"
        description="Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion."
        componentName="Carousel3D"
      />
      <Carousel3DAnimation />
    </main>
  );
}

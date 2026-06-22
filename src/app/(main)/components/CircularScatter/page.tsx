"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Custom Text Scramble Component
function ScrambleText({
  text,
  speed = 25,
  delay = 0,
  isActive = true,
}: {
  text: string;
  speed?: number;
  delay?: number;
  isActive?: boolean;
}) {
  const [displayText, setDisplayText] = useState("");
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      return;
    }
    let timer: NodeJS.Timeout;
    let frame = 0;
    const finalLength = text.length;

    const run = () => {
      timer = setTimeout(() => {
        let current = "";
        for (let i = 0; i < finalLength; i++) {
          if (i < frame / 3) {
            current += text[i];
          } else {
            current += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(current);
        frame++;

        if (frame / 3 < finalLength) {
          run();
        } else {
          setDisplayText(text);
        }
      }, speed);
    };

    const delayTimer = setTimeout(run, delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(delayTimer);
    };
  }, [text, speed, delay, isActive]);

  return <span>{displayText}</span>;
}

const talentData = [
  {
    id: 0,
    img: "https://tweenlabs.xyz/showcase-1.webp",
    name: "Sarah Jenkins",
    role: "iOS Tech Lead",
    color: "#f1b333", // Gold
    left: "6vw",
    top: "14vh",
    rot: -12,
  },
  {
    id: 1,
    img: "https://tweenlabs.xyz/showcase-2.webp",
    name: "Alex Rivera",
    role: "Android Architect",
    color: "#0c9367", // Green
    left: "4vw",
    top: "44vh",
    rot: 8,
  },
  {
    id: 2,
    img: "https://tweenlabs.xyz/showcase-3.webp",
    name: "Elena Rostova",
    role: "SwiftUI Lead",
    color: "#8b5cf6", // Purple
    left: "7vw",
    top: "74vh",
    rot: -6,
  },
  {
    id: 3,
    img: "https://tweenlabs.xyz/showcase-4.webp",
    name: "Marcus Vance",
    role: "Flutter Specialist",
    color: "#3b82f6", // Blue
    left: "26vw",
    top: "10vh",
    rot: 6,
  },
  {
    id: 4,
    img: "https://tweenlabs.xyz/showcase-5.webp",
    name: "Siddharth Mehta",
    role: "React Native Lead",
    color: "#c53b3a", // Red
    left: "58vw",
    top: "10vh",
    rot: -8,
  },
  {
    id: 5,
    img: "https://tweenlabs.xyz/showcase-6.webp",
    name: "Chloe Dupont",
    role: "KMP Engineer",
    color: "#eab308", // Yellow
    left: "80vw",
    top: "14vh",
    rot: 10,
  },
  {
    id: 6,
    img: "https://tweenlabs.xyz/showcase-7.webp",
    name: "Liam O'Connor",
    role: "iOS UI Specialist",
    color: "#06b6d4", // Cyan
    left: "83vw",
    top: "44vh",
    rot: -10,
  },
  {
    id: 7,
    img: "https://tweenlabs.xyz/showcase-8.webp",
    name: "Sofia Giraldo",
    role: "Mobile DevOps Lead",
    color: "#ec4899", // Pink
    left: "76vw",
    top: "74vh",
    rot: 12,
  },
];

export default function CircularScatterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const [animStarted, setAnimStarted] = useState(false);

  useGSAP(
    () => {
      const container = heroRef.current;
      if (!container) return;

      let idleTweens: gsap.core.Tween[] = [];

      const scrollerEl =
        containerRef.current?.closest("#main-scroller") || null;
      const scroller = scrollerEl || undefined;
      const scrollerRect = scrollerEl
        ? scrollerEl.getBoundingClientRect()
        : { left: 0, top: 0 };
      const screenCenterX =
        (scrollerEl
          ? (scrollerEl as HTMLElement).clientWidth
          : window.innerWidth) / 2;
      const screenCenterY =
        (scrollerEl
          ? (scrollerEl as HTMLElement).clientHeight
          : window.innerHeight) / 2;

      const cards = Array.from(
        pinnedSectionRef.current?.querySelectorAll<HTMLElement>(
          ".cs-scatter-card",
        ) ?? [],
      );

      // Compute all coordinates relative to screen center while cards are in their initial CSS positions
      const cardParams = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2 - scrollerRect.left;
        const targetCenterY = rect.top + rect.height / 2 - scrollerRect.top;

        const X_c = screenCenterX - targetCenterX;
        const Y_c = screenCenterY - targetCenterY;

        const R_final = Math.sqrt(X_c * X_c + Y_c * Y_c);
        const theta_final = Math.atan2(-Y_c, -X_c);

        return {
          card,
          X_c,
          Y_c,
          R_final,
          theta_final,
        };
      });

      // 1. Initial State: Centered and Stacked
      cardParams.forEach((param, idx) => {
        gsap.set(param.card, {
          x: param.X_c,
          y: param.Y_c,
          scale: 0.9,
          rotation: 0,
          opacity: 0,
          zIndex: 10 + idx,
        });
      });

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedSectionRef.current,
          scroller: scroller,
          start: "top top",
          end: "+=1000",
          pin: true,
          pinSpacing: true,
          toggleActions: "play none none reverse",
          onEnter: () => setAnimStarted(true),
          onLeaveBack: () => {
            setAnimStarted(false);
            killFloatingIdle();
          },
        },
        defaults: { ease: "power4.out" },
        onComplete: () => {
          startFloatingIdle();
        },
      });

      // Staggered Stack-in at Center:
      // Cards appear one-by-one in the exact center of the screen
      talentData.forEach((card, idx) => {
        introTl.to(
          `.cs-scatter-card-${idx}`,
          {
            opacity: 1,
            scale: 1.02,
            rotation: idx % 2 === 0 ? 4 : -4,
            duration: 0.38,
            ease: "back.out(1.2)",
          },
          idx * 0.3,
        );
      });

      const scatterStart = talentData.length * 0.3 + 0.4;

      // Explode to Circular Layout with Spiral Orbit:
      // Cards explode outwards following a circular loop/spiral path before stopping
      cardParams.forEach((param, idx) => {
        const loops = 0.6; // Elegant 0.6 circular loop before stopping to keep it clean and non-overlapping
        const animObj = { p: 0 };

        introTl.to(
          animObj,
          {
            p: 1,
            duration: 2.8,
            ease: "power3.out",
            onUpdate: () => {
              const t = animObj.p;
              const R_t = param.R_final * t;
              // Spiral: starts at theta_final - 2*PI*loops, ends at theta_final
              const theta_t = param.theta_final - 2 * Math.PI * (1 - t) * loops;

              const x = param.X_c + R_t * Math.cos(theta_t);
              const y = param.Y_c + R_t * Math.sin(theta_t);

              gsap.set(param.card, {
                x,
                y,
                rotation: gsap.utils.interpolate(
                  idx % 2 === 0 ? 4 : -4,
                  talentData[idx].rot,
                  t,
                ),
                scale: gsap.utils.interpolate(1.02, 1, t),
              });
            },
          },
          scatterStart,
        ); // Start all card expansions simultaneously to prevent intersections and keep the movement clean
      });

      // Fade/Slide in the Central Hero text at the same time
      introTl
        .fromTo(
          ".cs-hero-tagline",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          scatterStart,
        )
        .fromTo(
          ".cs-hero-title-scramble",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          scatterStart + 0.2,
        )
        .fromTo(
          ".cs-hero-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          scatterStart + 0.4,
        );

      // 2. Continuous Floating Idle Loop
      function startFloatingIdle() {
        killFloatingIdle();

        cardParams.forEach((param, idx) => {
          const offset = idx % 2 === 0 ? 1 : -1;
          const t = gsap.to(param.card, {
            y: `+=${10 * offset}`,
            x: `+=${5 * -offset}`,
            rotation: `+=${1.5 * offset}`,
            duration: 3.2 + idx * 0.3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          idleTweens.push(t);
        });
      }

      // Helper to kill idle tweens
      function killFloatingIdle() {
        idleTweens.forEach((t) => t.kill());
        idleTweens = [];
      }

      ScrollTrigger.refresh();

      return () => {
        killFloatingIdle();
      };
    },
    { scope: containerRef },
  );

  // Custom mouse-move/hover functions for cards
  const handleCardEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    color: string,
  ) => {
    gsap.to(e.currentTarget, {
      scale: 1.08,
      borderColor: color,
      boxShadow: `0 15px 35px ${color}20, 6px 6px 0px #2a2a2a`,
      duration: 0.3,
      overwrite: "auto",
    });
    gsap.to(e.currentTarget.querySelector(".card-role-text"), {
      color: color,
      duration: 0.3,
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      borderColor: "#2a2a2a",
      boxShadow: "4px 4px 0px #2a2a2a",
      duration: 0.3,
      overwrite: "auto",
    });
    gsap.to(e.currentTarget.querySelector(".card-role-text"), {
      color: "#a1a1aa",
      duration: 0.3,
    });
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#f2ece0] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black overflow-x-hidden"
      ref={containerRef}
    >
      {/* Premium subtle grid background overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <section
        ref={pinnedSectionRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center"
      >
        {/* 1. Hero Section (Circular Cards Workspace) */}
        <div
          ref={heroRef}
          className="h-full w-full relative flex flex-col justify-center items-center overflow-hidden"
        >
          {/* Central Hero Text Area (Bottom Centered) */}
          <div className="absolute bottom-[4vh] md:bottom-[6vh] left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-2xl px-6 pointer-events-none">
            <span className="cs-hero-tagline inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-[#f1b333] font-black bg-[#2a2a2a] text-white px-3 py-1 rounded-full mb-4">
              [ Circular Orbit Physics ]
            </span>
            <h1 className="cs-hero-title-scramble font-serif font-black text-4xl md:text-6xl text-[#2a2a2a] leading-[1.05] tracking-tighter uppercase mb-4">
              <ScrambleText
                text="Orbital Equilibrium"
                delay={2800}
                isActive={animStarted}
              />
            </h1>
            <p className="cs-hero-subtitle font-mono text-[11px] md:text-xs text-[#2a2a2a]/70 max-w-lg mx-auto leading-relaxed mb-8 pointer-events-auto">
              Watch cards dynamically calculate their angular trajectories and
              spiral outward into an elegant circular geometry on scroll.
            </p>
          </div>

          {/* Floating cards container */}
          <div
            ref={floatingCardsRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            {talentData.map((card, idx) => (
              <div
                key={card.id}
                className={`cs-scatter-card cs-scatter-card-${idx} absolute w-[36vw] md:w-[13.5vw] aspect-[3/4] pointer-events-auto select-none rounded-3xl border-2 border-[#2a2a2a] bg-white p-3 shadow-[4px_4px_0px_#2a2a2a] cursor-pointer transition-shadow duration-200`}
                style={{
                  left: card.left,
                  top: card.top,
                }}
                onMouseEnter={(e) => handleCardEnter(e, card.color)}
                onMouseLeave={handleCardLeave}
              >
                {/* Card Image Area */}
                <div className="w-full h-[70%] bg-[#fcfbfa] border border-[#2a2a2a]/10 rounded-2xl overflow-hidden relative">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Card Title Details */}
                <div className="h-[30%] flex flex-col justify-end pt-2">
                  <h4 className="font-serif font-black text-xs md:text-sm text-[#2a2a2a] leading-none mb-1 truncate">
                    {card.name}
                  </h4>
                  <div className="flex justify-between items-center w-full">
                    <span className="card-role-text font-mono text-[8px] md:text-[9px] text-zinc-400 font-bold uppercase">
                      {card.role}
                    </span>
                    <span className="font-mono text-[7px] text-zinc-400/80">
                      [0{idx + 1}]
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

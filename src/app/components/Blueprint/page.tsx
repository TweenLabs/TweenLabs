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
    skills: ["Swift", "UIKit", "Combine", "Architecture"],
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
    skills: ["Kotlin", "Compose", "Coroutines", "Dagger"],
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
    skills: ["SwiftUI", "CoreData", "Combine", "Metal"],
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
    skills: ["TS", "React Native", "Redux", "JSI"],
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
    skills: ["Kotlin", "KMP", "Compose", "Ktor"],
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
    skills: ["Swift", "CoreAnimation", "Metal", "UI"],
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
    skills: ["CI/CD", "Fastlane", "Actions", "Docker"],
    color: "#ec4899", // Pink
    left: "76vw",
    top: "74vh",
    rot: 12,
  },
];

export default function BlueprintScatterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const [animStarted, setAnimStarted] = useState(false);

  useGSAP(
    () => {
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

      // 1. Page Load Intro Animation Sequence
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
      });

      // Fade in hero titles
      introTl
        .fromTo(
          ".bp-hero-tagline",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
        )
        .fromTo(
          ".bp-hero-title-scramble",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.6",
        )
        .fromTo(
          ".bp-hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        );

      // Exploding / Scattering Cards Animation:
      // Cards start centered and stacked behind the hero text, then explode outwards.
      introTl.fromTo(
        ".bp-scatter-card",
        {
          x: (i, target) => {
            const rect = target.getBoundingClientRect();
            const targetCenterX =
              rect.left + rect.width / 2 - scrollerRect.left;
            return screenCenterX - targetCenterX;
          },
          y: (i, target) => {
            const rect = target.getBoundingClientRect();
            const targetCenterY = rect.top + rect.height / 2 - scrollerRect.top;
            return screenCenterY - targetCenterY;
          },
          scale: 0.2,
          rotation: 0,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: (i) => talentData[i].rot,
          opacity: 1,
          duration: 1.8,
          stagger: 0.06,
          ease: "power4.out",
          onComplete: () => {
            // Trigger floating idle loop once scattered
            startFloatingIdle();
          },
        },
        "-=1.2",
      );

      // 2. Continuous Floating Idle Loop
      function startFloatingIdle() {
        killFloatingIdle();

        const cards = Array.from(
          pinnedSectionRef.current?.querySelectorAll<HTMLElement>(
            ".bp-scatter-card",
          ) ?? [],
        );
        cards.forEach((card, idx) => {
          const offset = idx % 2 === 0 ? 1 : -1;
          const t = gsap.to(card, {
            y: `+=${10 * offset}`,
            x: `+=${5 * -offset}`,
            rotation: `+=${1.5 * offset}`,
            duration: 3 + idx * 0.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          idleTweens.push(t);
        });
      }

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
    // Bring card to front and scale up
    gsap.to(e.currentTarget, {
      scale: 1.08,
      borderColor: color,
      boxShadow: `0 15px 35px ${color}20, 6px 6px 0px #2a2a2a`,
      duration: 0.3,
      overwrite: "auto",
    });
    // Highlight inner text/details
    gsap.to(e.currentTarget.querySelector(".card-role-text"), {
      color: color,
      duration: 0.3,
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Reset layout properties
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
        {/* 2. Hero Section (Exploding Cards Workspace) */}
        <div
          ref={heroRef}
          className="h-full w-full relative flex flex-col justify-center items-center overflow-hidden"
        >
          {/* Central Hero Text Area */}
          <div className="absolute bottom-[4vh] md:bottom-[6vh] left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-2xl px-6 pointer-events-none">
            <span className="bp-hero-tagline inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-[#f1b333] font-black bg-[#2a2a2a] text-white px-3 py-1 rounded-full mb-4">
              [ Blueprint Physics System ]
            </span>
            <h1 className="bp-hero-title-scramble font-serif font-black text-4xl md:text-6xl text-[#2a2a2a] leading-[1.05] tracking-tighter uppercase mb-4">
              <ScrambleText
                text="Exploding Blueprints"
                delay={600}
                isActive={animStarted}
              />
            </h1>
            <p className="bp-hero-subtitle font-mono text-[11px] md:text-xs text-[#2a2a2a]/70 max-w-lg mx-auto leading-relaxed mb-8 pointer-events-auto">
              Observe architectural card elements transition from a stacked
              singularity to their designated grid coordinates on scroll.
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
                className="bp-scatter-card absolute w-[36vw] md:w-[13.5vw] aspect-[3/4] pointer-events-auto select-none rounded-3xl border-2 border-[#2a2a2a] bg-white p-3 shadow-[4px_4px_0px_#2a2a2a] cursor-pointer transition-shadow duration-200"
                style={{
                  left: card.left,
                  top: card.top,
                  zIndex: 10 + idx,
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

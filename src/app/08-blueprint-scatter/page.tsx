"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

// Custom Text Scramble Component
function ScrambleText({
  text,
  speed = 25,
  delay = 0,
}: {
  text: string;
  speed?: number;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  useEffect(() => {
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
  }, [text, speed, delay]);

  return <span>{displayText}</span>;
}

const talentData = [
  {
    id: 0,
    img: "/Untitled design.png",
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
    img: "/Untitled design (1).png",
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
    img: "/Untitled design (2).png",
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
    img: "/Untitled design (3).png",
    name: "Marcus Vance",
    role: "Flutter Specialist",
    skills: ["Dart", "Flutter", "BLoC", "Firebase"],
    color: "#3b82f6", // Blue
    left: "26vw",
    top: "10vh",
    rot: 6,
  },
  {
    id: 4,
    img: "/Untitled design (4).png",
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
    img: "/Untitled design (5).png",
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
    img: "/Untitled design (6).png",
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
    img: "/Untitled design (7).png",
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
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const floatTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // 1. Page Load Intro Animation Sequence
      const introTl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // Fade in hero titles
      introTl
        .fromTo(
          ".hero-tagline",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
        )
        .fromTo(
          ".hero-title-scramble",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.6",
        )
        .fromTo(
          ".hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta-btn",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6",
        );

      // Exploding / Scattering Cards Animation:
      // Cards start centered and stacked behind the hero text, then explode outwards.
      introTl.fromTo(
        ".scatter-card",
        {
          x: (i, target) => {
            const rect = target.getBoundingClientRect();
            const targetCenterX = rect.left + rect.width / 2;
            const screenCenterX = window.innerWidth / 2;
            return screenCenterX - targetCenterX;
          },
          y: (i, target) => {
            const rect = target.getBoundingClientRect();
            const targetCenterY = rect.top + rect.height / 2;
            const screenCenterY = window.innerHeight / 2;
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
        floatTimelineRef.current = gsap.timeline({ repeat: -1 });

        const cards = gsap.utils.toArray<HTMLElement>(".scatter-card");
        cards.forEach((card, idx) => {
          const offset = idx % 2 === 0 ? 1 : -1;
          gsap.to(card, {
            y: `+=${10 * offset}`,
            x: `+=${5 * -offset}`,
            rotation: `+=${1.5 * offset}`,
            duration: 3 + idx * 0.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });
      }

      return () => {
        if (floatTimelineRef.current) floatTimelineRef.current.kill();
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
      className="relative h-screen w-screen bg-[#f2ece0] text-[#2a2a2a] overflow-hidden selection:bg-[#f1b333] selection:text-black"
      ref={containerRef}
    >
      {/* Premium subtle grid background overlay */}
      <div
        className="absolute inset-0 dot-grid pointer-events-none z-0"
        style={{ opacity: 0.25 }}
      />

      {/* Navbar removed to prevent overlapping with cards */}

      {/* 2. Hero Section (Exploding Cards Workspace) */}
      <div
        ref={heroRef}
        className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Central Hero Text Area */}
        <div className="absolute bottom-[4vh] md:bottom-[6vh] left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-2xl px-6 pointer-events-none">
          <span className="hero-tagline inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-[#f1b333] font-black bg-[#2a2a2a] text-white px-3 py-1 rounded-full mb-4">
            Vetted Mobile Engineers
          </span>
          <h1 className="hero-title-scramble font-serif font-black text-4xl md:text-6xl text-[#2a2a2a] leading-[1.05] tracking-tighter uppercase mb-4">
            <ScrambleText text="Hire Mobile Devs" delay={600} />
            <br />
            <span className="text-[#f1b333]">
              <ScrambleText text="Differently" delay={1200} />
            </span>
          </h1>
          <p className="hero-subtitle font-mono text-[11px] md:text-xs text-[#2a2a2a]/70 max-w-lg mx-auto leading-relaxed mb-8 pointer-events-auto">
            Engineers who own outcomes — CTO-screened with a ≤ 5% pass rate.
            Ready to scale your product immediately.
          </p>
          <div className="hero-cta-btn inline-block pointer-events-auto">
            <button
              onClick={() =>
                window.history.length > 1
                  ? window.history.back()
                  : (window.location.href = "/")
              }
              className="brutalist-btn bg-[#2a2a2a] text-white hover:bg-black px-8 py-3.5 rounded-full font-mono text-[11px] font-bold uppercase border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#f1b333] cursor-pointer transition-transform duration-150 active:translate-y-0.5"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Floating cards container */}
        <div
          ref={floatingCardsRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {talentData.map((card, idx) => (
            <div
              key={card.id}
              className={`scatter-card absolute w-[36vw] md:w-[13.5vw] aspect-[3/4] pointer-events-auto select-none rounded-3xl border-2 border-[#2a2a2a] bg-white p-3 shadow-[4px_4px_0px_#2a2a2a] cursor-pointer transition-shadow duration-200`}
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
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
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
    </div>
  );
}

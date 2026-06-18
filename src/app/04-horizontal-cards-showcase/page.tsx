"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const cardsData = [
  {
    id: "ROX",
    title: "FOUNDER ROX",
    borderColor: "#0c9367", // green
    btnBg: "bg-wtf-green text-white hover:bg-[#0a8059]",
    rotateStart: 6,
    leftPos: "left-[7.5%] md:left-[10vw]",
  },
  {
    id: "RITESH",
    title: "DEV RITESH",
    borderColor: "#c53b3a", // red
    btnBg: "bg-wtf-red text-white hover:bg-[#aa3231]",
    rotateStart: -4,
    leftPos: "left-[7.5%] md:left-[30vw]",
  },
  {
    id: "BHANU",
    title: "DEV BHANU",
    borderColor: "#3b82f6", // blue
    btnBg: "bg-wtf-blue text-white hover:bg-[#2563eb]",
    rotateStart: 5,
    leftPos: "left-[7.5%] md:left-[50vw]",
  },
  {
    id: "10 MILLION",
    title: "10 MILLION FUND",
    borderColor: "#f1b333", // yellow
    btnBg: "bg-wtf-yellow text-black hover:bg-[#d99f26]",
    rotateStart: -6,
    leftPos: "left-[7.5%] md:left-[70vw]",
  },
];

export default function AnimationFourPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Master timeline linked to vertical scroll pinning
    // Pinned section height is 4500px to ensure smooth scroll scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: "+=2200", 
        invalidateOnRefresh: true,
      },
    });

    const cards = gsap.utils.toArray<HTMLElement>(".card-item");
    
    // Timeline Sequence:
    // 1. Staggered Entry: Cards enter from bottom one by one.
    // 2. Wait Phase: All cards stay on screen together, drifting slightly.
    // 3. Staggered Exit: Cards exit off-screen top one by one.
    cards.forEach((card, idx) => {
      const cardData = cardsData[idx];
      const startRot = cardData.rotateStart;
      
      // Stagger start times: Card 1 at 0s, Card 2 at 0.6s, Card 3 at 1.2s, Card 4 at 1.8s
      const entryStart = idx * 0.6;
      const entryDuration = 1.0;
      
      // All cards are fully entered by 2.8s. They all exit together at 3.0s as user scrolls.
      const holdStart = entryStart + entryDuration;
      const exitStart = 3.0; // All cards exit simultaneously
      const holdDuration = exitStart - holdStart;
      const exitDuration = 1.0;

      // 1. Entry: from below the viewport (110vh) up to the center (0)
      tl.fromTo(
        card,
        {
          y: "110vh",
          rotation: startRot + 15,
          opacity: 0,
          scale: 0.85,
        },
        {
          y: "0vh",
          rotation: startRot,
          opacity: 1,
          scale: 1,
          duration: entryDuration,
          ease: "power2.out",
        },
        entryStart
      )
      // 2. Wait/Float Phase: subtle kinetic drift in the center
      .to(
        card,
        {
          y: "-8vh",
          rotation: startRot - 2,
          duration: holdDuration,
          ease: "none",
        },
        holdStart
      )
      // 3. Exit: up and out off the top of the viewport (-110vh)
      .to(
        card,
        {
          y: "-110vh",
          rotation: startRot - 15,
          opacity: 0,
          scale: 0.85,
          duration: exitDuration,
          ease: "power2.in",
        },
        exitStart
      );
    });

    // Continuous idle floating/bouncing effect for cards when standing still
    gsap.to(".card-inner", {
      y: "-10px",
      rotation: "1.5",
      duration: 2.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.35,
        from: "random"
      }
    });

    // Recalculate ScrollTrigger parameters once fonts load
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, { scope: containerRef });

  return (
    <div
      className="relative min-h-screen bg-[#1e1e1e] text-white overflow-x-hidden selection:bg-wtf-yellow selection:text-black"
      ref={containerRef}
    >
      {/* Dot Grid Background Overlay */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-10" style={{ opacity: 0.05 }} />

      {/* Dashboard Back Link */}
      <div className="fixed left-6 top-6 z-50">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
          className="brutalist-btn bg-wtf-yellow text-black px-4 py-2 text-xs font-mono font-bold uppercase rounded-md cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000]"
        >
          ← Back
        </button>
      </div>

      {/* Pinned main content section */}
      <div ref={scrollSectionRef} className="h-screen w-full flex items-center justify-center relative overflow-hidden">
        
        {/* Absolute Cards container */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-full h-[340px] md:h-[380px] lg:h-[420px]">
            {cardsData.map((card, idx) => (
              <div
                key={card.id}
                className={`card-item absolute top-0 ${card.leftPos} w-[85%] md:w-[18vw] h-full transform will-change-transform pointer-events-auto`}
              >
                <div
                  className="card-inner w-full h-full border-4 bg-[#fbfaf7] rounded-3xl flex flex-col justify-between p-6 md:p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.95)]"
                  style={{
                    borderColor: card.borderColor,
                  }}
                >
                  {/* Card Top Left logo */}
                  <div className="flex items-center gap-0.5 font-serif font-black text-xs md:text-sm uppercase text-black select-none">
                    <span className="text-[#c53b3a]">D</span>
                    <span className="text-[#f1b333]">E</span>
                    <span className="text-[#0c9367]">V</span>
                  </div>
                  
                  {/* Card Center Content */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                    <h3 className="font-serif font-black text-xl md:text-2xl lg:text-3xl text-[#121212] leading-tight tracking-tight uppercase whitespace-normal px-2">
                      {card.title}
                    </h3>
                    <button className={`brutalist-btn ${card.btnBg} px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer`}>
                      Learn More
                    </button>
                  </div>
                  
                  {/* Card Bottom Right details */}
                  <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                    <span>[DEV-0{idx + 1}]</span>
                    <span className="font-bold text-zinc-650 tracking-wider">ALLTHINGS DEV</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

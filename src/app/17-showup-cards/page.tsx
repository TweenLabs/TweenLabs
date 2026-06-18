"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StageItem {
  id: number;
  num: string;
  title: string;
  accentClass: string;
  accentHex: string;
  imgUrl: string;
  phase: string;
  desc: string;
}

const stageData: StageItem[] = [
  {
    id: 1,
    num: "01",
    title: "PLAN & SCOPE",
    accentClass: "bg-wtf-orange",
    accentHex: "229, 91, 60",
    imgUrl: "/Untitled design.png",
    phase: "PHASE 01",
    desc: "Gathering system requirements, wireframing workflows, and compiling API matrices.",
  },
  {
    id: 2,
    num: "02",
    title: "STYLING & TOKEN",
    accentClass: "bg-wtf-green",
    accentHex: "12, 147, 103",
    imgUrl: "/Untitled design (1).png",
    phase: "PHASE 02",
    desc: "Specifying layout structures, fine-grain noise textures, and asymmetric skews.",
  },
  {
    id: 3,
    num: "03",
    title: "DEVELOP & DEPLOY",
    accentClass: "bg-wtf-blue",
    accentHex: "59, 130, 246",
    imgUrl: "/Untitled design (2).png",
    phase: "PHASE 03",
    desc: "Compiling optimized route structures, loading counter staggers, and final page builds.",
  },
];

export default function ShowUpCardsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const smoothStep = (p: number) => p * p * (3 - 2 * p);

    // Pin the showup card section during viewport scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".showup-cards-sec",
      pinSpacing: false,
    });

    // Fall, Scale and Flip Service Cards
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
          const innerCard = document.querySelector(`${cardId} .flip-card-inner`);

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate("-100%", "40%", smoothStep(normalizedProgress));
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate("40%", "0%", smoothStep(normalizedProgress));
          } else {
            y = "0%";
          }

          let scale;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalizedProgress));
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalizedProgress));
          } else {
            scale = 1;
          }

          let opacity;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x, rotate, rotationY;
          if (cardProgress < 0.6) {
            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            rotationY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(
              index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
              "0%",
              smoothStep(normalizedProgress)
            );
            rotate = gsap.utils.interpolate(
              index === 0 ? -5 : index === 1 ? 0 : 5,
              0,
              smoothStep(normalizedProgress)
            );
            rotationY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotationY = 180;
          }

          gsap.set(cardId, {
            opacity: opacity,
            y: y,
            x: x,
            rotate: rotate,
            scale: scale,
          });

          if (innerCard) {
            gsap.set(innerCard, {
              rotationY: rotationY,
            });
          }
        });
      },
    });

  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Mouse tilt on cards when pointer hovers
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  return (
    <div className="relative min-h-[280vh] bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black overflow-x-hidden font-sans" ref={containerRef}>
      {/* Tactile Grid Backgrounds */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating Back Button */}
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
          Component 17
        </span>
        <h1 className="font-serif font-black text-lg uppercase text-[#2a2a2a]">
          Showup Cards
        </h1>
      </div>

      {/* Interactive Cards Overlay (Pins on scroll) */}
      <section className="showup-cards-sec relative w-full h-screen flex flex-col justify-center items-center bg-[#f8f5ee] border-b-3 border-[#2a2a2a] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-15" />
        
        {/* Simple Header Inside Container */}
        <div className="text-center select-none max-w-lg mb-8 pointer-events-none z-10">
          <span className="font-mono text-[10px] font-bold text-zinc-400 block tracking-widest">[ ASSEMBLY SEQUENCING ]</span>
          <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-[#2a2a2a] leading-none mt-2">
            Scroll to Build Nodes
          </h2>
          <p className="font-mono text-[9px] text-zinc-450 mt-1 uppercase tracking-wider">
            [ Cards will fall, assemble, and flip 180° ]
          </p>
        </div>

        <div className="cards-container w-full max-w-4xl flex items-center justify-center gap-6 md:gap-8 px-4 pointer-events-auto">
          {stageData.map((stage) => (
            <div
              key={stage.id}
              className="card w-48 aspect-[5/7] md:w-56 opacity-0 flex-1 relative transform-gpu"
              id={`card-${stage.id}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="card-wrapper w-full h-full animate-[floating_2.5s_infinite_ease-in-out] transform-gpu" style={{ animationDelay: `${(stage.id - 1) * 0.25}s` }}>
                <div className="flip-card-inner w-full h-full preserve-3d relative">
                  
                  {/* Front Side Face */}
                  <div className="flip-card-front absolute inset-0 brutalist-card p-4 bg-white text-[#2a2a2a] flex flex-col justify-between backface-hidden cursor-pointer select-none">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-zinc-400">[{stage.phase}]</span>
                      <span className={`inline-block border border-black px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${stage.accentClass}`}>
                        FLIP NODE
                      </span>
                    </div>

                    <div className="inner-img-frame w-full h-[140px] md:h-[180px] border-2 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-50 my-2 shadow-[2px_2px_0px_#2a2a2a]">
                      <Image
                        src={stage.imgUrl}
                        alt={stage.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-200 pt-2">
                      <h3 className="font-serif font-black text-xs text-[#2a2a2a]">{stage.title}</h3>
                      <span className="font-mono text-[10px] text-zinc-400 font-bold">0{stage.id}</span>
                    </div>
                  </div>

                  {/* Back Side Face (Scroll-revealed) */}
                  <div className="flip-card-back absolute inset-0 brutalist-card p-4 bg-white border-3 border-[#2a2a2a] text-[#2a2a2a] flex flex-col justify-between rotate-y-180 backface-hidden cursor-pointer select-none">
                    <div className="w-full flex justify-between font-mono font-bold text-[9px] uppercase border-b-2 border-black pb-2 items-center">
                      <span className="text-zinc-400">0{stage.id} // NODE DETAILS</span>
                      <span className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${stage.accentClass}`} />
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                      <p className="font-mono text-[9px] font-bold bg-zinc-100 border border-black px-2.5 py-1 rounded">
                        {stage.phase}
                      </p>
                      <p className="text-[11px] font-sans font-semibold mt-3 text-zinc-650 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-200 pt-2 font-mono text-[8px] text-zinc-400 font-black">
                      <span>STATUS: ONLINE</span>
                      <span>SECURE // OK</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

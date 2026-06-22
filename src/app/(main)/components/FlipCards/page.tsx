"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ComponentHeader } from "@/components/ComponentHeader";

const showupSectionSelector = ".showup-cards-sec";

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
    accentClass: "bg-[#e55b3c]",
    accentHex: "229, 91, 60",
    imgUrl: "https://tweenlabs.xyz/showcase-1.webp",
    phase: "PHASE 01",
    desc: "Gathering system requirements, wireframing workflows, and compiling API matrices.",
  },
  {
    id: 2,
    num: "02",
    title: "STYLING & TOKEN",
    accentClass: "bg-[#0c9367]",
    accentHex: "12, 147, 103",
    imgUrl: "https://tweenlabs.xyz/showcase-2.webp",
    phase: "PHASE 02",
    desc: "Specifying layout structures, fine-grain noise textures, and asymmetric skews.",
  },
  {
    id: 3,
    num: "03",
    title: "DEVELOP & DEPLOY",
    accentClass: "bg-[#3b82f6]",
    accentHex: "59, 130, 246",
    imgUrl: "https://tweenlabs.xyz/showcase-3.webp",
    phase: "PHASE 03",
    desc: "Compiling optimized route structures, loading counter staggers, and final page builds.",
  },
];

function FlipCardsAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showupSectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver: only run CSS floating animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;
      const smoothStep = (p: number) => p * p * (3 - 2 * p);

      // Pin the showup card section during viewport scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        pin: showupSectionRef.current,
        pinSpacing: false,
      });

      // Fall, Scale and Flip Service Cards
      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (0.9 - delay * 0.1),
            );
            const innerCard = containerRef.current?.querySelector(
              `${cardId} .flip-card-inner`,
            );

            let y;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              y = gsap.utils.interpolate(
                "-100%",
                "40%",
                smoothStep(normalizedProgress),
              );
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate(
                "40%",
                "0%",
                smoothStep(normalizedProgress),
              );
            } else {
              y = "0%";
            }

            let scale;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              scale = gsap.utils.interpolate(
                0.25,
                0.75,
                smoothStep(normalizedProgress),
              );
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              scale = gsap.utils.interpolate(
                0.75,
                1,
                smoothStep(normalizedProgress),
              );
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
                smoothStep(normalizedProgress),
              );
              rotate = gsap.utils.interpolate(
                index === 0 ? -5 : index === 1 ? 0 : 5,
                0,
                smoothStep(normalizedProgress),
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
    },
    { scope: containerRef },
  );

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

  const handleMouseLeave = contextSafe(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: "elastic.out(1.1, 0.4)",
        duration: 0.75,
        overwrite: "auto",
      });
    },
  );

  return (
    <div
      className="relative min-h-[280vh] bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black overflow-x-hidden font-sans"
      ref={containerRef}
    >
      {/* Tactile Grid Backgrounds */}
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

      {/* Interactive Cards Overlay (Pins on scroll) */}
      <section
        ref={showupSectionRef}
        className="showup-cards-sec relative w-full h-screen flex flex-col justify-center items-center bg-[#f8f5ee] border-b-3 border-[#2a2a2a] overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

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
              <div
                className={`card-wrapper w-full h-full ${isInView ? "animate-[floating_2.5s_infinite_ease-in-out]" : ""} transform-gpu`}
                style={{ animationDelay: `${(stage.id - 1) * 0.25}s` }}
              >
                <div
                  className="flip-card-inner w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front Side Face */}
                  <div
                    className="flip-card-front absolute inset-0 border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-4 bg-white text-[#2a2a2a] flex flex-col justify-between cursor-pointer select-none"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-zinc-400">
                        [{stage.phase}]
                      </span>
                      <span
                        className={`inline-block border border-black px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${stage.accentClass}`}
                      >
                        FLIP NODE
                      </span>
                    </div>

                    <div className="inner-img-frame w-full h-[140px] md:h-[180px] border-2 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-50 my-2 shadow-[2px_2px_0px_#2a2a2a]">
                      <img
                        src={stage.imgUrl}
                        alt={stage.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-200 pt-2">
                      <h3 className="font-serif font-black text-xs text-[#2a2a2a]">
                        {stage.title}
                      </h3>
                      <span className="font-mono text-[10px] text-zinc-400 font-bold">
                        0{stage.id}
                      </span>
                    </div>
                  </div>

                  {/* Back Side Face (Scroll-revealed) */}
                  <div
                    className="flip-card-back absolute inset-0 border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-4 bg-white border-3 text-[#2a2a2a] flex flex-col justify-between cursor-pointer select-none"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="w-full flex justify-between font-mono font-bold text-[9px] uppercase border-b-2 border-black pb-2 items-center">
                      <span className="text-zinc-400">
                        0{stage.id} {"//"} NODE DETAILS
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${stage.accentClass}`}
                      />
                    </div>

                    <div className="inner-img-frame w-full h-[140px] md:h-[180px] border-2 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-50 my-2 shadow-[2px_2px_0px_#2a2a2a]">
                      <img
                        src={stage.imgUrl}
                        alt={stage.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex items-center justify-center py-2">
                      <p className="text-[10px] md:text-[11px] font-sans font-bold text-zinc-650 leading-snug text-center">
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

export default function FlipCardsPage() {
  return (
    <>
      <ComponentHeader
        title="Flip Cards"
        description="Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space."
        componentName="FlipCards"
      />
      <FlipCardsAnimation />
    </>
  );
}

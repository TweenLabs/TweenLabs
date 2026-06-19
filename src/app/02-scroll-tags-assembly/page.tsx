"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const tagsData = [
  {
    text: "CREATIVE",
    color: "bg-[#e55b3c] text-white",
    xStart: -400,
    yStart: -200,
    rotate: -15,
  },
  {
    text: "DEVELOPER",
    color: "bg-[#0c9367] text-white",
    xStart: 400,
    yStart: 250,
    rotate: 12,
  },
  {
    text: "GSAP 3",
    color: "bg-[#f1b333] text-black",
    xStart: -300,
    yStart: 300,
    rotate: -8,
  },
  {
    text: "NEXT.JS 16",
    color: "bg-[#6758a5] text-white",
    xStart: 500,
    yStart: -150,
    rotate: 15,
  },
  {
    text: "REACT 19",
    color: "bg-[#3b82f6] text-white",
    xStart: -500,
    yStart: 100,
    rotate: 5,
  },
  {
    text: "BRUTALIST",
    color: "bg-[#c53b3a] text-white",
    xStart: 300,
    yStart: -300,
    rotate: -12,
  },
  {
    text: "SCROLL TRIGGER",
    color: "bg-black text-white",
    xStart: -600,
    yStart: -100,
    rotate: 20,
  },
  {
    text: "FLUID MOTION",
    color: "bg-white text-black",
    xStart: 600,
    yStart: 400,
    rotate: -6,
  },
];

export default function AnimationTwoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tags = gsap.utils.toArray<HTMLElement>(".assembler-tag");

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=2000",
          anticipatePin: 1,
        },
      });

      tags.forEach((tag, idx) => {
        const xStart = Number(tag.getAttribute("data-xs") || 0);
        const yStart = Number(tag.getAttribute("data-ys") || 0);
        const rotate = Number(tag.getAttribute("data-rot") || 0);

        tl.fromTo(
          tag,
          {
            x: xStart,
            y: yStart,
            rotation: rotate * 3,
            opacity: 0,
            scale: 0.2,
          },
          {
            x: 0,
            y: 0,
            rotation: rotate,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          idx * 0.15,
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black min-h-screen"
      ref={containerRef}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <section
        ref={scrollSectionRef}
        className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-white border-y-3 border-[#2a2a2a]"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="z-10 w-full max-w-4xl px-4 flex flex-col gap-8 items-center">
          <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
            DOM Board Collider
          </div>

          <div className="w-full min-h-[300px] border-3 border-[#2a2a2a] rounded-xl bg-zinc-50 p-8 flex flex-wrap gap-4 items-center justify-center shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05)] relative">
            {tagsData.map((tag, i) => (
              <span
                key={i}
                className={`assembler-tag px-6 py-3 border-2 border-[#2a2a2a] rounded-lg font-mono font-black text-sm md:text-base shadow-[3px_3px_0px_#2a2a2a] transform will-change-transform ${tag.color}`}
                data-xs={tag.xStart}
                data-ys={tag.yStart}
                data-rot={tag.rotate}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

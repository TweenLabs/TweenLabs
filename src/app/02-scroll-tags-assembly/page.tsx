"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const tagsData = [
  { text: "CREATIVE", color: "bg-wtf-orange text-white", xStart: -400, yStart: -200, rotate: -15 },
  { text: "DEVELOPER", color: "bg-wtf-green text-white", xStart: 400, yStart: 250, rotate: 12 },
  { text: "GSAP 3", color: "bg-wtf-yellow text-black", xStart: -300, yStart: 300, rotate: -8 },
  { text: "NEXT.JS 16", color: "bg-wtf-purple text-white", xStart: 500, yStart: -150, rotate: 15 },
  { text: "REACT 19", color: "bg-wtf-blue text-white", xStart: -500, yStart: 100, rotate: 5 },
  { text: "BRUTALIST", color: "bg-wtf-red text-white", xStart: 300, yStart: -300, rotate: -12 },
  { text: "SCROLL TRIGGER", color: "bg-black text-white", xStart: -600, yStart: -100, rotate: 20 },
  { text: "FLUID MOTION", color: "bg-white text-black", xStart: 600, yStart: 400, rotate: -6 },
];

export default function AnimationTwoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tags = gsap.utils.toArray<HTMLElement>(".assembler-tag");

    // Pin the scroll section and animate the tags entering the DOM
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    tags.forEach((tag, idx) => {
      const xStart = Number(tag.getAttribute("data-xs") || 0);
      const yStart = Number(tag.getAttribute("data-ys") || 0);
      const rotate = Number(tag.getAttribute("data-rot") || 0);

      // Animate each tag flying into its DOM grid cell from offscreen
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
        idx * 0.15 // stagger offset in timeline
      );
    });

  }, { scope: containerRef });

  return (
    <div className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black" ref={containerRef}>
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />
      
      {/* Intro section */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-4 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-wtf-green border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Scroll Tags Assembly Sandbox</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase max-w-2xl leading-[1.1]">
          Scroll Down to Assemble the Tags
        </h1>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-bounce mt-4">
          ↓ Scroll Down ↓
        </p>
      </section>

      {/* Assembly ScrollTrigger Section */}
      <section ref={scrollSectionRef} className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-white border-y-3 border-[#2a2a2a]">
        <div className="absolute inset-0 dot-grid opacity-5 pointer-events-none" />
        
        <div className="z-10 w-full max-w-4xl px-4 flex flex-col gap-8 items-center">
          <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
            DOM Board Collider
          </div>
          
          {/* Target grid container where tags land */}
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

      {/* Outro section */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-6 z-10 relative">
        <h2 className="text-4xl font-serif font-black uppercase">
          Assembly Complete
        </h2>
        <p className="max-w-md text-sm font-sans font-medium text-zinc-600">
          All tags have flown into their correct positions in the DOM board.
        </p>
        <button
        onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
        className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer"
        
      >
        ← Back
      </button>
      </section>
    </div>
  );
}

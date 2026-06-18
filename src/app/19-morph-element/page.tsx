"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function MorphElementPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Text reveals on page load
    gsap.fromTo(
      ".intro-title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
    );

    // 2. Scroll-triggered card reveals
    gsap.fromTo(
      ".feature-card-item",
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".spotlight-section",
          start: "top 70%",
          end: "bottom 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 3. Spotlight cursor mask follower
    const updateSpotlight = (e: MouseEvent) => {
      const rect = spotlightRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Animate the masking spotlight circle (revealing the background mesh image)
      gsap.to(".spotlight-bg", {
        clipPath: `circle(150px at ${x}px ${y}px)`,
        duration: 0.3,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    const containerEl = spotlightRef.current;
    if (containerEl) {
      containerEl.addEventListener("mousemove", updateSpotlight);
      containerEl.addEventListener("mouseleave", () => {
        // Reset/fade out spotlight to center
        gsap.to(".spotlight-bg", {
          clipPath: `circle(0px at 50% 50%)`,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("mousemove", updateSpotlight);
      }
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center selection:bg-wtf-yellow selection:text-black overflow-x-hidden"
    >
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Intro Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-8 text-center border-b-3 border-[#2a2a2a] z-10">
        <div className="max-w-3xl flex flex-col gap-6">
          <div className="inline-flex self-center items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
            <span>Component 19</span>
          </div>
          <h1 className="intro-title text-4xl md:text-6xl font-serif font-black uppercase text-[#2a2a2a] leading-none tracking-tight">
            Presentation Spotlight
          </h1>
          <h2 className="intro-title text-xl md:text-2xl font-mono text-zinc-550 uppercase tracking-widest mt-4">
            Agents that get you hired while offline
          </h2>
          <p className="intro-title text-sm text-zinc-650 max-w-md mx-auto font-sans font-medium">
            Scroll down to launch the spotlight canvas. Move your mouse over the dashboard to reveal structural details.
          </p>
        </div>
      </section>

      {/* Spotlight Canvas Section */}
      <section className="spotlight-section relative w-full min-h-screen py-24 px-4 border-b-3 border-[#2a2a2a] bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-12">
          
          {/* Spotlight Area */}
          <div
            ref={spotlightRef}
            className="relative brutalist-card w-full h-[360px] rounded-2xl bg-zinc-900 overflow-hidden flex flex-col items-center justify-center text-center p-8 select-none group"
          >
            {/* The hidden color background revealed ONLY by mouse cursor spotlight circle */}
            <div
              className="spotlight-bg absolute inset-0 pointer-events-none opacity-90 transition-opacity"
              style={{ clipPath: "circle(0px at 50% 50%)" }}
            >
              <Image
                src="/Untitled design (5).png"
                alt=""
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-wtf-purple/20 mix-blend-multiply" />
            </div>

            {/* Static Content */}
            <h3 className="relative z-10 text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-white leading-none group-hover:text-wtf-yellow transition-colors">
              Information flows best through intentional design.
            </h3>
            <p className="relative z-10 text-xs font-mono text-zinc-400 mt-4 uppercase tracking-widest">
              [ Hover to project light beam ]
            </p>
          </div>

          {/* Sibling Features Cards */}
          <div className="features grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Flow", desc: "Pipeline mapping." },
              { title: "Signal", desc: "Clamping deltas." },
              { title: "System Design", desc: "Neo-Brutalism." },
              { title: "Archive", desc: "Stagger storage." },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card-item brutalist-card p-6 bg-white flex flex-col justify-between h-40 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] font-bold text-zinc-400">NODE 0{i + 1}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-wtf-green border border-black shadow-[1px_1px_0px_black]" />
                </div>
                <h4 className="text-xl font-serif font-black uppercase text-[#2a2a2a]">{feature.title}</h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Outro Section */}
      <section className="h-screen w-full bg-[#f0eadf] flex flex-col items-center justify-center p-8 text-center z-10">
        <h2 className="text-4xl font-serif font-black uppercase mb-4 text-[#2a2a2a]">
          ( System Complete )
        </h2>
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-4 px-8 rounded-xl uppercase tracking-wider cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </section>
    </div>
  );
}

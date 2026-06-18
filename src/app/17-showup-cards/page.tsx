"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ShowUpCardsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const smoothStep = (p: number) => p * p * (3 - 2 * p);

    // 1. Hero Cards fanning out on scroll
    ScrollTrigger.create({
      trigger: ".showup-hero",
      start: "top top",
      end: "75% top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));
        gsap.set(".showup-hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((cardId, index) => {
          const delay = index * 0.9;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));

          const y = gsap.utils.interpolate("0%", "250%", smoothStep(cardProgress));
          const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));

          let x = "0%";
          let rotation = 0;
          if (index === 0) {
            x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
          } else if (index === 2) {
            x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
          }

          gsap.set(cardId, {
            y: y,
            x: x,
            rotation: rotation,
            scale: scale,
          });
        });
      },
    });

    // 2. Pin the services section
    ScrollTrigger.create({
      trigger: ".showup-services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".showup-services",
      pinSpacing: true,
    });

    // Handle service cards placement
    ScrollTrigger.create({
      trigger: ".showup-services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      onLeave: () => {
        const servicesSection = document.querySelector(".showup-services") as HTMLElement;
        if (!servicesSection) return;
        const servicesRect = servicesSection.getBoundingClientRect();
        const servicesTop = window.scrollY + servicesRect.top;

        gsap.set(".showup-cards-sec", {
          position: "absolute",
          top: servicesTop,
          left: 0,
          width: "100%",
          height: "100vh",
        });
      },
      onEnterBack: () => {
        gsap.set(".showup-cards-sec", {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        });
      },
    });

    // 3. Fall, Scale and Flip Service Cards
    ScrollTrigger.create({
      trigger: ".showup-services",
      start: "top bottom",
      end: `+=${window.innerHeight * 3}px`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
        const headerY = gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress));

        gsap.set(".showup-services-header", {
          y: headerY,
        });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
          const innerCard = document.querySelector(`${cardId} .flip-card-inner`);

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate("-100%", "50%", smoothStep(normalizedProgress));
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate("50%", "0%", smoothStep(normalizedProgress));
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

  return (
    <div className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black overflow-x-hidden" ref={containerRef}>
      {/* Floating Back to Dashboard */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Hero Part */}
      <section className="showup-hero relative h-screen w-full bg-wtf-purple flex items-center justify-center p-8 border-b-3 border-[#2a2a2a] z-10">
        <div className="showup-hero-cards flex justify-center items-center gap-6 w-full max-w-2xl select-none">
          {/* Card 1 */}
          <div id="hero-card-1" className="brutalist-card w-48 aspect-[5/7] p-6 bg-wtf-orange text-white flex flex-col justify-between transform-gpu origin-top-right">
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>Plan</span>
              <span>01</span>
            </div>
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>01</span>
              <span>Plan</span>
            </div>
          </div>
          {/* Card 2 */}
          <div id="hero-card-2" className="brutalist-card w-48 aspect-[5/7] p-6 bg-wtf-green text-white flex flex-col justify-between transform-gpu">
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>Design</span>
              <span>02</span>
            </div>
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>02</span>
              <span>Design</span>
            </div>
          </div>
          {/* Card 3 */}
          <div id="hero-card-3" className="brutalist-card w-48 aspect-[5/7] p-6 bg-wtf-blue text-white flex flex-col justify-between transform-gpu origin-top-left">
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>Develop</span>
              <span>03</span>
            </div>
            <div className="flex justify-between items-center font-mono font-bold text-xs uppercase">
              <span>03</span>
              <span>Develop</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="h-screen w-full bg-[#f0eadf] flex items-center justify-center text-center p-8 border-b-3 border-[#2a2a2a] z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif font-black uppercase leading-tight text-[#2a2a2a]">
            Scroll down to trigger card assembly, scaling, and flip-back reveals.
          </h1>
        </div>
      </section>

      {/* Services Pinning Section */}
      <section className="showup-services h-screen w-full bg-wtf-orange flex items-center justify-center p-8 z-10 border-b-3 border-[#2a2a2a]">
        <div className="showup-services-header transform translate-y-[400%] text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight leading-none">
            A Assembly Sequence
          </h1>
        </div>
      </section>

      {/* Interactive Cards Container */}
      <section className="showup-cards-sec fixed top-0 left-0 w-full h-screen flex justify-center items-center pointer-events-none z-0 bg-[#f8f5ee] border-b-3 border-[#2a2a2a] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="cards-container w-full max-w-4xl flex items-center justify-center gap-8 px-4">
          
          {/* Card 1 */}
          <div className="card w-48 aspect-[5/7] opacity-0 flex-1 relative transform-gpu" id="card-1">
            <div className="card-wrapper w-full h-full animate-[floating_2s_infinite_ease-in-out_delay-0s] transform-gpu">
              <div className="flip-card-inner w-full h-full preserve-3d relative">
                
                {/* Front */}
                <div className="flip-card-front absolute inset-0 brutalist-card p-6 bg-wtf-orange text-white flex flex-col justify-between backface-hidden">
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>Plan</span>
                    <span>01</span>
                  </div>
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 brutalist-card p-6 bg-white border-3 border-[#2a2a2a] text-[#2a2a2a] flex flex-col justify-between rotate-y-180 backface-hidden">
                  <div className="w-full flex justify-between font-mono font-bold text-xs uppercase border-b-2 border-black pb-2">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                    <p className="font-mono text-xs font-bold bg-zinc-100 border border-black px-3 py-1 rounded">STAGE 1</p>
                    <p className="text-xs font-sans font-semibold mt-3 text-zinc-600">Research & user requirements wireframe.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card w-48 aspect-[5/7] opacity-0 flex-1 relative transform-gpu" id="card-2">
            <div className="card-wrapper w-full h-full animate-[floating_2s_infinite_ease-in-out_0.25s] transform-gpu">
              <div className="flip-card-inner w-full h-full preserve-3d relative">
                
                {/* Front */}
                <div className="flip-card-front absolute inset-0 brutalist-card p-6 bg-wtf-green text-white flex flex-col justify-between backface-hidden">
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 brutalist-card p-6 bg-white border-3 border-[#2a2a2a] text-[#2a2a2a] flex flex-col justify-between rotate-y-180 backface-hidden">
                  <div className="w-full flex justify-between font-mono font-bold text-xs uppercase border-b-2 border-black pb-2">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                    <p className="font-mono text-xs font-bold bg-zinc-100 border border-black px-3 py-1 rounded">STAGE 2</p>
                    <p className="text-xs font-sans font-semibold mt-3 text-zinc-600">Style tokens and high contrast mockups.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card w-48 aspect-[5/7] opacity-0 flex-1 relative transform-gpu" id="card-3">
            <div className="card-wrapper w-full h-full animate-[floating_2s_infinite_ease-in-out_0.5s] transform-gpu">
              <div className="flip-card-inner w-full h-full preserve-3d relative">
                
                {/* Front */}
                <div className="flip-card-front absolute inset-0 brutalist-card p-6 bg-wtf-blue text-white flex flex-col justify-between backface-hidden">
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>Develop</span>
                    <span>03</span>
                  </div>
                  <div className="card-title w-full flex justify-between font-mono font-bold text-xs uppercase">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 brutalist-card p-6 bg-white border-3 border-[#2a2a2a] text-[#2a2a2a] flex flex-col justify-between rotate-y-180 backface-hidden">
                  <div className="w-full flex justify-between font-mono font-bold text-xs uppercase border-b-2 border-black pb-2">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                    <p className="font-mono text-xs font-bold bg-zinc-100 border border-black px-3 py-1 rounded">STAGE 3</p>
                    <p className="text-xs font-sans font-semibold mt-3 text-zinc-600">Dynamic GSAP timelines & React integration.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Outro Section */}
      <section className="h-screen w-full bg-wtf-purple flex items-center justify-center p-8 text-center border-t-3 border-[#2a2a2a] z-10 relative">
        <div className="max-w-md flex flex-col gap-6 text-white">
          <h2 className="text-3xl font-serif font-black uppercase">Sequence End</h2>
          <p className="text-xs font-mono bg-[#2a2a2a] border border-white px-4 py-2 rounded-md">
            All structural transitions completed.
          </p>
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer">
              ← Dashboard
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

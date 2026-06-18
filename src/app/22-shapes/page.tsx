"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";

interface ShapeConfig {
  id: number;
  className: string;
  accentHex: string;
}

const shapesData: ShapeConfig[] = [
  { id: 1, className: "w-[10%] aspect-[0.5/1] bg-[#ff9f43] rounded-l-full", accentHex: "255, 159, 67" },
  { id: 2, className: "w-[10%] aspect-[0.5/1] bg-[#fed330] rounded-l-full", accentHex: "254, 211, 48" },
  { id: 3, className: "w-[20%] aspect-square rounded-full bg-[#ff7675] overflow-hidden relative border-2 border-black", accentHex: "255, 118, 117" }, // image 6
  { id: 4, className: "w-[20%] aspect-square bg-[#0984e3] rounded-t-full rounded-bl-full rounded-br-none", accentHex: "9, 132, 227" },
  { id: 5, className: "w-[20%] aspect-square rounded-full bg-[#ffeaa7] overflow-hidden relative border-2 border-black", accentHex: "255, 234, 167" }, // image 7
  { id: 6, className: "w-[20%] aspect-square bg-[#ffb8b8] rounded-tr-full", accentHex: "255, 184, 184" },
];

export default function ShapesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLHeadingElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const hasMerged = useRef(false);
  const shapesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaderGone, setIsLoaderGone] = useState(false);

  useGSAP(() => {
    const counter = { value: 0 };

    // Initial state of main content to prevent flash
    gsap.set(".shapes-main-title-word", { opacity: 0, y: 40 });
    gsap.set(".shapes-main-shape", { opacity: 0 });

    // Radii presets for changing shapes randomly
    const radii = [
      "50% 0% 0% 50%", // vertical semicircle flat right
      "0% 50% 50% 0%", // vertical semicircle flat left
      "50% 50% 50% 50%", // circle
      "50% 50% 50% 0%", // leaf/teardrop shapes
      "50% 50% 0% 50%",
      "50% 0% 50% 50%",
      "0% 50% 50% 50%",
      "0% 50% 0% 0%", // quarter circle
      "0% 0% 50% 0%",
      "0% 0% 0% 0%", // square
    ];

    // Morph helper for loader shapes
    const morph = (el: HTMLDivElement | null, durationMult = 1) => {
      if (!el || hasMerged.current) return;
      const randomDuration = (Math.random() * (1.2 - 0.6) + 0.6) * durationMult;
      const randomRadius = radii[Math.floor(Math.random() * radii.length)];

      gsap.to(el, {
        borderRadius: randomRadius,
        duration: randomDuration,
        ease: "power2.inOut",
        onComplete: () => morph(el, durationMult),
      });
    };

    // Start morphing for the 3 loader shapes
    morph(shape1Ref.current, 0.85);
    morph(shape2Ref.current, 1.0);
    morph(shape3Ref.current, 1.15);

    // Timeline for counter and loader exit
    const tl = gsap.timeline();

    tl.to(counter, {
      value: 100,
      duration: 4.5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(counter.value));
        }
        const progressBar = document.getElementById("loader-shapes-bar");
        if (progressBar) {
          progressBar.style.width = `${counter.value}%`;
        }
      },
      onComplete: () => {
        hasMerged.current = true;

        // Stop current tweens
        gsap.killTweensOf([shape1Ref.current, shape2Ref.current, shape3Ref.current]);

        const rect1 = shape1Ref.current?.getBoundingClientRect();
        const rect2 = shape2Ref.current?.getBoundingClientRect();
        const rect3 = shape3Ref.current?.getBoundingClientRect();

        const xOffset1 = rect2 && rect1 ? rect2.left - rect1.left : 128;
        const xOffset3 = rect2 && rect3 ? rect2.left - rect3.left : -128;

        const mergeTl = gsap.timeline();

        // 1. Side shapes stretch towards the center
        mergeTl
          .to(shape1Ref.current, {
            x: xOffset1 * 0.7,
            scaleX: 1.5,
            scaleY: 0.8,
            borderRadius: "50%",
            duration: 0.6,
            ease: "power2.in",
          })
          .to(
            shape3Ref.current,
            {
              x: xOffset3 * 0.7,
              scaleX: 1.5,
              scaleY: 0.8,
              borderRadius: "50%",
              duration: 0.6,
              ease: "power2.in",
            },
            "<"
          )
          .to(
            shape2Ref.current,
            {
              scaleX: 1.2,
              scaleY: 0.8,
              borderRadius: "50%",
              duration: 0.6,
              ease: "power2.in",
            },
            "<"
          )

          // 2. Smash into center, side shapes squash completely, center absorbs them and glows
          .to(shape1Ref.current, {
            x: xOffset1,
            scaleX: 0,
            scaleY: 1.5,
            opacity: 0,
            duration: 0.3,
            ease: "power4.out",
          })
          .to(
            shape3Ref.current,
            {
              x: xOffset3,
              scaleX: 0,
              scaleY: 1.5,
              opacity: 0,
              duration: 0.3,
              ease: "power4.out",
            },
            "<"
          )
          .to(
            shape2Ref.current,
            {
              scaleX: 1.5,
              scaleY: 1.5,
              backgroundColor: "transparent",
              boxShadow: "none",
              duration: 0.3,
              ease: "power4.out",
            },
            "<"
          )
          .to(
            ".logo-h",
            {
              opacity: 1,
              scale: 1.5,
              duration: 0.3,
              ease: "back.out(2)",
            },
            "<"
          )

          // 3. Settle the H logo
          .to(shape2Ref.current, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.5,
            ease: "power2.out",
          })
          .to(
            ".logo-h",
            {
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "<"
          )

          // 4. Fade out loader background
          .to(loaderRef.current, {
            backgroundColor: "transparent",
            duration: 0.8,
            ease: "power2.inOut",
          })
          .to(
            ".loader-text-el",
            {
              opacity: 0,
              duration: 0.5,
            },
            "<"
          )

          // 5. Zoom the H shape
          .to(
            shape2Ref.current,
            {
              scale: 1.6,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "-=0.2"
          )

          // 6. Reveal logo text
          .to(".logo-rest", { opacity: 1, duration: 0.01 })
          .to(".logo-rest", {
            width: 250,
            duration: 0.8,
            ease: "power4.out",
          })

          // 7. Explode out final page shapes
          .add(() => {
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            gsap.to(shape2Ref.current, {
              scale: 0,
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            });

            const mainContainer = shapesContainerRef.current;
            if (mainContainer) {
              const mainShapes = gsap.utils.toArray(".shapes-main-shape");
              const targetColors = ["#ff9f43", "#fed330", "#ff7675", "#0984e3", "#ffeaa7", "#ffb8b8"];

              gsap.set(".shapes-main-shape img", { opacity: 0 });

              mainShapes.forEach((shape: any, i: number) => {
                const rect = shape.getBoundingClientRect();
                const shapeCenterX = rect.left + rect.width / 2;
                const shapeCenterY = rect.top + rect.height / 2;

                const xOffset = screenCenterX - shapeCenterX;
                const yOffset = screenCenterY - shapeCenterY;

                const targetRadius = window.getComputedStyle(shape).borderRadius;
                const targetColor = targetColors[i] || "#0984e3";
                const startRadius = i % 2 === 0 ? "0%" : "50%";

                gsap.set(shape, {
                  x: xOffset,
                  y: yOffset,
                  scale: 0.15,
                  borderRadius: startRadius,
                  backgroundColor: targetColor,
                  opacity: 1,
                });

                const shapeTl = gsap.timeline();

                shapeTl
                  .to(shape, {
                    x: 0,
                    y: 0,
                    duration: 1.4,
                    ease: "power2.out",
                  })
                  .to(
                    shape,
                    {
                      scale: 1,
                      borderRadius: targetRadius,
                      duration: 1.3,
                      ease: "elastic.out(1, 0.6)",
                      clearProps: "transform,borderRadius,backgroundColor",
                    },
                    "-=0.6"
                  );

                const img = shape.querySelector("img");
                if (img) {
                  shapeTl.to(
                    img,
                    {
                      opacity: 1,
                      duration: 0.8,
                      ease: "power2.out",
                    },
                    "-=0.8"
                  );
                }
              });
            }

            // Word-by-word stagger title reveal
            gsap.fromTo(
              ".shapes-main-title-word",
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.08,
                ease: "power4.out",
              }
            );
          })

          // Remove preloader completely
          .to(loaderRef.current, {
            display: "none",
            delay: 2.4,
            onComplete: () => {
              setIsLoaderGone(true);
            }
          });
      },
    });
  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 3D Card tilt on settled shapes
  const handleCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  const handleCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  const titleString = "THE CAREER AGENT THAT GETS YOU HIRED";

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#f0eadf] flex flex-col justify-center items-center py-12 px-4 selection:bg-wtf-yellow selection:text-black overflow-hidden font-sans"
    >
      {/* Background grid details */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating Dashboard Back button */}
      {isLoaderGone && (
        <div className="fixed top-6 left-6 z-50 pointer-events-auto">
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
              ← Dashboard
            </button>
          </Link>
        </div>
      )}

      {/* Page Heading readout */}
      {isLoaderGone && (
        <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 select-none text-right">
          <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 bg-white px-2 py-0.5 rounded">
            Component 22
          </span>
          <h1 className="font-serif font-black text-lg uppercase text-[#2a2a2a]">
            Shapes Fusion
          </h1>
        </div>
      )}

      {/* Black Loading Overlay */}
      <div
        ref={loaderRef}
        className="fixed inset-0 bg-[#0c0c0e] z-40 flex flex-col justify-between p-8 md:p-16 select-none"
      >
        <div className="flex justify-between items-center w-full font-mono text-[10px] tracking-widest text-zinc-500 uppercase font-bold">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-wtf-yellow animate-ping" />
            <span>SHAPES FUSION // LOADING ENGINE</span>
          </div>
          <span>SYSTEM ACTIVE</span>
        </div>

        {/* Morphing shapes area */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          {/* Laser scanning sweep */}
          <div className="absolute left-[10vw] right-[10vw] h-[1px] bg-sky-500 opacity-40 animate-pulse pointer-events-none" />

          <div className="flex items-center gap-8 justify-center w-full max-w-lg">
            {/* Shape 1 */}
            <div
              ref={shape1Ref}
              className="w-20 h-20 bg-[#ff9f43] rounded-l-full opacity-90 shadow-lg"
            />
            {/* Shape 2 */}
            <div
              ref={shape2Ref}
              className="w-20 h-20 bg-[#0984e3] rounded-t-full rounded-bl-full rounded-br-none opacity-90 shadow-lg flex items-center justify-center relative"
            >
              <div className="flex items-baseline text-[#ff9f43] font-black tracking-tight relative z-10">
                <span className="logo-h text-6xl opacity-0 transform-gpu font-serif">H</span>
                <div className="logo-rest opacity-0 overflow-hidden flex items-baseline" style={{ width: 0 }}>
                  <span className="logo-rest-inner text-5xl block pb-1 font-sans">unt4job</span>
                </div>
              </div>
            </div>
            {/* Shape 3 */}
            <div
              ref={shape3Ref}
              className="w-20 h-20 bg-[#fed330] rounded-full opacity-90 shadow-lg"
            />
          </div>
        </div>

        {/* Status Indicators & Counter */}
        <div className="flex justify-between items-end w-full relative z-10">
          <div className="loader-text-el text-[8px] md:text-[9px] font-mono text-zinc-500 max-w-xs leading-relaxed uppercase flex flex-col gap-1">
            <span>[ SYSTEM STATE: CALIBRATING ]</span>
            <span>[ TARGET: LOGO_FUSION ]</span>
            <span>Aligning vector radii. Page opens automatically.</span>
          </div>
          <div className="loader-text-el flex items-baseline font-bold tracking-tighter text-white font-serif">
            <h1 ref={counterRef} className="text-7xl md:text-9xl leading-none">0</h1>
            <span className="text-xl md:text-2xl text-sky-500 font-bold ml-2">%</span>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 h-2 bg-sky-500 transition-all duration-100 ease-out" id="loader-shapes-bar" style={{ width: "0%" }} />
      </div>

      {/* Main Page Content (Revealed after Loader) */}
      <div className="w-full max-w-4xl text-left mb-12 px-4 z-10 select-none">
        <span className="shapes-main-title-word text-xs font-semibold uppercase tracking-wider text-wtf-blue block mb-3 font-mono">
          E-learning platform
        </span>
        <h1 className="text-4xl md:text-7xl font-serif font-black text-[#2a2a2a] leading-tight tracking-tight uppercase flex flex-wrap gap-x-4">
          {titleString.split(" ").map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden pb-2">
              <span className="shapes-main-title-word inline-block transform will-change-transform font-serif font-black uppercase">
                {word}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Shapes Grid Container */}
      <div
        ref={shapesContainerRef}
        className="w-full max-w-4xl flex items-end justify-center gap-1.5 sm:gap-3 md:gap-4 px-2 z-10 pointer-events-auto"
      >
        {shapesData.map((shape) => {
          const isImageA = shape.id === 3;
          const isImageB = shape.id === 5;

          return (
            <div
              key={shape.id}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className={`shapes-main-shape group hover:shadow-[8px_8px_0px_#2a2a2a] transition-shadow duration-200 cursor-pointer ${shape.className}`}
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-10"
                style={{
                  background: `radial-gradient(100px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${shape.accentHex}, 0.1), transparent 85%)`,
                }}
              />
              
              {isImageA ? (
                <Image
                  src="/Untitled design (6).png"
                  alt="User A"
                  fill
                  sizes="200px"
                  className="object-cover pointer-events-none"
                />
              ) : isImageB ? (
                <Image
                  src="/Untitled design (7).png"
                  alt="User B"
                  fill
                  sizes="200px"
                  className="object-cover pointer-events-none"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

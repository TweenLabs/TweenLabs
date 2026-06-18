"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";

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
    gsap.set(".shapes-main-title", { opacity: 0, y: 50 });
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
    morph(shape1Ref.current, 0.8);
    morph(shape2Ref.current, 1.0);
    morph(shape3Ref.current, 1.2);

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
                    duration: 1.5,
                    ease: "power2.out",
                  })
                  .to(
                    shape,
                    {
                      scale: 1,
                      borderRadius: targetRadius,
                      duration: 1.4,
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

            // Title reveal
            gsap.fromTo(
              ".shapes-main-title",
              { x: -150, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 1.5,
                stagger: 0.15,
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

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#f3f8fc] flex flex-col justify-center items-center py-12 px-4 selection:bg-wtf-yellow selection:text-black overflow-hidden"
    >
      {/* Floating Dashboard Back button (only shown when loader is done to avoid preloader visual clutter) */}
      {isLoaderGone && (
        <div className="fixed top-4 left-4 z-50 pointer-events-auto">
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
              ← Dashboard
            </button>
          </Link>
        </div>
      )}

      {/* Black Loading Overlay */}
      <div
        ref={loaderRef}
        className="fixed inset-0 bg-[#0a0a0a] z-40 flex flex-col justify-between p-8 md:p-16 select-none"
      >
        <div className="flex justify-between items-center w-full font-mono text-[10px] tracking-widest text-[#555] uppercase font-bold">
          <span>Shapes Loading</span>
          <span>GSAP Shapes Fusion</span>
        </div>

        {/* Morphing shapes area */}
        <div className="relative flex-1 w-full flex items-center justify-center">
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

        {/* Counter */}
        <div className="flex justify-between items-end w-full">
          <div className="loader-text-el text-[9px] font-mono text-[#444] max-w-xs leading-relaxed uppercase">
            Please wait while the shapes align. The page will load automatically.
          </div>
          <div className="loader-text-el flex items-baseline font-bold tracking-tighter text-white font-serif">
            <h1 ref={counterRef} className="text-7xl md:text-9xl leading-none">0</h1>
            <span className="text-xl md:text-2xl text-sky-500 font-bold ml-2">%</span>
          </div>
        </div>
      </div>

      {/* Main Page Content (Revealed after Loader) */}
      <div className="w-full max-w-4xl text-left mb-16 px-4 z-10">
        <span className="shapes-main-title text-xs font-semibold uppercase tracking-wider text-wtf-blue block mb-3 font-mono">
          E-learning platform
        </span>
        <h1 className="shapes-main-title text-4xl md:text-7xl font-serif font-black text-black leading-tight tracking-tight uppercase">
          The Career Agent <br />
          That Gets You Hired
        </h1>
      </div>

      {/* Shapes Container */}
      <div
        ref={shapesContainerRef}
        className="w-full max-w-4xl flex items-end justify-center gap-1.5 sm:gap-3 md:gap-4 px-2 z-10"
      >
        {/* Shape 1 */}
        <div className="shapes-main-shape w-[10%] aspect-[0.5/1] bg-[#ff9f43] rounded-l-full shadow-sm border border-black/10" />

        {/* Shape 2 */}
        <div className="shapes-main-shape w-[10%] aspect-[0.5/1] bg-[#fed330] rounded-l-full shadow-sm border border-black/10" />

        {/* Shape 3 with Local Girl Image */}
        <div className="shapes-main-shape w-[20%] aspect-square rounded-full bg-[#ff7675] overflow-hidden relative shadow-md border-2 border-black">
          <Image
            src="/Untitled design (6).png"
            alt="User Graphic A"
            fill
            className="object-cover"
          />
        </div>

        {/* Shape 4 */}
        <div className="shapes-main-shape w-[20%] aspect-square bg-[#0984e3] rounded-t-full rounded-bl-full rounded-br-none shadow-md border border-black/10" />

        {/* Shape 5 with Local Boy Image */}
        <div className="shapes-main-shape w-[20%] aspect-square rounded-full bg-[#ffeaa7] overflow-hidden relative shadow-md border-2 border-black">
          <Image
            src="/Untitled design (7).png"
            alt="User Graphic B"
            fill
            className="object-cover"
          />
        </div>

        {/* Shape 6 */}
        <div className="shapes-main-shape w-[20%] aspect-square bg-[#ffb8b8] rounded-tr-full shadow-sm border border-black/10" />
      </div>

      {/* Complete Back Button shown at bottom as well */}
      {isLoaderGone && (
        <div className="mt-16 z-20">
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-4 px-8 rounded-xl uppercase tracking-wider cursor-pointer">
              ← Dashboard
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function KineticTypographyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const text = "KINETIC TYPE";

  // IntersectionObserver: only bind mouse listeners when visible
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
    (context, contextSafe) => {
      if (!contextSafe || !isInView) return;

      const chars = textContainerRef.current?.querySelectorAll(".kinetic-char");
      if (!chars || chars.length === 0) return;

      const onMouseMove = contextSafe((e: MouseEvent) => {
        const rect = textContainerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        chars.forEach((char) => {
          const charEl = char as HTMLElement;
          const charRect = charEl.getBoundingClientRect();
          const charX = charRect.left + charRect.width / 2 - rect.left;
          const charY = charRect.top + charRect.height / 2 - rect.top;

          const deltaX = mouseX - charX;
          const deltaY = mouseY - charY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          const maxDistance = 140;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance; // 0 to 1

            // Push letters away from mouse with a slight tilt rotation
            const moveX = -(deltaX / distance) * force * 30;
            const moveY = -(deltaY / distance) * force * 30;
            const angle = -(deltaX / distance) * force * 25;

            gsap.to(charEl, {
              x: moveX,
              y: moveY,
              rotate: angle,
              scale: 1 + force * 0.25,
              color: "#6758a5", // Turn purple when close to mouse
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            // Reset
            gsap.to(charEl, {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              color: "#2a2a2a",
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });

      const onMouseLeave = contextSafe(() => {
        chars.forEach((char) => {
          gsap.to(char, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            color: "#2a2a2a",
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });

      const container = textContainerRef.current;
      container?.addEventListener("mousemove", onMouseMove);
      container?.addEventListener("mouseleave", onMouseLeave);

      return () => {
        container?.removeEventListener("mousemove", onMouseMove);
        container?.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: containerRef, dependencies: [isInView] },
  );

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 selection:bg-[#f1b333] selection:text-black overflow-hidden"
      ref={containerRef}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        ref={textContainerRef}
        className="relative w-full max-w-4xl min-h-[300px] flex items-center justify-center overflow-hidden p-6 cursor-crosshair select-none z-10"
      >
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-serif font-black tracking-tight flex flex-wrap justify-center gap-x-4 gap-y-2 w-full text-center">
          {text.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIdx) => {
                const flatIndex =
                  text.split(" ").slice(0, wordIdx).join("").length + charIdx;
                return (
                  <span
                    key={charIdx}
                    className={`kinetic-char char-${flatIndex} inline-block transform origin-center font-black text-[#2a2a2a] will-change-transform`}
                    style={{ textShadow: "3px 3px 0px #f1b333" }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}

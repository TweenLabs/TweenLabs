# How to Use: 3D Coverflow Carousel

This guide shows you how to integrate the interactive **3D Coverflow Carousel** as a standalone React component.

### Core GSAP Animation Code
```javascript
// Setup loop ticker to smoothly interpolate coverflow positions
const updatePositions = () => {
  const state = dragRef.current;
  const numCards = items.length;

  if (detailIdx === null) {
    if (state.isDragging) {
      state.smoothRotation += (state.rotation - state.smoothRotation) * 0.25;
    } else {
      state.velocity *= 0.92; // Inertia friction
      state.rotation += state.velocity;
      state.rotation = Math.max(0, Math.min(numCards - 1, state.rotation)); // Clamp bounds
      state.smoothRotation += (state.rotation - state.smoothRotation) * 0.15;
    }
  }

  // Calculate 3D transforms for each card
  cardsRef.current.forEach((card, index) => {
    if (!card) return;

    if (detailIdx !== null) {
      // Fade out non-active cards in detail mode
      if (index !== detailIdx) {
        gsap.to(card, {
          opacity: 0,
          scale: 0.5,
          z: -400,
          x: index < detailIdx ? -600 : 600,
          rotationY: index < detailIdx ? -60 : 60,
          pointerEvents: "none",
          duration: 0.6,
          overwrite: "auto",
        });
      }
      return;
    }

    const diff = index - state.smoothRotation;
    const xStep = 260; // horizontal separation
    const zStep = 180; // depth offset
    const maxRotY = 48; // max rotation degrees

    const x = diff * xStep;
    const z = -Math.abs(diff) * zStep;
    const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));

    const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
    const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);
    const isClickable = Math.abs(diff) < 0.8;

    gsap.set(card, {
      x: x,
      y: 0,
      z: z,
      rotationY: rotY,
      scale: scale,
      opacity: opacity,
      zIndex: Math.round(100 - Math.abs(diff) * 10),
      pointerEvents: isClickable ? "auto" : "none",
    });
  });
};

gsap.ticker.add(updatePositions);
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface CarouselCardItem {
  id: number;
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  bgColor: string; // Background color for container (e.g. "#e55b3c")
  accentClass: string; // Tailwind accent class (e.g. "bg-[#e55b3c]")
  textColor: string;
}

interface ThreeDCarouselProps {
  items: CarouselCardItem[];
}

export default function ThreeDCarousel({ items }: ThreeDCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startRotation: 0,
    rotation: 0,
    smoothRotation: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });

  const getHexWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useGSAP(
    () => {
      const updatePositions = () => {
        const state = dragRef.current;
        const numCards = items.length;

        if (detailIdx === null) {
          if (state.isDragging) {
            state.smoothRotation += (state.rotation - state.smoothRotation) * 0.25;
          } else {
            state.velocity *= 0.92;
            state.rotation += state.velocity;
            state.rotation = Math.max(0, Math.min(numCards - 1, state.rotation));
            state.smoothRotation += (state.rotation - state.smoothRotation) * 0.15;
          }
        }

        const currentActive = Math.max(0, Math.min(numCards - 1, Math.round(state.smoothRotation)));
        setActiveIdx(currentActive);

        if (containerRef.current && detailIdx === null) {
          const activeItem = items[currentActive];
          const targetBg = getHexWithOpacity(activeItem.bgColor, 0.12);
          gsap.to(containerRef.current, {
            backgroundColor: targetBg,
            duration: 0.5,
            overwrite: "auto",
          });
        }

        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          if (detailIdx !== null) {
            if (index !== detailIdx) {
              gsap.to(card, {
                opacity: 0,
                scale: 0.5,
                z: -400,
                x: index < detailIdx ? -600 : 600,
                rotationY: index < detailIdx ? -60 : 60,
                pointerEvents: "none",
                duration: 0.6,
                overwrite: "auto",
              });
            }
            return;
          }

          const diff = index - state.smoothRotation;
          const xStep = 260;
          const zStep = 180;
          const maxRotY = 48;

          const x = diff * xStep;
          const z = -Math.abs(diff) * zStep;
          const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));

          const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
          const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);
          const isClickable = Math.abs(diff) < 0.8;

          gsap.set(card, {
            x: x,
            y: 0,
            z: z,
            rotationY: rotY,
            scale: scale,
            opacity: opacity,
            zIndex: Math.round(100 - Math.abs(diff) * 10),
            pointerEvents: isClickable ? "auto" : "none",
          });
        });
      };

      gsap.ticker.add(updatePositions);
      return () => gsap.ticker.remove(updatePositions);
    },
    { scope: containerRef, dependencies: [detailIdx, items] }
  );

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (detailIdx !== null) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    const state = dragRef.current;
    state.isDragging = true;
    state.startX = e.clientX;
    state.startRotation = state.rotation;
    state.lastX = e.clientX;
    state.lastTime = Date.now();
    state.velocity = 0;

    if (carouselRef.current) {
      carouselRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.isDragging) return;

    const width = containerRef.current?.offsetWidth || 1000;
    const deltaX = e.clientX - state.startX;

    const sensitivity = 2.2;
    state.rotation = state.startRotation - (deltaX / width) * sensitivity;

    const now = Date.now();
    const dt = now - state.lastTime;
    if (dt > 0) {
      const dx = e.clientX - state.lastX;
      state.velocity = -(dx / width) * sensitivity * 0.7;
      state.lastX = e.clientX;
      state.lastTime = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    if (carouselRef.current) {
      carouselRef.current.releasePointerCapture(e.pointerId);
    }

    const momentumOffset = state.velocity * 4;
    const targetSnap = Math.max(0, Math.min(items.length - 1, Math.round(state.rotation + momentumOffset)));

    gsap.to(state, {
      rotation: targetSnap,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    state.velocity = 0;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (detailIdx !== null) return;
    const state = dragRef.current;
    const delta = e.deltaY * 0.0015;
    state.rotation = Math.max(0, Math.min(items.length - 1, state.rotation + delta));

    gsap.killTweensOf(state);
    gsap.to(state, {
      rotation: Math.round(state.rotation),
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const closeDetail = useCallback(() => {
    if (detailIdx === null) return;
    const prev = detailIdx;
    setDetailIdx(null);

    if (detailPanelRef.current) {
      gsap.to(detailPanelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }

    if (containerRef.current) {
      const targetBg = getHexWithOpacity(items[prev].bgColor, 0.12);
      gsap.to(containerRef.current, {
        backgroundColor: targetBg,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [detailIdx, items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailIdx !== null) {
        if (e.key === "Escape") closeDetail();
        return;
      }
      const state = dragRef.current;
      if (e.key === "ArrowRight") {
        const next = Math.min(items.length - 1, Math.round(state.rotation) + 1);
        gsap.to(state, { rotation: next, duration: 0.5, ease: "power2.out" });
      } else if (e.key === "ArrowLeft") {
        const prev = Math.max(0, Math.round(state.rotation) - 1);
        gsap.to(state, { rotation: prev, duration: 0.5, ease: "power2.out" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailIdx, closeDetail, items]);

  const handleCardMouseMove = (e: React.MouseEvent, index: number) => {
    if (detailIdx !== null) return;
    if (index !== Math.round(dragRef.current.smoothRotation)) return;

    const card = cardInnersRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotY = (x / rect.width - 0.5) * 20;
    const rotX = (y / rect.height - 0.5) * -20;

    gsap.to(card, {
      rotationY: rotY,
      rotationX: rotX,
      scale: 1.04,
      boxShadow: "12px 12px 0px #2a2a2a",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardInnersRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow: "6px 6px 0px #2a2a2a",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const openDetail = (index: number) => {
    const state = dragRef.current;
    if (index !== Math.round(state.smoothRotation)) {
      gsap.to(state, { rotation: index, duration: 0.5, ease: "power2.out" });
      return;
    }

    setDetailIdx(index);
    const card = cardsRef.current[index];
    if (!card) return;

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: items[index].bgColor,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    gsap.to(card, {
      x: "-25vw",
      y: 0,
      z: 0,
      scale: 1,
      rotationY: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    if (detailPanelRef.current) {
      gsap.fromTo(
        detailPanelRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.7, ease: "power3.inOut", overwrite: "auto" }
      );
      gsap.fromTo(
        detailPanelRef.current.querySelectorAll(".stagger-in"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.3, overwrite: "auto" }
      );
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-screen overflow-hidden bg-[#f0eadf] text-[#2a2a2a] transition-colors duration-500"
    >
      {/* 3D Carousel Main Stage */}
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex items-center justify-center relative select-none cursor-grab active:cursor-grabbing"
        style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIdx;

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              onClick={() => openDetail(idx)}
              className="absolute w-[290px] h-[390px] md:w-[340px] md:h-[450px] flex items-center justify-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={(el) => {
                  cardInnersRef.current[idx] = el;
                }}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
                className={`w-full h-full border-3 bg-white p-4 flex flex-col justify-between rounded-xl select-none relative overflow-hidden group shadow-[6px_6px_0px_#2a2a2a] ${
                  isActive ? "border-[#f1b333]" : "border-[#2a2a2a]"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                }}
              >
                {/* 3D Visual Layers */}
                <div className="flex flex-col gap-3" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-zinc-400">[{item.category}]</span>
                    <span className="font-mono text-xs font-bold text-zinc-650">0{idx + 1}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase text-[#2a2a2a]">{item.title}</h2>
                </div>

                <div
                  className="w-full h-[180px] md:h-[230px] border-3 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-100"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    className="object-cover w-full h-full select-none group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
                  <span className="font-mono text-[10px] font-bold text-zinc-500">SPECIFICATION REPORT</span>
                  <div className={`w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-bold text-xs shadow-[1.5px_1.5px_0px_#2a2a2a] ${item.accentClass} ${item.textColor}`}>
                    ↗
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Split Detail View Panel */}
      <div
        ref={detailPanelRef}
        className="fixed top-0 right-0 w-full md:w-[50vw] h-full bg-white border-l-4 border-[#2a2a2a] z-40 flex flex-col justify-between p-8 md:p-14 shadow-2xl pointer-events-auto transform translate-x-full opacity-0"
      >
        {detailIdx !== null && (
          <>
            <div className="flex items-center justify-between stagger-in">
              <span className="font-mono text-xs font-bold text-zinc-400">DETAIL REVEAL // MODULE {items[detailIdx].id + 1}</span>
              <button
                onClick={closeDetail}
                className="w-10 h-10 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-bold text-sm bg-red-500 text-white cursor-pointer shadow-[3px_3px_0px_#2a2a2a]"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-6 my-auto">
              <div className="stagger-in flex items-center gap-3">
                <span className={`border-2 border-[#2a2a2a] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white uppercase ${items[detailIdx].accentClass}`}>
                  {items[detailIdx].category}
                </span>
              </div>
              <h2 className="stagger-in text-4xl md:text-5xl font-serif font-black uppercase text-[#2a2a2a] tracking-tight">{items[detailIdx].title}</h2>
              <p className="stagger-in text-base font-medium text-zinc-700 leading-relaxed border-l-4 border-[#2a2a2a] pl-6">{items[detailIdx].desc}</p>
            </div>

            <div className="stagger-in flex gap-4 mt-auto">
              <button className={`flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm uppercase border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] ${items[detailIdx].accentClass} ${items[detailIdx].textColor}`}>
                Execute Spec
              </button>
              <button onClick={closeDetail} className="flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] bg-white text-black">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add 3d-carousel
```

---

### 🛠️ Option B: Manual Installation

Follow these beginner-friendly, step-by-step instructions to integrate the component into your project.

### ⚡ Step 1: Install Dependencies
Open your project terminal and install the required GreenSock libraries:
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create a new component file inside your React/Next.js folder structure, for example:
   `file:///your-project/src/components/ThreeDCarousel.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import ThreeDCarousel from "@/components/ThreeDCarousel.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <ThreeDCarousel />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `items` (Array): An array of card specs containing category tags, image paths, descriptions, and color accents.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

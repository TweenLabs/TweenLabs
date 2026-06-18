# How to Use: Stacking Cards Classic

This guide shows you how to integrate the **Stacking Cards Classic** scroll-pin reveal. This variant stacks cards exactly on top of each other without offset margins.

### Core GSAP Animation Code
```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardEls = gsap.utils.toArray(".scroll-card-item");

cardEls.forEach((card, index) => {
  // Pin duration stacks cards exactly, then scrolls them off-screen together
  const baseDuration = 450;
  const pinDuration = (cardEls.length - index) * baseDuration;

  ScrollTrigger.create({
    trigger: card,
    start: "top 12%",
    end: `+=${pinDuration}`,
    pin: true,
    pinSpacing: false, // Stack overlap requires spacing = false
    onToggle: (self) => {
      if (self.isActive) {
        setActiveStep(index);
      }
    },
  });
});
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ClassicScrollCard {
  id: number;
  title: string;
  copy: string;
  imgUrl: string;
  bgColor: string;
  textColor: string;
  accentHex: string; // rgb value string (e.g. "229, 91, 60")
  themeClass: string; // Tailwind bg color class
}

interface StackingCardsClassicProps {
  cards: ClassicScrollCard[];
}

export default function StackingCardsClassic({ cards }: StackingCardsClassicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".scroll-card-item");
      if (cardEls.length === 0) return;

      cardEls.forEach((card, index) => {
        const baseDuration = 450;
        const pinDuration = (cardEls.length - index) * baseDuration;

        ScrollTrigger.create({
          trigger: card,
          start: "top 12%",
          end: `+=${pinDuration}`,
          pin: true,
          pinSpacing: false,
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStep(index);
            }
          },
        });
      });
    },
    { scope: containerRef }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

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

    const img = card.querySelector(".inner-img");
    if (img) {
      const moveX = ((x - rect.width / 2) / rect.width) * 12;
      const moveY = ((y - rect.height / 2) / rect.height) * 12;
      gsap.to(img, {
        x: moveX,
        y: moveY,
        scale: 1.06,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.8,
      overwrite: "auto",
    });

    const img = card.querySelector(".inner-img");
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1.0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col pt-28 pb-48">
      {/* Scroll indicator - left side fixed panel */}
      <div className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-6 select-none pointer-events-none">
        <div className="w-[4px] h-48 bg-zinc-300 relative rounded">
          <div
            className="absolute top-0 left-0 w-full bg-[#2a2a2a] rounded transition-all duration-300"
            style={{
              height: `${(activeStep / (cards.length - 1)) * 100}%`,
            }}
          />
        </div>
        <div className="flex flex-col gap-5 items-center font-mono text-[10px] font-bold">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`w-9 h-9 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center transition-all duration-300 shadow-[2px_2px_0px_#2a2a2a] ${
                idx === activeStep
                  ? `${card.themeClass} text-white scale-110`
                  : "bg-white text-zinc-400"
              }`}
            >
              0{idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Cards stack */}
      <div className="w-full flex flex-col items-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className="scroll-card-item relative w-full h-[82vh] flex justify-center items-center px-4 md:px-8"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`brutalist-card w-full max-w-4xl p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center select-none cursor-pointer rounded-2xl will-change-transform relative overflow-hidden ${card.bgColor} ${card.textColor}`}
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
                style={{
                  background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${card.accentHex}, 0.08), transparent 85%)`,
                }}
              />

              <div className="flex-1 flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs opacity-50 uppercase tracking-widest">[ Step 0{card.id} ]</span>
                  <span className={`inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${card.themeClass}`}>
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif font-black uppercase tracking-tight leading-none text-[#2a2a2a]">
                  {card.title}
                </h3>
                <p className="font-sans font-medium text-xs md:text-sm leading-relaxed text-zinc-650 mt-2">
                  {card.copy}
                </p>
              </div>

              <div
                className="inner-img-frame w-full md:w-80 h-48 md:h-56 relative rounded-xl border-3 border-[#2a2a2a] overflow-hidden shadow-[4px_4px_0px_#2a2a2a] flex-shrink-0 z-10 bg-zinc-100"
                style={{ transform: "translateZ(15px)" }}
              >
                <img
                  src={card.imgUrl}
                  alt={card.title}
                  className="inner-img object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add scroll-cards-classic
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
   `file:///your-project/src/components/StackingCardsClassic.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import StackingCardsClassic from "@/components/StackingCardsClassic.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <StackingCardsClassic />
    </main>
  );
}
```

### ⚠️ Plugin Registration Notice
Since this component uses GSAP plugins (ScrollTrigger), they must be imported and registered at the top of your component file:
```tsx
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(useGSAP, ScrollTrigger);
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `cards` (Array): List of cards designed to stack exactly on top of each other without offset margins.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

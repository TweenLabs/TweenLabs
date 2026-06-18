# How to Use: Horizontal Cards Showcase

This guide shows you how to copy and use the **Horizontal Cards Showcase** as a standalone React component.

### Core GSAP Animation Code
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: scrollSection,
    pin: true,
    scrub: 0.6,
    start: "top top",
    end: "+=2000",
  },
});

cards.forEach((card, idx) => {
  const startRot = cardsData[idx].rotateStart;
  const entryStart = idx * 0.6;
  const entryDuration = 1.0;
  const holdStart = entryStart + entryDuration;
  const exitStart = 3.0;
  const holdDuration = exitStart - holdStart;
  const exitDuration = 1.0;

  tl.fromTo(card, { y: "110vh", rotation: startRot + 15, opacity: 0, scale: 0.85 }, { y: "0vh", rotation: startRot, opacity: 1, scale: 1, duration: entryDuration, ease: "power2.out" }, entryStart)
    .to(card, { y: "-8vh", rotation: startRot - 2, duration: holdDuration, ease: "none" }, holdStart)
    .to(card, { y: "-110vh", rotation: startRot - 15, opacity: 0, scale: 0.85, duration: exitDuration, ease: "power2.in" }, exitStart);
});

// Idle float
gsap.to(".card-inner", {
  y: "-10px",
  rotation: "1.5",
  duration: 2.2,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
  stagger: { each: 0.35, from: "random" }
});
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CardData {
  id: string;
  title: string;
  borderColor: string;
  btnBg: string;
  rotateStart: number;
  leftPos: string; // Tailwind left offset classes
}

interface CardsShowcaseProps {
  cards?: CardData[];
}

const defaultCards: CardData[] = [
  {
    id: "CARD-1",
    title: "PRODUCT DESIGN",
    borderColor: "#0c9367",
    btnBg: "bg-[#0c9367] text-white hover:bg-[#0a8059]",
    rotateStart: 6,
    leftPos: "left-[10vw]",
  },
  {
    id: "CARD-2",
    title: "GSAP DEVELOPER",
    borderColor: "#c53b3a",
    btnBg: "bg-[#c53b3a] text-white hover:bg-[#aa3231]",
    rotateStart: -4,
    leftPos: "left-[30vw]",
  },
  {
    id: "CARD-3",
    title: "NEO BRUTALISM",
    borderColor: "#3b82f6",
    btnBg: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
    rotateStart: 5,
    leftPos: "left-[50vw]",
  },
  {
    id: "CARD-4",
    title: "NEXT.JS SPEED",
    borderColor: "#f1b333",
    btnBg: "bg-[#f1b333] text-black hover:bg-[#d99f26]",
    rotateStart: -6,
    leftPos: "left-[70vw]",
  },
];

export default function CardsShowcase({ cards = defaultCards }: CardsShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: "+=2000",
        invalidateOnRefresh: true,
      },
    });

    const cardElements = gsap.utils.toArray<HTMLElement>(".card-item");

    cardElements.forEach((card, idx) => {
      const data = cards[idx];
      const startRot = data.rotateStart;

      const entryStart = idx * 0.6;
      const entryDuration = 1.0;
      const holdStart = entryStart + entryDuration;
      const exitStart = 3.0;
      const holdDuration = exitStart - holdStart;
      const exitDuration = 1.0;

      // 1. Staggered Entrance
      tl.fromTo(
        card,
        {
          y: "110vh",
          rotation: startRot + 15,
          opacity: 0,
          scale: 0.85,
        },
        {
          y: "0vh",
          rotation: startRot,
          opacity: 1,
          scale: 1,
          duration: entryDuration,
          ease: "power2.out",
        },
        entryStart
      )
      // 2. Float Drift Hold Phase
      .to(
        card,
        {
          y: "-8vh",
          rotation: startRot - 2,
          duration: holdDuration,
          ease: "none",
        },
        holdStart
      )
      // 3. Staggered Exit
      .to(
        card,
        {
          y: "-110vh",
          rotation: startRot - 15,
          opacity: 0,
          scale: 0.85,
          duration: exitDuration,
          ease: "power2.in",
        },
        exitStart
      );
    });

    // Idle hover floating animation loop
    gsap.to(".card-inner", {
      y: "-10px",
      rotation: "1.5",
      duration: 2.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.35,
        from: "random",
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#1e1e1e] overflow-hidden">
      {/* Scroll area */}
      <div 
        ref={scrollSectionRef} 
        className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-[380px] md:h-[420px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className="card-item absolute top-0 w-[80%] md:w-[18vw] h-full transform will-change-transform pointer-events-auto"
                style={{ left: card.leftPos.replace("left-", "") }}
              >
                <div
                  className="card-inner w-full h-full border-4 bg-[#fbfaf7] rounded-3xl flex flex-col justify-between p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.9)]"
                  style={{ borderColor: card.borderColor }}
                >
                  <div className="font-serif font-black text-xs text-black uppercase">
                    CARD CONCEPT
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                    <h3 className="font-serif font-black text-xl text-[#121212] uppercase px-2">
                      {card.title}
                    </h3>
                    <button className={`border-2 border-black ${card.btnBg} px-5 py-2 rounded-full font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000] cursor-pointer`}>
                      Launch Demo
                    </button>
                  </div>

                  <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                    <span>[{card.id}]</span>
                    <span className="font-bold text-zinc-500">GSAP INC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add horizontal-cards-showcase
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
   `file:///your-project/src/components/HorizontalCardsShowcase.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import HorizontalCardsShowcase from "@/components/HorizontalCardsShowcase.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <HorizontalCardsShowcase />
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

- `items` (Array): A list of showcases. Each showcase item has a `title`, `subtitle`, `imgUrl`, `bgColor`, and `link`.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

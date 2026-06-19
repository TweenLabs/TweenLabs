# How to Use: Page Change Animation

This guide shows you how to copy and use the **Page Change Animation** (3D stacked pages) as a standalone React component.

### Core GSAP Animation Code
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: scrollSection,
    pin: true,
    scrub: 0.3,
    start: "top top",
    end: "+=2400",
  }
});

for (let i = 1; i < panels.length; i++) {
  tl.to(`.panel-${i}`, { y: "0vh", duration: 1.4, ease: "power3.out" });
  tl.to(`.panel-${i}-content`, { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");
  
  // Shrink and tilt outgoing background panel
  tl.to(`.panel-${i - 1}`, {
    scale: 0.85,
    y: "-8vh",
    rotateX: 12,
    opacity: 0.4,
    transformOrigin: "center 30%",
    duration: 1.4,
    ease: "power3.out",
  }, "<");
  
  // Fade out grandparent panel to save GPU memory
  if (i > 1) {
    tl.to(`.panel-${i - 2}`, { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<");
  }
  tl.to({}, { duration: 0.1 });
}
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface PanelData {
  title: string;
  color: string; // Background color hex or utility
  description: string;
}

interface PageChangeProps {
  panels?: PanelData[];
}

const defaultPanels: PanelData[] = [
  {
    title: "FIRST NODE",
    color: "#0c9367",
    description: "First panel slide-up module. Pinned screen initializes stack compilation.",
  },
  {
    title: "SECOND NODE",
    color: "#c53b3a",
    description: "Second panel overrides initial context. Outgoing screen shrinks with rotateX tilt.",
  },
  {
    title: "THIRD NODE",
    color: "#3b82f6",
    description: "Third panel stacks on top. Parallax content container offsets downward.",
  },
];

export default function PageChangeAnimation({ panels = defaultPanels }: PageChangeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Set initial states: Panel 0 is visible, rest are below the screen (100vh)
    gsap.set(".panel-0", { y: "0vh", scale: 1, rotateX: 0, autoAlpha: 1 });
    
    for (let i = 1; i < panels.length; i++) {
      gsap.set(`.panel-${i}`, { y: "100vh", scale: 1, rotateX: 0, autoAlpha: 0 });
      gsap.set(`.panel-${i}-content`, { y: "15vh" });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.3,
        start: "top top",
        end: `+=${panels.length * 800}`,
        invalidateOnRefresh: true,
      },
    });

    // 2. Build stacked transition timeline loops
    for (let i = 1; i < panels.length; i++) {
      tl.set(`.panel-${i}`, { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
      tl.set(`.panel-${i}-content`, { y: "15vh" });

      tl.to(`.panel-${i}`, { y: "0vh", duration: 1.4, ease: "power3.out" });
      tl.to(`.panel-${i}-content`, { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");

      // Shrink and tilt outgoing background panel
      tl.to(`.panel-${i - 1}`, {
        scale: 0.85,
        y: "-8vh",
        rotateX: 12,
        opacity: 0.4,
        transformOrigin: "center 30%",
        duration: 1.4,
        ease: "power3.out",
      }, "<");

      // Fade out grandparent panel to save GPU memory
      if (i > 1) {
        tl.to(`.panel-${i - 2}`, { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<");
      }

      // Small holding gap
      tl.to({}, { duration: 0.1 });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#1e1e1e] overflow-hidden">
      {/* Viewport viewport */}
      <div 
        ref={scrollSectionRef} 
        className="h-screen w-full relative overflow-hidden" 
        style={{ perspective: "1400px", perspectiveOrigin: "50% 40%", transformStyle: "preserve-3d" }}
      >
        {panels.map((panel, idx) => (
          <section
            key={idx}
            className={`panel-item panel-${idx} absolute inset-0 text-white flex flex-col justify-between p-8 md:p-16 select-none will-change-transform`}
            style={{ backgroundColor: panel.color, backfaceVisibility: "hidden" }}
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-xs uppercase tracking-wider">/ cosmos / panel-0{idx + 1}</span>
            </div>

            <div className={`panel-${idx}-content flex-grow flex flex-col justify-center items-center text-center gap-6 max-w-2xl mx-auto will-change-transform`}>
              <h1 className="text-4xl md:text-7xl font-serif font-black uppercase tracking-tight border-b-4 border-white pb-2">
                {panel.title}
              </h1>
              <p className="text-sm md:text-base font-sans font-medium opacity-90 leading-relaxed">
                {panel.description}
              </p>
            </div>

            <div className="font-mono text-xs opacity-50">
              SCROLL DOWN TO ADVANCE
            </div>
          </section>
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
npx tweenlabs@latest add page-change-animation
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
   `file:///your-project/src/components/PageChangeAnimation.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import PageTransitionProvider from "@/components/PageChangeAnimation.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <PageTransitionProvider />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `children` (ReactNode): Wrap your page elements. Transition triggers automatically during Route Navigation (Next.js Link clicks or window routing).

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

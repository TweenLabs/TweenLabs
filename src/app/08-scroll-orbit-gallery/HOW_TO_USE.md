# How to Use: Scroll Orbit Gallery (Ponder.ai Inspired)

This guide shows you how to copy and use the **Scroll Orbit Gallery** (where corner cards converge into a full-page timeline) as a standalone React component, using `/demo.svg` as project images that reveal themselves when scanned by the playhead.

### Core GSAP Animation Code
```javascript
// 1. Initial State: Offset the cards relative to their final horizontal layout position
// They float at the 4 corners of the screen (partially off-screen and rotated)
gsap.set(".orbit-card-0", { x: "-15vw", y: "-35vh", rotation: -18, scale: 0.75 });
gsap.set(".orbit-card-1", { x: "52vw", y: "-38vh", rotation: 12, scale: 0.75 });
gsap.set(".orbit-card-2", { x: "-42vw", y: "38vh", rotation: -12, scale: 0.75 });
gsap.set(".orbit-card-3", { x: "15vw", y: "35vh", rotation: 18, scale: 0.75 });

// Hide playhead and timeline tracks initially
gsap.set(".playhead-line", { scaleY: 0, opacity: 0 });
gsap.set(".timeline-track", { scaleX: 0, opacity: 0 });

// Hide card images initially
gsap.set(".card-image", { opacity: 0, scale: 0.9 });

// 2. Master timeline linked to vertical scroll pinning
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: scrollSectionRef.current,
    pin: true,
    scrub: 0.6,
    start: "top top",
    end: "+=3000",
    invalidateOnRefresh: true,
  },
});

// Phase 1: Convergence
tl.to(".orbit-card-0, .orbit-card-1, .orbit-card-2, .orbit-card-3", {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  duration: 1.2,
  ease: "power2.inOut",
}, 0);

// Fade in timeline track guide
tl.to(".timeline-track", {
  scaleX: 1,
  opacity: 0.15,
  duration: 0.4,
  ease: "power2.out",
}, 0.8);

// Phase 2: Playhead Activation & Sweep
tl.to(".playhead-line", {
  scaleY: 1,
  opacity: 1,
  duration: 0.3,
  ease: "back.out(1.5)",
}, 1.2)
.to(".playhead-line", {
  left: "95vw",
  duration: 2.0,
  ease: "none",
}, 1.5);

// Card 0 active glow & image reveal (timeline time 1.55s to 2.05s)
tl.to(".orbit-card-0", { scale: 1.08, duration: 0.25 }, 1.55)
  .to(".orbit-card-0 .card-inner-box", { borderColor: "#f1b333", boxShadow: "0 12px 36px rgba(241, 179, 51, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-0 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
  .to(".orbit-card-0", { scale: 1, duration: 0.25 }, 1.8)
  .to(".orbit-card-0 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-0 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 1 active glow & image reveal (timeline time 2.05s to 2.55s)
tl.to(".orbit-card-1", { scale: 1.08, duration: 0.25 }, 2.05)
  .to(".orbit-card-1 .card-inner-box", { borderColor: "#0c9367", boxShadow: "0 12px 36px rgba(12, 147, 103, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-1 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
  .to(".orbit-card-1", { scale: 1, duration: 0.25 }, 2.3)
  .to(".orbit-card-1 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-1 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 2 active glow & image reveal (timeline time 2.55s to 3.05s)
tl.to(".orbit-card-2", { scale: 1.08, duration: 0.25 }, 2.55)
  .to(".orbit-card-2 .card-inner-box", { borderColor: "#8b5cf6", boxShadow: "0 12px 36px rgba(139, 92, 246, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-2 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
  .to(".orbit-card-2", { scale: 1, duration: 0.25 }, 2.8)
  .to(".orbit-card-2 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-2 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 3 active glow & image reveal (timeline time 3.05s to 3.55s)
tl.to(".orbit-card-3", { scale: 1.08, duration: 0.25 }, 3.05)
  .to(".orbit-card-3 .card-inner-box", { borderColor: "#c53b3a", boxShadow: "0 12px 36px rgba(197, 59, 58, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-3 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
  .to(".orbit-card-3", { scale: 1, duration: 0.25 }, 3.3)
  .to(".orbit-card-3 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-3 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Phase 3: Exit Slide-out
tl.to(".playhead-line", { scaleY: 0, opacity: 0, duration: 0.2 }, 3.5)
  .to(".timeline-cards-row", { xPercent: -150, duration: 1.0, ease: "power2.in" }, 3.6);
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function StandaloneOrbitGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial offsets at the 4 corners of the viewport
    gsap.set(".orbit-card-0", { x: "-15vw", y: "-35vh", rotation: -18, scale: 0.75 });
    gsap.set(".orbit-card-1", { x: "52vw", y: "-38vh", rotation: 12, scale: 0.75 });
    gsap.set(".orbit-card-2", { x: "-42vw", y: "38vh", rotation: -12, scale: 0.75 });
    gsap.set(".orbit-card-3", { x: "15vw", y: "35vh", rotation: 18, scale: 0.75 });
    
    gsap.set(".playhead-line", { scaleY: 0, opacity: 0 });
    gsap.set(".timeline-track", { scaleX: 0, opacity: 0 });
    gsap.set(".card-image", { opacity: 0, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: "+=3200",
        invalidateOnRefresh: true,
      },
    });

    // Convergence
    tl.to(".orbit-card-0, .orbit-card-1, .orbit-card-2, .orbit-card-3", {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: "power2.inOut",
    }, 0);

    tl.to(".timeline-track", { scaleX: 1, opacity: 0.15, duration: 0.4 }, 0.8);

    // Playhead sweep
    tl.to(".playhead-line", { scaleY: 1, opacity: 1, duration: 0.3 }, 1.2)
      .to(".playhead-line", { left: "95vw", duration: 2.0, ease: "none" }, 1.5);

    // Card active scales & border glows & image reveal
    tl.to(".orbit-card-0", { scale: 1.08, duration: 0.25 }, 1.55)
      .to(".orbit-card-0 .card-inner-box", { borderColor: "#f1b333", boxShadow: "0 12px 36px rgba(241, 179, 51, 0.35)", duration: 0.25 }, "<")
      .to(".orbit-card-0 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
      .to(".orbit-card-0", { scale: 1, duration: 0.25 }, 1.8)
      .to(".orbit-card-0 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
      .to(".orbit-card-0 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

    tl.to(".orbit-card-1", { scale: 1.08, duration: 0.25 }, 2.05)
      .to(".orbit-card-1 .card-inner-box", { borderColor: "#0c9367", boxShadow: "0 12px 36px rgba(12, 147, 103, 0.35)", duration: 0.25 }, "<")
      .to(".orbit-card-1 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
      .to(".orbit-card-1", { scale: 1, duration: 0.25 }, 2.3)
      .to(".orbit-card-1 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
      .to(".orbit-card-1 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

    tl.to(".orbit-card-2", { scale: 1.08, duration: 0.25 }, 2.55)
      .to(".orbit-card-2 .card-inner-box", { borderColor: "#8b5cf6", boxShadow: "0 12px 36px rgba(139, 92, 246, 0.35)", duration: 0.25 }, "<")
      .to(".orbit-card-2 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
      .to(".orbit-card-2", { scale: 1, duration: 0.25 }, 2.8)
      .to(".orbit-card-2 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
      .to(".orbit-card-2 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

    tl.to(".orbit-card-3", { scale: 1.08, duration: 0.25 }, 3.05)
      .to(".orbit-card-3 .card-inner-box", { borderColor: "#c53b3a", boxShadow: "0 12px 36px rgba(197, 59, 58, 0.35)", duration: 0.25 }, "<")
      .to(".orbit-card-3 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
      .to(".orbit-card-3", { scale: 1, duration: 0.25 }, 3.3)
      .to(".orbit-card-3 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
      .to(".orbit-card-3 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

    // Exit slide left
    tl.to(".playhead-line", { scaleY: 0, opacity: 0, duration: 0.2 }, 3.5)
      .to(".timeline-cards-row", { xPercent: -150, duration: 1.0, ease: "power2.in" }, 3.6);

    // Subtle drift floating effect
    gsap.to(".card-inner-box", {
      y: "-6px",
      rotation: "0.8",
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.4, from: "random" }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-[#f2ece0] text-[#2a2a2a]">
      <div ref={scrollSectionRef} className="h-screen w-full flex items-center justify-center relative font-sans">
        
        {/* Track Line */}
        <div className="timeline-track absolute left-[5vw] right-[5vw] h-[2px] bg-[#2a2a2a]/15 opacity-0 origin-left z-10" />
        
        {/* Laser Playhead */}
        <div ref={playheadRef} className="playhead-line absolute top-[5vh] bottom-[5vh] left-[5vw] w-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-30 origin-top transform -translate-x-1/2">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
        </div>

        {/* Row of Cards */}
        <div className="timeline-cards-row absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-full h-[280px] md:h-[360px] lg:h-[420px]">
            
            {/* Card 1 */}
            <div className="orbit-card-0 absolute top-0 left-[4vw] md:left-[6vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <span className="font-mono text-[9px] text-zinc-400">[MODULE_01]</span>
                <div className="flex-grow flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <svg className="w-8 h-8 text-[#2a2a2a]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  <img src="/demo.svg" alt="Project 01" className="card-image absolute inset-0 w-full h-full object-cover opacity-0 scale-95 z-10" />
                </div>
                <span className="font-serif font-black text-xs text-center uppercase tracking-wide">Project 01</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="orbit-card-1 absolute top-0 left-[28vw] md:left-[29vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <span className="font-mono text-[9px] text-zinc-400">[MODULE_02]</span>
                <div className="flex-grow flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <svg className="w-8 h-8 text-[#2a2a2a]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  <img src="/demo.svg" alt="Project 02" className="card-image absolute inset-0 w-full h-full object-cover opacity-0 scale-95 z-10" />
                </div>
                <span className="font-serif font-black text-xs text-center uppercase tracking-wide">Project 02</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="orbit-card-2 absolute top-0 left-[52vw] md:left-[52vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <span className="font-mono text-[9px] text-zinc-400">[MODULE_03]</span>
                <div className="flex-grow flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <svg className="w-8 h-8 text-[#2a2a2a]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  <img src="/demo.svg" alt="Project 03" className="card-image absolute inset-0 w-full h-full object-cover opacity-0 scale-95 z-10" />
                </div>
                <span className="font-serif font-black text-xs text-center uppercase tracking-wide">Project 03</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="orbit-card-3 absolute top-0 left-[76vw] md:left-[75vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <span className="font-mono text-[9px] text-zinc-400">[MODULE_04]</span>
                <div className="flex-grow flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <svg className="w-8 h-8 text-[#2a2a2a]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  <img src="/demo.svg" alt="Project 04" className="card-image absolute inset-0 w-full h-full object-cover opacity-0 scale-95 z-10" />
                </div>
                <span className="font-serif font-black text-xs text-center uppercase tracking-wide">Project 04</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add scroll-orbit-gallery
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
   `file:///your-project/src/components/ScrollOrbitGallery.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import ScrollOrbitGallery from "@/components/ScrollOrbitGallery.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <ScrollOrbitGallery />
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

- `images` (string[]): A list of absolute paths or URLs to render in the circular scrolling orbit.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

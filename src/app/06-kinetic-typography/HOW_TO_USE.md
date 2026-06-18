# How to Use the Kinetic Typography Modes

This guide shows you how to isolate and copy the code for each animation mode to use them as standalone components in your other React/Next.js projects.

---

## 1. Wave Cascade Mode
This mode animates individual characters in a staggered, repeating sine-wave pattern.

### Core GSAP Animation Code
```javascript
gsap.fromTo(
  ".wave-char",
  { y: 15, rotate: -6, scale: 0.95 },
  {
    y: -15,
    rotate: 6,
    scale: 1.05,
    duration: 0.6 / speed,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: {
      each: 0.08,
      from: "start",
    },
  }
);
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface WaveTextProps {
  text: string;
  speed?: number; // 1 = default
}

export default function WaveText({ text, speed = 1 }: WaveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".wave-char",
      { y: 15, rotate: -6, scale: 0.95 },
      {
        y: -15,
        rotate: 6,
        scale: 1.05,
        duration: 0.6 / speed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.08,
          from: "start",
        },
      }
    );
  }, { scope: containerRef, dependencies: [text, speed] });

  return (
    <div ref={containerRef} className="flex flex-wrap gap-x-2 py-8">
      {text.split(" ").map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIdx) => (
            <span
              key={charIdx}
              className="wave-char inline-block font-black text-4xl transform origin-center"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
```

---

## 2. Cyber Scramble Mode
Scrambles letters using temporary random characters before sequentially decoding them to reveal the final text.

### Core GSAP Animation Code (JS Scramble Logic)
```javascript
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const textArray = text.toUpperCase().split("");

textArray.forEach((originalChar, index) => {
  if (originalChar === " ") return;
  
  let scrambleCount = 0;
  const maxScrambles = 8 + Math.floor(Math.random() * 8) + index;
  const intervalTime = 40 / speed;

  const interval = setInterval(() => {
    if (scrambleCount >= maxScrambles) {
      targetElement.textContent = originalChar;
      clearInterval(interval);
    } else {
      targetElement.textContent = chars[Math.floor(Math.random() * chars.length)];
      scrambleCount++;
    }
  }, intervalTime);
});
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ScrambleTextProps {
  text: string;
  speed?: number;
}

export default function ScrambleText({ text, speed = 1 }: ScrambleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerKey, setTriggerKey] = useState(0);

  useGSAP(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const textArray = text.toUpperCase().split("");

    textArray.forEach((originalChar, index) => {
      if (originalChar === " ") return;
      const el = containerRef.current?.querySelector(`.char-${index}`);
      if (!el) return;

      let scrambleCount = 0;
      const maxScrambles = 8 + Math.floor(Math.random() * 8) + index;
      const intervalTime = 40 / speed;

      const interval = setInterval(() => {
        if (scrambleCount >= maxScrambles) {
          el.textContent = originalChar;
          clearInterval(interval);
        } else {
          el.textContent = chars[Math.floor(Math.random() * chars.length)];
          scrambleCount++;
        }
      }, intervalTime);
    });
  }, { scope: containerRef, dependencies: [text, speed, triggerKey] });

  return (
    <div ref={containerRef} className="flex flex-wrap gap-x-2 py-8">
      <button 
        onClick={() => setTriggerKey(p => p + 1)}
        className="absolute top-2 right-2 text-xs font-mono border p-1 rounded"
      >
        Re-scramble
      </button>
      {text.split(" ").map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIdx) => {
            const flatIdx = text.split(" ").slice(0, wordIdx).join("").length + charIdx;
            return (
              <span
                key={charIdx}
                className={`char-${flatIdx} inline-block font-black text-4xl`}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
```

---

## 3. Magnetic Push Mode
Letters dynamically react to the user's mouse pointer coordinates, tilting, rotating, and scaling away from the cursor.

### Core GSAP Animation Code (Magnetic Math + Tween)
```javascript
const deltaX = mouseX - charCenterX;
const deltaY = mouseY - charCenterY;
const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
const maxDistance = 120;

if (distance < maxDistance) {
  const force = (maxDistance - distance) / maxDistance;
  
  // Push away offset vectors
  const moveX = -(deltaX / distance) * force * 25;
  const moveY = -(deltaY / distance) * force * 25;
  const angle = -(deltaX / distance) * force * 20;

  gsap.to(charElement, {
    x: moveX,
    y: moveY,
    rotate: angle,
    scale: 1 + force * 0.15,
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto",
  });
} else {
  gsap.to(charElement, {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto",
  });
}
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MagneticTextProps {
  text: string;
}

export default function MagneticText({ text }: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP((context, contextSafe) => {
    if (!contextSafe) return;
    const chars = containerRef.current?.querySelectorAll(".magnetic-char");
    if (!chars || chars.length === 0) return;

    const onMouseMove = contextSafe((e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      chars.forEach((char) => {
        const charEl = char as HTMLElement;
        const charRect = charEl.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        const charX = (charRect.left + charRect.width / 2) - containerRect.left;
        const charY = (charRect.top + charRect.height / 2) - containerRect.top;

        const deltaX = mouseX - charX;
        const deltaY = mouseY - charY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const maxDistance = 120; // Radius of magnetic effect

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance; // 0 to 1
          
          // Push away (invert delta signs to pull instead)
          const moveX = -(deltaX / distance) * force * 25;
          const moveY = -(deltaY / distance) * force * 25;
          const angle = -(deltaX / distance) * force * 20;

          gsap.to(charEl, {
            x: moveX,
            y: moveY,
            rotate: angle,
            scale: 1 + force * 0.15,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(charEl, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
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
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    const container = containerRef.current;
    container?.addEventListener("mousemove", onMouseMove);
    container?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container?.removeEventListener("mousemove", onMouseMove);
      container?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, { scope: containerRef, dependencies: [text] });

  return (
    <div 
      ref={containerRef} 
      className="flex flex-wrap justify-center gap-x-2 py-12 border w-full max-w-lg cursor-crosshair"
    >
      {text.split(" ").map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIdx) => (
            <span
              key={charIdx}
              className="magnetic-char inline-block font-black text-4xl transform origin-center"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
```

---

## 4. Liquid Warp Mode
Applies an SVG turbulence noise displacement filter over the text and animates it in a looping ripple cycle.

### Core GSAP Animation Code
```javascript
const tl = gsap.timeline({ repeat: -1, yoyo: true });

tl.to("#displacement-map", {
  attr: { scale: 40 },
  duration: 1.5 / speed,
  ease: "power1.inOut",
})
.to("#turbulence-noise", {
  attr: { baseFrequency: "0.03 0.08" },
  duration: 1.5 / speed,
  ease: "power1.inOut",
}, "<");
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LiquidTextProps {
  text: string;
  speed?: number;
}

export default function LiquidText({ text, speed = 1 }: LiquidTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to("#displacement-map", {
      attr: { scale: 40 },
      duration: 1.5 / speed,
      ease: "power1.inOut",
    })
    .to("#turbulence-noise", {
      attr: { baseFrequency: "0.03 0.08" },
      duration: 1.5 / speed,
      ease: "power1.inOut",
    }, "<");
  }, { scope: containerRef, dependencies: [text, speed] });

  return (
    <div ref={containerRef} className="py-8">
      {/* SVG filter definition required in the document */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-effect">
            <feTurbulence
              id="turbulence-noise"
              type="fractalNoise"
              baseFrequency="0.01 0.04"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              id="displacement-map"
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h1 
        className="font-black text-5xl" 
        style={{ filter: "url(#liquid-effect)" }}
      >
        {text}
      </h1>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add kinetic-typography
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
   `file:///your-project/src/components/KineticTypography.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import KineticTypography from "@/components/KineticTypography.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <KineticTypography />
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

- `text` (string): Target text to display.
- `mode` (string): The animation effect layout. Options: `'wave' | 'scramble' | 'magnetic' | 'liquid'`.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

# How to Use: Bento Grid Tilt

This guide explains how to integrate the 3D Perspective Tilt bento items into your standalone React projects using GSAP.

### Core GSAP Animation Code
```javascript
const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  
  // Calculate relative coordinates inside the card
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set CSS variables for pointer spotlight effect
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);

  // Elegant 3D tilt values (-5 to +5 degrees)
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
  const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;

  gsap.to(card, {
    rotateX: rotateX,
    rotateY: rotateY,
    transformPerspective: 1000,
    ease: "power1.out",
    duration: 0.3,
    overwrite: "auto",
  });

  // Optional: Dynamic parallax shifts on nested assets/images
  const imgFrame = card.querySelector(".inner-img");
  if (imgFrame) {
    const moveX = ((x - rect.width / 2) / rect.width) * 10;
    const moveY = ((y - rect.height / 2) / rect.height) * 10;
    gsap.to(imgFrame, {
      x: moveX,
      y: moveY,
      scale: 1.05,
      duration: 0.4,
      ease: "power1.out",
      overwrite: "auto",
    });
  }
};

const handleMouseLeave = (e) => {
  const card = e.currentTarget;
  // Smooth elastic return back to flat default state
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    ease: "elastic.out(1.1, 0.4)",
    duration: 0.75,
    overwrite: "auto",
  });

  const imgFrame = card.querySelector(".inner-img");
  if (imgFrame) {
    gsap.to(imgFrame, {
      x: 0,
      y: 0,
      scale: 1.0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
};
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface BentoTiltCardProps {
  children: React.ReactNode;
  accentHex?: string; // rgb value string: e.g. "229, 91, 60"
  className?: string;
}

export default function BentoTiltCard({
  children,
  accentHex = "229, 91, 60",
  className = "",
}: BentoTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });

    const img = card.querySelector(".inner-img");
    if (img) {
      const moveX = ((x - rect.width / 2) / rect.width) * 10;
      const moveY = ((y - rect.height / 2) / rect.height) * 10;
      gsap.to(img, {
        x: moveX,
        y: moveY,
        scale: 1.05,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border-3 border-[#2a2a2a] bg-white p-6 shadow-[5px_5px_0px_#2a2a2a] hover:shadow-[10px_10px_0px_#2a2a2a] transition-shadow duration-200 cursor-pointer select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      }}
    >
      {/* Interactive Spotlight Radial Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${accentHex}, 0.08), transparent 85%)`,
        }}
      />
      
      {/* Inner Slot Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add bento-grid-flip
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
   `file:///your-project/src/components/BentoTiltCard.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import BentoTiltCard from "@/components/BentoTiltCard.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <BentoTiltCard />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `children` (ReactNode): The card contents.
- `accentHex` (string): RGB values (e.g. `'229, 91, 60'`) for the glowing pointer spotlight.
- `className` (string): Tailwind styling overrides.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

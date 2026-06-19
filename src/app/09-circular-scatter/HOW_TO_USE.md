# How to Use: Circular Scatter Gallery

This guide shows you how to copy and use the **Circular Scatter Gallery** (where cards start stacked in the center, explode outwards simultaneously in a premium spiral orbit trajectory, drift continuously, and support bottom-aligned text scramble layouts) as a standalone React component in Next.js or React.

## Core GSAP Animation Code (Spiral Orbit)

The entry transition stacks cards one-by-one, then sweeps them out along a synchronized spiral orbit. To prevent overlapping during the transition, all cards start moving simultaneously:

```javascript
// 1. Initial Measurement: Get local coordinates relative to screen center
const cards = gsap.utils.toArray(".scatter-card");
const cardParams = cards.map((card, idx) => {
  const rect = card.getBoundingClientRect();
  const targetCenterX = rect.left + rect.width / 2;
  const screenCenterX = window.innerWidth / 2;
  const targetCenterY = rect.top + rect.height / 2;
  const screenCenterY = window.innerHeight / 2;
  
  const X_c = screenCenterX - targetCenterX;
  const Y_c = screenCenterY - targetCenterY;
  
  const R_final = Math.sqrt(X_c * X_c + Y_c * Y_c);
  const theta_final = Math.atan2(-Y_c, -X_c);
  
  return { card, X_c, Y_c, R_final, theta_final };
});

// Set initial state at screen center
cardParams.forEach((param, idx) => {
  gsap.set(param.card, {
    x: param.X_c,
    y: param.Y_c,
    scale: 0.9,
    rotation: 0,
    opacity: 0,
    zIndex: 10 + idx,
  });
});

const introTl = gsap.timeline({
  defaults: { ease: "power4.out" },
  onComplete: () => {
    startFloatingIdle();
  }
});

// Phase 1: Staggered Center Pile-up (Deliberate & Premium)
talentData.forEach((card, idx) => {
  introTl.to(`.scatter-card-${idx}`, {
    opacity: 1,
    scale: 1.02,
    rotation: (idx % 2 === 0 ? 4 : -4),
    duration: 0.38,
    ease: "back.out(1.2)",
  }, idx * 0.3);
});

const scatterStart = talentData.length * 0.3 + 0.4;

// Phase 2: Synchronized Spiral Orbit Sweep (No crossovers or crossovers)
cardParams.forEach((param, idx) => {
  const loops = 0.6; // Elegant 216-degree orbit path
  const animObj = { p: 0 };
  
  introTl.to(animObj, {
    p: 1,
    duration: 2.8,
    ease: "power3.out",
    onUpdate: () => {
      const t = animObj.p;
      const R_t = param.R_final * t;
      // Archimedean Spiral path: theta(t) sweeps back from final angle
      const theta_t = param.theta_final - (2 * Math.PI * (1 - t) * loops);
      
      const x = param.X_c + R_t * Math.cos(theta_t);
      const y = param.Y_c + R_t * Math.sin(theta_t);
      
      gsap.set(param.card, {
        x,
        y,
        rotation: gsap.utils.interpolate(idx % 2 === 0 ? 4 : -4, talentData[idx].rot, t),
        scale: gsap.utils.interpolate(1.02, 1, t),
      });
    },
  }, scatterStart); // Simultaneous start ensures zero overlapping
});

// Phase 3: Bottom text fades in in parallel
introTl.fromTo(".hero-tagline, .hero-title-scramble, .hero-subtitle, .hero-cta-btn", 
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 },
  scatterStart
);
```

## Continuous Float / Hover Highlight Logic

```javascript
// Floating Drift Idle Loop
function startFloatingIdle() {
  cardParams.forEach((param, idx) => {
    const offset = idx % 2 === 0 ? 1 : -1;
    gsap.to(param.card, {
      y: `+=${10 * offset}`,
      x: `+=${5 * -offset}`,
      rotation: `+=${1.5 * offset}`,
      duration: 3.2 + idx * 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });
}

// Mouse Hover Event Handlers
const handleCardEnter = (e, color) => {
  gsap.to(e.currentTarget, {
    scale: 1.08,
    borderColor: color,
    boxShadow: `0 15px 35px ${color}20, 6px 6px 0px #2a2a2a`,
    duration: 0.3,
    overwrite: "auto",
  });
};

const handleCardLeave = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    borderColor: "#2a2a2a",
    boxShadow: "4px 4px 0px #2a2a2a",
    duration: 0.3,
    overwrite: "auto",
  });
};
```

## ScrambleText React Component

```tsx
import { useState, useEffect } from "react";

export function ScrambleText({ text, speed = 25, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let frame = 0;
    const finalLength = text.length;

    const run = () => {
      timer = setTimeout(() => {
        let current = "";
        for (let i = 0; i < finalLength; i++) {
          if (i < frame / 3) {
            current += text[i];
          } else {
            current += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(current);
        frame++;

        if (frame / 3 < finalLength) {
          run();
        } else {
          setDisplayText(text);
        }
      }, speed);
    };

    const delayTimer = setTimeout(run, delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(delayTimer);
    };
  }, [text, speed, delay]);

  return <span>{displayText}</span>;
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add circular-scatter
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
   `file:///your-project/src/components/CircularScatterGallery.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import CircularScatterGallery from "@/components/CircularScatterGallery.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <CircularScatterGallery />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `cards` (Array): A list of circular scatter card datasets.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

# How to Use: Blueprint Scatter Gallery

This guide shows you how to copy and use the **Blueprint Scatter Gallery** (where cards start stacked in the center, explode outwards to the sides of the viewport, drift continuously, and support premium hover states) as a standalone React component in Next.js or React.

## Core GSAP Animation Code

The intro animation uses a single timeline that first stacks the cards in the center and then explodes/scatters them straight outward to their layout coordinates:

```javascript
// 1. Initial State: Center-stack position
gsap.set(".scatter-card", {
  x: (i, target) => {
    const rect = target.getBoundingClientRect();
    const targetCenterX = rect.left + rect.width / 2;
    const screenCenterX = window.innerWidth / 2;
    return screenCenterX - targetCenterX;
  },
  y: (i, target) => {
    const rect = target.getBoundingClientRect();
    const targetCenterY = rect.top + rect.height / 2;
    const screenCenterY = window.innerHeight / 2;
    return screenCenterY - targetCenterY;
  },
  scale: 0.9,
  rotation: 0,
  opacity: 0,
  zIndex: (i) => 10 + i,
});

const introTl = gsap.timeline({
  defaults: { ease: "power4.out" }
});

// Phase 1: Staggered Fade-in & Pile-up at screen center
talentData.forEach((card, idx) => {
  introTl.to(`.scatter-card-${idx}`, {
    opacity: 1,
    scale: 1.02,
    rotation: (idx % 2 === 0 ? 4 : -4),
    duration: 0.35,
    ease: "back.out(1.2)",
  }, idx * 0.28);
});

// Phase 2: Explode outward to their final CSS grid/flex side spots
const scatterStart = talentData.length * 0.28 + 0.4;

introTl.to(".scatter-card", {
  x: 0,
  y: 0,
  scale: 1,
  rotation: (i) => talentData[i].rot,
  duration: 1.6,
  stagger: {
    each: 0.05,
    from: "end"
  },
  ease: "power4.out",
  onComplete: () => {
    startFloatingIdle();
  }
}, scatterStart);

// Phase 3: Centered bottom text fades in in parallel
introTl.fromTo(".hero-tagline, .hero-title-scramble, .hero-subtitle, .hero-cta-btn", 
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
  scatterStart
);
```

## Continuous Float / Hover Highlight Logic

Once the cards settle, we trigger an infinite floating drift. We also bind interactive mouse hover behaviors to scale cards up, apply color-specific shadows, and bring them to the front-most layer:

```javascript
// Floating Drift Idle Loop
function startFloatingIdle() {
  const cards = gsap.utils.toArray(".scatter-card");
  cards.forEach((card, idx) => {
    const offset = idx % 2 === 0 ? 1 : -1;
    gsap.to(card, {
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

The scramble title text effect is powered by this lightweight, self-contained custom React component:

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
npx tweenlabs@latest add blueprint-scatter
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
   `file:///your-project/src/components/BlueprintScatterGallery.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import BlueprintScatterGallery from "@/components/BlueprintScatterGallery.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <BlueprintScatterGallery />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `cards` (Array): A list of card datasets with titles, tags, custom coordinates, and hover accents.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

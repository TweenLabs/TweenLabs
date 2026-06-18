# How to Use: Screen for Skill & Fit Showcase

This guide shows you how to copy and integrate the **Screen for Skill & Fit Showcase** (featuring ScrollTrigger page pinning, sequential candidate profile transitions, and micro-animated technology staggers) as a standalone component in Next.js or React.

## Core GSAP Animation & Pinning Code

The showcase utilizes a master GSAP timeline tied to vertical scroll pinning. As the user scrolls, the mockup frame remains fixed in the center while profiles transition:

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// 1. Initial State for Stacked Cards
// First card is active at scale 1. Other cards start pushed down, scaled down, and hidden.
gsap.set(".candidate-card:not(:first-child)", {
  y: 350,
  scale: 0.9,
  opacity: 0,
  pointerEvents: "none",
});

// 2. Master ScrollTrigger Timeline
const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: pinSectionRef.current,
    pin: true,
    scrub: 0.8,
    start: "top top",
    end: "+=3200", // Pinned for 3200px of scrolling
    invalidateOnRefresh: true,
  }
});

// --- Sequence Card Transitions ---

// Transition 1: Card 0 Out, Card 1 In (progress 15% to 35%)
mainTl.to(".candidate-card-0", {
  y: -300,
  scale: 0.92,
  opacity: 0,
  rotation: -3,
  duration: 1,
  ease: "power2.inOut",
}, 0.5)
.to(".candidate-card-1", {
  y: 0,
  scale: 1,
  opacity: 1,
  rotation: 0,
  duration: 1,
  ease: "power3.out",
}, 0.6)
.fromTo(".candidate-card-1 .tech-badge-item", 
  { scale: 0, opacity: 0 },
  { scale: 1, opacity: 1, stagger: 0.08, duration: 0.8, ease: "back.out(1.5)" },
  0.9
);

// Transition 2: Card 1 Out, Card 2 In (progress 45% to 65%)
mainTl.to(".candidate-card-1", {
  y: -300,
  scale: 0.92,
  opacity: 0,
  rotation: 3,
  duration: 1,
  ease: "power2.inOut",
}, 1.8)
.to(".candidate-card-2", {
  y: 0,
  scale: 1,
  opacity: 1,
  rotation: 0,
  duration: 1,
  ease: "power3.out",
}, 1.9)
.fromTo(".candidate-card-2 .tech-badge-item", 
  { scale: 0, opacity: 0 },
  { scale: 1, opacity: 1, stagger: 0.08, duration: 0.8, ease: "back.out(1.5)" },
  2.2
);

// Transition 3: Card 2 Out, Card 3 In (progress 75% to 95%)
mainTl.to(".candidate-card-2", {
  y: -300,
  scale: 0.92,
  opacity: 0,
  rotation: -3,
  duration: 1,
  ease: "power2.inOut",
}, 3.1)
.to(".candidate-card-3", {
  y: 0,
  scale: 1,
  opacity: 1,
  rotation: 0,
  duration: 1,
  ease: "power3.out",
}, 3.2)
.fromTo(".candidate-card-3 .tech-badge-item", 
  { scale: 0, opacity: 0 },
  { scale: 1, opacity: 1, stagger: 0.08, duration: 0.8, ease: "back.out(1.5)" },
  3.5
);
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add screen-skill-fit
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
   `file:///your-project/src/components/ScreenSkillFit.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import ScreenSkillFit from "@/components/ScreenSkillFit.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <ScreenSkillFit />
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

- `steps` (Array): List of candidate checkpoints containing profile stats, score gauges, and descriptions.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)

# Screen for Skill & Fit

A scroll-pinned showcase where candidate profile cards transition in and out as you scroll. Each card has animated tech badges that pop in with a stagger. The viewport stays pinned while content changes.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add SkillFit
```

This automatically installs the component and all its dependencies. You're done!

---

## Manual Installation (Step-by-Step)

If you prefer to install manually, follow these steps:

### Step 1: Install GSAP

Open your terminal in your project folder and run:

```bash
npm install gsap @gsap/react
```

> [!TIP]
> Using pnpm? Run `pnpm add gsap @gsap/react` instead.
> Using yarn? Run `yarn add gsap @gsap/react` instead.

### Step 2: Copy the Component Code

1. Click the **"Full Component Code"** tab in the code viewer above
2. Click the **"Copy"** button in the top-right corner
3. In your project, create a new file: `src/components/tweenlabs/SkillFit.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import SkillFit from "@/components/tweenlabs/SkillFit";

export default function MyPage() {
  return (
    <main>
      <SkillFit />
    </main>
  );
}
```

### Step 4: Register GSAP Plugins

Make sure the top of your component file has these imports:

```tsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
```

---

## How the Animation Works

This section shows the core GSAP animation logic. You don't need to copy this separately — it's already included in the Full Component Code above. This is here to help you understand how it works.

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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `candidates` | `Array` | Required | Array of candidate profiles with name, skills, and scores. |

### Theme Tokens

This component uses TweenLabs' Neo-Brutalist design tokens:

| Token | Value | What It Does |
|-------|-------|-------------|
| Background | `bg-[#f0eadf]` | Warm sand-colored canvas |
| Borders | `border-3 border-[#2a2a2a]` | Bold charcoal outlines |
| Shadows | `shadow-[6px_6px_0px_#2a2a2a]` | Tactile offset drop shadows |

> [!TIP]
> You can change these values throughout the component to match your own design system. Just search and replace the hex colors.

---

## Troubleshooting

**Animation not playing?**
- Make sure you have `"use client"` at the very top of your component file
- Check that GSAP is installed: `npm list gsap`

**Component not rendering?**
- Verify the import path matches your file location
- Make sure you're using React 18+ or 19

**ScrollTrigger not working?**
- Make sure you imported and registered ScrollTrigger (see Step 4)
- Check that your component has enough scroll height (the page must be scrollable)
- Try adding `ScrollTrigger.refresh()` after dynamic content loads

**Styling looks wrong?**
- This component uses Tailwind CSS utility classes
- Make sure Tailwind is installed and configured in your project

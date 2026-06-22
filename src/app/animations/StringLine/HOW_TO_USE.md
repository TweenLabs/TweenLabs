# String Line Network

An SVG network of connected nodes and lines that draws itself as you scroll. Nodes scale up when they're near the center of the viewport. Creates a tech/data visualization aesthetic.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add StringLine
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
3. In your project, create a new file: `src/components/tweenlabs/StringLine.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import StringLine from "@/components/tweenlabs/StringLine";

export default function MyPage() {
  return (
    <main>
      <StringLine />
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

### Core GSAP Animation Code
```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const path = document.querySelector("#network-path");
const dot = document.querySelector(".moving-dot");
const cards = document.querySelectorAll(".im-card");

const pathLength = path.getTotalLength();

// Hide path initially using dasharray properties
gsap.set(path, {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength,
});

// Map SVG coordinates to find the nearest timeline scroll progress for each card
const cardCenters = Array.from(cards).map((card) => {
  const xPct = parseFloat(card.style.left) / 100;
  const yPct = parseFloat(card.style.top) / 100;
  return { svgX: xPct * 1600, svgY: yPct * 900, card };
});

const SAMPLES = 600;
const pathSamples = [];
for (let i = 0; i <= SAMPLES; i++) {
  const t = (i / SAMPLES) * pathLength;
  const pt = path.getPointAtLength(t);
  pathSamples.push({ t: i / SAMPLES, x: pt.x, y: pt.y });
}

const cardProgressMap = cardCenters.map(({ svgX, svgY, card }) => {
  let closestProgress = 0;
  let closest = Infinity;
  for (const sample of pathSamples) {
    const dist = (sample.x - svgX) ** 2 + (sample.y - svgY) ** 2;
    if (dist < closest) {
      closest = dist;
      closestProgress = sample.t;
    }
  }
  return { card, progress: closestProgress };
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "+=3000",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress;

      // Proximity scaling and color shifting based on dot distance
      cardProgressMap.forEach(({ card, progress: cardProg }, index) => {
        const activationWindow = 0.06;
        const proximity = Math.max(0, 1 - Math.abs(progress - cardProg) / activationWindow);
        const scale = progress >= cardProg ? 1.08 : 0.85 + 0.23 * proximity;
        
        const colorInterpolator = gsap.utils.interpolate("#ffffff", "#FFE5EC");
        const backgroundColor = colorInterpolator(progress >= cardProg ? 1 : proximity);

        gsap.set(card, { scale, backgroundColor });
      });
    },
  },
});

// Draw path SVG strokes on scroll
tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);

// Align dot position along the dynamic path
tl.to(dot, {
  motionPath: {
    path: path,
    align: path,
    alignOrigin: [0.5, 0.5],
  },
  ease: "none",
}, 0);
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `Array` | Required | Array of node data with positions and labels. |
| `connections` | `Array` | Required | Array of connection pairs between nodes. |

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

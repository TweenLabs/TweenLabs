# Blueprint Scatter Gallery

Cards start stacked in the center of the screen, then explode outward to their positions. After settling, cards gently float. Hover any card to scale it up with a colored shadow.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add Blueprint
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
3. In your project, create a new file: `src/components/tweenlabs/Blueprint.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import Blueprint from "@/components/tweenlabs/Blueprint";

export default function MyPage() {
  return (
    <main>
      <Blueprint />
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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `Array` | Required | Array of card data with titles, tags, coordinates, and accent colors. |

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

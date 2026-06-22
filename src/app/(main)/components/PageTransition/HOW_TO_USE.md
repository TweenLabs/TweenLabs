# Page Transition

Stacked colored sections that peel away as you scroll. Each section slides up and overlaps the previous one with dynamic skewing, creating a premium page-peel transition effect.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add PageTransition
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
3. In your project, create a new file: `src/components/tweenlabs/PageTransition.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import PageTransition from "@/components/tweenlabs/PageTransition";

export default function MyPage() {
  return (
    <main>
      <PageTransition />
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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `Array` | Required | Array of page sections with title, content, and background color. |

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

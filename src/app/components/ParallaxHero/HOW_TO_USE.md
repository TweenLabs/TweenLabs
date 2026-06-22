# Parallax Hero

A multi-layer hero section where background and foreground elements move at different speeds as you scroll, creating a sense of depth. Text characters scatter in on page load.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add ParallaxHero
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
3. In your project, create a new file: `src/components/tweenlabs/ParallaxHero.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import ParallaxHero from "@/components/tweenlabs/ParallaxHero";

export default function MyPage() {
  return (
    <main>
      <ParallaxHero />
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
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

// SplitText character scatter entrance
SplitText.create(".headline", {
  type: "chars",
  autoSplit: true,
  onSplit(self) {
    gsap.set(self.chars, { autoAlpha: 0, y: 80 });
    return gsap.to(self.chars, {
      autoAlpha: 1, y: 0, duration: 0.8,
      stagger: { from: "random", each: 0.03 },
      ease: "back.out(1.5)",
    });
  },
});

// Parallax layers at different speeds
layers.forEach((layer) => {
  gsap.to(layer.element, {
    y: -200 * layer.speed,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
  });
});
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Hero heading text. |
| `subtitle` | `string` | '' | Secondary text below the heading. |
| `layers` | `number` | 3 | Number of parallax depth layers. |

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

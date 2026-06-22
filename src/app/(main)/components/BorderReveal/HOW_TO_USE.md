# Border Reveal Text

Large text scrolls horizontally across the screen. As you scroll down, individual letters fly in from the top and bottom edges of the screen, assembling into words.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add BorderReveal
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
3. In your project, create a new file: `src/components/tweenlabs/BorderReveal.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import BorderReveal from "@/components/tweenlabs/BorderReveal";

export default function MyPage() {
  return (
    <main>
      <BorderReveal />
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
const horizontalTween = gsap.to(textTrack, {
  x: () => -(textTrack.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: scrollSection,
    pin: true,
    scrub: 1,
  },
});

chars.forEach((char) => {
  const startY = -window.innerHeight * 0.9;
  const startRot = -35;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: char,
      containerAnimation: horizontalTween,
      start: "left right",
      end: "right left",
      scrub: true,
    },
  });

  tl.fromTo(char, { y: startY, rotation: startRot, opacity: 0, scale: 0.6 }, { y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" })
    .to(char, { y: -15, rotation: 4, scale: 1.03, duration: 0.15, ease: "sine.inOut" })
    .to(char, { y: 15, rotation: -4, scale: 0.97, duration: 0.15, ease: "sine.inOut" })
    .to(char, { y: -startY, rotation: -startRot, opacity: 0, scale: 0.6, duration: 0.35, ease: "power3.in" });
});
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Required | The text to display and animate. |
| `speed` | `number` | 1 | Animation speed multiplier. |

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

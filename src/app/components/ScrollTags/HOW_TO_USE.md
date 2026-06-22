# Scroll Tags

Tags/badges fly in from all directions (left, right, top, bottom) and land in a grid as you scroll. Creates an energetic, dynamic entrance effect for skill badges or feature tags.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add ScrollTags
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
3. In your project, create a new file: `src/components/tweenlabs/ScrollTags.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import ScrollTags from "@/components/tweenlabs/ScrollTags";

export default function MyPage() {
  return (
    <main>
      <ScrollTags />
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
    scrub: 1,
    start: "top top",
    end: "+=1500",
  },
});

tags.forEach((tag, idx) => {
  const xStart = Number(tag.getAttribute("data-xs") || 0);
  const yStart = Number(tag.getAttribute("data-ys") || 0);
  const rotate = Number(tag.getAttribute("data-rot") || 0);

  tl.fromTo(
    tag,
    { x: xStart, y: yStart, rotation: rotate * 3, opacity: 0, scale: 0.2 },
    { x: 0, y: 0, rotation: rotate, opacity: 1, scale: 1, ease: "power2.out" },
    idx * 0.15
  );
});
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `Array` | Required | Array of tag strings to animate. |
| `columns` | `number` | 4 | Number of grid columns for the tags. |

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

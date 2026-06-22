# Accordion

A vertical accordion component where clicking a section opens it with smooth animation. The page background color morphs to match the selected section, and inner content staggers in.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add Accordion
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
3. In your project, create a new file: `src/components/tweenlabs/Accordion.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import Accordion from "@/components/tweenlabs/Accordion";

export default function MyPage() {
  return (
    <main>
      <Accordion />
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
const handleToggle = (index) => {
  const isExpanding = activeIndex !== index;
  const activeItem = accordionItems[index];

  // Morph background container
  gsap.to(containerRef.current, {
    backgroundColor: isExpanding ? activeItem.bgTint : "#f0eadf",
    duration: 0.5,
    ease: "power2.out",
  });

  // Morph card border & shadow accent
  gsap.to(cardRef.current, {
    borderColor: isExpanding ? activeItem.color : "#2a2a2a",
    boxShadow: isExpanding
      ? `8px 8px 0px ${activeItem.color}`
      : "6px 6px 0px #2a2a2a",
    duration: 0.5,
    ease: "power2.out",
  });

  // Animate panel heights & details stagger
  accordionItems.forEach((_, idx) => {
    const el = contentRefs.current[idx];
    if (!el) return;

    const shouldExpand = isExpanding && idx === index;

    if (shouldExpand) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        marginTop: 16,
        duration: 0.45,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      // Stagger list elements inside the expanding content panel
      const listItems = el.querySelectorAll(".accordion-detail-item");
      gsap.fromTo(
        listItems,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.1,
          overwrite: "auto",
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.35,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }
  });
};
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `Array` | Required | Array of accordion items with title, content, and color. |
| `defaultOpen` | `number` | 0 | Index of the section open by default. |

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

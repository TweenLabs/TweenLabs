# Gravity Drop

Letters of a word fall from the top of the screen one-by-one and land on a shelf/baseline with a realistic physics bounce effect. Simple and eye-catching hero text animation.


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add GravityDrop
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
3. In your project, create a new file: `src/components/tweenlabs/GravityDrop.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import GravityDrop from "@/components/tweenlabs/GravityDrop";

export default function MyPage() {
  return (
    <main>
      <GravityDrop />
    </main>
  );
}
```

### Step 4: Register GSAP Plugins

Make sure the top of your component file has these imports:

```tsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
```

---

## How the Animation Works

This section shows the core GSAP animation logic. You don't need to copy this separately — it's already included in the Full Component Code above. This is here to help you understand how it works.

### Core GSAP Animation Code
```javascript
gsap.fromTo(
  ".falling-letter",
  {
    y: -400,
    rotation: () => gsap.utils.random(-90, 90),
    opacity: 0,
    scale: 2,
  },
  {
    y: 0,
    rotation: 0,
    opacity: 1,
    scale: 1,
    duration: 1.2,
    stagger: {
      each: 0.08,
      from: "random",
    },
    ease: "bounce.out",
  }
);
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Required | The word or phrase to drop. |
| `delay` | `number` | 0.1 | Stagger delay between each letter in seconds. |
| `bounce` | `number` | 0.4 | Bounce intensity (0 = no bounce, 1 = max bounce). |

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


**Styling looks wrong?**
- This component uses Tailwind CSS utility classes
- Make sure Tailwind is installed and configured in your project

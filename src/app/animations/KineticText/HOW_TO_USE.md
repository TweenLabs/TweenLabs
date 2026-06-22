# Kinetic Text

Interactive text animation with multiple modes — liquid wave (letters ripple), character scramble (letters randomize then resolve), and magnetic motion (letters attract toward cursor).


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add KineticText
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
3. In your project, create a new file: `src/components/tweenlabs/KineticText.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import KineticText from "@/components/tweenlabs/KineticText";

export default function MyPage() {
  return (
    <main>
      <KineticText />
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
  ".wave-char",
  { y: 15, rotate: -6, scale: 0.95 },
  {
    y: -15,
    rotate: 6,
    scale: 1.05,
    duration: 0.6 / speed,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: {
      each: 0.08,
      from: "start",
    },
  }
);
```

## 2. Cyber Scramble Mode
Scrambles letters using temporary random characters before sequentially decoding them to reveal the final text.

### Core GSAP Animation Code (JS Scramble Logic)
```javascript
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const textArray = text.toUpperCase().split("");

textArray.forEach((originalChar, index) => {
  if (originalChar === " ") return;
  
  let scrambleCount = 0;
  const maxScrambles = 8 + Math.floor(Math.random() * 8) + index;
  const intervalTime = 40 / speed;

  const interval = setInterval(() => {
    if (scrambleCount >= maxScrambles) {
      targetElement.textContent = originalChar;
      clearInterval(interval);
    } else {
      targetElement.textContent = chars[Math.floor(Math.random() * chars.length)];
      scrambleCount++;
    }
  }, intervalTime);
});
```

## 3. Magnetic Push Mode
Letters dynamically react to the user's mouse pointer coordinates, tilting, rotating, and scaling away from the cursor.

### Core GSAP Animation Code (Magnetic Math + Tween)
```javascript
const deltaX = mouseX - charCenterX;
const deltaY = mouseY - charCenterY;
const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
const maxDistance = 120;

if (distance < maxDistance) {
  const force = (maxDistance - distance) / maxDistance;
  
  // Push away offset vectors
  const moveX = -(deltaX / distance) * force * 25;
  const moveY = -(deltaY / distance) * force * 25;
  const angle = -(deltaX / distance) * force * 20;

  gsap.to(charElement, {
    x: moveX,
    y: moveY,
    rotate: angle,
    scale: 1 + force * 0.15,
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto",
  });
} else {
  gsap.to(charElement, {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto",
  });
}
```

## 4. Liquid Warp Mode
Applies an SVG turbulence noise displacement filter over the text and animates it in a looping ripple cycle.

### Core GSAP Animation Code
```javascript
const tl = gsap.timeline({ repeat: -1, yoyo: true });

tl.to("#displacement-map", {
  attr: { scale: 40 },
  duration: 1.5 / speed,
  ease: "power1.inOut",
})
.to("#turbulence-noise", {
  attr: { baseFrequency: "0.03 0.08" },
  duration: 1.5 / speed,
  ease: "power1.inOut",
}, "<");
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Required | The text to animate. |
| `mode` | `string` | 'wave' | Animation mode: 'wave', 'scramble', or 'magnetic'. |

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

# 🌌 GSAP Animation Playground

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.7-black?logo=nextdotjs)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)

A high-fidelity, interactive Neo-Brutalist animation playground built on **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**. This repository houses premium, production-ready GSAP scroll triggers, magnetic mechanics, 3D physics widgets, and layout transitions.

---

## 🚀 Key Feature: Single-File Portability

Every route animation is **entirely self-contained** within its own single `page.tsx` file (located under `/src/app/`). 

*   **No Dependency Hunting**: You do not need to track down external sub-components or local CSS utilities. 
*   **Plug-and-Play**: To use any effect on your own site, simply copy-paste that single page file, install `gsap` and `@gsap/react`, and you're good to go!

---

## 🎨 Available Sandboxes

### 1. Classic Parallax Stack (`/16b-scroll-cards-classic`)
A scroll-pinned classic overlapping card deck utilizing coordinate-based y-parallax translations.
*   **Key Techniques**: ScrollTrigger pinning, scroll offset interpolation, custom 3D card tilt on hover, radial spotlight gradient overlays.
*   **Modularity**: Cards adjust spacing dynamically to keep badges visible at all times and unpin simultaneously.

### 2. Modern Stacking Cards (`/16-scroll-cards-01`)
Minimalist stacked card layout that overlaps sections in clean cards, with scroll progress markers on the side.
*   **Key Techniques**: Viewport clamping (`height: 65vh`), ScrollTrigger bounds (`top 8%`).

### 3. SVG String Network (`/18-string-line`)
A scroll-triggered interactive web connection network that scales and highlights nodes based on path proximity.
*   **Key Techniques**: GSAP `MotionPathPlugin` alignment, `ScrollTrigger` scrub, custom 3D card tilts, active pulsing halos.

### 4. Bento Grid Tilt (`/13-bento-grid-flip`)
A responsive bento-box dashboard layout showing tech stacks, containing 3D mouse rotation triggers.
*   **Key Techniques**: $\pm 6^\circ$ Y/X coordinate mouse-tilt, hover border transitions, backdrop filters.

### 5. 3D Coverflow Carousel (`/14-3d-carousel`)
An interactive 3D mathematical wheel rotation carousel built with drag physics.
*   **Key Techniques**: Pointer drag inertia calculations, keyboard arrow navigations, and GSAP details panel expansion.

---

## 💻 Tech Stack
*   **Core**: Next.js 16 (App Router), React 19, TypeScript
*   **Animation**: GSAP 3 (`@gsap/react` hooks, `ScrollTrigger`, `MotionPathPlugin`)
*   **Styles**: Tailwind CSS v4 (using `@import "tailwindcss"`)
*   **Scroll**: Lenis smooth scrolling

---

## 🛠️ Getting Started

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-username/gsap-playground.git
cd gsap-playground
```

Install the dependencies using your package manager of choice:

```bash
pnpm install
# or
npm install
# or
yarn install
```

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive playground directory.

---

## 📦 Copy-Pasting Code
To integrate an animation into your own React/Next.js codebase:
1. Locate the route folder under `/src/app/` (e.g. `/src/app/18-string-line/page.tsx`).
2. Copy the file contents.
3. Install GSAP and `@gsap/react` in your project:
   ```bash
   npm install gsap @gsap/react
   ```
4. Paste the file as a component or page route. Replace any static image paths (`/Untitled design.png` etc.) with your own asset URLs.

---

## 🤝 How to Contribute

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### 🍴 The Contribution Workflow

1.  **Fork the Project**: Click the **Fork** button at the top right of this repository page to create a copy of the project in your own GitHub account.
2.  **Clone your Fork**:
    ```bash
    git clone https://github.com/your-username/gsap-playground.git
    cd gsap-playground
    ```
3.  **Create your Feature Branch**:
    ```bash
    git checkout -b feature/amazing-animation
    ```
4.  **Implement & Refine**: Build your animation inside a new `/src/app/xx-your-animation/page.tsx` folder. Make sure your page is self-contained!
5.  **Validate Compile Safety**: Make sure the build compiles cleanly with zero TypeScript warnings before committing:
    ```bash
    pnpm build
    ```
6.  **Commit your Changes**:
    ```bash
    git commit -m 'feat: add amazing new GSAP scroll transition'
    ```
7.  **Push to the Branch**:
    ```bash
    git push origin feature/amazing-animation
    ```
8.  **Open a Pull Request**: Head over to the original repository and submit a pull request from your feature branch. We'll review and merge it!

### 📝 Submission Guidelines
*   Keep the animations self-contained in a single page file.
*   Document the GSAP techniques used in comments at the top of the file.
*   Make sure designs align with the Neo-Brutalist or modern glassmorphic look!

---

## 📄 License
This project is licensed under the **MIT License** — feel free to use, modify, and distribute these animations in personal and commercial projects!

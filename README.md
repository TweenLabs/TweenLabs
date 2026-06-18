<!-- SEO Meta Block — paste this in your Next.js layout.tsx or head -->
<!--
title: TweenLabs — Premium Open Source GSAP Component Library for Next.js
description: A free, open-source GSAP animation component library and UI template sandbox built with Next.js 16, React 19, and Lenis. Learn and build modern web animations with reusable, copy-paste ready components.
keywords: TweenLabs, GSAP component library, GSAP Next.js, GSAP animations React, open source animation library, web animation components, Lenis smooth scroll, GSAP ScrollTrigger components, Next.js animation library
-->

# <img src="public/logo.svg" alt="TweenLabs Logo" width="40" height="40" align="center" /> TweenLabs


> The open-source **GSAP animation component library** for Next.js developers — learn, copy, and contribute modern web animation patterns built with **GSAP 3.15**, **Next.js 16**, and **Lenis**.

**[Live Demo](https://tweenlabs.xyz)** • **[Contributing Guide](#contributing)** • **[Roadmap](#roadmap)**  

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

<!-- [Contributors](https://img.shields.io/github/contributors/GSAP-PLAYGROUND/TweenLabs?style=flat-square) -->

---

## What is TweenLabs?

**TweenLabs** is a community-driven, open-source collection of reusable GSAP animation components for Next.js and React. Every component is production-ready, well-documented, and built to help developers understand *how* advanced web animations work — not just copy code blindly.

No paid plugins. No locked content. Just clean, modern animation patterns anyone can learn from and build on.

> 🔍 **Looking for a GSAP component library for Next.js?** You found it.

---

## ✨ Animation Components

| Component | Description | GSAP Features Used |
|-----------|-------------|-------------------|
| **Gravity Drop** | Physics-based falling animations with realistic bounce | `gsap.to`, `ease`, stagger |
| **Scroll-Triggered Assemblies** | Content reveals synced with scroll position | ScrollTrigger |
| **Border Reveal Effects** | Inward/outward border animations | Timeline, `clipPath` |
| **Horizontal Card Showcase** | Smooth carousel and card transitions | ScrollTrigger, `x` transforms |
| **Page Transitions** | Seamless route change animations | Timeline, Next.js router |
| **Smooth Scrolling** | Native-feel smooth scroll | Lenis + GSAP ticker |

> More components added with every contribution. [See full list →](https://tweenlabs.xyz)

---

## 🛠 Tech Stack

- **[Next.js 16](https://nextjs.org/)** – React framework with SSR and App Router
- **[GSAP 3.15](https://gsap.com/)** – Industry-standard JavaScript animation library
- **[React 19](https://react.dev/)** – Modern component-based UI
- **[Lenis 1.3](https://github.com/darkroom-digital/lenis)** – Buttery smooth scroll
- **[Tailwind CSS 4](https://tailwindcss.com/)** – Utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** – Full type safety

---

## 🚀 Quick Start

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Clone and run
git clone https://github.com/GSAP-PLAYGROUND/TweenLabs.git
cd TweenLabs
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — pick any animation card and start exploring.

---

## 🤝 Contributing

TweenLabs grows with the community. We welcome new components, bug fixes, docs, performance improvements, and accessibility enhancements.

### Steps

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/TweenLabs.git

# 2. Create a branch
git checkout -b feat/your-animation-name

# 3. Install & run
pnpm install && pnpm dev

# 4. Make changes, then commit
git commit -m "feat: add [animation name]"

# 5. Push and open a PR
git push origin feat/your-animation-name
```

### Adding a New Component

- Follow the folder pattern: `src/app/XX-component-name/`
- Include a `page.tsx` with your animation
- Add inline comments explaining the GSAP logic
- Reference `gsapskills.md` for best practices

### Good First Contributions

- ✅ Add explanatory comments to existing animations
- ✅ Test on mobile/tablet and report issues
- ✅ Create animation variants with different easing curves
- ✅ Improve accessibility (`prefers-reduced-motion`, ARIA)
- ✅ Write or improve docs

### Code Guidelines

- Use CSS transforms (`x`, `y`, `scale`) — never layout properties
- Always respect `prefers-reduced-motion`
- TypeScript only — no `any` types
- Write descriptive commit messages

---

## 🗺 Roadmap

- [ ] Export as npm package (`@tweenlabs/components`)
- [ ] Storybook integration for isolated component previews
- [ ] Unit tests for animation logic
- [ ] FLIP, Draggable, MorphSVG animation patterns
- [ ] Community showcase gallery
- [ ] Animation starter templates for common use cases

---

## 📚 Learn More

New to GSAP? These resources pair perfectly with this repo:

- [GSAP Official Docs](https://gsap.com/docs/) — start here
- [GSAP + React Guide](https://gsap.com/resources/React/) — useGSAP hook
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — scroll animations
- [Next.js Docs](https://nextjs.org/docs) — framework reference
- [Lenis Docs](https://lenis.studiofreight.com/) — smooth scroll setup

---

## 📜 License

[MIT](LICENSE) — free to use in personal and commercial projects.

---

## 🌟 Contributors

Thanks to everyone building this together. ❤️

<!-- Add contributor grid here once you have 5+ contributors -->

---

**Built in public. Animated with love. Open to all. 🚀**

<!-- 
SEARCH TAGS (do not remove — improves GitHub discoverability):
tweenlabs, gsap animation library, gsap component library, gsap nextjs, gsap react components,
open source animation, web animation components, lenis smooth scroll, scrolltrigger examples,
next.js animation, gsap copy paste components, gsap learning, gsap playground
-->

# GSAP Agent Skills Reference

This document serves as a prompt helper/reference for AI coding assistants (like Antigravity, Claude Code, Cline, etc.) working on this project. By referencing these local paths, the agent can use best practices for GSAP animations without wasting tokens downloading or re-reading rules.

## Local Installation Path
The GSAP skills are installed locally on the system at:
`C:\Users\Ritesh Sinha\.agents\skills\`

---

## Available GSAP Skills & Rules

### 1. Core Animations (`gsap-core`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-core\`
- **Key Guidelines:** Basics of tweens, proper easing functions (e.g., `"power2.out"`), and avoiding plain string ease definitions. Ensure staggers are configured efficiently.

### 2. Timelines (`gsap-timeline`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-timeline\`
- **Key Guidelines:** Creating nested timelines, sequencing, and using relative labels (`"<"` or `"+=0.5"`) instead of absolute delays.

### 3. ScrollTrigger (`gsap-scrolltrigger`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-scrolltrigger\`
- **Key Guidelines:** Implementing scroll-driven animations, pinning, scroll scrub, toggleActions, and optimizing scroll performance. Ensure correct cleanup of ScrollTrigger instances when components unmount.

### 4. Next.js & TypeScript Integration (`gsap-react` & `gsap-frameworks`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-react\` & `gsap-frameworks\`
- **Key Guidelines:** Integrating GSAP with Next.js and TypeScript correctly:
  - **SSR Safety:** Next.js is SSR-by-default. Any component using GSAP must include the `"use client"` directive at the top.
  - **Use `useGSAP()` Hook:** Always use the `@gsap/react` hook `useGSAP()` for context/scope-safe animations.
  - **Strict Mode Compatibility:** Avoid using standard `useEffect` for GSAP initialization to prevent double-initialization bugs in Next.js/React Strict Mode.
  - **TypeScript Typing:**
    - Type DOM container refs properly, e.g., `const container = useRef<HTMLDivElement>(null);`.
    - Pass the typed scope ref to the hook: `useGSAP(() => { ... }, { scope: container });`.
    - Type persistent timelines correctly: `const tl = useRef<gsap.core.Timeline | null>(null);`.

### 5. Performance Optimization (`gsap-performance`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-performance\`
- **Key Guidelines:** Animating CSS transforms (`x`, `y`, `rotation`, `scale`) instead of layout properties (`top`, `left`, `width`, `height`). Utilizing `autoAlpha` instead of `opacity` for performance and hiding invisible elements.

### 6. Plugins (`gsap-plugins`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-plugins\`
- **Key Guidelines:** Configuration and usage of GSAP plugins (e.g., DrawSVG, SplitText, MotionPath).

### 7. Frameworks & Next.js Specifics (`gsap-frameworks`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-frameworks\`
- **Key Guidelines:** Framework integrations. For Next.js, ensure any registry and plugin registration (`gsap.registerPlugin(...)`) only runs on the client-side, and ensure animations target hydration-safe elements.

### 8. Utilities (`gsap-utils`)
- **Location:** `C:\Users\Ritesh Sinha\.agents\skills\gsap-utils\`
- **Key Guidelines:** Leveraging GSAP utility methods (e.g., `gsap.utils.mapRange()`, `gsap.utils.interpolate()`).

---

## AI Agent Instruction
> [!IMPORTANT]
> **AI Coding Agent:** When writing, editing, or refactoring animations in this project, do not make network requests or guess the rules. Refer directly to the Markdown guidelines located in the local folders above to ensure clean, performant, and standard-compliant GSAP code.

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title:
    "GSAP vs Framer Motion: Which Animation Library Should You Use in 2025? | TweenLabs",
  description:
    "An in-depth comparison of GSAP and Framer Motion for React and Next.js. Performance benchmarks, API design, ScrollTrigger, timeline control, and when to use each library.",
  keywords: [
    "GSAP vs Framer Motion",
    "GSAP vs Framer Motion 2025",
    "best React animation library",
    "GSAP React comparison",
    "Framer Motion alternatives",
    "GSAP ScrollTrigger vs Framer Motion",
    "web animation library comparison",
    "React animation performance",
  ],
  alternates: {
    canonical: siteConfig.fullUrl("/blog/gsap-vs-framer-motion"),
  },
  openGraph: {
    title: "GSAP vs Framer Motion: Which Should You Use in 2025?",
    description:
      "In-depth comparison of GSAP and Framer Motion for React & Next.js. Performance, API, ScrollTrigger, and real-world examples.",
    url: siteConfig.fullUrl("/blog/gsap-vs-framer-motion"),
    type: "article",
  },
};

const comparisons = [
  {
    category: "Performance",
    gsap: "Runs on requestAnimationFrame with automatic batching. Zero layout thrashing. Handles 1000+ concurrent animations without frame drops. Industry benchmark for complex timelines.",
    framer:
      "Built on React's render cycle. Good for simple animations but can cause re-renders with complex orchestrations. Spring physics are computed per-frame.",
    verdict: "GSAP",
    detail:
      "GSAP is faster for complex animations. Framer Motion is fine for simple UI transitions.",
  },
  {
    category: "Scroll Animations",
    gsap: "ScrollTrigger is the most powerful scroll-animation engine available. Pin elements, scrub timelines, create parallax effects, snap to sections — all with battle-tested performance.",
    framer:
      "useScroll hook + useTransform provides basic scroll-linked animations. No built-in pinning, snapping, or complex scrubbing. Often paired with Intersection Observer for triggers.",
    verdict: "GSAP",
    detail:
      "ScrollTrigger is leagues ahead. If you need scroll animations, GSAP is the clear choice.",
  },
  {
    category: "API Design",
    gsap: "Imperative API with method chaining. gsap.to(), gsap.from(), gsap.timeline(). Requires understanding of the animation model but offers precise control.",
    framer:
      "Declarative API with JSX props. <motion.div animate={{x: 100}} />. More React-idiomatic. Easier learning curve for React developers.",
    verdict: "Framer Motion",
    detail:
      "Framer Motion's declarative API is more intuitive for React devs. GSAP requires more setup but rewards with more control.",
  },
  {
    category: "Timeline & Sequencing",
    gsap: "Full timeline control with labels, nested timelines, position parameters, and .addPause(). Can seek, reverse, speed up, or loop any point in a sequence.",
    framer:
      "orchestrate with staggerChildren and delayChildren in variants. No true timeline — you define sequences through parent-child variant propagation.",
    verdict: "GSAP",
    detail:
      "GSAP's timeline is unmatched for complex, multi-step animation sequences.",
  },
  {
    category: "Bundle Size",
    gsap: "~26KB (core) + ~13KB (ScrollTrigger). Tree-shakeable. Plugins load separately.",
    framer:
      "~32KB for the full package. Includes layout animations, gestures, and AnimatePresence.",
    verdict: "Tie",
    detail:
      "Similar bundle sizes. Both are reasonable for modern web projects.",
  },
  {
    category: "Next.js App Router",
    gsap: 'Works in client components with the @gsap/react useGSAP hook. Requires "use client" directive. Auto-cleanup on unmount.',
    framer:
      'Works in client components with motion components. Requires "use client" directive. AnimatePresence works with route changes.',
    verdict: "Tie",
    detail:
      "Both work well with Next.js App Router. Framer Motion has slightly better exit animation support.",
  },
  {
    category: "SVG & 3D Transforms",
    gsap: "Native SVG morphing, drawSVG, motionPath plugins. Full 3D transform support with perspective. MorphSVG can interpolate between any two SVG shapes.",
    framer:
      "Basic SVG animation via pathLength. No built-in SVG morphing. 3D transforms supported but without the depth of GSAP's plugin ecosystem.",
    verdict: "GSAP",
    detail:
      "GSAP's SVG and 3D plugin ecosystem is significantly more powerful.",
  },
];

export default function GsapVsFramerMotionPage() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <article className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-20">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-wider text-[#e55b3c] font-bold hover:underline"
            >
              ← Blog
            </Link>
            <span className="font-mono text-xs text-[#999]">•</span>
            <time
              dateTime="2025-06-22"
              className="font-mono text-xs text-[#999] uppercase"
            >
              June 2025
            </time>
          </div>
          <h1 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight mb-6">
            GSAP vs Framer Motion
            <br />
            <span className="text-[#e55b3c]">Which Should You Use?</span>
          </h1>
          <p className="text-lg text-[#555] max-w-3xl leading-relaxed">
            Both GSAP and Framer Motion are excellent animation libraries for
            React. But they solve different problems. This guide breaks down
            every key difference to help you pick the right tool for your
            project.
          </p>
        </header>

        {/* TL;DR */}
        <section className="bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] p-6 md:p-8 rounded-lg shadow-[6px_6px_0px_#e55b3c] mb-12">
          <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-[#f1b333] mb-4">
            TL;DR
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <strong className="text-[#f1b333]">Choose GSAP</strong> → Complex
              timelines, scroll animations, SVG morphing, 3D transforms,
              high-performance orchestration
            </li>
            <li>
              <strong className="text-[#f1b333]">Choose Framer Motion</strong> →
              Simple UI transitions, layout animations, exit animations
              (AnimatePresence), quick prototyping
            </li>
            <li>
              <strong className="text-[#f1b333]">Use both</strong> → GSAP for
              complex scroll sections, Framer Motion for UI micro-interactions
            </li>
          </ul>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
            Feature-by-Feature Comparison
          </h2>

          <div className="space-y-6">
            {comparisons.map((comp) => (
              <div
                key={comp.category}
                className="bg-white border-2 border-[#2a2a2a] rounded-lg shadow-[4px_4px_0px_#2a2a2a] overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-3 bg-[#f7f3ec] border-b-2 border-[#2a2a2a]">
                  <h3 className="font-mono font-bold text-sm uppercase tracking-wider">
                    {comp.category}
                  </h3>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border-2 border-[#2a2a2a] ${
                      comp.verdict === "GSAP"
                        ? "bg-[#0c9367] text-white"
                        : comp.verdict === "Framer Motion"
                          ? "bg-[#6758a5] text-white"
                          : "bg-[#f1b333] text-[#2a2a2a]"
                    }`}
                  >
                    Winner: {comp.verdict}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#eee]">
                  <div className="p-5">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#0c9367] mb-2">
                      GSAP
                    </div>
                    <p className="text-xs text-[#555] leading-relaxed">
                      {comp.gsap}
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#6758a5] mb-2">
                      Framer Motion
                    </div>
                    <p className="text-xs text-[#555] leading-relaxed">
                      {comp.framer}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-[#faf8f4] border-t border-[#eee]">
                  <p className="text-xs text-[#777] italic">{comp.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-12">
          <h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
            Code Comparison
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#2a2a2a] rounded-lg shadow-[4px_4px_0px_#2a2a2a] overflow-hidden">
              <div className="px-4 py-2 bg-[#0c9367] text-white font-mono text-xs font-bold uppercase border-b-2 border-[#2a2a2a]">
                GSAP — Fade In on Scroll
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto bg-[#1a1a1a] text-[#e0e0e0]">
                {`useGSAP(() => {
  gsap.from(".card", {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".cards",
      start: "top 80%",
    },
  });
}, { scope: containerRef });`}
              </pre>
            </div>

            <div className="bg-white border-2 border-[#2a2a2a] rounded-lg shadow-[4px_4px_0px_#2a2a2a] overflow-hidden">
              <div className="px-4 py-2 bg-[#6758a5] text-white font-mono text-xs font-bold uppercase border-b-2 border-[#2a2a2a]">
                Framer Motion — Fade In on Scroll
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto bg-[#1a1a1a] text-[#e0e0e0]">
                {`<motion.div
  initial={{ y: 60, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{
    duration: 0.8,
    delay: index * 0.15,
  }}
  viewport={{ once: true }}
>
  <Card />
</motion.div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* When to Use */}
        <section className="mb-12">
          <h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
            When to Use Each Library
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#2a2a2a] p-6 rounded-lg shadow-[4px_4px_0px_#0c9367]">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3 text-[#0c9367]">
                Use GSAP When You Need...
              </h3>
              <ul className="space-y-2 text-sm text-[#555]">
                <li>✦ Scroll-pinned sections and parallax effects</li>
                <li>✦ Complex multi-step timelines</li>
                <li>✦ SVG morphing and path animations</li>
                <li>✦ 3D transforms with perspective</li>
                <li>✦ High-fidelity, frame-perfect animations</li>
                <li>✦ Physics-based motion (inertia, spring)</li>
                <li>✦ 60fps with 100+ animated elements</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#2a2a2a] p-6 rounded-lg shadow-[4px_4px_0px_#6758a5]">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3 text-[#6758a5]">
                Use Framer Motion When You Need...
              </h3>
              <ul className="space-y-2 text-sm text-[#555]">
                <li>✦ Quick UI state transitions</li>
                <li>✦ Layout animations (shared layout)</li>
                <li>✦ Exit animations (AnimatePresence)</li>
                <li>✦ Gesture-driven animations (drag, hover)</li>
                <li>✦ Rapid prototyping</li>
                <li>✦ Declarative API for small teams</li>
                <li>✦ Simple spring-based micro-interactions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] p-8 md:p-12 rounded-lg shadow-[6px_6px_0px_#f1b333] text-center">
          <h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">
            Ready to Use GSAP?
          </h2>
          <p className="text-[#aaa] mb-6 max-w-xl mx-auto">
            TweenLabs has 22+ free, production-ready GSAP components for React
            and Next.js. Copy-paste or install via CLI.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/best-gsap-components"
              className="inline-block bg-[#f1b333] text-[#2a2a2a] font-mono font-bold text-sm px-8 py-3 rounded-lg border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 uppercase tracking-wider"
            >
              Browse Components →
            </Link>
            <Link
              href="/"
              className="inline-block bg-transparent text-white font-mono font-bold text-sm px-8 py-3 rounded-lg border-2 border-white hover:bg-white hover:text-[#2a2a2a] transition-all duration-150 uppercase tracking-wider"
            >
              TweenLabs Home →
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}

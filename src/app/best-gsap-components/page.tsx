import type { Metadata } from "next";
import Link from "next/link";
import { animations } from "@/data/components";
import { seoCategories } from "@/data/seo-categories";

export const metadata: Metadata = {
	title:
		"Best GSAP Components 2025 | Free React & Next.js Animation Templates | TweenLabs",
	description:
		"Discover the best free GSAP components for React and Next.js. 22+ production-ready ScrollTrigger animations, 3D carousels, morphing text, parallax heroes, and more. Copy-paste or install via CLI.",
	keywords: [
		"best GSAP components",
		"best GSAP components 2025",
		"free GSAP components",
		"GSAP React components",
		"GSAP Next.js components",
		"GSAP ScrollTrigger examples",
		"GSAP animation templates",
		"copy paste GSAP components",
		"GSAP UI library",
		"React animation components",
		"best web animation library",
		"GSAP vs Framer Motion",
	],
	alternates: {
		canonical: "https://tweenlabs.xyz/best-gsap-components",
	},
	openGraph: {
		title: "Best GSAP Components 2025 | Free React & Next.js Animations",
		description:
			"22+ production-ready GSAP components for React & Next.js. ScrollTrigger, 3D carousels, morphing text — all free and open-source.",
		url: "https://tweenlabs.xyz/best-gsap-components",
		siteName: "TweenLabs",
		type: "article",
	},
};

const categories = [
	{
		title: "Scroll-Driven Animations",
		description:
			"Components that animate based on scroll position using GSAP ScrollTrigger. Perfect for storytelling landing pages and immersive experiences.",
		components: [
			"ScrollCards",
			"ScrollTags",
			"HorizontalCards",
			"PageTransition",
			"OrbitGallery",
		],
	},
	{
		title: "Interactive & Mouse-Driven",
		description:
			"Components that respond to user input — cursor position, clicks, and drags. These create engaging, tactile web experiences.",
		components: [
			"FluidCursor",
			"MagneticDock",
			"BentoGrid",
			"Carousel3D",
			"FlipCards",
		],
	},
	{
		title: "Typography & Text Effects",
		description:
			"Creative text animations using GSAP timelines and SVG filters. Great for hero sections, headings, and brand statements.",
		components: [
			"KineticText",
			"MorphingText",
			"RevealText",
			"BorderReveal",
			"GravityDrop",
		],
	},
	{
		title: "Layout & Structure",
		description:
			"Animated layout components that bring structure and motion to your page — grids, accordions, tabs, and more.",
		components: [
			"Accordion",
			"TabsMotion",
			"Blueprint",
			"CircularScatter",
			"ParallaxHero",
		],
	},
];

export default function BestGsapComponentsPage() {
	return (
		<div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
			{/* Dot Grid */}
			<div className="absolute inset-0 dot-grid pointer-events-none z-0" />

			<main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-20">
				{/* Hero */}
				<header className="mb-16">
					<div className="inline-flex items-center gap-2 bg-[#e55b3c] border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] mb-6">
						Updated for 2025
					</div>
					<h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight mb-6">
						Best GSAP Components
						<br />
						<span className="text-[#e55b3c]">for React & Next.js</span>
					</h1>
					<p className="text-lg md:text-xl text-[#555] max-w-3xl leading-relaxed font-medium">
						A curated collection of{" "}
						<strong className="text-[#2a2a2a]">
							{animations.length} production-ready
						</strong>{" "}
						GSAP animation components you can copy-paste or install via CLI.
						Built for{" "}
						<strong className="text-[#2a2a2a]">
							React 19, Next.js 16, and TypeScript
						</strong>
						. Every component is self-contained, accessible, and free under the
						MIT license.
					</p>

					{/* Install CTA */}
					<div className="mt-8 flex flex-wrap gap-4">
						<div className="bg-[#2a2a2a] text-[#f1b333] font-mono text-sm px-5 py-3 rounded-lg border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] select-all">
							npx tweenlabs@latest add FlipCards
						</div>
						<Link
							href="/"
							className="bg-[#f1b333] text-[#2a2a2a] font-mono font-bold text-sm px-5 py-3 rounded-lg border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 uppercase tracking-wider"
						>
							Browse All Components →
						</Link>
					</div>
				</header>

				{/* Why GSAP */}
				<section className="mb-16">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						Why GSAP for React & Next.js?
					</h2>
					<div className="grid md:grid-cols-3 gap-6">
						{[
							{
								title: "Performance",
								desc: "GSAP animates off the main thread using requestAnimationFrame with automatic batching. Zero layout thrashing, sub-16ms frame budgets.",
							},
							{
								title: "ScrollTrigger",
								desc: "The most powerful scroll-animation engine available. Pin elements, scrub timelines, create parallax effects — all with a single plugin.",
							},
							{
								title: "Timeline Control",
								desc: "Sequence complex animations with labels, staggers, and easing functions. Pause, reverse, seek — full programmatic control.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="bg-white border-2 border-[#2a2a2a] p-6 rounded-lg shadow-[4px_4px_0px_#2a2a2a]"
							>
								<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2 text-[#e55b3c]">
									{item.title}
								</h3>
								<p className="text-sm text-[#555] leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Component Categories */}
				{categories.map((cat) => (
					<section key={cat.title} className="mb-16">
						<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-3 border-b-3 border-[#2a2a2a] pb-3">
							{cat.title}
						</h2>
						<p className="text-[#555] mb-6 leading-relaxed">{cat.description}</p>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{cat.components.map((name) => {
								const anim = animations.find((a) => a.componentName === name);
								if (!anim) return null;
								return (
									<Link
										key={name}
										href={anim.route}
										className="group bg-white border-2 border-[#2a2a2a] p-5 rounded-lg shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
									>
										<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2 group-hover:text-[#e55b3c] transition-colors">
											{anim.name}
										</h3>
										<p className="text-xs text-[#777] leading-relaxed">
											{anim.description}
										</p>
										<div className="mt-3 text-[10px] font-mono text-[#e55b3c] font-bold uppercase">
											View Demo →
										</div>
									</Link>
								);
							})}
						</div>
					</section>
				))}

				{/* How to Install */}
				<section className="mb-16">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						How to Install GSAP Components
					</h2>
					<div className="bg-white border-2 border-[#2a2a2a] p-8 rounded-lg shadow-[6px_6px_0px_#2a2a2a]">
						<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-[#e55b3c]">
							Option 1: CLI (Recommended)
						</h3>
						<div className="bg-[#2a2a2a] text-[#f1b333] font-mono text-sm p-4 rounded-md mb-6 select-all">
							npx tweenlabs@latest add ComponentName
						</div>

						<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-[#e55b3c]">
							Option 2: Copy-Paste
						</h3>
						<ol className="list-decimal list-inside space-y-2 text-sm text-[#555]">
							<li>
								Install dependencies:{" "}
								<code className="font-mono text-xs bg-[#f0eadf] px-1.5 py-0.5 rounded border border-[#ddd]">
									npm install gsap @gsap/react
								</code>
							</li>
							<li>Click &quot;Get Code&quot; on any component card</li>
							<li>
								Paste the code into your project — every component is
								self-contained
							</li>
						</ol>
					</div>
				</section>

				{/* FAQ — AEO targeting */}
				<section className="mb-16">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{[
							{
								q: "What are the best free GSAP components for React?",
								a: `TweenLabs offers ${animations.length} free, production-ready GSAP components for React and Next.js including ScrollTrigger decks, 3D carousels, morphing text effects, parallax heroes, kinetic typography, and fluid cursor animations. All components are MIT-licensed, self-contained, and installable via npx tweenlabs@latest add ComponentName.`,
							},
							{
								q: "Is GSAP better than Framer Motion for animations?",
								a: "GSAP excels at complex, timeline-based animations with ScrollTrigger, SVG morphing, 3D transforms, and physics-based motion. Framer Motion is better for simple declarative animations tied to React state. For high-fidelity scroll animations and interactive experiences, GSAP is the industry standard.",
							},
							{
								q: "Can I use GSAP with Next.js App Router?",
								a: 'Yes. Use the @gsap/react useGSAP hook inside client components (marked with "use client"). The hook automatically handles cleanup on unmount, preventing memory leaks. TweenLabs components are specifically optimized for Next.js 16 App Router.',
							},
							{
								q: "Are these components accessible?",
								a: "Yes. All TweenLabs components respect prefers-reduced-motion, use semantic HTML, include ARIA attributes where needed, and maintain keyboard navigability.",
							},
						].map((item) => (
							<details
								key={item.q}
								className="bg-white border-2 border-[#2a2a2a] rounded-lg shadow-[3px_3px_0px_#2a2a2a] group"
							>
								<summary className="font-mono font-bold text-sm uppercase tracking-wider px-6 py-4 cursor-pointer select-none list-none flex items-center justify-between hover:text-[#e55b3c] transition-colors">
									{item.q}
									<span className="text-lg group-open:rotate-45 transition-transform">
										+
									</span>
								</summary>
								<p className="px-6 pb-5 text-sm text-[#555] leading-relaxed border-t border-[#eee] pt-4">
									{item.a}
								</p>
							</details>
						))}
					</div>
				</section>

				{/* Browse by Category */}
				<section className="mb-16">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						Browse by Category
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{seoCategories.map((cat) => (
							<Link
								key={cat.slug}
								href={`/best-gsap-components/${cat.slug}`}
								className="group bg-white border-2 border-[#2a2a2a] p-5 rounded-lg shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
							>
								<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-1 group-hover:text-[#e55b3c] transition-colors">
									{cat.title}
								</h3>
								<p className="text-[10px] font-mono text-[#999]">
									{cat.components.length} components
								</p>
							</Link>
						))}
					</div>
				</section>

				{/* Bottom CTA */}
				<section className="bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] p-8 md:p-12 rounded-lg shadow-[6px_6px_0px_#e55b3c] text-center">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">
						Start Building with GSAP
					</h2>
					<p className="text-[#aaa] mb-6 max-w-xl mx-auto">
						Browse {animations.length} premium animation components. Pick one,
						install it, and ship something beautiful.
					</p>
					<Link
						href="/"
						className="inline-block bg-[#f1b333] text-[#2a2a2a] font-mono font-bold text-sm px-8 py-3 rounded-lg border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 uppercase tracking-wider"
					>
						Explore All Components →
					</Link>
				</section>
			</main>
		</div>
	);
}

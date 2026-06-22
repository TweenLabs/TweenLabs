import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { animations } from "@/data/components";
import { seoCategories } from "@/data/seo-categories";

export function generateStaticParams() {
	return seoCategories.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Metadata {
	const cat = seoCategories.find((c) => c.slug === params.slug);
	if (!cat) return {};

	return {
		title: cat.metaTitle,
		description: cat.metaDescription,
		keywords: cat.keywords,
		alternates: {
			canonical: `https://tweenlabs.xyz/best-gsap-components/${cat.slug}`,
		},
		openGraph: {
			title: cat.metaTitle,
			description: cat.metaDescription,
			url: `https://tweenlabs.xyz/best-gsap-components/${cat.slug}`,
			siteName: "TweenLabs",
			type: "article",
		},
	};
}

export default function CategoryPage({
	params,
}: {
	params: { slug: string };
}) {
	const cat = seoCategories.find((c) => c.slug === params.slug);
	if (!cat) notFound();

	const matchedComponents = cat.components
		.map((name) => animations.find((a) => a.componentName === name))
		.filter(Boolean);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: cat.heading,
		description: cat.description,
		url: `https://tweenlabs.xyz/best-gsap-components/${cat.slug}`,
		numberOfItems: matchedComponents.length,
		isPartOf: {
			"@type": "WebSite",
			name: "TweenLabs",
			url: "https://tweenlabs.xyz",
		},
		mainEntity: {
			"@type": "ItemList",
			itemListElement: matchedComponents.map((anim, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: anim!.name,
				url: `https://tweenlabs.xyz${anim!.route}`,
			})),
		},
	};

	const faqLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: cat.faq.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.a,
			},
		})),
	};

	return (
		<div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
			<div className="absolute inset-0 dot-grid pointer-events-none z-0" />

			{/* JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
			/>

			<main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-20">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 text-xs font-mono text-[#999] mb-8">
					<Link href="/" className="hover:text-[#e55b3c]">
						Home
					</Link>
					<span>/</span>
					<Link
						href="/best-gsap-components"
						className="hover:text-[#e55b3c]"
					>
						Best GSAP Components
					</Link>
					<span>/</span>
					<span className="text-[#2a2a2a] font-bold">{cat.title}</span>
				</nav>

				{/* Hero */}
				<header className="mb-14">
					<div className="inline-flex items-center gap-2 bg-[#e55b3c] border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] mb-6">
						{matchedComponents.length} Components
					</div>
					<h1 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight mb-4">
						{cat.heading}
						<br />
						<span className="text-[#e55b3c]">{cat.headingAccent}</span>
					</h1>
					<p className="text-lg text-[#555] max-w-3xl leading-relaxed">
						{cat.description}
					</p>

					<div className="mt-6 bg-[#2a2a2a] text-[#f1b333] font-mono text-sm px-5 py-3 rounded-lg border-2 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] inline-block select-all">
						npx tweenlabs@latest add{" "}
						{matchedComponents[0]?.componentName || "ComponentName"}
					</div>
				</header>

				{/* Why Section */}
				<section className="mb-14">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						{cat.whySection.title}
					</h2>
					<div className="grid md:grid-cols-3 gap-5">
						{cat.whySection.points.map((point) => (
							<div
								key={point.title}
								className="bg-white border-2 border-[#2a2a2a] p-5 rounded-lg shadow-[4px_4px_0px_#2a2a2a]"
							>
								<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2 text-[#e55b3c]">
									{point.title}
								</h3>
								<p className="text-sm text-[#555] leading-relaxed">
									{point.desc}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Components Grid */}
				<section className="mb-14">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						Components
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{matchedComponents.map((anim) => {
							if (!anim) return null;
							return (
								<Link
									key={anim.componentName}
									href={anim.route}
									className="group bg-white border-2 border-[#2a2a2a] p-5 rounded-lg shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
								>
									<h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2 group-hover:text-[#e55b3c] transition-colors">
										{anim.name}
									</h3>
									<p className="text-xs text-[#777] leading-relaxed mb-3">
										{anim.description}
									</p>
									<div className="flex items-center gap-3">
										<span className="text-[10px] font-mono text-[#e55b3c] font-bold uppercase">
											View Demo →
										</span>
										<span className="text-[10px] font-mono text-[#999] font-bold uppercase">
											Get Code
										</span>
									</div>
								</Link>
							);
						})}
					</div>
				</section>

				{/* FAQ */}
				<section className="mb-14">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-6 border-b-3 border-[#2a2a2a] pb-3">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{cat.faq.map((item) => (
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

				{/* Related Categories */}
				<section className="mb-14">
					<h2 className="font-serif font-black text-xl uppercase tracking-tight mb-4">
						More Categories
					</h2>
					<div className="flex flex-wrap gap-2">
						{seoCategories
							.filter((c) => c.slug !== cat.slug)
							.map((c) => (
								<Link
									key={c.slug}
									href={`/best-gsap-components/${c.slug}`}
									className="font-mono text-xs uppercase tracking-wider font-bold px-3 py-1.5 bg-white border-2 border-[#2a2a2a] rounded-md shadow-[2px_2px_0px_#2a2a2a] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:text-[#e55b3c] transition-all duration-150"
								>
									{c.title}
								</Link>
							))}
					</div>
				</section>

				{/* CTA */}
				<section className="bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] p-8 md:p-12 rounded-lg shadow-[6px_6px_0px_#e55b3c] text-center">
					<h2 className="font-serif font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">
						Start Building
					</h2>
					<p className="text-[#aaa] mb-6 max-w-xl mx-auto">
						{animations.length} premium GSAP components. Free, open-source, and
						production-ready.
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

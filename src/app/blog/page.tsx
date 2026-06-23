import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog | GSAP Tutorials, Comparisons & Animation Guides | TweenLabs",
  description:
    "Learn GSAP, React animation patterns, and web animation best practices. Tutorials, comparisons, and guides from TweenLabs.",
  alternates: {
    canonical: siteConfig.fullUrl("/blog"),
  },
};

const posts = [
  {
    title: "GSAP vs Framer Motion: Which Should You Use in 2025?",
    description:
      "Feature-by-feature comparison of GSAP and Framer Motion for React and Next.js. Performance, ScrollTrigger, API design, and when to use each.",
    href: "/blog/gsap-vs-framer-motion",
    date: "June 2025",
    tag: "Comparison",
    tagColor: "bg-[#6758a5]",
  },
];

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-20">
        <header className="mb-12">
          <h1 className="font-serif font-black text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-[#555]">
            GSAP tutorials, animation guides, and comparisons.
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="block bg-white border-2 border-[#2a2a2a] p-6 md:p-8 rounded-lg shadow-[4px_4px_0px_#2a2a2a] hover:shadow-[2px_2px_0px_#2a2a2a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`${post.tagColor} text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#2a2a2a]`}
                >
                  {post.tag}
                </span>
                <time className="font-mono text-xs text-[#999] uppercase">
                  {post.date}
                </time>
              </div>
              <h2 className="font-serif font-black text-xl md:text-2xl uppercase tracking-tight mb-2 group-hover:text-[#e55b3c] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[#555] leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Parallax Hero | TweenLabs",
  description:
    "Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion. Explore on TweenLabs.",
  keywords: ["GSAP", "Parallax Hero", "Hero", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Parallax Hero Component",
    description:
      "Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion.",
    applicationCategory: "DeveloperApplication",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

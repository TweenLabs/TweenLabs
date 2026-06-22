import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Scroll Cards | TweenLabs",
  description:
    "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers. Explore on TweenLabs.",
  keywords: ["GSAP", "Scroll Cards", "ScrollTrigger", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Scroll Cards Component",
    description:
      "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers.",
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

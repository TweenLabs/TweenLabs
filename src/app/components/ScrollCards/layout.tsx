import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Stacking Scroll Cards Effect | TweenLabs",
  description:
    "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Stacking Scroll Cards",
    "Stacking Scroll Cards animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
    "ScrollTrigger",
    "scroll animation",
    "scroll pinning",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Stacking Scroll Cards Component",
    description:
      "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "TweenLabs",
    },
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

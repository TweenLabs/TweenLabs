import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Scroll Tags Assembly Effect | TweenLabs",
  description: "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Scroll Tags Assembly","Scroll Tags Assembly animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS","ScrollTrigger","scroll animation","scroll pinning"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TweenLabs Scroll Tags Assembly Component",
  "description": "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Browser",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "TweenLabs"
  }
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

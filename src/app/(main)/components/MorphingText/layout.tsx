import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Morphing Text Effect | TweenLabs",
  description:
    "Smooth auto-cycling text morphing animation with SVG threshold filter and color-coded word transitions. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Morphing Text",
    "Morphing Text animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
    "text animation",
    "SVG filter morph",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Morphing Text Component",
    description:
      "Smooth auto-cycling text morphing animation with SVG threshold filter and color-coded word transitions.",
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

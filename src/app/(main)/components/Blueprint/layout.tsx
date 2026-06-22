import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Blueprint Scatter Gallery Effect | TweenLabs",
  description:
    "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Blueprint Scatter Gallery",
    "Blueprint Scatter Gallery animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Blueprint Scatter Gallery Component",
    description:
      "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io.",
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

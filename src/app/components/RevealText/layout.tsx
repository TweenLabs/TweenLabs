import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Reveal Text Animation | TweenLabs",
  description:
    "Premium line-by-line text reveal using SplitText masks with staggered choreography. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Reveal Text",
    "Reveal Text animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
    "SplitText",
    "text reveal",
    "scroll animation",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Reveal Text Component",
    description:
      "Premium line-by-line text reveal using SplitText masks with staggered choreography.",
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

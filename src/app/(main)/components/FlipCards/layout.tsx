import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Flip Cards Effect | TweenLabs",
  description:
    "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Flip Cards",
    "Flip Cards animation",
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
    name: "TweenLabs Flip Cards Component",
    description:
      "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space.",
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

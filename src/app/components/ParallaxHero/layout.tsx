import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Parallax Hero Effect | TweenLabs",
  description:
    "Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Parallax Hero",
    "Parallax Hero animation",
    "parallax",
    "SplitText",
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
    name: "TweenLabs Parallax Hero Component",
    description:
      "Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Browser",
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "TweenLabs" },
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

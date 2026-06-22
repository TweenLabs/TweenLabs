import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Circular Scatter | TweenLabs",
  description:
    "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered. Explore on TweenLabs.",
  keywords: ["GSAP", "Circular Scatter", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Circular Scatter Component",
    description:
      "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered.",
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

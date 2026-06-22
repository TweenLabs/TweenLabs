import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Morphing Text | TweenLabs",
  description:
    "Smooth auto-cycling text morphing animation with SVG threshold filter and color-coded word transitions. Explore on TweenLabs.",
  keywords: [
    "GSAP",
    "Morphing Text",
    "Text Animation",
    "SVG",
    "TweenLabs",
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Fluid Cursor | TweenLabs",
  description:
    "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries. Explore this advanced cursor animation on TweenLabs.",
  keywords: ["GSAP", "Fluid Cursor", "Cursor", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Fluid Cursor Component",
    description:
      "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries.",
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Orbit Gallery | TweenLabs",
  description:
    "Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline. Explore on TweenLabs.",
  keywords: ["GSAP", "Orbit Gallery", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Orbit Gallery Component",
    description:
      "Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline.",
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

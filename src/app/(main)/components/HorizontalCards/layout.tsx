import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Horizontal Cards | TweenLabs",
  description:
    "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport. Explore on TweenLabs.",
  keywords: ["GSAP", "Horizontal Cards", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Horizontal Cards Component",
    description:
      "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport.",
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

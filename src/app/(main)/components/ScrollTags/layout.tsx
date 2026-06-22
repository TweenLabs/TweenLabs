import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Scroll Tags | TweenLabs",
  description:
    "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions. Explore on TweenLabs.",
  keywords: ["GSAP", "Scroll Tags", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Scroll Tags Component",
    description:
      "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions.",
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

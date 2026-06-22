import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Gravity Drop | TweenLabs",
  description:
    "Staggered letters falling down onto a shelf collider with realistic physics bounce. Explore on TweenLabs.",
  keywords: ["GSAP", "Gravity Drop", "Physics", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Gravity Drop Component",
    description:
      "Staggered letters falling down onto a shelf collider with realistic physics bounce.",
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

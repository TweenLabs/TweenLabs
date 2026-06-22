import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Accordion | TweenLabs",
  description:
    "Vertical accordion showcase where selection morphs page background color and staggers content. Explore on TweenLabs.",
  keywords: ["GSAP", "Accordion", "UI Component", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Accordion Component",
    description:
      "Vertical accordion showcase where selection morphs page background color and staggers content.",
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Page Transition | TweenLabs",
  description:
    "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing. Explore this animation on TweenLabs.",
  keywords: ["GSAP", "Page Transition", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Page Transition Component",
    description:
      "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing.",
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

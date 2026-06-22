import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Reveal Text | TweenLabs",
  description:
    "Premium line-by-line text reveal using SplitText masks with staggered choreography. Explore on TweenLabs.",
  keywords: ["GSAP", "Reveal Text", "Text Animation", "SplitText", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Reveal Text Component",
    description:
      "Premium line-by-line text reveal using SplitText masks with staggered choreography.",
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

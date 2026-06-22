import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Blueprint | TweenLabs",
  description:
    "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io. Explore on TweenLabs.",
  keywords: ["GSAP", "Blueprint", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Blueprint Component",
    description:
      "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io.",
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

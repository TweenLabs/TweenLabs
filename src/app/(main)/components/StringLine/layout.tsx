import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP String Line | TweenLabs",
  description:
    "ScrollTriggered SVG network line drawing tracking node proximity scale offsets. Explore on TweenLabs.",
  keywords: ["GSAP", "String Line", "SVG", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs String Line Component",
    description:
      "ScrollTriggered SVG network line drawing tracking node proximity scale offsets.",
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

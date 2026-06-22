import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Border Reveal | TweenLabs",
  description:
    "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders. Explore on TweenLabs.",
  keywords: ["GSAP", "Border Reveal", "Text", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Border Reveal Component",
    description:
      "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
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

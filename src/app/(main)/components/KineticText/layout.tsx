import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Kinetic Text | TweenLabs",
  description:
    "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion. Explore on TweenLabs.",
  keywords: ["GSAP", "Kinetic Text", "Text Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Kinetic Text Component",
    description:
      "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion.",
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

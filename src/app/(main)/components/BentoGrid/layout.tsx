import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Bento Grid | TweenLabs",
  description:
    "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs. Explore on TweenLabs.",
  keywords: ["GSAP", "Bento Grid", "Grid", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Bento Grid Component",
    description:
      "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs.",
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

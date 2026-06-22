import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Magnetic Dock | TweenLabs",
  description:
    "Premium floating menu bar where buttons pull dynamically toward the user's cursor. Explore on TweenLabs.",
  keywords: ["GSAP", "Magnetic Dock", "Menu", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Magnetic Dock Component",
    description:
      "Premium floating menu bar where buttons pull dynamically toward the user's cursor.",
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Skill Fit | TweenLabs",
  description:
    "Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers. Explore this animation component on TweenLabs.",
  keywords: ["GSAP", "Skill Fit", "Profile", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Skill Fit Component",
    description:
      "Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers.",
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

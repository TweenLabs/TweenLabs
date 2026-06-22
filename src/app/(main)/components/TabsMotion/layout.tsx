import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Tabs Motion | TweenLabs",
  description:
    "Animated tab navigation with sliding indicator pill and directional content crossfade transitions. Explore on TweenLabs.",
  keywords: ["GSAP", "Tabs Motion", "Tab Navigation", "Animation", "TweenLabs"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Tabs Motion Component",
    description:
      "Animated tab navigation with sliding indicator pill and directional content crossfade transitions.",
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

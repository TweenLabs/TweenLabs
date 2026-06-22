import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Tabs Motion Animation | TweenLabs",
  description:
    "Animated tab navigation with sliding indicator pill and directional content crossfade transitions. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP Tabs Motion",
    "Tabs Motion animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
    "tab navigation",
    "sliding pill",
    "crossfade",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs Tabs Motion Component",
    description:
      "Animated tab navigation with sliding indicator pill and directional content crossfade transitions.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "TweenLabs",
    },
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

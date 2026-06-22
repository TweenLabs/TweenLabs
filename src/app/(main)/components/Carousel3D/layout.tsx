import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP 3D Carousel | TweenLabs",
  description:
    "Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion. Explore this premium animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "3D Carousel",
    "Carousel animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "3D transform",
    "Tailwind CSS",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs 3D Carousel Component",
    description:
      "Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion.",
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

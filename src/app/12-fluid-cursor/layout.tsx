import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Fluid Cursor Reticle Effect | TweenLabs",
  description: "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Fluid Cursor Reticle","Fluid Cursor Reticle animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TweenLabs Fluid Cursor Reticle Component",
  "description": "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Browser",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "TweenLabs"
  }
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

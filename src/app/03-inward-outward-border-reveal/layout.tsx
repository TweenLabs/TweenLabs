import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Inward-Outward Sentence Effect | TweenLabs",
  description: "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Inward-Outward Sentence","Inward-Outward Sentence animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TweenLabs Inward-Outward Sentence Component",
  "description": "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
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

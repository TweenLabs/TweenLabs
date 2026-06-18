import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TweenLabs | Open Source GSAP Animation Experts",
  description:
    "Learn about TweenLabs, a premium open-source collection of GSAP components for Next.js. Discover our expertise, standards, and engineering guidelines for high-fidelity web animations.",
  keywords: [
    "TweenLabs about",
    "GSAP experts",
    "React GSAP contributors",
    "open source animations team",
    "Next.js animations",
    "TweenLabs licensing",
  ],
  alternates: {
    canonical: "https://tweenlabs.xyz/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://tweenlabs.xyz/about/#aboutpage",
        url: "https://tweenlabs.xyz/about",
        name: "About TweenLabs - Premium GSAP Animation Components",
        isPartOf: {
          "@id": "https://tweenlabs.xyz/#website",
        },
        description:
          "TweenLabs is an open-source animation workshop and catalog built to make GreenSock (GSAP) integrations in React and Next.js accessible, clean, and fully optimized.",
        publisher: {
          "@type": "Organization",
          "@id": "https://tweenlabs.xyz/#website",
          name: "TweenLabs",
          url: "https://tweenlabs.xyz",
        },
        mainEntity: {
          "@type": "Organization",
          name: "TweenLabs",
          description:
            "A team of open-source developers and creative UI engineers specializing in high-performance web animations and interactive frontend experiences.",
          logo: "https://tweenlabs.xyz/logo.svg",
          sameAs: ["https://github.com/GSAP-PLAYGROUND/TweenLabs"],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}

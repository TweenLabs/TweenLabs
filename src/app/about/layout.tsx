import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

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
    canonical: siteConfig.fullUrl("/about"),
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
        "@id": `${siteConfig.url}/about/#aboutpage`,
        url: siteConfig.fullUrl("/about"),
        name: `About ${siteConfig.name} - Premium GSAP Animation Components`,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        description:
          "TweenLabs is an open-source animation workshop and catalog built to make GreenSock (GSAP) integrations in React and Next.js accessible, clean, and fully optimized.",
        publisher: {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#website`,
          name: siteConfig.name,
          url: siteConfig.url,
        },
        mainEntity: {
          "@type": "Organization",
          name: siteConfig.name,
          description:
            "A team of open-source developers and creative UI engineers specializing in high-performance web animations and interactive frontend experiences.",
          logo: siteConfig.fullUrl("/logo.svg"),
          sameAs: [siteConfig.github],
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

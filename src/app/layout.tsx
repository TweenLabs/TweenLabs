import type { Metadata } from "next";
import { Fraunces, Geist, Space_Mono } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/PageWrapper";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TweenLabs | Best GSAP UI Components & React Animation Templates",
  description:
    "Discover TweenLabs: the best GSAP components library for web animations. Copy-paste free, production-ready GSAP UI components, ScrollTrigger widgets, 3D physics widgets, and layout transitions.",
  keywords: [
    "best GSAP components",
    "GSAP components",
    "GSAP UI Components",
    "GSAP React Components",
    "free GSAP components",
    "GSAP templates",
    "Next.js GSAP Components",
    "ScrollTrigger",
    "Web Animations",
    "Neo-Brutalism",
    "TweenLabs",
  ],
  alternates: {
    canonical: "https://tweenlabs.xyz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "TweenLabs | Best GSAP UI Components & React Animation Templates",
    description:
      "Discover TweenLabs: the best GSAP components library for web animations. Copy-paste free, production-ready GSAP UI components, ScrollTrigger widgets, 3D physics widgets, and layout transitions.",
    url: "https://tweenlabs.xyz",
    siteName: "TweenLabs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://tweenlabs.xyz/Untitled%20design.png",
        width: 1200,
        height: 630,
        alt: "TweenLabs GSAP Component Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TweenLabs | Best GSAP UI Components & React Animation Templates",
    description:
      "Discover TweenLabs: the best GSAP components library for web animations. Copy-paste free, production-ready GSAP UI components, ScrollTrigger widgets, 3D physics widgets, and layout transitions.",
    images: ["https://tweenlabs.xyz/Untitled%20design.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tweenlabs.xyz/#website",
        url: "https://tweenlabs.xyz",
        name: "TweenLabs",
        description:
          "The best curated library of premium, high-fidelity GSAP components and animations.",
        publisher: {
          "@type": "Organization",
          name: "TweenLabs",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": "https://tweenlabs.xyz/#collectionpage",
        url: "https://tweenlabs.xyz",
        name: "Best GSAP UI Components & Animation Templates | TweenLabs",
        isPartOf: {
          "@id": "https://tweenlabs.xyz/#website",
        },
        description:
          "A collection of 19+ copy-paste GSAP components including ScrollTrigger decks, 3D carousels, bento grids, and interactive typography.",
        about: {
          "@type": "Thing",
          name: "GSAP (GreenSock Animation Platform) Components",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://tweenlabs.xyz/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is TweenLabs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TweenLabs is a curated library of high-fidelity, interactive, and portable GSAP components, UI templates, and scroll-triggered animations. Every resource is designed to be easily copy-pasted into your React and Next.js projects.",
            },
          },
          {
            "@type": "Question",
            name: "Are these GSAP components free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all TweenLabs animations and layouts are free and open-source. Simply click 'Get Code' on any card, install the required packages, and drop the code directly into your codebase.",
            },
          },
          {
            "@type": "Question",
            name: "What frameworks are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our components are optimized for React 19, Next.js 16 (App Router), TypeScript, and Tailwind CSS. They utilize standard clean packages like @gsap/react and Lenis smooth scrolling.",
            },
          },
          {
            "@type": "Question",
            name: "What kind of GSAP components are included?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TweenLabs houses a wide range of creative mechanics: 3D hover tilt grids, kinetic wave typography, scroll-pinned parallax card decks, pointer drag carousel wheels, elastic fluid cursors, and animated SVG networks.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geist.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased selection:bg-wtf-yellow selection:text-black`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden relative">
        {/* Schema markup for Generative Engine Optimization (GEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Fine Grain noise overlay across the entire site */}
        <div className="noise-overlay fixed inset-0 pointer-events-none z-[99] opacity-70" />
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}

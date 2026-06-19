import type { Metadata } from "next";
import { Fraunces, Geist, Space_Mono } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/PageWrapper";
import { ConvexClientProvider } from "@/provider/ConvexClientProvider";
import { getToken, fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../convex/_generated/api";

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
    "TweenLabs is an open-source library of premium, copy-paste React, Next.js, and GSAP animation components. Build high-fidelity web experiences with ScrollTrigger, 3D tilt, and interactive typography templates.",
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
      "TweenLabs is an open-source library of premium, copy-paste React, Next.js, and GSAP animation components. Build high-fidelity web experiences with ScrollTrigger, 3D tilt, and interactive typography templates.",
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
      "TweenLabs is an open-source library of premium, copy-paste React, Next.js, and GSAP animation components. Build high-fidelity web experiences with ScrollTrigger, 3D tilt, and interactive typography templates.",
    images: ["https://tweenlabs.xyz/Untitled%20design.png"],
  },
  verification: {
    google: "GcVbSl__f6IIF7TagtI2w_1xL_iMucTM86gTAqN",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side to prevent loading flicker in the client
  const token = await getToken().catch(() => undefined);
  const user = token ? await fetchAuthQuery(api.auth.getCurrentUser).catch(() => null) : null;

  const initialSession = user
    ? {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.pictureUrl || user.image,
        },
        session: {
          id: "",
          userId: user._id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      }
    : null;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tweenlabs.xyz/#organization",
        name: "TweenLabs",
        url: "https://tweenlabs.xyz",
        logo: "https://tweenlabs.xyz/logo.svg",
        sameAs: ["https://github.com/GSAP-PLAYGROUND/TweenLabs"],
        description: "TweenLabs is an open-source engineering repository providing high-performance, copy-paste GreenSock (GSAP) UI components, ScrollTrigger timelines, and custom animation hooks tailored specifically for React 19 and Next.js 16 (App Router) environments."
      },
      {
        "@type": "WebSite",
        "@id": "https://tweenlabs.xyz/#website",
        url: "https://tweenlabs.xyz",
        name: "TweenLabs",
        description:
          "TweenLabs is a premium web design animations repository featuring copy-paste React 19, Next.js 16, and GSAP ScrollTrigger UI components.",
        publisher: {
          "@id": "https://tweenlabs.xyz/#organization",
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
          "A collection of 18+ copy-paste GSAP components including ScrollTrigger decks, 3D carousels, bento grids, and interactive typography.",
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
            "name": "What is TweenLabs?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "TweenLabs is a dedicated front-end animation resource library featuring production-ready GreenSock (GSAP) components and interactive React templates. It provides web developers and UI designers with reusable, copy-paste code snippets to build high-fidelity scroll animations, creative layouts, and interactive experiences.",
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
          {
            "@type": "Question",
            name: "How to optimize GSAP for Next.js App Router?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To optimize GSAP in Next.js App Router, run all timeline configurations inside client-side components using the useGSAP hook. Use CSS initial values for layout properties to prevent Layout Shifts (CLS), and wrap animations in media checks to respect user preferences.",
            },
          },
          {
            "@type": "Question",
            name: "How to prevent GSAP memory leaks in React?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Always clean up your animation contexts when React components unmount. Using the official @gsap/react useGSAP helper hook automatically performs context reversion and cleanup when the component unmounts, preventing memory leaks and orphaned timelines.",
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
        <ConvexClientProvider initialToken={user ? token : null} initialSession={initialSession}>
          <PageWrapper>{children}</PageWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

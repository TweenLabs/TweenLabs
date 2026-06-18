import type { Metadata } from "next";
import { Poppins, Fraunces, Space_Mono } from "next/font/google";
import LenisProvider from "@/provider/LenisProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
  title: "TweenLabs | Premium GSAP Animation Templates & React Components",
  description: "Explore TweenLabs: A high-fidelity, interactive Neo-Brutalist library of copy-paste GSAP UI components, animation templates, ScrollTrigger pins, 3D physics widgets, and layout transitions.",
  keywords: [
    "GSAP",
    "GSAP Components",
    "GSAP UI Components",
    "GSAP React Components",
    "Next.js GSAP Components",
    "GSAP Templates",
    "Next.js 16",
    "React 19",
    "ScrollTrigger",
    "Web Animations",
    "Neo-Brutalism",
    "TweenLabs"
  ],
  openGraph: {
    title: "TweenLabs | Premium GSAP Animation Templates & React Components",
    description: "Explore TweenLabs: A high-fidelity, interactive Neo-Brutalist library of copy-paste GSAP UI components, animation templates, ScrollTrigger pins, 3D physics widgets, and layout transitions.",
    url: "https://tweenlabs.xyz",
    siteName: "TweenLabs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TweenLabs | Premium GSAP Animation Templates & React Components",
    description: "Explore TweenLabs: A high-fidelity, interactive Neo-Brutalist library of copy-paste GSAP UI components, animation templates, ScrollTrigger pins, 3D physics widgets, and layout transitions.",
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
        "url": "https://tweenlabs.xyz",
        "name": "TweenLabs",
        "description": "A curated library of premium, high-fidelity GSAP components and animations.",
        "publisher": {
          "@type": "Organization",
          "name": "TweenLabs"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": "https://tweenlabs.xyz/#collectionpage",
        "url": "https://tweenlabs.xyz",
        "name": "GSAP UI Components & Animation Templates | TweenLabs",
        "isPartOf": {
          "@id": "https://tweenlabs.xyz/#website"
        },
        "description": "A collection of 19+ copy-paste GSAP components including ScrollTrigger decks, 3D carousels, bento grids, and interactive typography.",
        "about": {
          "@type": "Thing",
          "name": "GSAP (GreenSock Animation Platform) Components"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased selection:bg-wtf-yellow selection:text-black`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden relative">
        {/* Schema markup for Generative Engine Optimization (GEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Fine Grain noise overlay across the entire site */}
        <div className="noise-overlay fixed inset-0 pointer-events-none z-[99] opacity-70" />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Fraunces, Geist, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/PageWrapper";
import { fetchAuthQuery, getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/provider/ConvexClientProvider";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { animations } from "@/data/components";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700", "900"], // Only font-bold (700) and font-black (900) are used
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
		"GSAP ScrollTrigger tutorial",
		"React animation library",
		"copy paste animation components",
		"GSAP vs Framer Motion",
	],
	authors: [{ name: "TweenLabs", url: "https://tweenlabs.xyz" }],
	creator: "TweenLabs",
	publisher: "TweenLabs",
	category: "Technology",
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
			"max-video-preview": -1,
		},
	},
	openGraph: {
		title: "TweenLabs | Best GSAP UI Components & React Animation Templates",
		description:
			"22+ premium, copy-paste GSAP animation components for React & Next.js. ScrollTrigger, 3D carousels, kinetic typography, morphing text, and more — all free and open-source.",
		url: "https://tweenlabs.xyz",
		siteName: "TweenLabs",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "https://tweenlabs.xyz/logo.png",
				width: 512,
				height: 512,
				alt: "TweenLabs — Premium GSAP Animation Components",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "TweenLabs | Best GSAP UI Components & React Animation Templates",
		description:
			"22+ premium, copy-paste GSAP animation components for React & Next.js. Free and open-source.",
		images: ["https://tweenlabs.xyz/logo.png"],
		creator: "@TweenLabs",
	},
	verification: {
		google: "GcVbSl__f6IIF7TagtI2w_1xL_iMucTM86gTAqN",
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/logo.svg", type: "image/svg+xml" },
		],
		apple: "/logo.svg",
	},
	other: {
		"ai:llms": "https://tweenlabs.xyz/llms.txt",
		"ai:llms-full": "https://tweenlabs.xyz/llms-full.txt",
		"ai:context": "https://tweenlabs.xyz/ai.txt",
	},
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side to prevent loading flicker in the client
  const token = await getToken().catch(() => undefined);
  const user = token
    ? await fetchAuthQuery(api.auth.getCurrentUser).catch(() => null)
    : null;

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
          // eslint-disable-next-line react-hooks/purity
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
				sameAs: ["https://github.com/TweenLabs/TweenLabs"],
				description:
					"TweenLabs is an open-source engineering repository providing high-performance, copy-paste GreenSock (GSAP) UI components, ScrollTrigger timelines, and custom animation hooks tailored specifically for React 19 and Next.js 16 (App Router) environments.",
				foundingDate: "2025",
				knowsAbout: [
					"GSAP",
					"GreenSock Animation Platform",
					"React Animation",
					"ScrollTrigger",
					"Next.js",
					"Web Animation",
					"Motion Design",
				],
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
				inLanguage: "en-US",
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
					`A collection of ${animations.length}+ copy-paste GSAP components including ScrollTrigger decks, 3D carousels, morphing text, bento grids, parallax heroes, and interactive typography.`,
				about: {
					"@type": "Thing",
					name: "GSAP (GreenSock Animation Platform) Components",
				},
				numberOfItems: animations.length,
			},
			{
				"@type": "SoftwareApplication",
				"@id": "https://tweenlabs.xyz/#software",
				name: "TweenLabs CLI",
				operatingSystem: "Cross-platform (Node.js)",
				applicationCategory: "DeveloperApplication",
				offers: {
					"@type": "Offer",
					price: "0",
					priceCurrency: "USD",
				},
				softwareVersion: "0.1.6",
				downloadUrl: "https://www.npmjs.com/package/tweenlabs",
				installUrl: "https://www.npmjs.com/package/tweenlabs",
				author: {
					"@id": "https://tweenlabs.xyz/#organization",
				},
				description:
					"Zero-dependency CLI to install premium GSAP animation components directly into your Next.js or React project. Run npx tweenlabs@latest add ComponentName.",
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
							text: "TweenLabs is a dedicated front-end animation resource library featuring 22+ production-ready GreenSock (GSAP) components and interactive React templates. It provides web developers and UI designers with reusable, copy-paste code snippets to build high-fidelity scroll animations, creative layouts, and interactive experiences.",
						},
					},
					{
						"@type": "Question",
						name: "Are these GSAP components free?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Yes, all TweenLabs animations and layouts are free and open-source under the MIT license. You can install any component via the CLI with npx tweenlabs@latest add ComponentName, or copy-paste the code directly.",
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
						name: "How to install TweenLabs components?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "Run npx tweenlabs@latest add ComponentName in your project terminal. For example: npx tweenlabs@latest add FlipCards. The CLI downloads the component file and any required dependencies (gsap, @gsap/react) automatically.",
						},
					},
					{
						"@type": "Question",
						name: "What kind of GSAP components are included?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "TweenLabs houses a wide range of creative mechanics: 3D hover tilt grids, kinetic wave typography, scroll-pinned parallax card decks, morphing text with color transitions, pointer drag carousel wheels, elastic fluid cursors, and animated SVG networks.",
						},
					},
					{
						"@type": "Question",
						name: "GSAP vs Framer Motion — which should I use?",
						acceptedAnswer: {
							"@type": "Answer",
							text: "GSAP excels at complex, timeline-based animations with fine-grained control — scroll-pinning, SVG morphing, 3D transforms, and physics-based motion. Framer Motion is great for declarative, layout-driven React animations. TweenLabs uses GSAP because it offers superior performance for the high-fidelity animation patterns our components require.",
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
      className={cn(
        "h-full",
        "antialiased",
        "selection:bg-wtf-yellow",
        "selection:text-black",
        geist.variable,
        fraunces.variable,
        spaceMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden relative">
        {/* Schema markup for Generative Engine Optimization (GEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Fine Grain noise overlay across the entire site */}
        <div className="noise-overlay fixed inset-0 pointer-events-none z-[99] opacity-70" />
        <ConvexClientProvider
          initialToken={user ? token : null}
          initialSession={initialSession}
        >
          <PageWrapper>{children}</PageWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

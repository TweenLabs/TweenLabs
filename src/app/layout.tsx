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
  description: "Explore TweenLabs: A high-fidelity, interactive Neo-Brutalist sandbox of copy-paste GSAP animation templates, ScrollTrigger pins, 3D physics widgets, and layout transitions.",
  keywords: ["GSAP", "GSAP Templates", "Next.js 16", "React 19", "ScrollTrigger", "Web Animations", "Neo-Brutalism", "TweenLabs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased selection:bg-wtf-yellow selection:text-black`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f0eadf] text-[#2a2a2a] overflow-x-hidden relative">
        {/* Fine Grain noise overlay across the entire site */}
        <div className="noise-overlay fixed inset-0 pointer-events-none z-[99] opacity-70" />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}


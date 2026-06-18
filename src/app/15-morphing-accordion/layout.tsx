import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Morphing Accordion Effect | TweenLabs",
  description: "Vertical accordion showcase where selection morphs page background color and staggers content. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Morphing Accordion","Morphing Accordion animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Circular Scatter Gallery Effect | TweenLabs",
  description: "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Circular Scatter Gallery","Circular Scatter Gallery animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

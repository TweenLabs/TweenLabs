import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Showup Flip Cards Effect | TweenLabs",
  description: "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Showup Flip Cards","Showup Flip Cards animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

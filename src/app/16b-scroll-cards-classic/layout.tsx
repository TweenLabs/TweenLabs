import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Classic Parallax Stack Effect | TweenLabs",
  description: "Scroll-pinned classic overlapping cards utilizing y-parallax translations (optimized to stay within DOM viewport). Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Classic Parallax Stack","Classic Parallax Stack animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

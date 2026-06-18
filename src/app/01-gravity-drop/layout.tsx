import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Gravity Drop Effect | TweenLabs",
  description: "Staggered letters falling down onto a shelf collider with realistic physics bounce. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Gravity Drop","Gravity Drop animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

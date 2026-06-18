import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Horizontal Cards Showcase Effect | TweenLabs",
  description: "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Horizontal Cards Showcase","Horizontal Cards Showcase animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

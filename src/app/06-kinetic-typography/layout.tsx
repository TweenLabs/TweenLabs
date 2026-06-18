import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Kinetic Typography Effect | TweenLabs",
  description: "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Kinetic Typography","Kinetic Typography animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

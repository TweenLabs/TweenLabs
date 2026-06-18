import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Bento Grid Tilt Effect | TweenLabs",
  description: "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Bento Grid Tilt","Bento Grid Tilt animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS","3D animation","CSS 3D","mouse interactive"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

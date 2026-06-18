"use client";

import AnimationCard from "@/components/AnimationCard";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";

import { animations } from "@/data/animations";


export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <Hero />

      {/* Main Directory Grid */}
      <main className="w-full max-w-7xl px-4 md:px-8 py-12 flex flex-col gap-12 z-10">
        <div className="flex flex-col gap-2 border-b-3 border-[#2a2a2a] pb-6 mt-4">
          <h2 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
            Component Directory
          </h2>
          <p className="text-xs font-mono font-bold text-wtf-orange uppercase tracking-wider">
            Copy-Paste GSAP UI Components & Sandbox Previews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animations.map((anim) => (
            <AnimationCard key={anim.id} anim={anim} />
          ))}
        </div>
      </main>

      <FAQ />
    </div>
  );
}

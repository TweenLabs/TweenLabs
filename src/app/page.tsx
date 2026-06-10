"use client";

import Link from "next/link";

const animations = [
  {
    id: "01",
    name: "Gravity Drop",
    route: "/01-gravity-drop",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description: "Staggered letters falling down onto a shelf collider with realistic physics bounce.",
    tiltClass: "tilt-right",
  },
  {
    id: "02",
    name: "Scroll Tags Assembly",
    route: "/02-scroll-tags-assembly",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description: "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions.",
    tiltClass: "tilt-left",
  },
  {
    id: "03",
    name: "Inward-Outward Border Reveal",
    route: "/03-inward-outward-border-reveal",
    bgColor: "bg-wtf-red",
    textColor: "text-white",
    description: "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "04",
    name: "Horizontal Cards Showcase",
    route: "/04-horizontal-cards-showcase",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description: "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "05",
    name: "Tactile Stack Showcase",
    route: "/05-tactile-yellow-sandbox",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description: "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing.",
    tiltClass: "tilt-right",
  },
  {
    id: "06",
    name: "Adding soon",
    route: "/06-kinetic-purple-sandbox",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description: "High-contrast purple workspace template for advanced kinetic typography.",
    tiltClass: "tilt-left",
  },
];

const hoverColorsMap: Record<string, string> = {
  "bg-wtf-orange": "hover:bg-wtf-orange hover:text-white",
  "bg-wtf-green": "hover:bg-wtf-green hover:text-white",
  "bg-wtf-red": "hover:bg-wtf-red hover:text-white",
  "bg-wtf-blue": "hover:bg-wtf-blue hover:text-white",
  "bg-wtf-yellow": "hover:bg-wtf-yellow hover:text-black",
  "bg-wtf-purple": "hover:bg-wtf-purple hover:text-white",
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center selection:bg-wtf-yellow selection:text-black">
      
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 left-0 w-full z-45 bg-white border-b-3 border-[#2a2a2a] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full bg-wtf-orange border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a] animate-pulse" />
            <span className="font-serif font-black text-lg md:text-xl tracking-tight text-[#2a2a2a] uppercase">
              GSAP PLAYGROUND
            </span>
          </div>
          <div className="font-mono text-xs font-bold text-[#2a2a2a] bg-wtf-yellow border-2 border-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a]">
            Active Sandbox
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 pt-16 pb-8 md:py-20 flex flex-col items-center text-center gap-6 z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
            <span>Next.js 16 + React 19 Workspace</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight text-[#2a2a2a] max-w-4xl leading-[1.05] uppercase">
            GSAP Animation{" "}
            <span className="block mt-2 text-wtf-orange">
              Playground 
            </span>
          </h1>

          <p className="max-w-xl text-zinc-700 text-sm md:text-base leading-relaxed font-sans font-medium">
            Click on any route card below to launch the respective sandbox.
          </p>
        </div>
      </section>

      {/* Main Directory Grid */}
      <main className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animations.map((anim) => (
            <div
              key={anim.id}
              className={`brutalist-card brutalist-card-interactive p-6 bg-white flex flex-col justify-between gap-6`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-zinc-500">[{anim.id}]</span>
                  <span className={`inline-flex items-center gap-2 border-2 border-[#2a2a2a] px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${anim.bgColor} ${anim.textColor} shadow-[1.5px_1.5px_0px_#2a2a2a] ${anim.tiltClass}`}>
                    Theme Color
                  </span>
                </div>
                
                <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
                  {anim.name}
                </h2>
                
                <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed">
                  {anim.description}
                </p>
              </div>

              <Link href={anim.route} className="w-full mt-2 block">
                <button className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150`}>
                  Open →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-3 border-[#2a2a2a] bg-[#f8f5ee] py-12 px-4 md:px-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-serif font-black text-lg text-[#2a2a2a] uppercase">
              GSAP PLAYGROUND
            </span>
            <span className="text-xs font-mono font-bold text-zinc-550">
              Folder & Route structure matched to 3D Animations sibling templates.
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-550 justify-center">
            <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-bold">
              next-16
            </span>
            <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-bold">
              react-19
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

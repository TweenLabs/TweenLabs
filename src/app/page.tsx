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
    name: "Inward-Outward Sentence",
    route: "/03-inward-outward-border-reveal",
    bgColor: "bg-wtf-red",
    textColor: "text-white",
    description: "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "04",
    name: "HorizontaL Cards Showcase",
    route: "/04-horizontal-cards-showcase",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description: "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "05",
    name: "PAGE CHANGE ANIMATION",
    route: "/05-page-change-animation",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description: "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing.",
    tiltClass: "tilt-right",
  },
  {
    id: "06",
    name: "Kinetic Typography",
    route: "/06-kinetic-typography",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description: "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion.",
    tiltClass: "tilt-left",
  },
  {
    id: "07",
    name: "Scroll Orbit Gallery",
    route: "/07-scroll-orbit-gallery",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description: "Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline.",
    tiltClass: "tilt-right",
  },
  {
    id: "08",
    name: "Blueprint Scatter Gallery",
    route: "/08-blueprint-scatter",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description: "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io.",
    tiltClass: "tilt-left",
  },
  {
    id: "09",
    name: "Circular Scatter Gallery",
    route: "/09-circular-scatter",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description: "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered.",
    tiltClass: "tilt-right",
  },
  {
    id: "10",
    name: "Screen for Skills",
    route: "/10-screen-skill-fit",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description: "Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers.",
    tiltClass: "tilt-left",
  },
  {
    id: "11",
    name: "Interactive Magnetic Dock",
    route: "/11-magnetic-dock",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description: "Premium floating menu bar where buttons pull dynamically toward the user's cursor.",
    tiltClass: "tilt-right",
  },
  {
    id: "12",
    name: "Fluid Cursor Reticle",
    route: "/12-fluid-cursor",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description: "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries.",
    tiltClass: "tilt-left",
  },
  {
    id: "13",
    name: "Bento Grid Tilt",
    route: "/13-bento-grid-flip",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description: "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "14",
    name: "3D Coverflow Carousel",
    route: "/14-3d-carousel",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description: "Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "15",
    name: "Morphing Accordion",
    route: "/15-morphing-accordion",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description: "Vertical accordion showcase where selection morphs page background color and staggers content.",
    tiltClass: "tilt-right",
  },
  {
    id: "16",
    name: "Stacking Scroll Cards",
    route: "/16-scroll-cards-01",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description: "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers.",
    tiltClass: "tilt-right",
  },
  {
    id: "16b",
    name: "Classic Parallax Stack",
    route: "/16b-scroll-cards-classic",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description: "Scroll-pinned classic overlapping cards utilizing y-parallax translations (optimized to stay within DOM viewport).",
    tiltClass: "tilt-left",
  },
  {
    id: "17",
    name: "Showup Flip Cards",
    route: "/17-showup-cards",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description: "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space.",
    tiltClass: "tilt-left",
  },
  {
    id: "18",
    name: "SVG String Network",
    route: "/18-string-line",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description: "ScrollTriggered SVG network line drawing tracking node proximity scale offsets.",
    tiltClass: "tilt-right",
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
            <span className="font-serif font-black text-lg md:text-xl tracking-tight text-[#2a2a2a]">
              TweenLabs
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 pt-16 pb-8 md:py-20 flex flex-col items-center text-center gap-6 z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
            <span>TweenLabs Animation Hub</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight text-[#2a2a2a] max-w-4xl leading-[1.05]">
            TweenLabs
            <span className="block mt-2 text-wtf-orange uppercase">
              GSAP Components
            </span>
          </h1>

          <p className="max-w-xl text-zinc-700 text-sm md:text-base leading-relaxed font-sans font-medium">
            Copy-paste production-ready GSAP components, scroll triggers, and layout transitions. Click on any card below to launch the sandbox.
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
                
                <h2 className="text-2xl font-sans font-black uppercase tracking-tight text-[#2a2a2a]">
                  {anim.name}
                </h2>
                
                <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed">
                  {anim.description}
                </p>
              </div>

              <div className="w-full mt-2 flex gap-3">
                <Link href={anim.route} className="flex-1">
                  <button className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150`}>
                    View →
                  </button>
                </Link>
                <a
                  href={`https://github.com/tweenlabs/gsap-playground/blob/master/src/app${anim.route}/page.tsx`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150`}>
                    Get Code
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* About & FAQ Section for GEO (Generative Engine Optimization) */}
      <section className="w-full max-w-7xl px-4 md:px-8 py-12 flex flex-col gap-8 z-10 border-t-3 border-[#2a2a2a] mt-8">
        <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-[#2a2a2a]">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
            <h3 className="text-lg font-mono font-bold text-wtf-orange uppercase">
              What is TweenLabs?
            </h3>
            <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
              TweenLabs is a curated library of high-fidelity, interactive, and portable GSAP components, UI templates, and scroll-triggered animations. Every resource is designed to be easily copy-pasted into your React and Next.js projects.
            </p>
          </div>

          <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
            <h3 className="text-lg font-mono font-bold text-wtf-purple uppercase">
              Are these GSAP components free?
            </h3>
            <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
              Yes, all TweenLabs animations and layouts are free and open-source. Simply click &quot;Get Code&quot; on any card, install the required packages, and drop the code directly into your codebase.
            </p>
          </div>

          <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
            <h3 className="text-lg font-mono font-bold text-wtf-green uppercase">
              What frameworks are supported?
            </h3>
            <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
              Our components are optimized for **React 19**, **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. They utilize standard clean packages like <code>@gsap/react</code> and <code>Lenis</code> smooth scrolling.
            </p>
          </div>

          <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
            <h3 className="text-lg font-mono font-bold text-wtf-blue uppercase">
              What kind of GSAP components are included?
            </h3>
            <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
              TweenLabs houses a wide range of creative mechanics: 3D hover tilt grids, kinetic wave typography, scroll-pinned parallax card decks, pointer drag carousel wheels, elastic fluid cursors, and animated SVG networks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t-3 border-[#2a2a2a] bg-[#f8f5ee] py-12 px-4 md:px-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-serif font-black text-lg text-[#2a2a2a]">
              TweenLabs
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

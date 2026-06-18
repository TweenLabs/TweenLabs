"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AnimationCard from "@/components/AnimationCard";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center selection:bg-wtf-yellow selection:text-black pt-16">
      
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <Header />

      <Hero />

      {/* Main Directory Grid */}
      <main className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animations.map((anim) => (
            <AnimationCard key={anim.id} anim={anim} />
          ))}
        </div>
      </main>

      <FAQ />

      <Footer />
    </div>
  );
}

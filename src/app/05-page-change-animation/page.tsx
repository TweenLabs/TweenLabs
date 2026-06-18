"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navItems = ["pulsars", "nebulae", "gravity", "supernova", "darkness"];

const hoverClasses: Record<string, string> = {
  pulsars: "hover:bg-[#0c9367] hover:text-white",
  nebulae: "hover:bg-[#c53b3a] hover:text-white",
  gravity: "hover:bg-[#3b82f6] hover:text-white",
  supernova: "hover:bg-[#f1b333] hover:text-black",
  darkness: "hover:bg-[#6758a5] hover:text-white",
};

export default function AnimationFivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(() => {
    // Set initial states for all panels and their content
    gsap.set(".panel-0", { y: "0vh", scale: 1, rotateX: 0, autoAlpha: 1 });
    gsap.set(".panel-1, .panel-2, .panel-3, .panel-4", { y: "100vh", scale: 1, rotateX: 0, autoAlpha: 0 });
    gsap.set(".panel-1-content, .panel-2-content, .panel-3-content, .panel-4-content", { y: "15vh" });

    // Master timeline linked to vertical scroll pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.3,
        start: "top top",
        end: "+=3000",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Dynamic calculation of active section to highlight sidebar items
          const progress = self.progress;
          const index = Math.min(Math.floor(progress * 4 + 0.5), 4);
          const active = navItems[index];

          // Directly update DOM nodes for high-performance scroll transitions
          navItems.forEach((item) => {
            const el = document.getElementById(`nav-${item}`);
            if (el) {
              if (item === active) {
                el.classList.add("shadow-[3px_3px_0px_#000]", "scale-105", "!rotate-[-4deg]");
                el.classList.remove("opacity-60", "rotate-[2deg]");
                if (item === "pulsars") {
                  el.style.backgroundColor = "#0c9367";
                  el.style.color = "white";
                } else if (item === "nebulae") {
                  el.style.backgroundColor = "#c53b3a";
                  el.style.color = "white";
                } else if (item === "gravity") {
                  el.style.backgroundColor = "#3b82f6";
                  el.style.color = "white";
                } else if (item === "supernova") {
                  el.style.backgroundColor = "#f1b333";
                  el.style.color = "black";
                } else if (item === "darkness") {
                  el.style.backgroundColor = "#6758a5";
                  el.style.color = "white";
                }
              } else {
                el.style.backgroundColor = "";
                el.style.color = "";
                el.classList.remove("shadow-[3px_3px_0px_#000]", "scale-105", "!rotate-[-4deg]");
                el.classList.add("opacity-60", "rotate-[2deg]");
              }
            }
          });
        }
      }
    });

    tlRef.current = tl;

    // Initial hold so user reads the first panel
    tl.addLabel("pulsars", 0);
    tl.to({}, { duration: 0.1 });

    /*
     * PREMIUM 3D STACKED + PARALLAX TRANSITIONS:
     *
     *  INCOMING  ─ slides up from y:100vh → y:0 over 1.4s (power3.out).
     *              its inner content container slides up from y:15vh → y:0 in sync to create
     *              a beautiful 3D parallax depth effect.
     *  OUTGOING  ─ scales down slightly to 0.85, tilts back (rotateX: 12), and dims (opacity: 0.4)
     *              over the same 1.4s (power3.out). This preserves it as a background stacked layer
     *              until the incoming card completely slides over and covers it.
     *  CLEANUP   ─ the card that is 2 steps back fades out completely (autoAlpha: 0) to save GPU memory.
     */

    // — TRANSITION 1: Green (Pulsars) → Red (Nebulae) —
    tl.set(".panel-1", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
    tl.set(".panel-1-content", { y: "15vh" });
    tl.to(".panel-1", { y: "0vh", duration: 1.4, ease: "power3.out" });
    tl.to(".panel-1-content", { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");
    tl.to(".panel-0", {
      scale: 0.85, y: "-8vh", rotateX: 12, opacity: 0.4,
      transformOrigin: "center 30%", duration: 1.4, ease: "power3.out",
    }, "<");
    tl.addLabel("nebulae");
    tl.to({}, { duration: 0.1 });

    // — TRANSITION 2: Red (Nebulae) → Blue (Gravity) —
    tl.set(".panel-2", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
    tl.set(".panel-2-content", { y: "15vh" });
    tl.to(".panel-2", { y: "0vh", duration: 1.4, ease: "power3.out" });
    tl.to(".panel-2-content", { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");
    tl.to(".panel-1", {
      scale: 0.85, y: "-8vh", rotateX: 12, opacity: 0.4,
      transformOrigin: "center 30%", duration: 1.4, ease: "power3.out",
    }, "<");
    tl.to(".panel-0", { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<");
    tl.addLabel("gravity");
    tl.to({}, { duration: 0.1 });

    // — TRANSITION 3: Blue (Gravity) → Yellow (Supernova) —
    tl.set(".panel-3", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
    tl.set(".panel-3-content", { y: "15vh" });
    tl.to(".panel-3", { y: "0vh", duration: 1.4, ease: "power3.out" });
    tl.to(".panel-3-content", { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");
    tl.to(".panel-2", {
      scale: 0.85, y: "-8vh", rotateX: 12, opacity: 0.4,
      transformOrigin: "center 30%", duration: 1.4, ease: "power3.out",
    }, "<");
    tl.to(".panel-1", { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<");
    tl.addLabel("supernova");
    tl.to({}, { duration: 0.1 });

    // — TRANSITION 4: Yellow (Supernova) → Purple (Darkness) —
    tl.set(".panel-4", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
    tl.set(".panel-4-content", { y: "15vh" });
    tl.to(".panel-4", { y: "0vh", duration: 1.4, ease: "power3.out" });
    tl.to(".panel-4-content", { y: "0vh", duration: 1.4, ease: "power3.out" }, "<");
    tl.to(".panel-3", {
      scale: 0.85, y: "-8vh", rotateX: 12, opacity: 0.4,
      transformOrigin: "center 30%", duration: 1.4, ease: "power3.out",
    }, "<");
    tl.to(".panel-2", { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<");
    tl.addLabel("darkness");
    tl.to({}, { duration: 0.1 }); // final hold

  }, { scope: containerRef });

  const handleNavClick = (label: string) => {
    const tl = tlRef.current;
    if (tl && tl.scrollTrigger) {
      const scrollPos = tl.scrollTrigger.labelToScroll(label);
      if (lenis) {
        lenis.scrollTo(scrollPos);
      } else {
        window.scrollTo({
          top: scrollPos,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1e1e1e] overflow-hidden" ref={containerRef}>
      {/* Tactile Noise Overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[49] opacity-40" />

      {/* Dashboard Back Link */}
      <div className="fixed left-6 top-6 z-50">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
          className="brutalist-btn bg-[#f8f5ee] text-[#2a2a2a] px-4 py-2 text-xs font-mono font-bold uppercase rounded-md cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000]"
        >
          ← Back
        </button>
      </div>

      {/* Floating Navigator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item}
            id={`nav-${item}`}
            onClick={() => handleNavClick(item)}
            className={`w-28 text-left border-2 border-black bg-white text-[#2a2a2a] px-3 py-1.5 font-mono font-bold text-[10px] uppercase rounded shadow-[2px_2px_0px_rgba(0,0,0,0.85)] cursor-pointer transform rotate-[2deg] transition-all duration-200 hover:scale-105 opacity-60 hover:opacity-100 ${hoverClasses[item]}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Pinned Scroll Section Container — perspective + preserve-3d enables rotateX fall-back */}
      <div ref={scrollSectionRef} className="scroll-viewport h-screen w-full relative overflow-hidden" style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}>
        
        {/* PANEL 0: GREEN SECTION (Pulsars) */}
        <section className="panel-item panel-0 absolute inset-0 bg-[#0c9367] text-white flex flex-col justify-between p-8 md:p-16 z-10 select-none">
          <div className="flex justify-between items-center w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ cosmos-05 / module-01</span>
            <span className="font-serif font-black text-xl tracking-tight">COSMOS</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
              PULSARS & BEACONS
            </h1>
            <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
              Rapidly rotating neutron stars that emit highly focused beams of electromagnetic radiation. Observed as periodic pulses of energy as their beams sweep across the Earth.
            </p>
            <div className="flex gap-4 mt-2">
              <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                Explore Pulsars
              </button>
              <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                View Spectral Data
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Recent Discoveries:</span>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
              {[
                { ep: "PSR B1919+21", title: "First Pulsar Discovered", dur: "1.33 SEC PERIOD" },
                { ep: "CRAB NEBULA", title: "Young Energetic Pulsar", dur: "33 MSEC PERIOD" },
                { ep: "VELA PULSAR", title: "Gamma-Ray Source", dur: "89 MSEC PERIOD" },
                { ep: "J1748-2446AD", title: "Fastest Spinning Star", dur: "716 HZ ROTATION" },
              ].map((item, i) => (
                <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                  <span className="font-mono text-[9px] font-bold text-zinc-400">{item.ep}</span>
                  <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                  <span className="font-mono text-[8px] font-bold text-zinc-500">{item.dur}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PANEL 1: RED SECTION (Nebulae) */}
        <section className="panel-item panel-1 absolute inset-0 bg-[#c53b3a] text-white flex flex-col justify-between p-8 md:p-16 z-[12] select-none">
          <div className="panel-1-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ cosmos-05 / module-02</span>
              <span className="font-serif font-black text-xl tracking-tight">COSMOS</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                STELLAR NEBULAE
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Giant interstellar clouds of dust, hydrogen, helium, and other ionized gases where new solar systems and stars are born over millions of years of gravitational collapse.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Catalog Nebulae
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Hubble Gallery
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Nebula Highlights:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "ORION M42", title: "Brightest Diffuse Nebula", size: "1,344 LIGHT YRS" },
                  { tag: "EAGLE M16", title: "Pillars of Creation", size: "7,000 LIGHT YRS" },
                  { tag: "CARINA NGC 3372", title: "Massive Hypergiant Star", size: "8,500 LIGHT YRS" },
                  { tag: "HELIX NGC 7293", title: "Planetary Cosmic Eye", size: "650 LIGHT YRS" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 2: BLUE SECTION (Gravity) */}
        <section className="panel-item panel-2 absolute inset-0 bg-[#3b82f6] text-white flex flex-col justify-between p-8 md:p-16 z-[14] select-none">
          <div className="panel-2-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ cosmos-05 / module-03</span>
              <span className="font-serif font-black text-xl tracking-tight">COSMOS</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                EVENT HORIZONS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Gravitational fields so intense that nothing—no particles or electromagnetic radiation—can escape from them. Space-time is warped infinitely at the singularity.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Hawking Radiation
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Simulate Orbit
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Key Singularities:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "SAGITTARIUS A*", title: "Milky Way Center Core", date: "4.1M SOLAR MASS" },
                  { tag: "M87* SINGULARITY", title: "First Directly Imaged", date: "6.5B SOLAR MASS" },
                  { tag: "TON 618", title: "Largest Known Hole", date: "66B SOLAR MASS" },
                  { tag: "CYGNUS X-1", title: "Stellar-Mass Black Hole", date: "21.2 SOLAR MASS" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 3: YELLOW SECTION (Supernova) */}
        <section className="panel-item panel-3 absolute inset-0 bg-[#f1b333] text-[#2a2a2a] flex flex-col justify-between p-8 md:p-16 z-[16] select-none">
          <div className="panel-3-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ cosmos-05 / module-04</span>
              <span className="font-serif font-black text-xl tracking-tight">COSMOS</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-[#2a2a2a] pb-3">
                COSMIC EXPLOSIONS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90 text-zinc-800">
                The final spectacular collapse of massive stars, seeding the surrounding space with heavy elements like gold, platinum, and iron necessary for the formation of planets and life.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-[#2a2a2a] px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Elemental Yields
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Map Remnants
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Supernova Remnants:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { type: "SN 1054", name: "Crab Nebula Exploded", grant: "OBSERVED 1054 AD" },
                  { type: "CASSIOPEIA A", name: "Brightest Radio Source", grant: "340 YEARS OLD" },
                  { type: "SN 1987A", name: "Closest Observed Star", grant: "168K LIGHT YRS" },
                  { type: "KEPLER'S REMNANT", name: "Last Milky Way Supernova", grant: "OBSERVED 1604 AD" },
                ].map((item, i) => (
                  <div key={i} className="bg-white text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.type}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.name}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.grant}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 4: PURPLE SECTION (Darkness) */}
        <section className="panel-item panel-4 absolute inset-0 bg-[#6758a5] text-white flex flex-col justify-between p-8 md:p-16 z-[18] select-none">
          <div className="panel-4-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ cosmos-05 / module-05</span>
              <span className="font-serif font-black text-xl tracking-tight">COSMOS</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                THE INVISIBLE WEB
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Mysterious components making up 95% of the total universe. Dark matter binds galaxies together structurally, while dark energy accelerates the expansion of space-time itself.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  WIMP Experiments
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Map Expansion
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Astrophysics Focus:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "COSMIC WEB", title: "Dark Matter Filaments", location: "LARGE-SCALE CORE" },
                  { tag: "BULLET CLUSTER", title: "Matter-Separation Proof", location: "EMPIRICAL PROOF" },
                  { tag: "LAMBDA-CDM", title: "Big Bang Cosmology Model", location: "STANDARD MODEL" },
                  { tag: "WFIRST MISSION", title: "Nancy Roman Telescope", location: "LAUNCHING 2027" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

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

  useGSAP(
    () => {
      // Set initial states for all panels and their content
      gsap.set(".panel-0", { y: "0vh", scale: 1, rotateX: 0, autoAlpha: 1 });
      gsap.set(".panel-1, .panel-2, .panel-3, .panel-4", {
        y: "100vh",
        scale: 1,
        rotateX: 0,
        autoAlpha: 0,
      });
      gsap.set(
        ".panel-1-content, .panel-2-content, .panel-3-content, .panel-4-content",
        { y: "15vh" },
      );

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      // Master timeline linked to vertical scroll pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
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
              const el = containerRef.current?.querySelector(
                `#nav-${item}`,
              ) as HTMLElement | null;
              if (el) {
                if (item === active) {
                  el.classList.add(
                    "shadow-[3px_3px_0px_#000]",
                    "scale-105",
                    "!rotate-[-4deg]",
                  );
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
                  el.classList.remove(
                    "shadow-[3px_3px_0px_#000]",
                    "scale-105",
                    "!rotate-[-4deg]",
                  );
                  el.classList.add("opacity-60", "rotate-[2deg]");
                }
              }
            });
          },
        },
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
      tl.to(
        ".panel-1-content",
        { y: "0vh", duration: 1.4, ease: "power3.out" },
        "<",
      );
      tl.to(
        ".panel-0",
        {
          scale: 0.85,
          y: "-8vh",
          rotateX: 12,
          opacity: 0.4,
          transformOrigin: "center 30%",
          duration: 1.4,
          ease: "power3.out",
        },
        "<",
      );
      tl.addLabel("nebulae");
      tl.to({}, { duration: 0.1 });

      // — TRANSITION 2: Red (Nebulae) → Blue (Gravity) —
      tl.set(".panel-2", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
      tl.set(".panel-2-content", { y: "15vh" });
      tl.to(".panel-2", { y: "0vh", duration: 1.4, ease: "power3.out" });
      tl.to(
        ".panel-2-content",
        { y: "0vh", duration: 1.4, ease: "power3.out" },
        "<",
      );
      tl.to(
        ".panel-1",
        {
          scale: 0.85,
          y: "-8vh",
          rotateX: 12,
          opacity: 0.4,
          transformOrigin: "center 30%",
          duration: 1.4,
          ease: "power3.out",
        },
        "<",
      );
      tl.to(
        ".panel-0",
        { autoAlpha: 0, duration: 0.5, ease: "power3.out" },
        "<",
      );
      tl.addLabel("gravity");
      tl.to({}, { duration: 0.1 });

      // — TRANSITION 3: Blue (Gravity) → Yellow (Supernova) —
      tl.set(".panel-3", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
      tl.set(".panel-3-content", { y: "15vh" });
      tl.to(".panel-3", { y: "0vh", duration: 1.4, ease: "power3.out" });
      tl.to(
        ".panel-3-content",
        { y: "0vh", duration: 1.4, ease: "power3.out" },
        "<",
      );
      tl.to(
        ".panel-2",
        {
          scale: 0.85,
          y: "-8vh",
          rotateX: 12,
          opacity: 0.4,
          transformOrigin: "center 30%",
          duration: 1.4,
          ease: "power3.out",
        },
        "<",
      );
      tl.to(
        ".panel-1",
        { autoAlpha: 0, duration: 0.5, ease: "power3.out" },
        "<",
      );
      tl.addLabel("supernova");
      tl.to({}, { duration: 0.1 });

      // — TRANSITION 4: Yellow (Supernova) → Purple (Darkness) —
      tl.set(".panel-4", { y: "100vh", rotateX: 0, scale: 1, autoAlpha: 1 });
      tl.set(".panel-4-content", { y: "15vh" });
      tl.to(".panel-4", { y: "0vh", duration: 1.4, ease: "power3.out" });
      tl.to(
        ".panel-4-content",
        { y: "0vh", duration: 1.4, ease: "power3.out" },
        "<",
      );
      tl.to(
        ".panel-3",
        {
          scale: 0.85,
          y: "-8vh",
          rotateX: 12,
          opacity: 0.4,
          transformOrigin: "center 30%",
          duration: 1.4,
          ease: "power3.out",
        },
        "<",
      );
      tl.to(
        ".panel-2",
        { autoAlpha: 0, duration: 0.5, ease: "power3.out" },
        "<",
      );
      tl.addLabel("darkness");
      tl.to({}, { duration: 0.1 }); // final hold
    },
    { scope: containerRef },
  );

  const handleNavClick = (label: string) => {
    const tl = tlRef.current;
    if (tl?.scrollTrigger) {
      const scrollPos = tl.scrollTrigger.labelToScroll(label);
      window.scrollTo({
        top: scrollPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="relative min-h-screen bg-[#1e1e1e] overflow-hidden"
      ref={containerRef}
    >
      {/* Tactile Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[49] opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Main Pinned Scroll Section Container — perspective + preserve-3d enables rotateX fall-back */}
      <div
        ref={scrollSectionRef}
        className="scroll-viewport h-screen w-full relative overflow-hidden"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 40%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Floating Navigator — inside pinned section so it stays visible */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
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

        {/* PANEL 0: GREEN SECTION (Pulsars) */}
        <section className="panel-item panel-0 absolute inset-0 bg-[#0c9367] text-white flex flex-col justify-between p-8 md:p-16 z-10 select-none">
          <div className="flex justify-between items-center w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
              / cosmos-05 / module-01
            </span>
            <span className="font-serif font-black text-xl tracking-tight">
              COSMOS
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
              PULSARS & BEACONS
            </h1>
            <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
              Rapidly rotating neutron stars that emit highly focused beams of
              electromagnetic radiation. Observed as periodic pulses of energy
              as their beams sweep across the Earth.
            </p>
          </div>

          <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-wider opacity-75">
            <span>SCROLL OR CLICK TO NAVIGATE</span>
            <span>01 // 05</span>
          </div>
        </section>

        {/* PANEL 1: RED SECTION (Nebulae) */}
        <section className="panel-item panel-1 absolute inset-0 bg-[#c53b3a] text-white flex flex-col justify-between p-8 md:p-16 z-[12] select-none">
          <div className="panel-1-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                / cosmos-05 / module-02
              </span>
              <span className="font-serif font-black text-xl tracking-tight">
                COSMOS
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                STELLAR NEBULAE
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Giant interstellar clouds of dust, hydrogen, helium, and other
                ionized gases where new solar systems and stars are born over
                millions of years of gravitational collapse.
              </p>
            </div>

            <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-wider opacity-75">
              <span>SCROLL OR CLICK TO NAVIGATE</span>
              <span>02 // 05</span>
            </div>
          </div>
        </section>

        {/* PANEL 2: BLUE SECTION (Gravity) */}
        <section className="panel-item panel-2 absolute inset-0 bg-[#3b82f6] text-white flex flex-col justify-between p-8 md:p-16 z-[14] select-none">
          <div className="panel-2-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                / cosmos-05 / module-03
              </span>
              <span className="font-serif font-black text-xl tracking-tight">
                COSMOS
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                EVENT HORIZONS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Gravitational fields so intense that nothing—no particles or
                electromagnetic radiation—can escape from them. Space-time is
                warped infinitely at the singularity.
              </p>
            </div>

            <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-wider opacity-75">
              <span>SCROLL OR CLICK TO NAVIGATE</span>
              <span>03 // 05</span>
            </div>
          </div>
        </section>

        {/* PANEL 3: YELLOW SECTION (Supernova) */}
        <section className="panel-item panel-3 absolute inset-0 bg-[#f1b333] text-[#2a2a2a] flex flex-col justify-between p-8 md:p-16 z-[16] select-none">
          <div className="panel-3-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                / cosmos-05 / module-04
              </span>
              <span className="font-serif font-black text-xl tracking-tight">
                COSMOS
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-[#2a2a2a] pb-3">
                COSMIC EXPLOSIONS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90 text-zinc-800">
                The final spectacular collapse of massive stars, seeding the
                surrounding space with heavy elements like gold, platinum, and
                iron necessary for the formation of planets and life.
              </p>
            </div>

            <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-wider opacity-75">
              <span>SCROLL OR CLICK TO NAVIGATE</span>
              <span>04 // 05</span>
            </div>
          </div>
        </section>

        {/* PANEL 4: PURPLE SECTION (Darkness) */}
        <section className="panel-item panel-4 absolute inset-0 bg-[#6758a5] text-white flex flex-col justify-between p-8 md:p-16 z-[18] select-none">
          <div className="panel-4-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                / cosmos-05 / module-05
              </span>
              <span className="font-serif font-black text-xl tracking-tight">
                COSMOS
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                THE INVISIBLE WEB
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Mysterious components making up 95% of the total universe. Dark
                matter binds galaxies together structurally, while dark energy
                accelerates the expansion of space-time itself.
              </p>
            </div>

            <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-wider opacity-75">
              <span>SCROLL OR CLICK TO NAVIGATE</span>
              <span>05 // 05</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

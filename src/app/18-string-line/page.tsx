"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/all";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

interface NetworkItem {
  id: number;
  title: string;
  imgUrl: string;
  x: string;
  y: string;
  accentHex: string;
  themeColor: string;
}

const networkData: NetworkItem[] = [
  { id: 1, title: "Discover", imgUrl: "/Untitled design.png", x: "50%", y: "22%", accentHex: "229, 91, 60", themeColor: "bg-wtf-orange" },
  { id: 2, title: "Explore", imgUrl: "/Untitled design (1).png", x: "66%", y: "26%", accentHex: "12, 147, 103", themeColor: "bg-wtf-green" },
  { id: 3, title: "Interact", imgUrl: "/Untitled design (2).png", x: "79%", y: "34%", accentHex: "241, 179, 51", themeColor: "bg-wtf-yellow" },
  { id: 4, title: "Connect", imgUrl: "/Untitled design (3).png", x: "81%", y: "50%", accentHex: "59, 130, 246", themeColor: "bg-wtf-blue" },
  { id: 5, title: "Engage", imgUrl: "/Untitled design (4).png", x: "76%", y: "71%", accentHex: "103, 88, 165", themeColor: "bg-wtf-purple" },
  { id: 6, title: "Immerse", imgUrl: "/Untitled design.png", x: "58%", y: "81%", accentHex: "229, 91, 60", themeColor: "bg-wtf-orange" },
  { id: 7, title: "Navigate", imgUrl: "/Untitled design (1).png", x: "41%", y: "83%", accentHex: "12, 147, 103", themeColor: "bg-wtf-green" },
  { id: 8, title: "Experience", imgUrl: "/Untitled design (2).png", x: "20%", y: "60%", accentHex: "241, 179, 51", themeColor: "bg-wtf-yellow" },
  { id: 9, title: "Remember", imgUrl: "/Untitled design (3).png", x: "15%", y: "45%", accentHex: "59, 130, 246", themeColor: "bg-wtf-blue" },
  { id: 10, title: "Return", imgUrl: "/Untitled design (4).png", x: "28%", y: "34%", accentHex: "103, 88, 165", themeColor: "bg-wtf-purple" },
];

export default function StringLinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  useGSAP(() => {
    const path = document.querySelector("#network-path") as SVGPathElement | null;
    const dot = document.querySelector(".moving-dot") as HTMLDivElement | null;
    const cards = document.querySelectorAll(".im-card");

    if (!path) return;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const cardCenters = Array.from(cards).map((card) => {
      const htmlCard = card as HTMLElement;
      const xPct = parseFloat(htmlCard.style.left) / 100;
      const yPct = parseFloat(htmlCard.style.top) / 100;
      return {
        svgX: xPct * 1600,
        svgY: yPct * 900,
        card: htmlCard,
      };
    });

    const SAMPLES = 600;
    const pathSamples: { t: number; x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = (i / SAMPLES) * pathLength;
      const pt = path.getPointAtLength(t);
      pathSamples.push({ t: i / SAMPLES, x: pt.x, y: pt.y });
    }

    const cardProgressMap = cardCenters.map(({ svgX, svgY, card }) => {
      let closestProgress = 0;
      let closest = Infinity;

      for (const sample of pathSamples) {
        const dx = sample.x - svgX;
        const dy = sample.y - svgY;
        const dist = dx * dx + dy * dy;

        if (dist < closest) {
          closest = dist;
          closestProgress = sample.t;
        }
      }
      return { card, progress: closestProgress };
    });

    gsap.set(cards, { scale: 0.85 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setCurrentProgress(Math.round(progress * 100));

          const pastelColors = [
            "#FFE5EC", // soft pink
            "#E0FFFE", // light cyan
            "#F3E8FF", // lavender
            "#ECFDF5", // pale green
            "#FFFBEB", // pale yellow
            "#EFF6FF", // soft blue
            "#FAF5FF", // soft purple
            "#FFF0F5", // pale rose
            "#FFE8D6", // pale orange
            "#F0FDF4", // soft mint
          ];

          cardProgressMap.forEach(({ card, progress: cardProg }, index) => {
            const activationWindow = 0.06;
            const proximity = Math.max(
              0,
              1 - Math.abs(progress - cardProg) / activationWindow
            );

            const scale = progress >= cardProg ? 1.08 : 0.85 + 0.23 * proximity;

            const colorInterpolator = gsap.utils.interpolate("#ffffff", pastelColors[index % pastelColors.length]);
            const backgroundColor = colorInterpolator(progress >= cardProg ? 1 : proximity);

            gsap.set(card, { scale, backgroundColor });
          });
        }
      }
    });

    tl.to(path, {
      strokeDashoffset: 0,
      ease: "none",
    }, 0);

    tl.to(dot, {
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5]
      },
      ease: "none",
    }, 0);

  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 3D Card tilt on hover
  const handleCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  const handleCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  return (
    <div className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black">
      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto">
        <button
        onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
        className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer"
        
      >
        ← Back
      </button>
      </div>

      <section
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-white border-y-3 border-[#2a2a2a] select-none font-sans"
      >
        {/* Console readout display (Top center/right) */}
        <div className="absolute top-6 right-6 z-30 font-mono text-[9px] md:text-[10px] font-bold text-zinc-500 text-right flex flex-col gap-1">
          <span>[ SYSTEM: TRACKING ]</span>
          <span>PATH PROGRESS: {currentProgress}%</span>
        </div>

        {/* Decorative typography background */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
          <h1 className="text-4xl md:text-7xl font-serif font-black text-center text-[#2a2a2a]/10 uppercase tracking-tight leading-none">
            DESIGNED TO FEEL ALIVE
          </h1>
        </div>

        <svg
          id="team-svg"
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            id="network-path"
            d="
              M 800, 198
              C 950, 190 980, 50 1056, 234
              C 1120, 350 1200, 100 1264, 306
              C 1320, 450 1150, 420 1296, 450
              C 1420, 480 1250, 600 1216, 639
              C 1180, 680 1280, 820 1216, 639
              C 1120, 420 850, 750 928, 729
              C 1000, 710 940, 850 928, 729
              C 900, 600 750, 700 656, 747
              C 550, 800 600, 920 656, 747
              C 720, 580 500, 750 480, 747
              C 400, 740 380, 850 320, 540
              C 280, 300 180, 650 240, 405
              C 280, 200 100, 420 240, 405
              C 380, 390 320, 500 448, 306
              C 520, 180 350, 220 448, 306
              C 520, 380 680, 210 800, 198
              Z
            "
            stroke="#2a2a2a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Moving Dot with halo pulses */}
        <div className="moving-dot absolute top-0 left-0 w-6 h-6 rounded-full bg-wtf-orange border-2 border-[#2a2a2a] z-10 shadow-[2px_2px_0px_#2a2a2a] flex items-center justify-center">
          {/* Pulsing halo ring */}
          <span className="absolute h-10 w-10 border-2 border-wtf-orange/30 rounded-full animate-ping pointer-events-none" />
        </div>

        {/* Network Nodes */}
        {networkData.map((item, i) => {
          return (
            <div
              key={i}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="group im-card absolute flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#2a2a2a] bg-white shadow-[3px_3px_0px_#2a2a2a] z-20 cursor-pointer select-none"
              style={{
                left: item.x,
                top: item.y,
                transform: "translate(-50% , -50%)",
                transformOrigin: "center center",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Spotlight hover effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-0"
                style={{
                  background: `radial-gradient(100px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${item.accentHex}, 0.1), transparent 85%)`,
                }}
              />

              {/* Framed Image */}
              <div
                className="w-10 h-10 rounded-full border-2 border-[#2a2a2a] relative overflow-hidden flex-shrink-0 z-10"
                style={{ transform: "translateZ(10px)" }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={item.imgUrl}
                  alt=""
                />
              </div>

              {/* Title / Info */}
              <div className="flex flex-col relative z-10" style={{ transform: "translateZ(15px)" }}>
                <h2 className="uppercase text-[11px] font-serif font-black tracking-tight text-[#2a2a2a] leading-none">
                  {item.title}
                </h2>
                <span className="font-mono text-[7px] text-zinc-400 font-bold tracking-wider mt-0.5">
                  [ X: {item.x} | Y: {item.y} ]
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

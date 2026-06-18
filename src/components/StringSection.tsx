"use client";

import img1 from "../../public/Untitled design.png";
import img2 from "../../public/Untitled design (1).png";
import img3 from "../../public/Untitled design (2).png";
import img4 from "../../public/Untitled design (3).png";
import img5 from "../../public/Untitled design (4).png";
import Link from "next/link";

const images = [
    { image: img1.src, title: "Discover", x: "50%", y: "22%" },
    { image: img2.src, title: "Explore", x: "66%", y: "26%" },
    { image: img3.src, title: "Interact", x: "79%", y: "34%" },
    { image: img4.src, title: "Connect", x: "81%", y: "50%" },
    { image: img5.src, title: "Engage", x: "76%", y: "71%" },
    { image: img1.src, title: "Immerse", x: "58%", y: "81%" },
    { image: img2.src, title: "Navigate", x: "41%", y: "83%" },
    { image: img3.src, title: "Experience", x: "20%", y: "60%" },
    { image: img4.src, title: "Remember", x: "15%", y: "45%" },
    { image: img5.src, title: "Return", x: "28%", y: "34%" },
];
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/all";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export const StringSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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

                        const scale = progress >= cardProg ? 1.1 : 0.85 + 0.25 * proximity;

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

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-white border-y-3 border-[#2a2a2a]">
            {/* Back Button Floating */}
            <div className="absolute top-4 left-4 z-50 pointer-events-auto">
                <Link href="/">
                    <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
                        ← Dashboard
                    </button>
                </Link>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <h1 className="text-4xl md:text-7xl font-black text-center text-gray-400 uppercase tracking-tight opacity-40">
                    DESIGNED TO FEEL ALIVE
                </h1>
            </div>

            <svg
                id="team-svg"
                className="absolute inset-0 w-full h-full"
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
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <div className="moving-dot absolute top-0 left-0 w-5 h-5 rounded-full bg-wtf-orange border-2 border-[#2a2a2a] -z-20 shadow-[2px_2px_0px_#2a2a2a]" />

            {images.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="im-card absolute flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#2a2a2a] bg-white shadow-[3px_3px_0px_#2a2a2a] z-20"
                        style={{
                            left: item.x,
                            top: item.y,
                            transform: "translate(-50% , -50%)",
                            transformOrigin: "center center",
                            willChange: "transform",
                        }}
                    >
                        <img
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#2a2a2a] -ml-2.5 shadow-[1px_1px_0px_#2a2a2a]"
                            src={item.image}
                            alt=""
                        />
                        <h2 className="uppercase text-xs font-mono font-bold whitespace-nowrap text-black tracking-wide">
                            {item.title}
                        </h2>
                    </div>
                );
            })}
        </section>
    );
};

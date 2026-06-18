"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLORS = ["#87BAB2", "#D56D88", "#F17752", "#F1A650"];

export const SvgLine = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    const pathData = `
        M -350 220
        H 300
        
        Q 380 220 380 300
        V 360
        Q 380 440 460 440
        
        H 760
        
        Q 860 440 860 540
        V 620
        Q 860 720 960 720
        
        H 1800
    `;

    useGSAP(() => {
        pathRefs.current.forEach((path, i) => {
            if (!path) return;
            const length = path.getTotalLength();

            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length + (COLORS.length - i - 1) * 80,
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    end: "bottom 95%",
                    scrub: 2,
                },
            });
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative h-[140vh] overflow-hidden bg-[#f0eadf] border-b-3 border-[#2a2a2a]"
        >
            {/* Back Button Floating */}
            <div className="absolute top-4 left-4 z-50 pointer-events-auto">
                <Link href="/">
                    <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
                        ← Dashboard
                    </button>
                </Link>
            </div>

            <svg
                viewBox="0 0 1600 1100"
                className="absolute left-0 top-25 h-full w-full"
                fill="none"
            >
                {COLORS.map((color, i) => (
                    <path
                        key={i}
                        ref={(el) => {
                            pathRefs.current[i] = el;
                        }}
                        d={pathData}
                        stroke={color}
                        strokeWidth="20"
                        strokeLinecap="butt"
                        strokeLinejoin="round"
                        style={{
                            transform: `translate(${i * 20}px, ${i * 20}px)`,
                        }}
                    />
                ))}
            </svg>

            <div className="absolute right-[7%] top-[40%] z-10 md:top-175 lg:top-180 xl:top-190 brutalist-card p-6 bg-[#2a2a2a] text-white rotate-2 shadow-[6px_6px_0px_#f1b333] border-3 border-[#2a2a2a]">
                <h1 className="md:text-5xl lg:text-6xl font-serif font-black leading-none uppercase tracking-tight">
                    Let's Chat
                </h1>
            </div>
        </section>
    );
};

const COLORS_TWO = ["#F4A261", "#E76F51", "#2A9D8F", "#E9C46A"];

export const SvgLineTwo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    const pathData = `
        M -200 550
        C 400 950, 400 150, 800 550
        S 1200 150, 1800 550
    `;

    useGSAP(() => {
        pathRefs.current.forEach((path, i) => {
            if (!path) return;
            const length = path.getTotalLength();

            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length + (COLORS_TWO.length - i - 1) * 80,
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    end: "bottom 95%",
                    scrub: 2,
                },
            });
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative h-[140vh] overflow-hidden bg-[#1a1a1a]"
        >
            <svg
                viewBox="0 0 1600 1100"
                className="absolute left-0 top-25 h-full w-full"
                fill="none"
            >
                {COLORS_TWO.map((color, i) => (
                    <path
                        key={i}
                        ref={(el) => {
                            pathRefs.current[i] = el;
                        }}
                        d={pathData}
                        stroke={color}
                        strokeWidth="20"
                        strokeLinecap="butt"
                        strokeLinejoin="round"
                        style={{
                            transform: `translate(${i * 20}px, ${i * 20}px)`,
                        }}
                    />
                ))}
            </svg>

            <div className="absolute left-[7%] top-[40%] z-10 md:top-175 lg:top-180 xl:top-190 brutalist-card p-6 bg-white text-[#2a2a2a] -rotate-2 shadow-[6px_6px_0px_#6758a5] border-3 border-[#2a2a2a]">
                <h1 className="md:text-5xl lg:text-6xl font-serif font-black leading-none uppercase tracking-tight">
                    Our Work
                </h1>
            </div>
        </section>
    );
};

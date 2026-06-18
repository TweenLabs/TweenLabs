"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

interface DockItem {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export default function MagneticDockPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dockItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const dockData: DockItem[] = [
    {
      id: "home",
      label: "HOME",
      color: "bg-wtf-orange text-white",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "PROJECTS",
      color: "bg-wtf-green text-white",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "about",
      label: "ABOUT",
      color: "bg-wtf-yellow text-black",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "services",
      label: "SERVICES",
      color: "bg-wtf-purple text-white",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "contact",
      label: "CONTACT",
      color: "bg-wtf-blue text-white",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const btn = dockItemsRef.current[index];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate distance from mouse to center of button
    const distanceX = e.clientX - btnCenterX;
    const distanceY = e.clientY - btnCenterY;

    // Apply a magnetic pull factor (adjust weight to make it stronger or softer)
    const pullX = distanceX * 0.35;
    const pullY = distanceY * 0.35;

    contextSafe(() => {
      gsap.to(btn, {
        x: pullX,
        y: pullY,
        scale: 1.15,
        rotation: pullX * 0.1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    })();
  };

  const handleMouseLeave = (index: number) => {
    const btn = dockItemsRef.current[index];
    if (!btn) return;

    contextSafe(() => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    })();
  };

  const handleClick = (id: string, index: number) => {
    setActiveItem(id);
    const btn = dockItemsRef.current[index];
    if (!btn) return;

    contextSafe(() => {
      // Springy click feedback (squash and stretch)
      const tl = gsap.timeline();
      tl.to(btn, {
        scaleX: 1.35,
        scaleY: 0.65,
        duration: 0.1,
        ease: "power1.out",
      })
        .to(btn, {
          scaleX: 0.8,
          scaleY: 1.25,
          duration: 0.15,
          ease: "power1.out",
        })
        .to(btn, {
          scaleX: 1.1,
          scaleY: 0.95,
          duration: 0.15,
        })
        .to(btn, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.2,
          ease: "elastic.out(1, 0.3)",
        });
    })();
  };

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-8 selection:bg-wtf-yellow selection:text-black overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Header Info */}
      <header className="z-10 w-full max-w-2xl text-center flex flex-col gap-4 mt-8">
        <div className="inline-flex self-center items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Component 11</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Interactive Magnetic Dock
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Hover over the bottom dock items to feel the magnetic attraction
          force. Click any button to trigger a premium squash-and-stretch
          animation.
        </p>
      </header>

      {/* Active Section Display */}
      <main className="z-10 flex-1 flex items-center justify-center w-full max-w-xl my-12">
        <div className="w-full brutalist-card p-12 bg-white flex flex-col gap-6 text-center justify-center items-center min-h-[200px]">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            [ Active Destination ]
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
            {activeItem ? activeItem : "No Selection"}
          </h2>
          <p className="text-xs font-mono bg-zinc-100 border-2 border-[#2a2a2a] px-4 py-1.5 rounded-md shadow-[2px_2px_0px_#2a2a2a]">
            {activeItem
              ? `Navigating to active portal: /${activeItem}`
              : "Hover and click below"}
          </p>
        </div>
      </main>

      {/* Dock Area Container */}
      <footer className="z-10 w-full flex flex-col items-center gap-8 mb-8">
        <div className="relative border-4 border-[#2a2a2a] bg-white px-6 py-4 rounded-3xl shadow-[8px_8px_0px_#2a2a2a] flex items-center gap-6 md:gap-8 justify-center max-w-full overflow-visible">
          {dockData.map((item, idx) => (
            <div
              key={item.id}
              className="relative group flex items-center justify-center w-14 h-14 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-[#2a2a2a] text-white text-[9px] font-mono font-bold px-3 py-1.5 rounded-md border border-white uppercase tracking-wider whitespace-nowrap shadow-[2px_2px_0px_#f1b333] tilt-left">
                  {item.label}
                </div>
              </div>

              {/* Magnetic Button Element */}
              <button
                ref={(el) => {
                  dockItemsRef.current[idx] = el;
                }}
                onClick={() => handleClick(item.id, idx)}
                className={`w-14 h-14 border-3 border-[#2a2a2a] rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_#2a2a2a] cursor-pointer will-change-transform ${item.color}`}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </footer>
    </div>
  );
}

"use client";

import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.04,
        wheelMultiplier: 0.9,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

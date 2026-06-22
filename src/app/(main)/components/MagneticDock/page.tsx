"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
// MagneticDock component needs to be imported from animations folder
// For now, creating a placeholder wrapper

export default function MagneticDockPage() {
  return (
    <main>
      <ComponentHeader
        title="Magnetic Dock"
        description="Premium floating menu bar where buttons pull dynamically toward the user's cursor."
        componentName="MagneticDock"
      />
      <div className="min-h-screen flex items-center justify-center bg-[#f0eadf]">
        <p className="text-center text-gray-600">Magnetic Dock Component</p>
      </div>
    </main>
  );
}

"use client";

/**
 * Reusable stat/info card with icon badge.
 * Used in the admin dashboard and anywhere you need a metric display.
 *
 * Usage:
 *   <InfoCard label="Total Views" value={1234} icon="📊" color="bg-wtf-blue" />
 */

interface InfoCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function InfoCard({
  label,
  value,
  icon,
  color = "bg-wtf-orange",
}: InfoCardProps) {
  return (
    <div className="brutalist-card p-5 bg-white flex items-center gap-4">
      <div
        className={`w-12 h-12 ${color} rounded-lg border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <p className="font-serif font-black text-2xl text-[#2a2a2a]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

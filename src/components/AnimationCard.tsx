"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

interface AnimationItem {
  id: string;
  name: string;
  route: string;
  bgColor: string;
  textColor: string;
  description: string;
  tiltClass: string;
}

interface AnimationCardProps {
  anim: AnimationItem;
}

const hoverColorsMap: Record<string, string> = {
  "bg-wtf-orange": "hover:bg-wtf-orange hover:text-white",
  "bg-wtf-green": "hover:bg-wtf-green hover:text-white",
  "bg-wtf-red": "hover:bg-wtf-red hover:text-white",
  "bg-wtf-blue": "hover:bg-wtf-blue hover:text-white",
  "bg-wtf-yellow": "hover:bg-wtf-yellow hover:text-black",
  "bg-wtf-purple": "hover:bg-wtf-purple hover:text-white",
};

export default function AnimationCard({ anim }: AnimationCardProps) {
  const router = useRouter();
  const { session } = useSession();
  const { openModal } = useAuthModal();

  const handleGetCode = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/code/${anim.route.slice(1)}`;
    if (session) {
      router.push(targetUrl);
    } else {
      openModal(anim.route, true);
    }
  };

  return (
    <div className="brutalist-card brutalist-card-interactive p-6 bg-white flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-sm text-zinc-500">
            [{anim.id}]
          </span>
          <span
            className={`inline-flex items-center gap-2 border-2 border-[#2a2a2a] px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${anim.bgColor} ${anim.textColor} shadow-[1.5px_1.5px_0px_#2a2a2a] ${anim.tiltClass}`}
          >
            Theme Color
          </span>
        </div>

        <h2 className="text-2xl font-sans font-black uppercase tracking-tight text-[#2a2a2a]">
          {anim.name}
        </h2>

        <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed">
          {anim.description}
        </p>
      </div>

      <div className="w-full mt-2 flex gap-3">
        <Link href={anim.route} className="flex-1">
          <button
            className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150`}
          >
            View →
          </button>
        </Link>
        <button
          onClick={handleGetCode}
          className={`flex-1 brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150`}
        >
          Get Code
        </button>
      </div>
    </div>
  );
}

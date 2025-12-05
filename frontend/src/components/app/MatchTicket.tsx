"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { TrendingUp } from "lucide-react";

interface MatchTicketProps {
  teamA: string;
  logoA: StaticImageData;
  colorA: string;
  liquidityA?: string;
  teamB: string;
  logoB: StaticImageData;
  colorB: string;
  liquidityB?: string;
  time: string;
  stadium: string;
  status?: "LIVE" | "UPCOMING" | "ENDED";
}

export function MatchTicket({
  teamA,
  logoA,
  colorA,
  liquidityA = "$125,400",
  teamB,
  logoB,
  colorB,
  liquidityB = "$98,200",
  time,
  stadium,
  status = "UPCOMING",
}: MatchTicketProps) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-acid/50 hover:bg-white/10">
        {/* Header Status */}
        <div className="flex items-center justify-center border-b border-white/5 py-3 bg-black/20">
             <span className={`font-space text-xs font-bold tracking-wider ${status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-white/60'}`}>
                {status === 'LIVE' ? 'LIVE 🔴' : time} • {stadium}
             </span>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 divide-x divide-white/10 relative">
            {/* VS Badge Absolute Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight border border-white/10 font-anton text-white text-sm">
                    VS
                </div>
            </div>

            {/* Team A */}
            <div className="flex flex-col items-center p-6 text-center group/a">
                <div className="relative mb-4 h-20 w-20 transition-transform group-hover/a:scale-110">
                    <Image src={logoA} alt={teamA} fill className="object-contain" />
                </div>
                <h3 className="font-anton text-2xl text-white mb-1">{teamA}</h3>
                
                {/* Liquidity A */}
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold mb-6">
                    <TrendingUp className="h-3 w-3" />
                    <span>{liquidityA}</span>
                </div>

                <button className="w-full rounded-xl bg-white/5 py-3 font-anton text-sm uppercase tracking-wide text-white transition-colors hover:bg-acid hover:text-midnight">
                    Bet {teamA}
                </button>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center p-6 text-center group/b">
                <div className="relative mb-4 h-20 w-20 transition-transform group-hover/b:scale-110">
                    <Image src={logoB} alt={teamB} fill className="object-contain" />
                </div>
                <h3 className="font-anton text-2xl text-white mb-1">{teamB}</h3>
                
                {/* Liquidity B */}
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold mb-6">
                    <TrendingUp className="h-3 w-3" />
                    <span>{liquidityB}</span>
                </div>

                <button className="w-full rounded-xl bg-white/5 py-3 font-anton text-sm uppercase tracking-wide text-white transition-colors hover:bg-acid hover:text-midnight">
                    Bet {teamB}
                </button>
            </div>
        </div>
    </div>
  );
}

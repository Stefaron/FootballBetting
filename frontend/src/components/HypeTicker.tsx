"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Import logos
import Arsenal from "@/assets/Arsenal.png";
import Barca from "@/assets/Barca.png";
import Chelsea from "@/assets/Chelsea.png";
import Liverpool from "@/assets/Liverpool.png";
import ManCity from "@/assets/Manchester City.png";
import ManUtd from "@/assets/Manchester United.png";
import PSG from "@/assets/PSG.png";
import RealMadrid from "@/assets/Real Madrid.png";

const MATCHES = [
  { teamA: "MAN CITY", logoA: ManCity, teamB: "LIVERPOOL", logoB: Liverpool, time: "LIVE 🔴" },
  { teamA: "REAL MADRID", logoA: RealMadrid, teamB: "BARCELONA", logoB: Barca, time: "20:45" },
  { teamA: "ARSENAL", logoA: Arsenal, teamB: "CHELSEA", logoB: Chelsea, time: "TOMORROW" },
  { teamA: "PSG", logoA: PSG, teamB: "MAN UTD", logoB: ManUtd, time: "21:00" },
];

export function HypeTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-acid py-3 border-y border-midnight/10">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
          className="flex gap-12 pr-12"
        >
          {[...MATCHES, ...MATCHES, ...MATCHES].map((match, i) => (
            <div key={i} className="flex items-center gap-8">
              {/* Match item */}
              <div className="flex items-center gap-4 px-2">
                <Image src={match.logoA} alt={match.teamA} width={40} height={40} className="object-contain h-10 w-10" />
                <span className="font-anton text-xl text-midnight/30">VS</span>
                <Image src={match.logoB} alt={match.teamB} width={40} height={40} className="object-contain h-10 w-10" />
              </div>

              {/* Time badge */}
              {/* <div className="px-3 py-1 bg-midnight text-acid text-xs font-space font-bold rounded-full whitespace-nowrap">
                {match.time}
              </div> */}

              {/* Separator always outside */}
              <div className="w-px h-6 bg-midnight/20" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

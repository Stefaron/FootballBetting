"use client";
import { motion } from "framer-motion";

const MATCHES = [
  { id: 1, teamA: "Manchester United", teamB: "Liverpool", time: "20:00 WIB", tvl: "$50,000" },
  { id: 2, teamA: "Real Madrid", teamB: "Barcelona", time: "02:00 WIB", tvl: "$120,000" },
  { id: 3, teamA: "Arsenal", teamB: "Chelsea", time: "22:30 WIB", tvl: "$45,000" },
  { id: 4, teamA: "Juventus", teamB: "AC Milan", time: "01:45 WIB", tvl: "$30,000" },
  { id: 5, teamA: "Bayern Munich", teamB: "Dortmund", time: "23:30 WIB", tvl: "$80,000" },
];

export function LiveTicker() {
  return (
    <div className="w-full bg-background-secondary border-y border-white/5 py-6 overflow-hidden flex relative z-20">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background-secondary to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background-secondary to-transparent z-10" />
      
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...MATCHES, ...MATCHES].map((match, i) => (
          <div key={i} className="flex items-center mx-8 space-x-4 text-sm md:text-base font-mono text-text-secondary border border-white/10 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:border-accent-primary/50 transition-colors cursor-pointer group">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold group-hover:text-accent-primary transition-colors">{match.teamA} vs {match.teamB}</span>
            <span className="bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded text-xs font-bold">{match.time}</span>
            <span className="text-white/60">TVL: {match.tvl}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

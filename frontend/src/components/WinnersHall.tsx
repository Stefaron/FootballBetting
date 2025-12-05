"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const WINNERS = [
  { user: "@Alex", amount: "+$120", item: "Man City Gold NFT", color: "bg-yellow-500/20" },
  { user: "@Sarah", amount: "+$450", item: "Real Madrid Jersey", color: "bg-purple-500/20" },
  { user: "@Mike", amount: "+$890", item: "VIP Ticket", color: "bg-emerald-500/20" },
  { user: "@Jessica", amount: "+$210", item: "Signed Ball", color: "bg-blue-500/20" },
  { user: "@David", amount: "+$330", item: "Early Access", color: "bg-red-500/20" },
];

export function WinnersHall() {
  return (
    <section className="w-full overflow-hidden bg-midnight py-20">
      <div className="mb-12 px-4 text-center">
        <h2 className="font-anton text-4xl uppercase text-cool-white md:text-6xl">
          Winners <span className="text-stroke-acid">Hall</span>
        </h2>
        <p className="mt-4 font-space text-cool-white/60">
          Join the elite. Earn yield. Collect rewards.
        </p>
      </div>

      <div className="relative flex w-full">
        <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-midnight to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-midnight to-transparent" />
        
        <motion.div
          className="flex gap-6 px-4"
          drag="x"
          dragConstraints={{ right: 0, left: -1000 }}
        >
          {WINNERS.map((winner, i) => (
            <div
              key={i}
              className="glass-panel min-w-[300px] flex-shrink-0 rounded-2xl p-6 transition-transform hover:scale-105"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${winner.color} flex items-center justify-center`}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-space font-bold text-cool-white">{winner.user}</p>
                  <p className="font-space text-xs text-cool-white/60">Just won</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span className="text-sm text-cool-white/60">Yield</span>
                  <span className="font-mono font-bold text-emerald-400">{winner.amount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span className="text-sm text-cool-white/60">Reward</span>
                  <span className="font-mono font-bold text-acid">{winner.item}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

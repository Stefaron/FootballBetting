"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";
import jerseyChelsea from "@/assets/jersey/jersey_chelsea.png";
import jerseyMewahChelsea from "@/assets/jersey/jersey_mewah_chelsea.png";
import jerseyMewahMu from "@/assets/jersey/jersey_mewah_mu.png";
import jerseyMu from "@/assets/jersey/jersey_mu.png";

export function LockerRoom() {
  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      {/* Header Stats */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white/60 mb-2">
            <Wallet className="h-5 w-5" />
            <span className="font-space text-sm uppercase tracking-wider">Total Balance</span>
          </div>
          <div className="font-anton text-5xl text-white">$12,450.00</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white/60 mb-2">
            <TrendingUp className="h-5 w-5 text-acid" />
            <span className="font-space text-sm uppercase tracking-wider">Yield Earned</span>
          </div>
          <div className="font-anton text-5xl text-acid">+$1,240.50</div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Active Kits */}
        <div>
          <h3 className="mb-6 font-anton text-2xl uppercase text-white">Active Kits</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">Man City vs Liverpool</span>
                  <span className="text-acid text-sm font-bold">LIVE</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Staked: $500</span>
                  <span>Est. Yield: $25</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trophy Cabinet */}
        <div>
          <h3 className="mb-6 font-anton text-2xl uppercase text-white">Trophy Cabinet</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { img: jerseyMewahMu, label: "Legendary United" },
              { img: jerseyMewahChelsea, label: "Royal Blue" },
              { img: jerseyMu, label: "Red Devils" },
              { img: jerseyChelsea, label: "The Blues" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="aspect-square rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 flex flex-col items-center justify-center gap-4 group cursor-pointer relative overflow-hidden"
              >
                <div className="relative h-full w-full">
                  <Image 
                    src={item.img} 
                    alt={item.label} 
                    fill 
                    className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  />
                </div>
                <span className="font-space text-xs font-bold text-white/60 group-hover:text-white absolute bottom-2">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Timer, TrendingUp } from "lucide-react";
import Image from "next/image";
import haland from "../assets/haland.jpg";
import liverpool from "../assets/Liverpool.png";
import manCity from "../assets/Manchester City.png";

export function MatchSpotlight() {
  return (
    <section className="relative w-full bg-midnight py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-anton text-4xl uppercase text-cool-white md:text-6xl">
            Match of the <span className="text-acid">Week</span>
          </h2>
          <div className="flex items-center gap-2 rounded-full border border-urgent/50 bg-urgent/10 px-4 py-1 text-urgent">
            <div className="h-2 w-2 animate-pulse rounded-full bg-urgent" />
            <span className="font-space text-sm font-bold uppercase tracking-wider">Live Now</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Match Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-acid/5 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
              {/* Team A */}
              <div className="text-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-white/10 p-4">
                  {/* Placeholder for Team Logo */}
                  <Image
                    src={manCity}
                    alt="Team Logo"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-anton text-2xl uppercase text-cool-white">Man City</h3>
                <p className="font-space text-sm text-cool-white/60">Home</p>
              </div>

              {/* VS & Timer */}
              <div className="flex flex-col items-center gap-4">
                <span className="font-anton text-4xl text-white/20">VS</span>
                <div className="flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 font-mono text-2xl text-acid">
                  <Timer className="h-5 w-5" />
                  02:45:12
                </div>
              </div>

              {/* Team B */}
              <div className="text-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-white/10 p-4">
                  {/* Placeholder for Team Logo */}
                  <Image
                    src={liverpool}
                    alt="Team Logo"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-anton text-2xl uppercase text-cool-white">Liverpool</h3>
                <p className="font-space text-sm text-cool-white/60">Away</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 space-y-4">
              <div className="flex justify-between text-sm text-cool-white/80">
                <span>Total Liquidity</span>
                <span className="font-bold text-emerald-400">$540,000</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "75%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-acid"
                />
              </div>
              <div className="flex justify-between text-xs text-cool-white/40">
                <span>Target: $1M</span>
                <span>75% Filled</span>
              </div>
            </div>

            <button className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 py-4 font-space font-bold uppercase text-cool-white transition-colors hover:bg-white/10">
              Analyze Match
            </button>
          </div>

          {/* Star Player / Graphic Side */}
          <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-midnight lg:block">
             {/* Placeholder for Player Image */}
             <div className="absolute inset-0">
                <Image 
                  src={haland} 
                  alt="Erling Haaland" 
                  fill
                  className="object-cover object-top opacity-40"
                  priority
                />
             </div>
             <div className="absolute bottom-8 left-8">
                <h3 className="font-anton text-4xl uppercase text-white">Erling<br/>Haaland</h3>
                <div className="mt-2 flex items-center gap-2 text-acid">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-space font-bold">Top Scorer</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

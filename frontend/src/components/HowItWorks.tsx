"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Trophy } from "lucide-react";

const STEPS = [
  {
    icon: Shield,
    title: "Deposit",
    description: "Deposit USDC to back your team. Your principal is always safe.",
  },
  {
    icon: TrendingUp,
    title: "Yield",
    description: "Funds generate DeFi yield during the match via Aave/Compound.",
  },
  {
    icon: Trophy,
    title: "Win / Refund",
    description: "Winner takes Yield + NFT. Loser gets 100% refund.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-midnight py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-anton text-4xl uppercase text-cool-white md:text-6xl">
            How It <span className="text-acid">Works</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-acid/10 text-acid transition-transform group-hover:scale-110">
                <step.icon className="h-8 w-8" />
              </div>
              
              <h3 className="mb-4 font-anton text-2xl uppercase text-cool-white">
                {step.title}
              </h3>
              
              <p className="font-space text-cool-white/60">
                {step.description}
              </p>

              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-acid/5 blur-2xl transition-all group-hover:bg-acid/10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

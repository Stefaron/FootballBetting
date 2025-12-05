"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Placeholder data for the floating cards
const cards = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop", // Football player 1
    alt: "Star Player",
    className: "top-[15%] left-[5%] -rotate-6 w-[20vw] max-w-[250px] aspect-[3/4]",
    delay: 0,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop", // Football match
    alt: "Match Action",
    className: "top-[10%] right-[10%] rotate-3 w-[18vw] max-w-[220px] aspect-[3/4]",
    delay: 0.2,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Stadium
    alt: "Stadium Atmosphere",
    className: "bottom-[20%] left-[10%] rotate-6 w-[18vw] max-w-[220px] aspect-[4/3]",
    delay: 0.4,
  },
  {
    id: 4,
    src: "https://media.istockphoto.com/id/105777417/id/foto/football-team-winning-a-trophy.jpg?s=1024x1024&w=is&k=20&c=hBcxifUrPLniL4KR4emV5yb0s62AmCjAVS64rFA1udY=", // Trophy/Celebration
    alt: "Victory",
    className: "bottom-[15%] right-[5%] -rotate-3 w-[22vw] max-w-[280px] aspect-[4/5]",
    delay: 0.6,
  },
];

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-midnight flex items-center justify-center">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-acid/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating Cards */}
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: card.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`absolute ${card.className} hidden md:block`}
        >
          <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-midnight/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
              src={card.src}
              alt={card.alt}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </motion.div>
      ))}

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-anton text-[18vw] leading-[0.8] tracking-tighter text-cool-white uppercase mix-blend-normal drop-shadow-2xl"
        >
          NEVER
          <br />
          <span className="text-transparent text-stroke-acid">LOSE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-xl font-space text-lg text-cool-white/80 md:text-xl"
        >
          Bet on your team. Keep your principal. Earn the yield.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <Link href="/app">
            <button className="group relative flex items-center gap-3 bg-acid px-8 py-4 font-anton text-xl uppercase tracking-wide text-midnight rounded-full transition-transform hover:scale-105 active:scale-95">
              Launch App
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

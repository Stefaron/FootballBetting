"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "./Button";

export function NFTShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <section ref={ref} className="py-32 overflow-hidden relative">
      <div className="absolute inset-0 bg-accent-primary/5 -skew-y-3 transform origin-top-left scale-110" />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1">
          <h2 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight">
            Collect <br/>
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-white">Glory.</span>
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-md">
            Setiap kemenangan memberimu NFT Jersey eksklusif. Kumpulkan, pamerkan, dan buktikan prediksimu.
          </p>
          <Button size="lg">Lihat Koleksi</Button>
        </div>

        <div className="order-1 md:order-2 flex justify-center relative perspective-1000">
            <div className="absolute inset-0 bg-accent-primary/20 blur-[100px] rounded-full" />
            <motion.div 
                style={{ y, rotate }}
                className="relative z-10 w-72 h-96 md:w-96 md:h-[500px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-8 group hover:border-accent-primary/50 transition-colors"
            >
                {/* Abstract Jersey Shape */}
                <div className="flex-1 flex items-center justify-center w-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-48 h-48 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:text-accent-primary group-hover:drop-shadow-[0_0_25px_rgba(204,255,0,0.6)] transition-all duration-500">
                        <path d="M20.38 3.4a2 2 0 0 0-2-1H5.62a2 2 0 0 0-2 1L2 5.6V8a2 2 0 0 0 2 2h.62L6 20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1.38-10h.62a2 2 0 0 0 2-2V5.6l-1.62-2.2z" />
                    </svg>
                </div>
                <div className="w-full text-center border-t border-white/10 pt-6">
                    <div className="font-heading font-bold text-3xl tracking-widest mb-1">WINNER</div>
                    <div className="font-mono text-accent-primary text-xl">SEASON #1</div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
            </motion.div>
        </div>
      </div>
    </section>
  );
}

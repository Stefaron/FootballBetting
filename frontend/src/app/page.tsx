import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { HypeTicker } from "@/components/HypeTicker";
import { MatchSpotlight } from "@/components/MatchSpotlight";
import { WinnersHall } from "@/components/WinnersHall";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight text-cool-white selection:bg-acid selection:text-midnight">
      <Navbar />
      <Hero />
      <HypeTicker />
      <MatchSpotlight />
      <WinnersHall />
      <HowItWorks />
      
      {/* Simple Footer for now */}
      <footer className="border-t border-white/10 bg-midnight py-8 text-center">
        <p className="font-space text-sm text-cool-white/40">
          © 2025 No-Loss Football Betting Protocol. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

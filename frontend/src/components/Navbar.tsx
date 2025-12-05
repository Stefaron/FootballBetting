import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-6 inset-x-0 mx-auto w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-midnight/80 backdrop-blur-xl shadow-2xl">
      <div className="px-6 h-20 flex items-center justify-between">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-acid rotate-3" />
              <span className="font-anton text-2xl tracking-wider text-cool-white">
                NO-LOSS<span className="text-acid">.BET</span>
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-space text-sm font-medium text-cool-white/70">
            <Link href="/matches" className="hover:text-acid transition-colors">Matches</Link>
            <Link href="/how-it-works" className="hover:text-acid transition-colors">How it Works</Link>
            <Link href="/nfts" className="hover:text-acid transition-colors">NFTs</Link>
          </div>
        </div>

        {/* Right Side: Connect Wallet */}
        <div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
}

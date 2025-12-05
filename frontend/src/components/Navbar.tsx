"use client";

import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { usePathname } from "next/navigation";
import { parseAbi } from "viem";
import { Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MUSDT_ADDRESS = "0xFA9C1D2ba555B57C270CACfF7c24f6F506bFE40d";
const MOCK_USDT_ABI = parseAbi([
  "function faucet() external"
]);

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    token: MUSDT_ADDRESS,
  });
  
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Minting Successful! Balance updated.");
      refetchBalance();
    }
  }, [isConfirmed, refetchBalance]);

  const handleFaucet = () => {
    writeContract({
      address: MUSDT_ADDRESS,
      abi: MOCK_USDT_ABI,
      functionName: "faucet",
    });
  };

  const isAppPage = pathname === "/app";
  const isLoading = isWritePending || isConfirming;

  return (
    <nav className="fixed top-6 inset-x-0 mx-auto w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-midnight/80 backdrop-blur-xl shadow-2xl">
      <div className="px-6 h-20 flex items-center justify-between">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="Logo" width={64} height={64} />
              <span className="font-anton text-2xl tracking-wider text-cool-white">
                KICK<span className="text-acid">BACK</span>
              </span>
            </Link>
          </div>
          
          {/* Navigation Links - Only show on Landing Page */}
          {/* {!isAppPage && (
            <div className="hidden md:flex items-center gap-8 font-space text-sm font-medium text-cool-white/70">
              <Link href="/matches" className="hover:text-acid transition-colors">Matches</Link>
              <Link href="/how-it-works" className="hover:text-acid transition-colors">How it Works</Link>
              <Link href="/nfts" className="hover:text-acid transition-colors">NFTs</Link>
            </div>
          )} */}
        </div>

        {/* Right Side: Connect Wallet & Faucet */}
        <div className="flex items-center gap-4">
          {/* Faucet Button - Only show on App Page and when connected */}
          {isAppPage && isConnected && (
            <button
              onClick={handleFaucet}
              disabled={isLoading}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-acid/10 border border-acid/20 text-acid hover:bg-acid hover:text-midnight transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Coins className="h-4 w-4" />
              )}
              <span className="font-space font-bold text-sm">
                {isLoading ? "Minting..." : "Faucet"}
              </span>
            </button>
          )}

          {isAppPage && isConnected && balance && (
             <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm font-space text-white/60">Balance:</span>
                <span className="text-sm font-space font-bold text-acid">
                  {parseFloat(balance.formatted).toFixed(2)} {balance.symbol}
                </span>
             </div>
          )}
          <ConnectButton showBalance={false}/>
        </div>
      </div>
    </nav>
  );
}

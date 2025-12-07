"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { TrendingUp, Shield, Loader2, Trophy } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from "wagmi";
import { parseAbi } from "viem";
import { toast } from "sonner";

const MUSDT_ADDRESS = "0xFA9C1D2ba555B57C270CACfF7c24f6F506bFE40d";
const ERC20_ABI = parseAbi(["function approve(address spender, uint256 amount) external returns (bool)", "function mint(address to, uint256 amount) external"]);
const MATCH_VAULT_ABI = parseAbi([
  "function deposit(uint256 _teamId, uint256 _amount) external",
  "function claim() external",
  "function resolveMatch(uint8 _result) external",
  "function simulateYieldInject(uint256 _amount) external",
]);

interface MatchTicketProps {
  teamA: string;
  logoA: StaticImageData | string | null;
  colorA: string;
  liquidityA?: string;
  teamB: string;
  logoB: StaticImageData | string | null;
  colorB: string;
  liquidityB?: string;
  time: string;
  stadium: string;
  status?: "LIVE" | "UPCOMING" | "ENDED";
  vaultAddress?: string;
  startTime?: number;
  onClaimSuccess?: () => void;
}

export function MatchTicket({
  teamA,
  logoA,
  colorA,
  liquidityA = "$125,400",
  teamB,
  logoB,
  colorB,
  liquidityB = "$98,200",
  time,
  stadium,
  status = "UPCOMING",
  vaultAddress,
  startTime,
  onClaimSuccess,
}: MatchTicketProps) {
  const { address } = useAccount();
  const [betState, setBetState] = useState<{ hasBet: boolean; teamId: number | null }>({ hasBet: false, teamId: null });
  const [step, setStep] = useState<"idle" | "approving" | "depositing" | "minting_yield" | "approving_yield" | "injecting" | "resolving" | "claiming">("idle");
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!startTime) {
      setIsTimeUp(true); // If no start time, assume ready (or handle differently)
      return;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = startTime - now;

      if (diff <= 0) {
        setTimeLeft("Ready");
        setIsTimeUp(true);
        clearInterval(interval);
      } else {
        setIsTimeUp(false);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const { writeContract, data: hash, isPending: isWritePending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch balance for refetching
  const { refetch: refetchBalance } = useBalance({
    address,
    token: MUSDT_ADDRESS,
  });

  useEffect(() => {
    if (isConfirmed) {
      if (step === "approving") {
        toast.success("Approval Successful! Proceeding to Deposit...");
        reset();
        handleDeposit(betState.teamId!);
      } else if (step === "depositing") {
        toast.success("Bet Placed Successfully!");
        setBetState((prev) => ({ ...prev, hasBet: true }));
        setTimeout(() => {
          refetchBalance();
        }, 1000);
        setStep("idle");
        reset();
        // Start Yield Sequence: Mint -> Approve -> Inject
        handleYieldMint(BigInt(50 * 10 ** 18));
      } else if (step === "minting_yield") {
        toast.success("Yield Tokens Minted! Approving...");
        reset();
        handleYieldApprove(BigInt(50 * 10 ** 18));
      } else if (step === "approving_yield") {
        toast.success("Yield Approval Successful! Injecting Yield...");
        reset();
        handleInjectYield(BigInt(50 * 10 ** 18));
      } else if (step === "injecting") {
        toast.success("Yield Injected Successfully!");
        setStep("idle");
        reset();
      } else if (step === "resolving") {
        toast.success("Match Resolved! Proceeding to Claim...");
        reset();
        handleClaim();
      } else if (step === "claiming") {
        toast.success("Prize Claimed Successfully! Check your wallet.");
        setTimeout(() => {
          refetchBalance();
        }, 1000);
        setStep("idle");
        reset();
        onClaimSuccess?.();
      }
    }
  }, [isConfirmed, step, betState.teamId, onClaimSuccess, reset, refetchBalance]);

  const handleBet = (teamId: number) => {
    if (!vaultAddress) {
      toast.error("Match Vault not deployed for this match yet.");
      return;
    }
    setBetState({ hasBet: false, teamId });
    setStep("approving");

    // 1. Approve
    writeContract({
      address: MUSDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vaultAddress as `0x${string}`, BigInt(100 * 10 ** 18)], // Approve 100 mUSDT
    });
  };

  const handleDeposit = (teamId: number) => {
    if (!vaultAddress) return;
    setStep("depositing");

    // 2. Deposit
    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: MATCH_VAULT_ABI,
      functionName: "deposit",
      args: [BigInt(teamId), BigInt(100 * 10 ** 18)], // Bet 100 mUSDT
    });
  };

  const handleYieldMint = (amount: bigint) => {
    if (!address) return;
    setStep("minting_yield");

    writeContract({
      address: MUSDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "mint",
      args: [address, amount],
    });
  };

  const handleYieldApprove = (amount: bigint) => {
    if (!vaultAddress) return;
    setStep("approving_yield");

    writeContract({
      address: MUSDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vaultAddress as `0x${string}`, amount],
    });
  };

  const handleInjectYield = (amount: bigint) => {
    if (!vaultAddress) return;
    setStep("injecting");

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: MATCH_VAULT_ABI,
      functionName: "simulateYieldInject",
      args: [amount],
    });
  };

  const handleDemoClaim = () => {
    if (!vaultAddress || !betState.teamId) return;
    setStep("resolving");

    // DEMO: Resolve match to the team user bet on
    // Team A = 1 (TeamAWon), Team B = 2 (TeamBWon)
    // MatchResult enum: Pending=0, TeamAWon=1, TeamBWon=2, Draw=3
    const result = betState.teamId === 1 ? 1 : 2;

    toast.info("Resolving match... (Wait for confirmation)");

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: MATCH_VAULT_ABI,
      functionName: "resolveMatch",
      args: [result],
    });
  };

  const handleClaim = () => {
    if (!vaultAddress) return;
    setStep("claiming");

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: MATCH_VAULT_ABI,
      functionName: "claim",
    });
  };

  const isLoading = isWritePending || isConfirming;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-acid/50 hover:bg-white/10">
      {/* Header Status */}
      <div className="flex items-center justify-center border-b border-white/5 py-3 bg-black/20">
        <span className={`font-space text-xs font-bold tracking-wider ${status === "LIVE" ? "text-red-500 animate-pulse" : "text-white/60"}`}>
          {status === "LIVE" ? "LIVE 🔴" : time} • {stadium}
        </span>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-2 divide-x divide-white/10 relative">
        {/* VS Badge Absolute Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight border border-white/10 font-anton text-white text-sm">VS</div>
        </div>

        {/* Team A */}
        <div className="flex flex-col items-center p-6 text-center group/a">
          <div className="relative mb-4 h-20 w-20 transition-transform group-hover/a:scale-110 flex items-center justify-center">
            {logoA ? (
              <Image src={logoA} alt={teamA} fill className="object-contain" />
            ) : (
              <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colorA }}>
                <span className="font-anton text-2xl text-white">{teamA.charAt(0)}</span>
              </div>
            )}
          </div>
          <h3 className="font-anton text-2xl text-white mb-1">{teamA}</h3>

          {/* Liquidity A */}
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold mb-6">
            <TrendingUp className="h-3 w-3" />
            <span>{liquidityA}</span>
          </div>

          {!betState.hasBet ? (
            <button
              onClick={() => handleBet(1)}
              disabled={isLoading}
              className="w-full rounded-xl bg-white/5 py-3 font-anton text-sm uppercase tracking-wide text-white transition-colors hover:bg-acid hover:text-midnight disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && step !== "idle" && betState.teamId === 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Bet {teamA}
            </button>
          ) : betState.teamId === 1 ? (
            <button
              onClick={handleDemoClaim}
              disabled={isLoading || (!isTimeUp && !!startTime)}
              className={`w-full rounded-xl py-3 font-anton text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${
                !isTimeUp && startTime ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-acid text-midnight hover:bg-white animate-pulse"
              }`}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !isTimeUp && startTime ? (
                <>Wait {timeLeft}</>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  Demo Claim Prize
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-3 font-space text-xs text-white/40 uppercase text-center">Bet Placed on {teamB}</div>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center p-6 text-center group/b">
          <div className="relative mb-4 h-20 w-20 transition-transform group-hover/b:scale-110 flex items-center justify-center">
            {logoB ? (
              <Image src={logoB} alt={teamB} fill className="object-contain" />
            ) : (
              <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colorB }}>
                <span className="font-anton text-2xl text-white">{teamB.charAt(0)}</span>
              </div>
            )}
          </div>
          <h3 className="font-anton text-2xl text-white mb-1">{teamB}</h3>

          {/* Liquidity B */}
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold mb-6">
            <TrendingUp className="h-3 w-3" />
            <span>{liquidityB}</span>
          </div>

          {!betState.hasBet ? (
            <button
              onClick={() => handleBet(2)}
              disabled={isLoading}
              className="w-full rounded-xl bg-white/5 py-3 font-anton text-sm uppercase tracking-wide text-white transition-colors hover:bg-acid hover:text-midnight disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && step !== "idle" && betState.teamId === 2 ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Bet {teamB}
            </button>
          ) : betState.teamId === 2 ? (
            <button
              onClick={handleDemoClaim}
              disabled={isLoading || (!isTimeUp && !!startTime)}
              className={`w-full rounded-xl py-3 font-anton text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${
                !isTimeUp && startTime ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-acid text-midnight hover:bg-white animate-pulse"
              }`}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !isTimeUp && startTime ? (
                <>Wait {timeLeft}</>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  Demo Claim Prize
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-3 font-space text-xs text-white/40 uppercase text-center">Bet Placed on {teamA}</div>
          )}
        </div>
      </div>
    </div>
  );
}

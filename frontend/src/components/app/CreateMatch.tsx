"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Shield, Clock, Plus, Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi, decodeEventLog } from "viem";
import { toast } from "sonner";
import Image from "next/image";

// Import logos
import Arsenal from "@/assets/Arsenal.png";
import Barca from "@/assets/Barca.png";
import Chelsea from "@/assets/Chelsea.png";
import Liverpool from "@/assets/Liverpool.png";
import ManCity from "@/assets/Manchester City.png";
import ManUtd from "@/assets/Manchester United.png";
import PSG from "@/assets/PSG.png";
import RealMadrid from "@/assets/Real Madrid.png";

const TEAMS = [
  { name: "Arsenal", logo: Arsenal, color: "#EF0107" },
  { name: "Barcelona", logo: Barca, color: "#A50044" },
  { name: "Chelsea", logo: Chelsea, color: "#034694" },
  { name: "Liverpool", logo: Liverpool, color: "#C8102E" },
  { name: "Man City", logo: ManCity, color: "#6CABDD" },
  { name: "Man Utd", logo: ManUtd, color: "#DA291C" },
  { name: "PSG", logo: PSG, color: "#004170" },
  { name: "Real Madrid", logo: RealMadrid, color: "#FEBE10" },
];

const MATCH_VAULT_FACTORY_ADDRESS = "0x591a5e7010e1ebff43aab75e00c57b84f13586de";
const FACTORY_ABI = parseAbi([
  "function createMatchVault(uint256 _matchStartTime) external"
]);
const VAULT_CREATED_EVENT_ABI = parseAbi([
  "event VaultCreated(address indexed vaultAddress, uint256 matchStartTime, uint256 index)"
]);

interface CreateMatchProps {
  onMatchCreate: (match: any) => void;
  onCancel: () => void;
}

export function CreateMatch({ onMatchCreate, onCancel }: CreateMatchProps) {
  const [formData, setFormData] = useState({
    teamA: TEAMS[4], // Default Man City
    teamB: TEAMS[3], // Default Liverpool
    time: "20:45",
    stadium: "Wembley Stadium",
  });

  const [startTime, setStartTime] = useState<number | null>(null);

  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && receipt) {
      let vaultAddress = null;
      
      // Parse logs to find VaultCreated event
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: VAULT_CREATED_EVENT_ABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "VaultCreated") {
            vaultAddress = decoded.args.vaultAddress;
            break; 
          }
        } catch (e) {
          continue;
        }
      }

      if (vaultAddress) {
        toast.success("Match Created Successfully! Vault: " + vaultAddress.slice(0, 6) + "..." + vaultAddress.slice(-4));
      } else {
        toast.success("Match Created Successfully on Chain!");
      }
      
      // Create the new match object to update UI
      const newMatch = {
        id: Date.now(),
        teamA: formData.teamA.name,
        colorA: formData.teamA.color,
        logoA: formData.teamA.logo,
        teamB: formData.teamB.name,
        colorB: formData.teamB.color,
        logoB: formData.teamB.logo,
        time: formData.time,
        stadium: formData.stadium,
        status: "UPCOMING",
        vaultAddress: vaultAddress,
        startTime: startTime
      };
      
      onMatchCreate(newMatch);
    }
  }, [isConfirmed, receipt, formData, onMatchCreate, startTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate start time: 60 seconds from now for DEMO purposes
    const calculatedStartTime = Math.floor(Date.now() / 1000) + 45; // 60 seconds
    setStartTime(calculatedStartTime);

    writeContract({
      address: MATCH_VAULT_FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "createMatchVault",
      args: [BigInt(calculatedStartTime)],
    });
  };

  const isLoading = isWritePending || isConfirming;

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-anton text-4xl text-white uppercase tracking-wider">
          Create Match
        </h1>
        <button
          onClick={onCancel}
          className="text-white/60 hover:text-white transition-colors font-space text-sm"
        >
          Cancel
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
        onSubmit={handleSubmit}
      >
        {/* Team A Selection */}
        <div className="space-y-4">
          <h3 className="font-space font-bold text-acid text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" /> Home Team
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {TEAMS.map((team) => (
              <button
                key={team.name}
                type="button"
                onClick={() => setFormData({ ...formData, teamA: team })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  formData.teamA.name === team.name
                    ? "bg-acid/20 border-acid"
                    : "bg-black/20 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="relative h-10 w-10 mb-2">
                  <Image src={team.logo} alt={team.name} fill className="object-contain" />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${
                    formData.teamA.name === team.name ? "text-acid" : "text-white/60"
                }`}>
                    {team.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Team B Selection */}
        <div className="space-y-4">
          <h3 className="font-space font-bold text-urgent text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" /> Away Team
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {TEAMS.map((team) => (
              <button
                key={team.name}
                type="button"
                onClick={() => setFormData({ ...formData, teamB: team })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  formData.teamB.name === team.name
                    ? "bg-urgent/20 border-urgent"
                    : "bg-black/20 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="relative h-10 w-10 mb-2">
                  <Image src={team.logo} alt={team.name} fill className="object-contain" />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${
                    formData.teamB.name === team.name ? "text-urgent" : "text-white/60"
                }`}>
                    {team.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Match Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time
            </label>
            <input
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-acid focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 mb-1 uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Stadium
            </label>
            <input
              type="text"
              required
              value={formData.stadium}
              onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-acid focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-acid text-midnight font-space font-bold text-lg py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating on Chain...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Create Match
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}

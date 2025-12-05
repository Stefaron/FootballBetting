"use client";

import { MatchTicket } from "./MatchTicket";
import { Plus } from "lucide-react";

// Import logos
import Arsenal from "@/assets/Arsenal.png";
import Barca from "@/assets/Barca.png";
import Chelsea from "@/assets/Chelsea.png";
import Liverpool from "@/assets/Liverpool.png";
import ManCity from "@/assets/Manchester City.png";
import ManUtd from "@/assets/Manchester United.png";
import PSG from "@/assets/PSG.png";
import RealMadrid from "@/assets/Real Madrid.png";

export interface Match {
  id: number;
  teamA: string;
  logoA: any;
  colorA: string;
  teamB: string;
  logoB: any;
  colorB: string;
  time: string;
  stadium: string;
  status: "LIVE" | "UPCOMING" | "ENDED";
  vaultAddress?: string;
  startTime?: number;
}

export const INITIAL_MATCHES: Match[] = [
  {
    id: 1,
    teamA: "Man City",
    logoA: ManCity,
    colorA: "#6CABDD",
    teamB: "Liverpool",
    logoB: Liverpool,
    colorB: "#C8102E",
    time: "LIVE",
    stadium: "Etihad Stadium",
    status: "LIVE",
  },
  {
    id: 2,
    teamA: "Real Madrid",
    logoA: RealMadrid,
    colorA: "#FEBE10",
    teamB: "Barcelona",
    logoB: Barca,
    colorB: "#A50044",
    time: "20:45",
    stadium: "Santiago Bernabéu",
    status: "UPCOMING",
  },
  {
    id: 3,
    teamA: "Arsenal",
    logoA: Arsenal,
    colorA: "#EF0107",
    teamB: "Chelsea",
    logoB: Chelsea,
    colorB: "#034694",
    time: "Tomorrow",
    stadium: "Emirates Stadium",
    status: "UPCOMING",
  },
  {
    id: 4,
    teamA: "PSG",
    logoA: PSG,
    colorA: "#004170",
    teamB: "Man Utd",
    logoB: ManUtd,
    colorB: "#DA291C",
    time: "21:00",
    stadium: "Parc des Princes",
    status: "UPCOMING",
  },
];

interface ArenaProps {
  matches?: Match[];
  onCreateMatchClick?: () => void;
  onMatchRemove?: (id: number) => void;
}

export function Arena({ matches = INITIAL_MATCHES, onCreateMatchClick, onMatchRemove }: ArenaProps) {
  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      {/* Filters & Actions */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {["Live Now", "Upcoming", "High Yield Pools"].map((filter, i) => (
            <button
              key={filter}
              className={`rounded-full px-6 py-2 font-space text-sm font-bold transition-all ${
                i === 0
                  ? "bg-acid text-midnight"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {onCreateMatchClick && (
          <button
            onClick={onCreateMatchClick}
            className="flex items-center gap-2 rounded-full border border-acid/20 bg-acid/10 px-6 py-2 font-space text-sm font-bold text-acid transition-all hover:bg-acid hover:text-midnight"
          >
            <Plus className="h-4 w-4" />
            Create Match
          </button>
        )}
      </div>

      {/* Match Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {matches.map((match) => (
          <MatchTicket
            key={match.id}
            {...match}
            liquidityA="$125,400"
            liquidityB="$98,200"
            onClaimSuccess={() => onMatchRemove?.(match.id)}
          />
        ))}
      </div>
    </div>
  );
}

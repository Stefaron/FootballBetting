"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const LEADERBOARD = [
  { rank: 1, name: "CryptoKing", yield: "$45,200", avatar: "👑" },
  { rank: 2, name: "YieldMaster", yield: "$38,900", avatar: "🦁" },
  { rank: 3, name: "BetWhale", yield: "$32,100", avatar: "🐋" },
  { rank: 4, name: "LuckyStriker", yield: "$28,400", avatar: "⚽" },
  { rank: 5, name: "HODLer", yield: "$25,000", avatar: "💎" },
];

export function HallOfFame() {
  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      {/* Podium */}
      <div className="mb-16 flex items-end justify-center gap-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-3xl border-2 border-slate-400">
            {LEADERBOARD[1].avatar}
          </div>
          <div className="flex flex-col items-center w-24 bg-slate-800/50 rounded-t-lg p-4 h-32 border-t-4 border-slate-400">
            <span className="font-anton text-2xl text-slate-400">2</span>
            <span className="font-bold text-white text-sm truncate w-full text-center">{LEADERBOARD[1].name}</span>
            <span className="text-acid text-xs">{LEADERBOARD[1].yield}</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center gap-2 z-10">
          <Trophy className="h-8 w-8 text-yellow-400 animate-bounce" />
          <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-4xl border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            {LEADERBOARD[0].avatar}
          </div>
          <div className="flex flex-col items-center w-28 bg-slate-800/50 rounded-t-lg p-4 h-40 border-t-4 border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-transparent">
            <span className="font-anton text-3xl text-yellow-400">1</span>
            <span className="font-bold text-white text-sm truncate w-full text-center">{LEADERBOARD[0].name}</span>
            <span className="text-acid text-sm font-bold">{LEADERBOARD[0].yield}</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-3xl border-2 border-orange-700">
            {LEADERBOARD[2].avatar}
          </div>
          <div className="flex flex-col items-center w-24 bg-slate-800/50 rounded-t-lg p-4 h-24 border-t-4 border-orange-700">
            <span className="font-anton text-2xl text-orange-700">3</span>
            <span className="font-bold text-white text-sm truncate w-full text-center">{LEADERBOARD[2].name}</span>
            <span className="text-acid text-xs">{LEADERBOARD[2].yield}</span>
          </div>
        </div>
      </div>

      {/* List Ranking */}
      <div className="space-y-2">
        {LEADERBOARD.slice(3).map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-6 py-4 transition-colors hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <span className="font-anton text-xl text-white/40 w-8">{user.rank}</span>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <span className="font-bold text-white">{user.name}</span>
            </div>
            <span className="font-mono font-bold text-acid">{user.yield}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

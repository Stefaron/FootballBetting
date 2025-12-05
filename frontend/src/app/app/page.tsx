"use client";

import { useState } from "react";
import { DockMenu } from "@/components/app/DockMenu";
import { Arena } from "@/components/app/Arena";
import { LockerRoom } from "@/components/app/LockerRoom";
import { HallOfFame } from "@/components/app/HallOfFame";
import { Navbar } from "@/components/Navbar";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("arena");

  return (
    <main className="min-h-screen bg-midnight text-cool-white selection:bg-acid selection:text-midnight relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Reuse Navbar for Wallet Connection */}
      <Navbar />

      <div className="relative z-10 pt-32 px-4 md:pl-24 pb-32">
        {activeTab === "arena" && <Arena />}
        {activeTab === "locker" && <LockerRoom />}
        {activeTab === "hall" && <HallOfFame />}
        {activeTab === "settings" && (
          <div className="flex h-[50vh] items-center justify-center text-white/40 font-anton text-2xl">
            SETTINGS COMING SOON
          </div>
        )}
      </div>

      <DockMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}

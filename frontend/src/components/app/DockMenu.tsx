"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Trophy, Briefcase, Settings } from "lucide-react";

interface DockMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DockMenu({ activeTab, setActiveTab }: DockMenuProps) {
  const menuItems = [
    { id: "arena", icon: LayoutGrid, label: "The Arena" },
    { id: "locker", icon: Briefcase, label: "Locker Room", notification: true },
    { id: "hall", icon: Trophy, label: "Hall of Fame" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:bottom-auto md:left-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl md:flex-col">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-white/10"
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white/10 shadow-[0_0_15px_rgba(210,248,2,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <item.icon
                className={`relative z-10 h-5 w-5 transition-colors ${
                  isActive ? "text-acid" : "text-white/60 group-hover:text-white"
                }`}
              />

              {/* Notification Dot */}
              {item.notification && (
                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-urgent ring-2 ring-[#050A14]" />
              )}

              {/* Tooltip */}
              <div className="absolute left-full ml-4 hidden rounded-lg bg-midnight/90 px-3 py-1 text-xs font-bold text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 md:block">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

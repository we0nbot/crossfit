"use client";

import React from "react";
import { Flame, Zap, Shield } from "lucide-react";

interface LevelSelectorProps {
  req_rx: string;
  req_scaled: string;
  req_novato: string;
  activeLevel: "RX" | "SCALED" | "NOVATO";
  onSelectLevel: (level: "RX" | "SCALED" | "NOVATO") => void;
}

const levels = [
  {
    id: "RX" as const,
    label: "RX",
    icon: Flame,
    activeBg: "bg-emerald-500/10",
    activeBorder: "border-emerald-500",
    activeIcon: "bg-emerald-500/20",
    color: "text-emerald-500",
    borderBar: "border-l-emerald-500",
  },
  {
    id: "SCALED" as const,
    label: "Scaled",
    icon: Zap,
    activeBg: "bg-amber-500/10",
    activeBorder: "border-amber-500",
    activeIcon: "bg-amber-500/20",
    color: "text-amber-500",
    borderBar: "border-l-amber-500",
  },
  {
    id: "NOVATO" as const,
    label: "Novato",
    icon: Shield,
    activeBg: "bg-cyan-500/10",
    activeBorder: "border-cyan-500",
    activeIcon: "bg-cyan-500/20",
    color: "text-cyan-500",
    borderBar: "border-l-cyan-500",
  },
];

export default function LevelSelector({
  req_rx,
  req_scaled,
  req_novato,
  activeLevel,
  onSelectLevel,
}: LevelSelectorProps) {
  const reqMap = { RX: req_rx, SCALED: req_scaled, NOVATO: req_novato };
  const active = levels.find((l) => l.id === activeLevel)!;
  const Icon = active.icon;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {levels.map((level) => {
          const LvlIcon = level.icon;
          const isActive = activeLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded border transition-all duration-200 ${
                isActive
                  ? `${level.activeBg} ${level.activeBorder}`
                  : "bg-[#0d0d0d] border-[#222] opacity-50 hover:opacity-80"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? level.activeIcon : "bg-[#1a1a1a]"
                }`}
              >
                <LvlIcon className={`w-4 h-4 ${isActive ? level.color : "text-[#555]"}`} />
              </div>
              <span
                className={`font-condensed text-[11px] font-black italic uppercase tracking-wider ${
                  isActive ? level.color : "text-[#555]"
                }`}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Protocol block — left border accent */}
      <div className={`border-l-[3px] pl-4 transition-all duration-300 ${active.borderBar}`}>
        <p className={`text-[9px] font-black uppercase tracking-[0.25em] mb-2 ${active.color}`}>
          Protocolo <span className="italic">{activeLevel}</span>
        </p>
        <p className="text-white text-base font-semibold leading-relaxed whitespace-pre-line">
          {reqMap[activeLevel] || "Sin requerimientos específicos asignados."}
        </p>
      </div>
    </div>
  );
}

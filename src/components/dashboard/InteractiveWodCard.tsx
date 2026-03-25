"use client";

import React, { useState } from "react";
import { Dumbbell, Clock } from "lucide-react";
import LevelSelector from "@/components/LevelSelector";
import WodSession from "@/components/WodSession";

interface InteractiveWodCardProps {
  wod: any;
  athleteId: string;
}

const levelColors = {
  rx:     { label: "RX",     bg: "bg-emerald-500", text: "text-white" },
  scaled: { label: "SCALED", bg: "bg-amber-500",   text: "text-white" },
  novato: { label: "NOVATO", bg: "bg-cyan-500",    text: "text-white" },
};

export default function InteractiveWodCard({ wod, athleteId }: InteractiveWodCardProps) {
  const [activeLevel, setActiveLevel] = useState<"rx" | "scaled" | "novato">("scaled");

  const cfg = levelColors[activeLevel];
  const timerFormatted =
    wod.config?.timerValue > 0
      ? `${Math.floor(wod.config.timerValue / 60)}:${String(wod.config.timerValue % 60).padStart(2, "0")}`
      : null;

  return (
    <div className="lg:col-span-2 space-y-8">

      {/* ── WOD CARD ── */}
      <div className="space-y-6">

        {/* Level + Type badge row */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-[10px] font-black italic uppercase tracking-[0.15em] rounded ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
            {wod.tipo}
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          {timerFormatted && (
            <div className="flex items-center gap-1.5 text-[#555]">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-bold font-mono">{timerFormatted}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className="font-black italic uppercase text-white tracking-tight leading-[0.82]"
          style={{ fontSize: "clamp(56px, 18vw, 80px)" }}
        >
          {wod.titulo}
        </h2>

        {/* Divider */}
        <div className="h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* Protocol display */}
        <div className="border-l-[3px] border-[#222] pl-4 space-y-1.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#555]">
            Protocolo técnico
          </p>
          <p className="text-white text-base font-semibold leading-relaxed whitespace-pre-line font-mono">
            {wod.levels?.[activeLevel] || wod.descripcion || "Protocolo no definido"}
          </p>
        </div>
      </div>

      {/* ── LEVEL SELECTOR ── */}
      <div className="space-y-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555]">
          Ajuste de intensidad
        </p>
        <LevelSelector
          req_rx={wod.levels?.rx}
          req_scaled={wod.levels?.scaled}
          req_novato={wod.levels?.novato}
          activeLevel={activeLevel.toUpperCase() as any}
          onSelectLevel={(level) => setActiveLevel(level.toLowerCase() as any)}
        />
      </div>

      {/* ── WOD SESSION (timer + register) ── */}
      <WodSession
        wodId={wod.id_wod}
        userId={athleteId}
        fields={wod.config?.fields || ["tiempo"]}
        timerType={wod.config?.timerType || "STOPWATCH"}
        timerValue={wod.config?.timerValue || 0}
        req_rx={wod.levels?.rx}
        req_scaled={wod.levels?.scaled}
        req_novato={wod.levels?.novato}
        selectedLevel={activeLevel.toUpperCase() as any}
      />
    </div>
  );
}

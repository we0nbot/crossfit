"use client";

import React, { useState } from "react";
import { Activity, History } from "lucide-react";
import EliteTimer from "@/components/EliteTimer";
import LevelSelector from "@/components/LevelSelector";
import DynamicRegister from "@/components/DynamicRegister";
import Leaderboard from "@/components/Leaderboard";
import Link from "next/link";

interface FocusFlowViewProps {
  wod: any;
  athleteId: string;
}

export default function FocusFlowView({ wod, athleteId }: FocusFlowViewProps) {
  const [activeLevel, setActiveLevel] = useState<"RX" | "SCALED" | "NOVATO">("SCALED");
  const [capturedTime, setCapturedTime] = useState("00:00:00");
  const today = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Santiago",
  }).format(new Date()).replace(/\//g, "-");

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">

      {/* ── HEADER ── */}
      <header className="px-5 py-4 border-b border-[#1a1a1a] flex justify-between items-center bg-[#080808]/90 backdrop-blur-xl sticky top-0 z-50">
        <span className="text-xl font-black italic uppercase tracking-tight">
          Rorro<span className="text-emerald-500">Box</span>
        </span>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#222] rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#555]">
            {today}
          </span>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto flex flex-col">

        {/* ── HERO ── */}
        <section className="px-5 pt-8 pb-0">
          {/* Type tag */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black italic uppercase tracking-[0.15em] mb-4"
            style={{ clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,0 100%,6px 50%)" }}
          >
            <Activity className="w-3 h-3" />
            {wod.tipo}
          </div>

          {/* Title */}
          <h1
            className="font-black italic uppercase text-white leading-[0.82] tracking-tight"
            style={{ fontSize: "clamp(72px, 22vw, 88px)" }}
          >
            {wod.titulo}
          </h1>

          {/* Date strip */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]">
            <div className="h-px flex-1 bg-[#1a1a1a] relative">
              <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#555]">
              WOD del Día
            </span>
          </div>
        </section>

        {/* ── TIMER ── */}
        <section className="px-5 pt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555] mb-2">
            Cronómetro
          </p>
          <EliteTimer
            type={wod.config?.timerType || "STOPWATCH"}
            initialSeconds={wod.config?.timerValue || 0}
            onStop={setCapturedTime}
          />
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── DESCRIPCION ── */}
        {wod.descripcion && (
          <section className="px-5 pt-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555] mb-3">
              Descripción del WOD
            </p>
            <p className="text-[#aaa] text-sm font-medium leading-relaxed whitespace-pre-line italic border-l-[3px] border-[#222] pl-4">
              {wod.descripcion}
            </p>
          </section>
        )}

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── LEVEL SELECTOR ── */}
        <section className="px-5 pt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555] mb-4">
            Intensidad técnica
          </p>
          <LevelSelector
            activeLevel={activeLevel}
            onSelectLevel={setActiveLevel}
            req_rx={wod.levels?.rx}
            req_scaled={wod.levels?.scaled}
            req_novato={wod.levels?.novato}
          />
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── REGISTER ── */}
        <section className="px-5 pt-6">
          <DynamicRegister
            wodId={wod.id_wod || wod.id}
            userId={athleteId}
            fields={wod.config?.fields || ["tiempo"]}
            currentTime={capturedTime}
            selectedLevel={activeLevel}
            onSuccess={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── LEADERBOARD ── */}
        <section className="px-5 pt-6">
          <Leaderboard wodId={wod.id_wod || wod.id} />
        </section>

        {/* ── FOOTER ── */}
        <section className="px-5 pt-10 pb-16 flex flex-col items-center gap-6">
          <Link
            href="/dashboard/historial"
            className="flex items-center gap-2.5 px-6 py-3 border border-[#222] rounded text-[10px] font-black italic uppercase tracking-[0.2em] text-[#555] hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
          >
            <History className="w-4 h-4" />
            Ver mi Historial
          </Link>
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#333] italic">
            RorroBox Industrial · Curicó Archive
          </p>
        </section>

      </main>
    </div>
  );
}

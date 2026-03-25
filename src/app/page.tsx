"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import EliteTimer from "@/components/EliteTimer";
import LevelSelector from "@/components/LevelSelector";
import DynamicRegister from "@/components/DynamicRegister";
import Leaderboard from "@/components/Leaderboard";

export default function AthleteDashboard() {
  const [wod, setWod] = useState<any>(null);
  const [activeLevel, setActiveLevel] = useState<"RX" | "SCALED" | "NOVATO">("SCALED");
  const [loading, setLoading] = useState(true);
  const [capturedTime, setCapturedTime] = useState("00:00:00");

  useEffect(() => {
    async function fetchWod() {
      try {
        const res = await fetch("/api/wods/active", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (res.ok) setWod(await res.json());
      } catch (err) {
        console.error("Error de sincronización:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWod();
  }, []);

  /* ── LOADING ── */
  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#555]">
          Sincronizando ecosistema...
        </p>
      </div>
    );

  /* ── EMPTY ── */
  if (!wod)
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-10 text-center gap-4">
        <Activity className="w-10 h-10 text-[#222]" />
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#444]">
          No hay WOD programado
        </h1>
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#333]">
          Día de recuperación activa
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">

      <Navbar />

      <main className="w-full max-w-md mx-auto flex flex-col">

        {/* ── HERO ── */}
        <section className="px-5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#555] mb-2">
            WOD del Día • <span className="text-emerald-500">¡COOL DOWN!</span>
          </p>
          <div
            className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-[9px] font-black italic uppercase tracking-[0.15em] mb-4"
            style={{ clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,0 100%,6px 50%)" }}
          >
            {wod.tipo}
          </div>
          <h1
            className="font-black italic uppercase text-white tracking-tight leading-[0.82]"
            style={{ fontSize: "clamp(72px, 22vw, 88px)" }}
          >
            {wod.titulo}
          </h1>
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
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
            userId="ATHLETE_MOCK"
            fields={wod.config?.fields || ["tiempo"]}
            currentTime={capturedTime}
            selectedLevel={activeLevel}
          />
        </section>

        {/* ── LEADERBOARD ── */}
        <section className="px-5 pt-6 pb-20">
          <Leaderboard wodId={wod.id_wod || wod.id} />
        </section>

      </main>

      <footer className="px-5 py-8 text-center border-t border-[#111]">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#333] italic">
          RorroBox Industrial · <a href="https://instagram.com/rorrofx" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">@rorrofx</a> · Curicó Archive
        </p>
      </footer>
    </div>
  );
}

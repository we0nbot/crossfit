"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Flame, Users } from "lucide-react";

interface LeaderboardEntry {
  nombre_usuario: string;
  resultado: string;
  modalidad: string;
  fecha_registro: string;
}

const tabConfig = {
  rx:     { label: "RX",     activeClass: "bg-emerald-500 text-white border-emerald-500" },
  scaled: { label: "Scaled", activeClass: "bg-amber-500 text-white border-amber-500"   },
  novato: { label: "Novato", activeClass: "bg-cyan-500 text-white border-cyan-500"     },
};

const podiumColor = ["text-emerald-400", "text-[#aaa]", "text-[#c97c3a]"];

export default function Leaderboard({ wodId }: { wodId: string }) {
  const [activeTab, setActiveTab] = useState<"rx" | "scaled" | "novato">("rx");
  const [data, setData] = useState<any | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handler = () => setRefreshCount((c) => c + 1);
    window.addEventListener("refresh-leaderboard", handler);
    return () => window.removeEventListener("refresh-leaderboard", handler);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetch_() {
      if (!wodId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/wods/leaderboard?wodId=${wodId}&t=${Date.now()}`);
        if (res.ok && mounted) setData((await res.json()).leaderboard);
      } catch {}
      finally { if (mounted) setIsLoading(false); }
    }
    fetch_();
    return () => { mounted = false; };
  }, [wodId, refreshCount]);

  const list: LeaderboardEntry[] = data?.[activeTab] || [];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-500" />
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            Ranking
          </h3>
        </div>
        {/* Tabs */}
        <div className="flex gap-1.5">
          {(Object.keys(tabConfig) as Array<keyof typeof tabConfig>).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded border text-[9px] font-black uppercase tracking-wider transition-all duration-150 ${
                activeTab === tab
                  ? tabConfig[tab].activeClass
                  : "border-[#222] text-[#555] bg-transparent hover:text-[#888]"
              }`}
            >
              {tabConfig[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a1a1a] relative">
        <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="py-10 text-center">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#555]">
            Sincronizando ranking...
          </p>
        </div>
      ) : list.length === 0 ? (
        /* Empty state */
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#111] border border-[#222] rounded flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#333]" />
          </div>
          <p className="text-white font-black italic uppercase text-lg tracking-tighter leading-none">
            ¿Aún nadie marcó?
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">
            Sé el primero hoy.
          </p>
        </div>
      ) : (
        /* Entries */
        <div className="divide-y divide-[#111]">
          {list.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <span
                className={`text-3xl font-black italic leading-none min-w-[28px] text-center ${
                  podiumColor[i] || "text-[#333]"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${i === 0 ? "text-white" : "text-[#aaa]"}`}>
                  {entry.nombre_usuario}
                </p>
                {i === 0 && (
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-0.5">
                    Daily King
                  </p>
                )}
              </div>
              <span
                className={`font-mono text-lg font-black italic ${
                  i === 0 ? "text-emerald-400" : "text-[#555]"
                }`}
              >
                {entry.resultado}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#111]">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#444] flex items-center gap-1">
          <Users className="w-3 h-3" /> Top 10 Local
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#444]">
          Actualizado hoy
        </span>
      </div>
    </div>
  );
}

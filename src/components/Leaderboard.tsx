"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Users, Clock, Flame } from "lucide-react";

interface LeaderboardEntry {
  nombre_usuario: string;
  resultado: string; // MM:SS:ms o similar
  modalidad: string;
  fecha_registro: string;
}

interface LeaderboardData {
  rx: LeaderboardEntry[];
  scaled: LeaderboardEntry[];
}

/**
 * Leaderboard - Componente de cliente para visualización del Ranking diario.
 * Permite alternar entre Rx y Scaled con una estética de podio.
 */
export default function Leaderboard({ wodId }: { wodId: string }) {
  const [activeTab, setActiveTab] = useState<"rx" | "scaled">("rx");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRefresh = () => setRefreshCount(prev => prev + 1);
    window.addEventListener("refresh-leaderboard", handleRefresh);
    return () => window.removeEventListener("refresh-leaderboard", handleRefresh);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      if (!wodId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/wods/leaderboard?wodId=${wodId}&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json.leaderboard);
        }
      } catch (err) {
        console.error("Error al cargar leaderboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLeaderboard();
    return () => { isMounted = false; };
  }, [wodId, refreshCount]);

  if (isLoading) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-slate-500 min-h-[300px] animate-pulse">
        <Clock className="w-8 h-8 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando Ranking...</p>
      </div>
    );
  }

  const currentList = data?.[activeTab] || [];
  const hasRecords = currentList.length > 0;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Glare effect de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10"></div>
      
      {/* Header & Tabs */}
      <div className="p-6 bg-slate-900/40 border-b border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-500 shadow-lg shadow-emerald-500/20" />
          <h3 className="font-black italic uppercase tracking-tighter text-white text-lg">Ranking Local</h3>
        </div>
        
        <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setActiveTab("rx")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "rx" 
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" 
                : "text-slate-500 hover:text-white"
            }`}
          >
            RX
          </button>
          <button 
            onClick={() => setActiveTab("scaled")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "scaled" 
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" 
                : "text-slate-500 hover:text-white"
            }`}
          >
            SCALED
          </button>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="p-4 space-y-2 min-h-[300px]">
        {!hasRecords ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-700 animate-bounce">
              <Flame className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-black italic tracking-tighter uppercase text-xl">
                ¿Aún nadie ha marcado?
              </p>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                Sé el primero en marcar hoy.
              </p>
            </div>
            <button className="bg-slate-900 border border-slate-800 px-6 py-2 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:border-emerald-500/30 transition-all">
              Marcar mi tiempo
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {currentList.map((entry, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;
              const isPodium = index < 3;

              return (
                <div 
                  key={index} 
                  className={`flex justify-between items-center p-4 rounded-2xl transition-all duration-300 group ${
                    isFirst 
                      ? "bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                      : isPodium
                      ? "bg-slate-900/40 border border-slate-800/50"
                      : "bg-transparent border border-transparent hover:bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Posición con Estilo de Podio */}
                    <div className="relative flex items-center justify-center">
                      {isFirst ? (
                        <Medal className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      ) : (
                        <span className={`w-6 h-6 flex items-center justify-center text-xs font-black italic ${
                          isSecond ? "text-slate-200" : isThird ? "text-slate-400" : "text-slate-700 group-hover:text-slate-500"
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <span className={`text-sm font-black tracking-tight ${
                        isFirst ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}>
                        {entry.nombre_usuario}
                      </span>
                      {isFirst && (
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] bg-emerald-500 text-slate-950 px-1.5 rounded-full font-black uppercase tracking-[0.1em]">
                             Daily King
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono text-sm font-black ${
                      isFirst ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-500"
                    }`}>
                      {entry.resultado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-900/20 border-t border-slate-800/50 flex items-center justify-between">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
          <Users className="w-3 h-3" /> Top 10 Local
        </p>
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-right">
          Sincronizado hoy
        </p>
      </div>
    </div>
  );
}

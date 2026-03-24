"use client";

import React from "react";
import { Trophy, ArrowDown, ArrowUp, Zap, Calendar } from "lucide-react";

interface Milestone {
  fecha: string;
  wodNombre: string;
  valor: number;
  esPR: boolean;
  modalidad: string;
}

interface RecentMilestonesProps {
  history: Milestone[];
}

/**
 * RecentMilestones - Panel de "Hitos Recientes" para el atleta.
 * Visualiza las últimas 5 marcas con indicadores de progreso técnico (Salto de Calidad).
 */
export default function RecentMilestones({ history }: RecentMilestonesProps) {
  // Tomamos los últimos 5 de la historia (asumiendo que viene ordenada por fecha ASC)
  const lastFive = [...history].reverse().slice(0, 5);

  const calculateQualityJump = (current: Milestone, index: number) => {
    // Buscamos el anterior del mismo WOD en la historia completa para la comparación
    const previous = [...history]
      .reverse()
      .find((m, i) => m.wodNombre === current.wodNombre && m.fecha < current.fecha);

    if (!previous) return null;

    const diff = current.valor - previous.valor;
    const isImprovement = current.esPR; // Dependente de si es tiempo o volumen
    const pct = Math.abs((diff / previous.valor) * 100).toFixed(1);

    return { pct, isImprovement };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Hitos <span className="text-yellow-500">Recientes</span></h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lastFive.length > 0 ? lastFive.map((milestone, i) => {
          const jump = calculateQualityJump(milestone, i);
          
          return (
            <div 
              key={`${milestone.fecha}-${i}`} 
              className={`bg-slate-900 bg-opacity-40 backdrop-blur-md rounded-3xl p-6 border transition-all duration-500 relative overflow-hidden group hover:bg-opacity-60 ${
                milestone.esPR 
                  ? "border-yellow-500/50 shadow-[0_10px_30px_rgba(234,179,8,0.1)]" 
                  : "border-slate-800"
              }`}
            >
              {/* Background Accent */}
              {milestone.esPR && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full"></div>
              )}

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{milestone.fecha}</span>
                    {milestone.esPR && (
                      <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Personal Record</span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-yellow-500 transition-colors">
                    {milestone.wodNombre}
                  </h4>
                </div>
                
                <div className="text-right">
                  <p className="text-3xl font-black font-mono tracking-tighter text-white">
                    {milestone.valor > 600 ? milestone.valor : milestone.valor} <span className="text-[10px] font-bold text-slate-500 uppercase">{milestone.modalidad}</span>
                  </p>
                  {jump && (
                     <div className={`flex items-center justify-end gap-1 text-[10px] font-black uppercase mt-1 ${jump.isImprovement ? "text-emerald-400" : "text-amber-400"}`}>
                        <Zap className="w-3 h-3" />
                         Salto de Calidad: {jump.pct}% {jump.isImprovement ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                     </div>
                  )}
                </div>
              </div>

              {milestone.esPR && (
                <Trophy className="absolute bottom-4 right-4 w-12 h-12 text-yellow-500 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all" />
              )}
            </div>
          );
        }) : (
          <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-600 font-black uppercase tracking-[0.2em] italic">
             Esperando las primeras marcas del atleta...
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays, History } from "lucide-react";

/**
 * WodNavigator - Selector de Viaje en el Tiempo.
 * Permite al atleta navegar por el historial de WODs para consultar marcas pasadas
 * o prepararse para la programación semanal.
 */
export default function WodNavigator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get("date"); // Formato YYYY-MM-DD del input

  // Helper para convertir YYYY-MM-DD a DD-MM-YYYY (esperado por API/Sheets)
  const formatForUrl = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  const handleDateChange = (newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newDate) {
      params.set("date", newDate);
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  const moveDay = (offset: number) => {
    const baseDate = currentDate ? new Date(currentDate) : new Date();
    baseDate.setDate(baseDate.getDate() + offset);
    const formatted = baseDate.toISOString().split("T")[0];
    handleDateChange(formatted);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between shadow-lg group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Explorar Programación</h4>
          <p className="text-xs font-bold text-white italic uppercase tracking-tighter mt-1">Navegador Histórico</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => moveDay(-1)}
          className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
          <input 
            type="date" 
            value={currentDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs font-black text-white focus:outline-none focus:border-emerald-500 appearance-none uppercase transition-all"
          />
        </div>

        <button 
          onClick={() => moveDay(1)}
          className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

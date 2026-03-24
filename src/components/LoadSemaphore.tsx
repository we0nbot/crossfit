"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  Zap,
  ShieldAlert
} from "lucide-react";

interface InsightData {
  status: 'RED' | 'YELLOW' | 'GREEN';
  msg: string;
}

interface AnalyticsToday {
  stats: {
    media: number;
    total: number;
    high_variance: boolean;
  };
  insight: InsightData;
}

/**
 * LoadSemaphore - Componente de Semáforo de Carga Técnica.
 * Visualiza el estado tencico del WOD de hoy basado en el rendimiento grupal.
 */
export default function LoadSemaphore() {
  const [data, setData] = useState<AnalyticsToday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodayAnalytics() {
      try {
        const res = await fetch("/api/coach/analytics/today");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Error al cargar semáforo:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTodayAnalytics();
  }, []);

  if (loading) return (
    <div className="w-full h-24 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse flex items-center px-8 gap-4">
       <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
       <div className="space-y-2">
         <div className="w-48 h-4 bg-slate-800 rounded"></div>
         <div className="w-96 h-3 bg-slate-800 rounded opacity-50"></div>
       </div>
    </div>
  );

  if (!data || !data.insight) return null;

  const { status, msg } = data.insight;

  const config = {
    RED: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
      icon: ShieldAlert,
      label: "Carga Crítica",
      accent: "bg-rose-500"
    },
    YELLOW: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      icon: Zap,
      label: "Intensidad Baja",
      accent: "bg-amber-500"
    },
    GREEN: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      icon: CheckCircle2,
      label: "Carga Óptima",
      accent: "bg-emerald-500"
    }
  }[status];

  return (
    <div className={`p-8 rounded-[2.5rem] border ${config.bg} ${config.border} flex flex-col md:flex-row items-center gap-8 transition-all duration-700 shadow-2xl relative overflow-hidden group`}>
      
      {/* Indicador de Status Visual */}
      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${config.bg} relative`}>
        <div className={`absolute inset-0 rounded-2xl animate-ping opacity-10 ${config.accent}`}></div>
        <config.icon className={`w-8 h-8 ${config.text}`} />
      </div>

      <div className="flex-1 space-y-1 text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
            {config.label}
          </span>
          {data.stats.high_variance && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Alta Varianza
            </span>
          )}
        </div>
        <h4 className={`text-xl font-black italic uppercase tracking-tighter ${config.text}`}>
          {msg}
        </h4>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
          <Info className="w-3 h-3" /> Basado en el rendimiento de {data.stats.total} atletas hoy
        </p>
      </div>

      {/* Acción sugerida sutil */}
      <div className="flex-shrink-0 px-6 py-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-default">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className={`w-3 h-3 ${config.text}`} /> Feedback Operativo
         </p>
      </div>

      {/* Degradado de fondo sutil */}
      <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full blur-[100px] -z-10 transition-opacity group-hover:opacity-10 ${config.accent}`}></div>
    </div>
  );
}

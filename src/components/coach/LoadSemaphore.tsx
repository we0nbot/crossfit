"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, TrendingUp, Users, ChevronRight } from "lucide-react";

/**
 * LoadSemaphore - Dashboard crítico para el Coach.
 * Identifica si la programación del WOD fue adecuada analizando la distribución de cargas.
 */

interface LoadSemaphoreProps {
  data?: {
    histogram: { rango: string; atletas: number }[];
    insight: {
      status: "RED" | "YELLOW" | "GREEN";
      media: number;
      mediana: number;
      unidad: string;
      total_atletas: number;
      alerta?: string;
    };
  };
}

const MOCK_DATA: NonNullable<LoadSemaphoreProps["data"]> = {
  histogram: [
    { rango: "0-20", atletas: 2 },
    { rango: "21-40", atletas: 5 },
    { rango: "41-60", atletas: 12 },
    { rango: "61-80", atletas: 8 },
    { rango: "81-100", atletas: 4 },
  ],
  insight: {
    status: "YELLOW",
    media: 58.5,
    mediana: 55.0,
    unidad: "kg",
    total_atletas: 31,
    alerta: "Desviación alta en el rango superior. Posible sobrecarga.",
  },
};

export default function LoadSemaphore({ data = MOCK_DATA }: LoadSemaphoreProps) {
  const { insight } = data;

  // Selección de color según semáforo
  const statusColors = {
    RED: {
      border: "border-rose-500",
      bg: "bg-rose-500/5",
      text: "text-rose-500",
      accent: "#ef4444",
      label: "Carga Crítica",
    },
    YELLOW: {
      border: "border-amber-500",
      bg: "bg-amber-500/5",
      text: "text-amber-500",
      accent: "#f59e0b",
      label: "Atención Necesaria",
    },
    GREEN: {
      border: "border-emerald-500",
      bg: "bg-emerald-500/5",
      text: "text-emerald-500",
      accent: "#10b981",
      label: "Carga Óptima",
    },
  };

  const currentTheme = statusColors[insight.status];

  return (
    <div
      className={`relative group overflow-hidden bg-slate-950 border ${currentTheme.border} p-6 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.01]`}
    >
      {/* Glare effect dinámico */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${currentTheme.bg} blur-[60px] -z-0`}></div>

      <header className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Semáforo de <span className={currentTheme.text}>Carga</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
            <Users className="w-3 h-3" /> Distribución de {insight.total_atletas} Atletas
          </p>
        </div>
        <div className={`${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
          {currentTheme.label}
        </div>
      </header>

      {/* KPIs de Media y Mediana */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-1">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Media General</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">{insight.media}</span>
            <span className="text-slate-500 font-bold text-sm">{insight.unidad}</span>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-1">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Mediana Est.</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">{insight.mediana}</span>
            <span className="text-slate-500 font-bold text-sm">{insight.unidad}</span>
          </div>
        </div>
      </div>

      {/* Visualización Recharts (Código Quirúrgico) */}
      <div className="relative z-10 bg-slate-900/20 p-4 rounded-3xl border border-white/5 mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.histogram}>
            <XAxis dataKey="rango" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
              cursor={{ fill: "#1e293b", opacity: 0.4 }}
            />
            <Bar
              dataKey="atletas"
              fill={currentTheme.accent}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between items-center px-4 mt-2">
           <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Carga Mín</span>
           <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Carga Máx</span>
        </div>
      </div>

      {/* Sección Inferior de Acción */}
      <div className="space-y-4 relative z-10">
        {insight.alerta && (
          <div className={`${currentTheme.bg} border ${currentTheme.border}/20 p-4 rounded-2xl flex items-start gap-3`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${currentTheme.text}`} />
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              <span className={`font-black uppercase mr-1 ${currentTheme.text}`}>Insight:</span>
              {insight.alerta}
            </p>
          </div>
        )}

        <button className="w-full group/btn bg-white text-slate-950 font-black uppercase italic tracking-tighter py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5">
          Ver Detalle de Atletas Fuera de Rango
          <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

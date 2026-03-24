"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface HistogramData {
  rango: string;
  atletas: number;
}

interface IntensityHistogramProps {
  data: HistogramData[];
}

/**
 * IntensityHistogram - Visualización de la curva de rendimiento para el Coach.
 * Ayuda a identificar si el estímulo del WOD (Carga/Volumen) fue apropiado.
 */
export default function IntensityHistogram({ data }: IntensityHistogramProps) {
  return (
    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
      {/* Indicador de Fondo Sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

      <div className="flex items-center justify-between">
        <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">
          Distribución de <span className="text-emerald-500">Rendimiento</span>
        </h3>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-full">
          Estadística en Vivo
        </span>
      </div>

      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="rango" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontWeight: 'bold' }} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b' }} 
            />
            <Tooltip
              cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#10b981", fontWeight: "bold" }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}
            />
            <Bar 
              dataKey="atletas" 
              fill="#10b981" 
              radius={[8, 8, 2, 2]} 
              animationDuration={2000}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Panel de Insight Maestro */}
      <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl relative overflow-hidden group/insight transition-all hover:bg-emerald-500/15">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover/insight:scale-110 transition-transform">
             <span className="text-xl">💡</span>
          </div>
          <div className="space-y-1">
            <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">
              Insight del Coach
            </p>
            <p className="text-emerald-500 text-sm font-bold leading-relaxed tracking-tight">
              El 70% de la clase terminó en el <span className="text-white italic">'Sweet Spot'</span>. 
              La carga técnica de hoy fue óptima para el nivel general del Box.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

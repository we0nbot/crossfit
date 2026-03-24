"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { AlertCircle, Target, Activity } from "lucide-react";

interface HistogramItem {
  rango: string;
  atletas: number;
}

interface AnalysisData {
  stats: {
    total: number;
    promedio: string;
  };
  histograma: HistogramItem[];
  mensaje?: string;
}

/**
 * IntensityAnalysis - Monitor de Carga Técnica para el Coach.
 * Visualiza la efectividad del estímulo físico mediante la curva de resultados.
 */
export default function IntensityAnalysis({ wodId }: { wodId: string }) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/coach/stats/${wodId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Error cargando análisis de intensidad:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [wodId]);

  if (loading) return <div className="h-80 bg-slate-900 animate-pulse rounded-[2.5rem]" />;
  if (!data || data.histograma.length === 0) return (
    <div className="h-80 bg-slate-900/50 border border-dashed border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest italic">
       <div className="text-center space-y-2">
          <Activity className="w-12 h-12 mx-auto opacity-20" />
          <p>{data?.mensaje || "Sin datos para graficar"}</p>
       </div>
    </div>
  );

  const promedio = parseFloat(data.stats.promedio);
  
  // Lógica de Semáforo (Criterios del Coach)
  // Rojo > 12m (720s), Amarillo < 8m (480s), Verde entre medio.
  const isRed = promedio > 720;
  const isYellow = promedio < 480;

  const borderClass = isRed 
    ? "border-red-500/50 shadow-red-500/5" 
    : isYellow 
      ? "border-yellow-500/50 shadow-yellow-500/5" 
      : "border-emerald-500/20 shadow-emerald-500/5";

  const statusLabel = isRed 
    ? "SOBRECARGA DETECTADA" 
    : isYellow 
      ? "INTENSIDAD BAJA" 
      : "ESTÍMULO ÓPTIMO";

  const statusColor = isRed ? "bg-red-500" : isYellow ? "bg-yellow-500" : "bg-emerald-500";
  const textColor = isRed ? "text-red-400" : isYellow ? "text-yellow-400" : "text-emerald-400";

  // Encontrar rango dominante
  const dominante = [...data.histograma].sort((a, b) => b.atletas - a.atletas)[0];

  return (
    <div className={`p-8 bg-slate-950 rounded-[2.5rem] border-2 shadow-2xl transition-all duration-700 ${borderClass} relative overflow-hidden group`}>
      
      {/* Background Icon Detail */}
      <Target className={`absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 ${textColor}`} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Análisis de <span className={textColor}>Carga Técnica</span></h2>
          <div className="flex items-center gap-2">
             <Activity className="w-3 h-3 text-slate-500" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distribución: <span className="text-white">{data.stats.total} Atletas</span> Procesados</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg ${statusColor} ${isRed || isYellow ? 'text-white' : 'text-slate-950'}`}>
          {statusLabel}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={data.histograma} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
            <XAxis dataKey="rango" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} 
              contentStyle={{ borderRadius: "16px", background: "#020617", border: "1px solid #1e293b", padding: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} 
              labelStyle={{ color: "#64748b", fontWeight: "bold", fontSize: "10px", textTransform: "uppercase", marginBottom: "4px" }}
              itemStyle={{ color: isRed ? "#ef4444" : isYellow ? "#eab308" : "#10b981", fontWeight: "black" }}
            />
            <Bar dataKey="atletas" radius={[6, 6, 2, 2]}>
              {data.histograma.map((_, i) => (
                <Cell 
                   key={i} 
                   fill={isRed ? "#ef4444" : isYellow ? "#eab308" : "#10b981"} 
                   fillOpacity={0.4 + i * 0.15} 
                   className="transition-all duration-500 hover:fill-opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 flex gap-4 items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${statusColor} bg-opacity-10 ${textColor}`}>
            <AlertCircle className="w-6 h-6" />
         </div>
         <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
            * La mayoría de los atletas terminaron en el bloque de <span className="text-white font-black">{dominante?.rango}</span>. 
            {isRed ? " Considera reducir la carga técnica o el peso específico para la clase de la tarde." : isYellow ? " Los pesos fueron insuficientes para el estímulo deseado. Aumentar carga." : " El buen balance de hoy indica que la programación fue óptima."}
         </p>
      </div>
    </div>
  );
}

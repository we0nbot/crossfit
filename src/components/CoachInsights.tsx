"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertCircle, Zap, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";

interface AnalyticsData {
  stats: {
    total_atletas: number;
    media: string;
    mediana: string;
    desviacion_estandar: string;
    high_variance: boolean;
  };
  histogram: { rango: string; frecuencia: number }[];
  records: { nombre: string; resultado: string; segundos: number; modalidad: string }[];
}

interface CoachInsightsProps {
  wodId: string;
  timeCapMinutes?: number;
}

/**
 * CoachInsights - Componente de analítica avanzada para el Coach.
 * Proporciona feedback visual sobre la carga técnica y detecta outliers.
 */
export default function CoachInsights({ wodId, timeCapMinutes = 15 }: CoachInsightsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/coach/analytics?wodId=${wodId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Error al cargar insights:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [wodId]);

  if (loading) return <div className="h-48 bg-slate-900 animate-pulse rounded-3xl" />;
  if (!data) return null;

  const avg = parseFloat(data.stats.media);
  const timeCapSeconds = timeCapMinutes * 60;
  
  // Lógica de Semáforo
  const isTooHeavy = avg > timeCapSeconds;
  const isTooLight = avg < timeCapSeconds * 0.6;

  // Outliers
  const fastest = data.records.slice(0, 3);
  const slowest = [...data.records].reverse().slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Sistema de Semáforo / Banner de Carga */}
      {(isTooHeavy || isTooLight) && (
        <div className={`p-6 rounded-[2rem] border flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-1000 ${
          isTooHeavy ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
        }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
             isTooHeavy ? "bg-rose-500/20" : "bg-cyan-500/20"
          }`}>
             {isTooHeavy ? <ShieldAlert className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter">
              {isTooHeavy ? "⚠️ Carga Técnica Excesiva Detectada" : "⚡ Intensidad por debajo de lo esperado"}
            </h3>
            <p className="text-sm opacity-80 font-medium">
              {isTooHeavy 
                ? "El promedio del grupo superó el Time Cap. Considera reducir cargas o volumen en el próximo entrenamiento similar." 
                : "Los atletas terminaron muy rápido. La carga técnica fue insuficiente para el estímulo deseado."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Histograma de Distribución */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Distribución de Marcas</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold">HISTOGRAMA</span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.histogram}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="rango" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="frecuencia" radius={[6, 6, 0, 0]}>
                  {data.histogram.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.frecuencia > 0 ? "#10b981" : "#1e293b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Outliers (Atletas Extremos) */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Top 3 Rápidos */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingUp className="w-3 h-3" /> Potencial de Subida (Rx)
              </h4>
              <div className="space-y-3">
                {fastest.map((atleta, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white font-bold">{atleta.nombre}</span>
                    <span className="font-mono text-emerald-400 font-bold">{atleta.resultado}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Lentos */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingDown className="w-3 h-3" /> Necesitan Escalado (Scaled)
              </h4>
              <div className="space-y-3">
                {slowest.map((atleta, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white font-bold">{atleta.nombre}</span>
                    <span className="font-mono text-rose-400 font-bold">{atleta.resultado}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-emerald-500 text-slate-950 p-6 rounded-3xl flex items-center justify-between">
             <div>
                <p className="text-xs font-black uppercase opacity-60">Consistencia</p>
                <p className="text-xl font-black italic uppercase tracking-tighter">
                   {data.stats.high_variance ? "ALTA VARIANZA" : "GRUPO COHESIONADO"}
                </p>
             </div>
             <AlertCircle className={`w-8 h-8 ${data.stats.high_variance ? "animate-bounce" : "opacity-20"}`} />
          </div>
        </div>

      </div>
    </div>
  );
}

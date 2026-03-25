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
  Legend,
} from "recharts";

interface HistogramData {
  rango: string;
  RX: number;
  SCALED: number;
  NOVATO: number;
  total: number;
}

interface IntensityHistogramProps {
  data: HistogramData[];
}

/**
 * IntensityHistogram - Centro de Análisis de Población y Técnica.
 * Visualiza la distribución de atletas por nivel técnico (RX/Scaled/Novato).
 */
export default function IntensityHistogram({ data }: IntensityHistogramProps) {
  // Cálculo de ratio de Novatos para el Insight dinámico
  const totalAtletas = data.reduce((acc, curr) => acc + curr.total, 0);
  const totalNovatos = data.reduce((acc, curr) => acc + curr.NOVATO, 0);
  const novatoRatio = totalAtletas > 0 ? (totalNovatos / totalAtletas) * 100 : 0;

  return (
    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
      {/* Indicador de Fondo Sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

      <div className="flex items-center justify-between">
        <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">
          Análisis de <span className="text-emerald-500">Población</span>
        </h3>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-full">
          Censo de Nivel en Vivo
        </span>
      </div>

      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="rango" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontWeight: 'bold' }} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
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
              }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold", marginBottom: "8px" }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '20px' }}
            />
            
            {/* Barras Apiladas por Nivel Técnico */}
            <Bar dataKey="RX" name="RX" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} barSize={40} />
            <Bar dataKey="SCALED" name="Scaled" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} barSize={40} />
            <Bar dataKey="NOVATO" name="Novato" fill="#0ea5e9" stackId="a" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Criterio Técnico por Nivel de Población */}
      <div className={`mt-8 p-6 border rounded-3xl transition-all ${
        novatoRatio > 60 
          ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      }`}>
        <div className="flex gap-4 items-start">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
             novatoRatio > 60 ? "bg-amber-500/20" : "bg-emerald-500/20 text-emerald-400"
           }`}>
              <span className="text-xl">{novatoRatio > 60 ? "⚠️" : "💡"}</span>
           </div>
           <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Leyenda: % de Población por Nivel</p>
             <p className="text-sm font-bold leading-relaxed tracking-tight">
               {novatoRatio > 60 
                 ? `Alerta: El ${novatoRatio.toFixed(0)}% de los atletas hoy son Novatos. Se recomienda bajar la complejidad técnica mañana.` 
                 : `Estado Óptimo: Distribución técnica equilibrada. El Box responde bien a la carga actual.`}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

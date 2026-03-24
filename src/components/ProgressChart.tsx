"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { Trophy } from "lucide-react";

/**
 * ProgressChart - Visualización de la evolución del atleta.
 * Utiliza AreaChart para mostrar tendencias de rendimiento con énfasis en PRs.
 */

interface ProgressDataPoint {
  fecha: string;
  valor: number;
  wodNombre: string;
  modalidad: "Rx" | "Scaled";
  esPR?: boolean;
}

interface ProgressChartProps {
  data?: ProgressDataPoint[];
}

const MOCK_DATA: ProgressDataPoint[] = [
  { fecha: "2026-01-10", valor: 70, wodNombre: "Fran", modalidad: "Rx" },
  { fecha: "2026-01-25", valor: 75, wodNombre: "Cindy", modalidad: "Rx" },
  { fecha: "2026-02-05", valor: 82, wodNombre: "Grace", modalidad: "Rx", esPR: true },
  { fecha: "2026-02-20", valor: 80, wodNombre: "Murph", modalidad: "Scaled" },
  { fecha: "2026-03-15", valor: 90, wodNombre: "DT", modalidad: "Rx", esPR: true },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as ProgressDataPoint;
    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          {item.fecha}
        </p>
        <p className="text-white font-black italic uppercase tracking-tighter text-lg leading-none">
          {item.wodNombre}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
            item.modalidad === "Rx" ? "bg-emerald-500 text-slate-950" : "bg-cyan-500 text-slate-950"
          }`}>
            {item.modalidad}
          </span>
          <span className="text-emerald-400 font-mono font-bold text-sm">
            {item.valor} kg
          </span>
        </div>
        {item.esPR && (
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            <Trophy className="w-3 h-3 fill-current" />
            <span className="text-[8px] font-black uppercase tracking-widest">Personal Record</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Componente para dibujar puntos especiales (PR Gold)
const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (payload.esPR) {
    return (
      <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="white" viewBox="0 0 1024 1024">
        <circle 
          cx="512" 
          cy="512" 
          r="480" 
          fill="#fbbf24" 
          stroke="#fff" 
          strokeWidth="60"
          className="animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"
        />
      </svg>
    );
  }

  return null;
};

export default function ProgressChart({ data = MOCK_DATA }: ProgressChartProps) {
  return (
    <div className="h-72 w-full bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 relative group overflow-hidden transition-all hover:border-slate-700">
      {/* Glare effect sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-0"></div>
      
      <h3 className="text-white font-black italic uppercase text-sm mb-6 tracking-widest relative z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        Evolución de Rendimiento
      </h3>
      
      <div className="h-48 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -40, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="fecha" hide />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#1e293b', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between items-center px-2">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Histórico de Entrenamiento</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progreso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface PrData {
  fecha: string;
  valor: number;
}

interface PrChartProps {
  ejercicioNombre: string;
  data: PrData[];
  unidad?: string;
}

/**
 * Componente PrChart - Visualización de progreso Personal Record (PR).
 * Utiliza Recharts con una estética dark-athletic y gradientes.
 */
export default function PrChart({
  ejercicioNombre,
  data,
  unidad = "kg",
}: PrChartProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">
            Progreso Histórico
          </h3>
          <h2 className="text-2xl font-black text-white">{ejercicioNombre}</h2>
        </div>
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="fecha"
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}${unidad}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#10b981", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>Inicio de Ciclo</span>
        <span className="text-emerald-400">Nuevo PR Detectado</span>
      </div>
    </div>
  );
}

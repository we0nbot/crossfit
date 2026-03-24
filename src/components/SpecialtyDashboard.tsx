"use client";

import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Target, TrendingUp, AlertCircle, ChevronDown, Activity } from "lucide-react";

interface SpecialtyDashboardProps {
  userId: string;
}

/**
 * SpecialtyDashboard - Panel de Análisis de Debilidades Técnicas.
 * Permite al atleta filtrar por movimientos específicos (Extraídos de sus registros JSON)
 * para visualizar su curva de rendimiento aislada y detectar estancamientos.
 */
export default function SpecialtyDashboard({ userId }: SpecialtyDashboardProps) {
  const [movements, setMovements] = useState<string[]>([]);
  const [selectedMovement, setSelectedMovement] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // 1. Cargar catálogo de movimientos registrados por el usuario
  useEffect(() => {
    async function fetchMovements() {
      try {
        const res = await fetch(`/api/user/progress/filter?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setMovements(data.availableMovements || []);
          if (data.availableMovements?.length > 0) {
            setSelectedMovement(data.availableMovements[0]);
          }
        }
      } catch (err) {
        console.error("Error al cargar movimientos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovements();
  }, [userId]);

  // 2. Cargar datos del gráfico al cambiar el movimiento seleccionado
  useEffect(() => {
    if (!selectedMovement) return;

    async function fetchChartData() {
      setIsChartLoading(true);
      try {
        const res = await fetch(`/api/user/progress/filter?userId=${userId}&movimiento=${selectedMovement}`);
        if (res.ok) {
          const data = await res.json();
          setChartData(data.history || []);
        }
      } catch (err) {
        console.error("Error al cargar datos del gráfico:", err);
      } finally {
        setIsChartLoading(false);
      }
    }
    fetchChartData();
  }, [userId, selectedMovement]);

  if (isLoading) return <div className="h-64 flex items-center justify-center animate-pulse text-slate-500 uppercase text-[10px] font-black">Escaneando Historial...</div>;

  const lastValue = chartData.length > 0 ? chartData[chartData.length - 1].valor : 0;
  const firstValue = chartData.length > 0 ? chartData[0].valor : 0;
  const improved = lastValue > firstValue;
  const diffPct = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100).toFixed(1) : 0;

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 transition-all duration-700 group-hover:bg-emerald-500/10"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">
              Filtro de <span className="text-emerald-500">Especialidad</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Análisis de Variables Técnicas</p>
          </div>
        </div>

        {/* Selector de Movimientos Dinámico */}
        <div className="relative w-full md:w-64">
          <select 
            value={selectedMovement}
            onChange={(e) => setSelectedMovement(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white font-bold py-4 px-6 rounded-2xl appearance-none focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-black"
          >
            {movements.map(m => (
              <option key={m} value={m}>{m.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución de Especialidad */}
      <div className="h-80 w-full relative">
        {isChartLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-3xl">
             <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValueSpec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="fecha" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => val.split('-').slice(1).join('/')}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
              }}
              itemStyle={{ color: "#10b981", fontWeight: "bold" }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px", fontWeight: "black", textTransform: "uppercase" }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValueSpec)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Panel de Insights de Calidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${improved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {improved ? <TrendingUp className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
           </div>
           <div className="space-y-0.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Variación Histórica</p>
              <p className={`text-xl font-black italic uppercase tracking-tighter ${improved ? 'text-emerald-500' : 'text-rose-500'}`}>
                {improved ? '+' : ''}{diffPct}% de Mejora
              </p>
           </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
           <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
           </div>
           <div className="space-y-0.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor de Marca Actual</p>
              <p className="text-xl font-black italic uppercase tracking-tighter text-white">
                {lastValue} <span className="text-[10px] font-bold text-slate-500">Métrica Bruta</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import ProgressChart from "@/components/ProgressChart";
import { Dumbbell, TrendingUp, History, Search } from "lucide-react";

/**
 * Historial del Atleta - Vista Evolutiva con Selección de Movimiento.
 * Interfaz que permite filtrar por ejercicio específico y visualizar la tendencia.
 */

const MOVIMIENTOS = [
  "Back Squat",
  "Deadlift",
  "Front Squat",
  "Clean & Jerk",
  "Snatch",
  "Deadlift Peso",
  "Fran",
  "Cindy",
];

export default function HistorialPage(props: {
  searchParams: Promise<{ mockId?: string }>;
}) {
  const [athleteId, setAthleteId] = useState<string>("ID-ATLETA-ANONIMO");
  const [selectedMov, setSelectedMov] = useState("Back Squat");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar athleteId desde searchParams (simulación)
  useEffect(() => {
    props.searchParams.then((params) => {
      setAthleteId(params.mockId || "ID-ATLETA-ANONIMO");
    });
  }, [props.searchParams]);

  // Hook de re-fetch dinámico orientado a la progresión filtrada
  useEffect(() => {
    async function fetchData() {
      if (!athleteId) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/metrics/history?userId=${athleteId}&movimiento=${encodeURIComponent(selectedMov)}`
        );
        if (res.ok) {
          const json = await res.json();
          // Mapeamos para que ProgressChart lo entienda (fecha, valor, wodNombre, modalidad)
          const mapped = json.history.map((h: any) => ({
             fecha: h.fecha,
             valor: h.valor,
             wodNombre: h.wod,
             modalidad: h.modalidad,
             esPR: false // Por ahora simulado, se podría calcular comparando Máx.
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [athleteId, selectedMov]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-white">
      <div className="max-w-md mx-auto space-y-8 pb-16">
        
        {/* Encabezado Principal */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
               <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                Tu <span className="text-emerald-500">Historial</span>
              </h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                Evolución Técnica y de Carga
              </p>
            </div>
          </div>
        </header>

        {/* Selección de Movimiento (Pills Dinámicas) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-3 h-3" /> Filtrar Movimiento
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOVIMIENTOS.map((mov) => {
              const isActive = selectedMov === mov;
              return (
                <button
                  key={mov}
                  onClick={() => setSelectedMov(mov)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20"
                      : "bg-slate-900 border border-emerald-500/20 text-slate-400 hover:border-emerald-500/50 hover:text-white"
                  }`}
                >
                  {mov}
                </button>
              );
            })}
          </div>
        </section>

        {/* Gráfico de Progresión Actualizado Instantáneamente */}
        <section className="relative min-h-[300px] flex flex-col justify-center">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-pulse">
               <TrendingUp className="w-8 h-8 text-slate-700" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Analizando Datos...</p>
            </div>
          ) : chartData.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline px-2">
                <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {selectedMov}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {chartData.length} marcas registradas
                </span>
              </div>
              <ProgressChart data={chartData} />
            </div>
          ) : (
            <div className="text-center py-20 space-y-4 bg-slate-900/40 border border-slate-800 rounded-[3rem]">
               <Dumbbell className="w-12 h-12 text-slate-800 mx-auto" />
               <p className="text-slate-500 font-black italic uppercase tracking-tighter">No hay datos de {selectedMov}</p>
               <p className="text-[10px] text-slate-600 font-medium px-12">
                 Registra un resultado para este movimiento en tu próximo entreno.
               </p>
            </div>
          )}
        </section>

        {/* Footer Informativo */}
        <footer className="pt-4 border-t border-slate-900 flex justify-between">
           <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Almacf Evolution v1.1</p>
           <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Sincronizado</p>
        </footer>
      </div>
    </div>
  );
}

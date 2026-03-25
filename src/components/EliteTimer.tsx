"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'; // Corregido: Importación de Activity

interface EliteTimerProps {
  type: 'STOPWATCH' | 'COUNTDOWN';
  initialSeconds: number;
  onTimeChange?: (currentMs: number) => void;
}

/**
 * EliteTimer V3.1 - Edición Anti-Corte.
 * Implementa tipografía fluida y contenedores responsivos para evitar desbordamientos.
 */
export default function EliteTimer({ type, initialSeconds, onTimeChange }: EliteTimerProps) {
  const [totalCentis, setTotalCentis] = useState(type === 'COUNTDOWN' ? initialSeconds * 100 : 0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - (type === 'COUNTDOWN' ? (initialSeconds * 100 - totalCentis) * 10 : totalCentis * 10);

      timerRef.current = setInterval(() => {
        const deltaMs = Date.now() - startTimeRef.current;
        const deltaCentis = Math.floor(deltaMs / 10);

        if (type === 'COUNTDOWN') {
          const remaining = (initialSeconds * 100) - deltaCentis;
          if (remaining <= 0) {
            setTotalCentis(0);
            setIsRunning(false);
          } else {
            setTotalCentis(remaining);
            if (onTimeChange) onTimeChange(remaining * 10);
          }
        } else {
          setTotalCentis(deltaCentis);
          if (onTimeChange) onTimeChange(deltaCentis * 10);
        }
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, type, initialSeconds]);

  const format = useCallback((centis: number) => {
    const m = Math.floor(centis / 6000);
    const s = Math.floor((centis % 6000) / 100);
    const c = centis % 100;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${c.toString().padStart(2, '0')}`;
  }, []);

  const handleReset = () => {
    setIsRunning(false);
    setTotalCentis(type === 'COUNTDOWN' ? initialSeconds * 100 : 0);
  };

  return (
    <div className={`relative w-full max-w-full px-4 py-8 md:p-12 rounded-[2.5rem] border-2 transition-all duration-700 overflow-hidden ${isRunning
      ? 'bg-slate-950 border-emerald-500 shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]'
      : 'bg-black border-slate-900 shadow-2xl'
      }`}>

      {/* Indicadores Superiores (Flexibles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-800'}`}></div>
          <span className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest italic truncate">
            Precision Core // V3.1
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${type === 'COUNTDOWN'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
          <Activity className="w-3 h-3" />
          {type}
        </div>
      </div>

      {/* Reloj con Tipografía Fluida (Clamp) */}
      <div className="w-full flex justify-center items-center overflow-hidden mb-10 relative z-10">
        <div className={`text-[clamp(1.5rem,5vw,3rem)] font-black font-mono tabular-nums tracking-tighter italic leading-none transition-all duration-500 ${isRunning ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-800'
          }`}>
          {format(totalCentis)}
        </div>
      </div>

      {/* Controles Adaptativos */}
      <div className="flex gap-3 md:gap-6 relative z-10">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-grow py-5 rounded-2xl font-black text-base md:text-xl uppercase italic tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${isRunning
            ? 'bg-slate-900 text-white border border-slate-800'
            : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? 'PAUSE' : 'START'}
        </button>

        <button
          onClick={handleReset}
          className="aspect-square w-16 flex items-center justify-center bg-slate-950 border border-slate-900 text-slate-600 rounded-2xl hover:text-white transition-all active:rotate-180"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Barra de Progreso Minimalista */}
      <div className="mt-8 relative w-full h-1 bg-slate-900/50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${isRunning ? 'bg-emerald-500' : 'bg-slate-800'}`}
          style={{
            width: type === 'COUNTDOWN' ? `${(totalCentis / (initialSeconds * 100)) * 100}%` : '100%',
            transitionTimingFunction: 'linear'
          }}
        />
      </div>
    </div>
  );
}
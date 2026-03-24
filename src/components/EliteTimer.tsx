"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface EliteTimerProps {
  type: 'STOPWATCH' | 'COUNTDOWN';
  initialSeconds: number;
  onTimeChange?: (currentMs: number) => void;
}

/**
 * EliteTimer - Motor de Cronometraje de Grado Competición.
 * Implementa precisión de centisegundos (10ms) con tipografía tabular para estabilidad visual.
 * Diseñado para generar urgencia psicológica en el atleta de alto rendimiento.
 */
export default function EliteTimer({ type, initialSeconds, onTimeChange }: EliteTimerProps) {
  // Estado en centisegundos (100 centis = 1 segundo)
  const [totalCentis, setTotalCentis] = useState(type === 'COUNTDOWN' ? initialSeconds * 100 : 0);
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      // Sincronización absoluta con el reloj del sistema para evitar desfases
      startTimeRef.current = Date.now() - (type === 'COUNTDOWN' ? (initialSeconds * 100 - totalCentis) * 10 : totalCentis * 10);
      
      timerRef.current = setInterval(() => {
        const deltaMs = Date.now() - startTimeRef.current;
        const deltaCentis = Math.floor(deltaMs / 10);
        
        if (type === 'COUNTDOWN') {
          const remaining = (initialSeconds * 100) - deltaCentis;
          if (remaining <= 0) {
            setTotalCentis(0);
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
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
    <div className="bg-slate-950 p-8 md:p-12 rounded-[3.5rem] border-2 border-emerald-500/10 shadow-[0_0_80px_-15px_rgba(16,185,129,0.15)] relative overflow-hidden group">
      
      {/* Indicador Táctico Superior */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-700'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Precision Core v3.0</span>
         </div>
         <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${type === 'COUNTDOWN' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {type} Mode
         </span>
      </div>

      {/* Reloj de Impacto Psicológico */}
      <div className="text-7xl md:text-9xl font-black font-mono text-white tabular-nums tracking-tighter italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-none mb-12">
        {format(totalCentis)}
      </div>
      
      {/* Controles Ergonómicos */}
      <div className="grid grid-cols-4 gap-4">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`col-span-3 py-5 rounded-3xl font-black text-lg uppercase italic tracking-widest transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 ${
            isRunning 
              ? 'bg-slate-900 text-white border border-slate-800' 
              : 'bg-emerald-500 text-slate-950 shadow-[0_15px_40px_-5px_rgba(16,185,129,0.4)] hover:bg-emerald-400'
          }`}
        >
          {isRunning ? (
             <><Pause className="w-6 h-6 fill-current" /> Pausar</>
          ) : (
             <><Play className="w-6 h-6 fill-current" /> ¡GO!</>
          )}
        </button>
        
        <button 
          onClick={handleReset}
          className="col-span-1 flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-500 rounded-3xl hover:text-white hover:bg-slate-800 transition-all active:rotate-180"
          title="Reiniciar"
        >
          <RotateCcw className="w-7 h-7" />
        </button>
      </div>

      {/* Barra de Progreso Maestra */}
      <div className="mt-10 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
         <div 
           className={`h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_#10b981] ${isRunning ? 'opacity-100' : 'opacity-20'}`}
           style={{ 
             width: type === 'COUNTDOWN' 
               ? `${(totalCentis / (initialSeconds * 100)) * 100}%` 
               : '100%',
             transitionTimingFunction: 'linear'
           }}
         />
      </div>
    </div>
  );
}

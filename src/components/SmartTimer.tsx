"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";

interface SmartTimerProps {
  type: "STOPWATCH" | "COUNTDOWN";
  initialSeconds: number;
}

/**
 * SmartTimer - Motor de Cronometraje Adaptativo.
 * Soporta modos Stopwatch (progresivo) y Countdown (regresivo) con precisión técnica.
 */
export default function SmartTimer({ type, initialSeconds }: SmartTimerProps) {
  // Estado en milisegundos para máxima precisión técnica
  const [ms, setMs] = useState(type === "COUNTDOWN" ? initialSeconds * 1000 : 0);
  const [isActive, setIsActive] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      // Sincronización con el reloj del sistema para evitar desfases por carga de CPU
      startTimeRef.current = Date.now() - (type === "COUNTDOWN" ? (initialSeconds * 1000 - ms) : ms);
      
      timerRef.current = setInterval(() => {
        const delta = Date.now() - startTimeRef.current;
        
        if (type === "COUNTDOWN") {
          const remaining = initialSeconds * 1000 - delta;
          if (remaining <= 0) {
            setMs(0);
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
          } else {
            setMs(remaining);
          }
        } else {
          setMs(delta);
        }
      }, 10); // Actualización cada 10ms (Centisegundos)
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, type, initialSeconds]);

  // Formateador MM:SS:ms (Optimizado para legibilidad atlética)
  const formatTime = (totalMs: number) => {
    const totalSeconds = Math.floor(totalMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const cents = Math.floor((totalMs % 1000) / 10);

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${cents.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setMs(type === "COUNTDOWN" ? initialSeconds * 1000 : 0);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-8 rounded-[3rem] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Detalle visual de fondo (Glow sutil) */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <TimerIcon className={`w-5 h-5 ${isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-600'}`} />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Mode: {type === "COUNTDOWN" ? "Temporizador (T-CAP)" : "Cronómetro (STOPWATCH)"}
        </span>
      </div>

      <div className="text-7xl md:text-8xl font-black font-mono text-white tracking-tighter mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        {formatTime(ms)}
      </div>
      
      <div className="flex gap-4 justify-center items-center">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 max-w-[180px] flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase italic transition-all duration-300 shadow-lg ${
            isActive 
              ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' 
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-95'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-current" /> Pausa
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> Iniciar
            </>
          )}
        </button>

        <button 
          onClick={handleReset}
          className="p-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl hover:text-white hover:bg-slate-800 transition-all active:rotate-180"
          title="Reiniciar Cronómetro"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-8 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
         <div 
           className={`h-full bg-emerald-500 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-20'}`}
           style={{ 
             width: type === 'COUNTDOWN' 
               ? `${(ms / (initialSeconds * 1000)) * 100}%` 
               : '100%' 
           }}
         />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import EliteTimer from "./EliteTimer";
import LevelSelector from "./LevelSelector";
import DynamicRegister from "./DynamicRegister";
import { Timer, Layout, Target, Save } from "lucide-react";

interface WodSessionProps {
  wodId: string;
  userId: string;
  fields: string[];
  timerType: 'STOPWATCH' | 'COUNTDOWN';
  timerValue: number;
  req_rx: string;
  req_scaled: string;
  req_novato: string;
  selectedLevel: "RX" | "SCALED" | "NOVATO";
}

/**
 * WodSession - Orquestador Técnico de Entrenamiento (v4.0).
 * Integra el EliteTimer con la nueva estructura de 11 columnas.
 */
export default function WodSession({ 
  wodId, 
  userId, 
  fields,
  timerType,
  timerValue,
  req_rx,
  req_scaled,
  req_novato,
  selectedLevel
}: WodSessionProps) {
  const [currentMs, setCurrentMs] = useState<number>(0);
  const [capturedTime, setCapturedTime] = useState<string>("00:00:00");
  const [showRegister, setShowRegister] = useState(false);

  const formatMs = (ms: number) => {
    const totalCentis = Math.floor(ms / 10);
    const m = Math.floor(totalCentis / 6000);
    const s = Math.floor((totalCentis % 6000) / 100);
    const c = totalCentis % 100;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}`;
  };

  const handleCapture = () => {
    setCapturedTime(formatMs(currentMs));
    setShowRegister(true);
  };

  return (
    <div className="space-y-10">
      
      {/* 1. EliteTimer (Motor de Grado Competición) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-slate-500 uppercase tracking-widest text-[10px] font-black">
          <Timer className="w-3 h-3 text-emerald-500" />
          Control de Tiempo Social
        </div>
        <EliteTimer 
          type={timerType} 
          initialSeconds={timerValue} 
          onTimeChange={setCurrentMs} 
        />
        
        {!showRegister && (
          <button
            onClick={handleCapture}
            className="w-full py-5 bg-slate-900 border border-slate-800 rounded-3xl text-white font-black uppercase tracking-widest italic text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Save className="w-4 h-4 text-emerald-500" />
            Finalizar y Capturar Resultado
          </button>
        )}
      </section>

      {/* 3. Registro Dinámico (Campos Adaptativos) */}
      {showRegister && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <DynamicRegister 
             wodId={wodId} 
             userId={userId} 
             fields={fields} 
             currentTime={capturedTime}
             selectedLevel={selectedLevel}
             onSuccess={() => {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               setShowRegister(false);
             }}
           />
        </section>
      )}
    </div>
  );
}

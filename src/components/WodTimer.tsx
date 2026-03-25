"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Save, Timer } from "lucide-react";

interface WodTimerProps {
  userId?: string;
  wodId?: string;
  onTimeFinished?: (time: string) => void;
}

/**
 * Componente WodTimer - Gestión de cronómetro de alta precisión y registro de métricas.
 * Utiliza lógica matemática pura para el formateo de tiempo (MM:SS:ms).
 */
export default function WodTimer({
  userId = "00000000-0000-4000-a000-000000000000",
  wodId = "11111111-1111-4111-b111-111111111111",
  onTimeFinished
}: WodTimerProps) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      setTime(Date.now() - startTimeRef.current);
      requestRef.current = requestAnimationFrame(update);
    };

    if (isActive) {
      startTimeRef.current = Date.now() - time;
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);

  // Cálculo matemático puro para formatear tiempo MM:SS:CC (Centisegundos)
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsActive(true);
  const handleStop = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setMessage(null);
  };

  // Función de registro orientada al backend de métricas
  const handleRegister = async () => {
    if (time === 0) return;

    setIsSubmitting(true);
    setMessage(null);

    const formattedTime = formatTime(time);

    // Si tenemos orquestador de sesión, delegamos el registro al DynamicRegister final
    if (onTimeFinished) {
      onTimeFinished(formattedTime);
      setIsActive(false);
      return;
    }

    try {
      const response = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_wod: wodId,
          resultado: formattedTime,
          modalidad: "Rx",
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Exponemos el error técnico crudo para depurar
        console.error("Payload rechazado:", responseData);
        throw new Error(JSON.stringify(responseData));
      }

      alert("¡Tiempo registrado con éxito!");
      window.dispatchEvent(new CustomEvent("refresh-leaderboard"));
      setTime(0);
      setIsActive(false);
      setMessage({ type: "success", text: `Resultado registrado con éxito.` });
    } catch (error: any) {
      // Imprime el error exacto en la alerta (Zod o Google Sheets)
      alert(`Error Técnico:\n${error.message}`);
      setMessage({ type: "error", text: "Fallo al registrar la marca." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-auto space-y-8 transition-all hover:scale-[1.01]">
      <div className="flex items-center space-x-3 text-cyan-400">
        <Timer className="w-8 h-8 animate-pulse" />
        <h2 className="text-2xl font-black uppercase tracking-widest italic">Elite Clock</h2>
      </div>

      {/* Pantalla del Cronómetro */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black px-12 py-6 rounded-2xl text-6xl font-mono font-bold text-white tracking-tighter shadow-inner">
          {formatTime(time)}
        </div>
      </div>

      {/* Controles Principales */}
      <div className="flex items-center gap-4 w-full">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <Play className="fill-current" /> {time > 0 ? "RESUMIR" : "INICIAR"}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Square className="fill-current w-5 h-5" /> PAUSAR
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="p-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-2xl transition-all active:rotate-180 border border-white/5"
          title="Reiniciar"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Acción de Registro / Captura Dinámica */}
      <button
        onClick={handleRegister}
        disabled={isSubmitting || time === 0}
        className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-lg transition-all shadow-xl group/btn ${
          isSubmitting || time === 0
            ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 active:scale-95 shadow-blue-500/10"
        }`}
      >
        <Save className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
        {isSubmitting ? "SYNC..." : onTimeFinished ? "FINALIZAR Y REGISTRAR" : "REGISTRAR MARCA"}
      </button>

      {/* Feedback Visual */}
      {message && (
        <div className={`text-sm font-medium px-4 py-2 rounded-lg text-center w-full animate-bounce ${
          message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

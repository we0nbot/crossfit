"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface DynamicRegisterProps {
  wodId: string;
  userId: string;
  fields: string[]; // Ej: ['Peso (kg)', 'Reps', 'Rondas']
  currentTime: string; // MM:SS:CC capturado del EliteTimer
  onSuccess?: () => void;
}

/**
 * DynamicRegister (Versión Elite) - Formulario de captura adaptativo.
 * Integra el tiempo capturado del EliteTimer con inputs dinámicos de rendimiento técnico.
 */
export default function DynamicRegister({
  wodId,
  userId,
  fields,
  currentTime,
  onSuccess
}: DynamicRegisterProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    const missingFields = fields.filter((f) => !formData[f] || formData[f].trim() === "");
    if (missingFields.length > 0) {
      setStatus({ type: "error", msg: `Faltan completar: ${missingFields.join(", ")}` });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    // Construcción del Payload siguiendo el nuevo estándar de la Fase 2
    const payload = {
      wodId,
      userId,
      data: { 
        ...formData, 
        tiempo_final: currentTime 
      },
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
         const errData = await res.json();
         throw new Error(errData.error || "Error al sincronizar con el Box");
      }

      // Éxito: Notificar al ranking y al atleta
      setStatus({ type: "success", msg: "¡Marca registrada! Vas al Leaderboard." });
      window.dispatchEvent(new CustomEvent("refresh-leaderboard"));
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
      
    } catch (error: any) {
      console.error("[CRITICAL_REGISTER_ERROR]", error.message);
      setStatus({ type: "error", msg: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] space-y-8 relative overflow-hidden group">
      
      {/* Glow Inferior */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full"></div>

      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">Registrar <span className="text-emerald-500">Marca</span></h3>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Carga de Datos Tácticos</p>
        </div>
        <div className="flex flex-col items-end">
           <div className="flex items-center gap-2 text-emerald-400">
              <Clock className="w-4 h-4" />
              <span className="text-2xl font-black font-mono tabular-nums italic text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                {currentTime}
              </span>
           </div>
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Captured Time</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field} className="flex flex-col gap-2 group/input">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 group-focus-within/input:text-emerald-500 transition-colors duration-300">
                {field}
              </label>
              <input
                type="text"
                placeholder="--"
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white font-bold placeholder:text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] italic transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden ${
            isSubmitting
              ? "bg-slate-800 text-slate-600 scale-[0.98] cursor-not-allowed"
              : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_15px_40px_-5px_rgba(16,185,129,0.4)] active:scale-95"
          }`}
        >
          {isSubmitting ? (
             <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
          ) : (
             <>
               Subir Marca al Box <Send className="w-5 h-5" />
             </>
          )}
        </button>
      </form>

      {/* Alertas dinámicas de estado */}
      {status && (
        <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
          status.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5" 
            : "bg-red-500/10 border-red-500/20 text-red-500"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <div className="space-y-0.5">
             <p className="text-xs font-black uppercase tracking-widest">{status.msg}</p>
             {status.type === "success" && <p className="text-[10px] opacity-70">Ranking sincronizado con éxito.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

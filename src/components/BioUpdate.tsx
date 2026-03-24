"use client";

import React, { useState } from "react";
import { User, Save, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";

interface BioUpdateProps {
  userId: string;
  currentWeight: number;
}

/**
 * BioUpdate - Perfilador Biométrico del Atleta.
 * Permite la actualización rápida del peso corporal en el Box Hub
 * para garantizar la precisión de los asistentes de carga técnica.
 */
export default function BioUpdate({ userId, currentWeight }: BioUpdateProps) {
  const [newWeight, setNewWeight] = useState(currentWeight);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleUpdate = async () => {
    if (newWeight <= 0) {
      setStatus({ type: "error", msg: "Peso no válido" });
      return;
    }

    setIsUpdating(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newWeight }),
      });

      if (res.ok) {
        setStatus({ type: "success", msg: "Peso actualizado." });
        // Recargamos para que WeightCoach y otras métricas se sincronicen
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error("Error de sincronización");
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Fallo en el servidor" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] space-y-4 shadow-xl group transition-all duration-500 hover:border-emerald-500/30">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
           </div>
           <div>
              <h3 className="text-white font-black italic uppercase tracking-tighter text-sm">Ficha <span className="text-emerald-500">Biométrica</span></h3>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Ajuste de Cargas</p>
           </div>
        </div>
        <div className="text-right">
           <span className="text-xl font-black font-mono text-white italic">{currentWeight}kg</span>
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Actual</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-grow">
          <input 
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-center font-black text-emerald-400 focus:border-emerald-500 outline-none transition-all"
            placeholder="Nuevo Peso..."
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase">KG</span>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`px-6 h-[46px] rounded-xl flex items-center justify-center transition-all duration-300 ${
            isUpdating 
              ? "bg-slate-800 text-slate-600" 
              : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/10"
          }`}
        >
          {isUpdating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
        </button>
      </div>

      {status && (
        <div className={`p-3 rounded-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500 ${
          status.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs" 
            : "bg-red-500/10 border-red-500/20 text-red-500 text-xs"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="font-bold uppercase tracking-widest text-[9px]">{status.msg}</span>
        </div>
      )}

      <p className="text-[9px] leading-relaxed text-slate-500 italic px-2">
        Sincroniza tu peso tras un pesaje oficial para asegurar la precisión de los cálculos de carga en barra.
      </p>
    </div>
  );
}

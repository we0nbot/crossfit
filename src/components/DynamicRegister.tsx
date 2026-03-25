"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface DynamicRegisterProps {
  wodId: string;
  userId: string;
  fields: string[];
  currentTime: string;
  selectedLevel: string;
  onSuccess?: () => void;
}

const levelConfig = {
  RX:     { border: "border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  SCALED: { border: "border-amber-500",   bg: "bg-amber-500/10",   text: "text-amber-500"   },
  NOVATO: { border: "border-cyan-500",    bg: "bg-cyan-500/10",    text: "text-cyan-500"    },
};

export default function DynamicRegister({
  wodId,
  userId,
  fields,
  currentTime,
  selectedLevel,
  onSuccess,
}: DynamicRegisterProps) {
  const [atleta, setAtleta] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [localLevel, setLocalLevel] = useState<"RX" | "SCALED" | "NOVATO">(
    (selectedLevel as any) || "RX"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Carga inicial de datos persistidos
  React.useEffect(() => {
    const savedUser = localStorage.getItem("rorrobox_user");
    if (savedUser) setAtleta(savedUser);
  }, []);

  React.useEffect(() => {
    setLocalLevel(selectedLevel as any);
  }, [selectedLevel]);

  // Auto-Fill Inteligente: Capturar tiempo del cronómetro (v15.8)
  React.useEffect(() => {
    if (currentTime && currentTime !== "00:00:00") {
      const timeField = fields.find(f => 
        f.toLowerCase().includes("tiempo") || f.toLowerCase().includes("time")
      );
      if (timeField) {
        setFormData(prev => ({ ...prev, [timeField]: currentTime }));
      }
    }
  }, [currentTime, fields]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atleta.trim()) {
      setStatus({ type: "error", msg: "Identifícate: Escribe tu nombre primero" });
      return;
    }

    const missing = fields.filter(
      (f) => !["nivel", "modalidad", "level"].includes(f.toLowerCase()) && (!formData[f] || !formData[f].trim())
    );
    if (missing.length > 0) {
      setStatus({ type: "error", msg: `Faltan: ${missing.join(", ")}` });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    // Persistencia local para el próximo WOD
    localStorage.setItem("rorrobox_user", atleta);

    const payload = {
      atleta, // El nombre del alumno (Fase 16)
      wodId,
      userId: userId === "ATHLETE_MOCK" ? atleta : userId, // Si es el mock, usamos su nombre
      nivel: localLevel,
      results: { ...formData, tiempo_final: currentTime },
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al sincronizar");
      }
      setStatus({ type: "success", msg: "¡Marca registrada! Vas al Leaderboard." });
      window.dispatchEvent(new CustomEvent("refresh-leaderboard"));
      if (onSuccess) setTimeout(onSuccess, 2000);
    } catch (error: any) {
      setStatus({ type: "error", msg: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cfg = levelConfig[localLevel] || levelConfig.RX;
  const visibleFields = fields.filter(
    (f) => !["nivel", "modalidad", "level"].includes(f.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            Registrar <span className="text-emerald-500">Marca</span>
          </h3>
          {/* Level mini-pills */}
          <div className="flex gap-1.5 mt-3">
            {(["RX", "SCALED", "NOVATO"] as const).map((lvl) => {
              const c = levelConfig[lvl];
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLocalLevel(lvl)}
                  className={`px-3 py-1 rounded border text-[10px] font-black italic uppercase tracking-wider transition-all duration-150 ${
                    localLevel === lvl
                      ? `${c.border} ${c.bg} ${c.text}`
                      : "border-[#222] text-[#555] bg-transparent hover:text-[#888]"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Captured time */}
        <div className="text-right">
          <span className="text-2xl font-black italic font-mono text-white leading-none">
            {currentTime}
          </span>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#555] mt-0.5">
            Tiempo capturado
          </p>
        </div>
      </div>

      {/* Divider with level accent */}
      <div className={`h-px w-full bg-[#1a1a1a] relative`}>
        <div className={`absolute left-0 top-0 h-px w-10 ${cfg.bg.replace("bg-", "bg-").replace("/10", "")}`}
          style={{ background: localLevel === "RX" ? "#10b981" : localLevel === "SCALED" ? "#f59e0b" : "#06b6d4" }}
        />
      </div>

      {/* Inputs Dinámicos */}
      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Identidad del Atleta (v16.0) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">
            Nombre o Alias
          </label>
          <input
            type="text"
            placeholder="Ej: Rorro Extreme"
            className="bg-[#111] border border-[#222] rounded px-4 py-3 text-white text-sm font-semibold placeholder:text-[#333] outline-none focus:border-emerald-500 focus:ring-0 transition-all duration-200 w-full"
            value={atleta}
            onChange={(e) => setAtleta(e.target.value)}
          />
        </div>

        <div className={`grid gap-3 ${visibleFields.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {visibleFields.map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#555]">
                {field}
              </label>
              <input
                type="text"
                placeholder="—"
                className="bg-[#111] border border-[#222] rounded px-4 py-3 text-white text-sm font-semibold placeholder:text-[#333] outline-none focus:border-emerald-500 focus:ring-0 transition-colors duration-200 w-full"
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded text-sm font-black italic uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-200 ${
            isSubmitting
              ? "bg-[#1a1a1a] text-[#555] cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Subir Marca al Box
            </>
          )}
        </button>
      </form>

      {/* Status */}
      {status && (
        <div
          className={`flex items-center gap-3 p-4 rounded border text-xs font-bold uppercase tracking-wider animate-in fade-in duration-300 ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {status.msg}
        </div>
      )}
    </div>
  );
}

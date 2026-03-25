"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
} from "lucide-react";
import Link from "next/link";
import FocusFlowView from "@/components/dashboard/FocusFlowView";

/**
 * AthleteDashboard - Experiencia Premium de Alto Rendimiento 'The Focus Flow'.
 * Versión CLIENT-SIDE con Anti-Caché Móvil (CacheBuster).
 */
export default function AthleteDashboard() {
  const [wod, setWod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const athleteId = "00000000-0000-4000-a000-000000000000"; // Mock temporal

  useEffect(() => {
    async function fetchWod() {
      try {
        const cacheBuster = new Date().getTime(); 
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get("date");
        const apiUrl = `/api/wods/active?t=${cacheBuster}${dateParam ? `&date=${dateParam}` : ""}`;

        const res = await fetch(apiUrl, { 
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const data = await res.json();

        // Si la API dice que es día de descanso o hay error técnico
        if (!res.ok || data.status === "REST_DAY" || data.status === "LIBRARY_ERROR") {
          console.error("Estado especial del WOD:", data);
          setErrorStatus(data.error || "Día de descanso");
          setLoading(false);
          return;
        }

        setWod(data);
      } catch (err) {
        console.error("Error de sincronización con RorroBox Core:", err);
        setErrorStatus("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    }
    fetchWod();
  }, []);

  // 1. ESTADO DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Sincronizando...</p>
      </div>
    );
  }

  // 2. ESTADO DE DESCANSO / ERROR TÉCNICO
  if (errorStatus || !wod) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 space-y-8 text-center">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 animate-pulse text-emerald-500">
           <Activity className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Descanso <span className="text-emerald-500">Activo</span>
          </h1>
          <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl max-w-xs mx-auto">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Estado del Servidor</p>
            <p className="text-emerald-500 text-xs font-mono font-bold leading-relaxed lowercase">
              {errorStatus || "Buscando programación..."}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/dashboard/historial" className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            Ver Historial
          </Link>
          <button onClick={() => window.location.reload()} className="text-[8px] font-black text-slate-700 uppercase tracking-widest hover:text-emerald-500 transition-colors">
             Forzar Reintento Táctico
          </button>
        </div>
      </div>
    );
  }

  // 3. VISTA PRINCIPAL (FOCUS FLOW)
  return <FocusFlowView wod={wod} athleteId={athleteId} />;
}

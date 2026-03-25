"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Dumbbell, 
  Send, 
  Layout, 
  Eye, 
  Clock, 
  Trophy,
  PlusCircle,
  Hash,
  Zap,
  ShieldCheck,
  RefreshCw,
  Activity
} from "lucide-react";
import EliteTimer from "@/components/EliteTimer";

/**
 * ProgramacionPage - Panel del Coach para la creación de WODs.
 * Diseño con formulario interactivo y previsualización en tiempo real.
 */
export default function ProgramacionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [templates, setTemplates] = useState<any[]>([]);
  const [lastLoadedTemplate, setLastLoadedTemplate] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga de plantillas desde la API maestra de WODs
  const loadTemplates = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/wods/templates?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error("Fallo al cargar catálogo:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const [formData, setFormData] = useState({
    fecha: today,
    titulo: "",
    tipo: "AMRAP",
    descripcion: "", // Descripción General del WOD (Evolución 11-Col)
    req_rx: "",
    req_scaled: "",
    req_novato: "",
    timerType: "STOPWATCH",
    timerValue: 0,
    fields: "tiempo",
    id_wod: "" // Identificador técnico para el JOIN
  });

  const [activeTab, setActiveTab] = useState<"RX" | "SCALED" | "NOVATO">("RX");

  const handleSelectTemplate = (templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (!selected) return;

    setFormData({
      ...formData,
      titulo: selected.titulo,
      tipo: selected.tipo || "AMRAP", // Añadido para calzar con el esquema
      descripcion: selected.descripcion || "",
      // Extracción de Niveles (Fase 2 - Carga Instantánea)
      req_rx: selected.levels?.rx || selected.descripcion || "",
      req_scaled: selected.levels?.scaled || selected.descripcion || "",
      req_novato: selected.levels?.novato || selected.descripcion || "",
      timerType: selected.timerType || "STOPWATCH",
      timerValue: selected.timerValue || 0,
      fields: selected.inputSchema || "tiempo",
      id_wod: selected.id_wod || selected.id // Vincular ID para el JOIN técnico
    });
    setLastLoadedTemplate(selected.titulo);
  };

  // Agrupación de plantillas para el selector
  const heroWods = templates.filter(t => t.category === "HERO");
  const girlWods = templates.filter(t => t.category === "GIRL");
  const generalWods = templates.filter(t => !["HERO", "GIRL"].includes(t.category));

  // Tipos de WOD permitidos por la API
  const WOD_TYPES = ["AMRAP", "EMOM", "FOR TIME", "TABATA", "PR"];

  // Helper para convertir YYYY-MM-DD a DD-MM-YYYY para la API
  const formatDateToApi = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const formatted = `${day}-${month}-${year}`;
    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        ...formData,
        fecha: formatDateToApi(formData.fecha)
      };

      const res = await fetch("/api/wods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (res.ok) {
        alert("WOD Programado exitosamente para todos los niveles");
        router.refresh();
        setLastLoadedTemplate(null);
        setFormData({ 
          titulo: "", 
          tipo: "AMRAP", 
          descripcion: "",
          req_rx: "", 
          req_scaled: "",
          req_novato: "",
          fecha: today,
          timerType: "STOPWATCH",
          timerValue: 0,
          fields: "tiempo",
          id_wod: ""
        });
      } else {
        const err = await res.json();
        alert(`Error al programar: ${err.error || "Algo salió mal"}`);
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error de red al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Seccion */}
        <header className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic flex items-center gap-4">
              <Zap className="w-10 h-10 text-emerald-500 fill-current" />
              Rorro<span className="text-emerald-500">Box</span>
            </h1>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
               <ShieldCheck className="w-3 h-3" /> Command Center / Multi-Nivel Pipeline
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Columna: Formulario de Programación */}
          <section className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Planificación Diaria
                </h2>
              </div>
              {lastLoadedTemplate && (
                <div className="bg-emerald-500 text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-emerald-500/20">
                   ⚡ Clonando: {lastLoadedTemplate}
                </div>
              )}
            </div>

            {/* Selector de Hero WODs (Programación Rápida) */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Zap className="w-24 h-24 text-emerald-500" />
               </div>
               <div className="flex gap-4 relative z-10">
                 <div className="flex-grow relative">
                   <select 
                     onChange={(e) => handleSelectTemplate(e.target.value)}
                     className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white font-black italic uppercase tracking-tighter outline-none focus:border-emerald-500 appearance-none transition-all cursor-pointer"
                   >
                     <option value="">Selecciona una plantilla...</option>
                     
                     <optgroup label="--- HERO WODS ---" className="bg-slate-950 text-emerald-500 text-[10px] font-black">
                       {heroWods.map(t => (
                         <option key={t.id} value={t.id} className="text-white text-sm bg-slate-900">{t.titulo}</option>
                       ))}
                     </optgroup>
     
                     <optgroup label="--- GIRL WODS ---" className="bg-slate-950 text-emerald-500 text-[10px] font-black">
                       {girlWods.map(t => (
                         <option key={t.id} value={t.id} className="text-white text-sm bg-slate-900">{t.titulo}</option>
                       ))}
                     </optgroup>

                     <optgroup label="--- OTRAS PLANTILLAS / GENERAL ---" className="bg-slate-950 text-emerald-500 text-[10px] font-black">
                       {generalWods.map(t => (
                         <option key={t.id} value={t.id} className="text-white text-sm bg-slate-900">{t.titulo}</option>
                       ))}
                     </optgroup>
                   </select>
                 </div>
                 
                 <button
                   type="button"
                   onClick={loadTemplates}
                   disabled={isRefreshing}
                   className="px-6 bg-slate-950 border-2 border-slate-800 rounded-2xl text-emerald-500 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 group/refresh"
                   title="Actualizar Catálogo desde Google Sheets"
                 >
                   <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : 'group-hover/refresh:rotate-180 transition-transform duration-500'}`} />
                 </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-950 border-4 border-slate-900 p-10 rounded-[3rem] shadow-3xl space-y-10">
              
              {/* Grid 1: Fecha y Tipo Estructural */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Fecha de Sesión</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input 
                      type="date" 
                      required
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 pl-14 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black uppercase tracking-tighter"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Estructura</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <select 
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 pl-14 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black italic uppercase appearance-none"
                    >
                      {WOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Input Título (Impacto Visual) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Título del Entrenamiento</label>
                <div className="relative">
                  <Dumbbell className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input 
                    type="text" 
                    placeholder="MURPH, FRAN, DT..." 
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 pl-14 text-xl focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 font-black italic uppercase tracking-tighter"
                  />
                </div>
              </div>

              {/* Grid 2: Configuración del Timer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Motor Timer</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <select 
                      value={formData.timerType}
                      onChange={(e) => setFormData({...formData, timerType: e.target.value})}
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 pl-14 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black uppercase appearance-none"
                    >
                      <option value="STOPWATCH">STOPWATCH (Ascendente)</option>
                      <option value="COUNTDOWN">COUNTDOWN (AMRAP/CAP)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Valor Objetivo (Seg)</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 1200" 
                    value={formData.timerValue}
                    onChange={(e) => setFormData({...formData, timerValue: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black"
                  />
                </div>
              </div>

              {/* Input Estímulo y Preparación (JOIN TÉCNICO FASE 12) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-1 italic flex items-center gap-2">
                   <Zap className="w-3 h-3 fill-current" /> Estímulo y Preparación del Día
                </label>
                <textarea 
                  rows={4}
                  placeholder="Warmup, Estímulo del WOD, Time Caps recomendados..." 
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-bold italic placeholder:text-slate-800 resize-none"
                />
              </div>

              {/* Input Esquema de Resultados */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Campos de Registro</label>
                <input 
                  type="text" 
                  placeholder="tiempo, reps, peso..." 
                  required
                  value={formData.fields}
                  onChange={(e) => setFormData({...formData, fields: e.target.value})}
                  className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black italic uppercase tracking-widest"
                />
              </div>

              {/* Selector de Nivel (Tabs Industriales) */}
              <div className="space-y-6 pt-4">
                <div className="flex bg-slate-900 p-2 rounded-[2rem] border-2 border-slate-800 gap-2">
                   {(["RX", "SCALED", "NOVATO"] as const).map(tab => {
                     const isFilled = tab === "RX" ? formData.req_rx : tab === "SCALED" ? formData.req_scaled : formData.req_novato;
                     return (
                       <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            activeTab === tab 
                              ? tab === "RX" ? "bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                : tab === "SCALED" ? "bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                                : "bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                              : "text-slate-600 hover:text-slate-300"
                          }`}
                       >
                         {tab}
                         {isFilled && <div className={`w-1.5 h-1.5 rounded-full ${activeTab === tab ? 'bg-slate-950/40' : 'bg-emerald-500'}`} />}
                       </button>
                     );
                   })}
                </div>

                <textarea 
                  rows={8}
                  placeholder={`Protocolo Técnico ${activeTab}...`} 
                  required
                  value={activeTab === "RX" ? formData.req_rx : activeTab === "SCALED" ? formData.req_scaled : formData.req_novato}
                  onChange={(e) => {
                    if (activeTab === "RX") setFormData({...formData, req_rx: e.target.value});
                    else if (activeTab === "SCALED") setFormData({...formData, req_scaled: e.target.value});
                    else setFormData({...formData, req_novato: e.target.value});
                  }}
                  className={`w-full bg-slate-900 border-2 rounded-[2.5rem] p-8 text-sm focus:outline-none transition-all text-white font-mono placeholder:text-slate-800 resize-none leading-relaxed ${
                    activeTab === "RX" ? "border-emerald-500/20 focus:border-emerald-500" :
                    activeTab === "SCALED" ? "border-amber-500/20 focus:border-amber-500" :
                    "border-cyan-500/20 focus:border-cyan-500"
                  }`}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-500/20 group active:scale-95 text-lg uppercase italic tracking-tighter"
              >
                {isLoading ? (
                  <>
                    <span className="w-6 h-6 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    Publicar a RorroBox
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Columna: Previsualización de Grado Atleta */}
          <section className="space-y-10 sticky top-12 self-start hidden lg:block">
            <div className="flex items-center gap-2 px-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Visualización Live Atleta ({activeTab})
              </h2>
            </div>

            {/* Réplica Elite de WodCard ('Welding' v5.0) */}
            <div className="relative group max-w-lg">
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-[3rem] blur-xl opacity-20 animate-pulse"></div>
               <div className="relative bg-black border-4 border-slate-900 rounded-[3.5rem] shadow-3xl overflow-hidden">
                  
                  {/* HERO BLOCK PRO (Igual a FocusFlowView) */}
                  <div className="bg-slate-950/50 border-b-4 border-slate-900 p-10 space-y-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Activity className="w-24 h-24 text-emerald-500" />
                     </div>
                     <header className="space-y-2 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-[8px] font-black uppercase tracking-[0.2em] rounded-sm italic transform -skew-x-12">
                             {formData.tipo}
                           </span>
                           <div className="h-[1px] flex-grow bg-white/10"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-[0.85] break-words">
                          {formData.titulo || "Protocolo"}
                        </h2>
                     </header>
                     <div className="flex justify-center scale-90 origin-center">
                        <EliteTimer 
                           type={formData.timerType as any}
                           initialSeconds={formData.timerValue}
                        />
                     </div>
                  </div>

                  <div className="p-8 space-y-8">
                     {/* Estímulo y Preparación */}
                     {formData.descripcion && (
                       <div className="bg-slate-900/40 border-l-4 border-emerald-500 p-6 rounded-r-2xl space-y-2 shadow-xl">
                          <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Estímulo & Preparación</h4>
                          <p className="text-white text-xs font-bold italic tracking-tight leading-relaxed whitespace-pre-line opacity-90">
                            {formData.descripcion}
                          </p>
                       </div>
                     )}

                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full ${
                             activeTab === "RX" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : 
                             activeTab === "SCALED" ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : 
                             "bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                           } animate-pulse`} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Standard: {activeTab}</span>
                        </div>
                        <div className="p-8 bg-slate-950 border-2 border-slate-900 rounded-[2rem] min-h-[150px] flex flex-col justify-center">
                           { (activeTab === "RX" ? formData.req_rx : activeTab === "SCALED" ? formData.req_scaled : formData.req_novato) ? (
                             <p className="text-white text-base font-bold italic tracking-tight whitespace-pre-line leading-relaxed">
                               {activeTab === "RX" ? formData.req_rx : activeTab === "SCALED" ? formData.req_scaled : formData.req_novato}
                             </p>
                           ) : (
                             <p className="text-slate-800 text-[10px] font-black uppercase text-center tracking-widest">Esperando Programación...</p>
                           )}
                        </div>
                     </div>
                  </div>

                </div>
             </div>

             <div className="p-8 bg-slate-900/40 border-2 border-slate-800 rounded-[2.5rem] flex items-start gap-5 text-slate-400">
               <Trophy className="w-6 h-6 text-emerald-500 mt-1" />
               <div className="space-y-2">
                  <p className="text-white font-black uppercase italic tracking-widest text-xs">Criterio Competición</p>
                  <p className="text-[11px] leading-relaxed font-medium">
                    Asegura que las descripciones sean claras. Los atletas podrán elegir su nivel, pero la programación técnica se guardará de forma íntegra para analíticas futuras.
                  </p>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

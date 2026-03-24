"use client";

import React, { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";

/**
 * ProgramacionPage - Panel del Coach para la creación de WODs.
 * Diseño con formulario interactivo y previsualización en tiempo real.
 */
export default function ProgramacionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [templates, setTemplates] = useState<any[]>([]);
  const [lastLoadedTemplate, setLastLoadedTemplate] = useState<string | null>(null);

  // Carga de plantillas desde la API maestra de WODs
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch("/api/wods/templates");
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error("Fallo al cargar catálogo:", err);
      }
    }
    loadTemplates();
  }, []);

  const [formData, setFormData] = useState({
    fecha: today,
    titulo: "",
    tipo: "AMRAP",
    descripcion: "",
    timerType: "STOPWATCH",
    timerValue: 0,
    fields: "tiempo"
  });

  const handleSelectTemplate = (templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (!selected) return;

    setFormData({
      ...formData,
      titulo: selected.titulo,
      descripcion: selected.descripcion,
      timerType: selected.timerType,
      timerValue: selected.timerValue,
      fields: selected.inputSchema
    });
    setLastLoadedTemplate(selected.titulo);
  };

  // Agrupación de plantillas para el selector (Usando la propiedad 'category' del API)
  const heroWods = templates.filter(t => t.category === "HERO");
  const girlWods = templates.filter(t => t.category === "GIRL");

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
        alert("WOD Programado exitosamente");
        setLastLoadedTemplate(null);
        setFormData({ 
          titulo: "", 
          tipo: "AMRAP", 
          descripcion: "", 
          fecha: today,
          timerType: "STOPWATCH",
          timerValue: 0,
          fields: "tiempo"
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
        <header className="flex items-center justify-between border-b border-slate-900 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <Layout className="w-8 h-8 text-emerald-500" />
              Programación <span className="text-emerald-500">Técnica</span>
            </h1>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-[0.2em]">
              Gestión de cargas e inteligencia competitiva
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Columna: Formulario de Programación */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Nuevo Entrenamiento
                </h2>
              </div>
              {lastLoadedTemplate && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                   ⚡ Plantilla Cargada: {lastLoadedTemplate}
                </div>
              )}
            </div>

            {/* Selector de Hero WODs (Programación Rápida) */}
            <div className="mb-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] space-y-3 shadow-inner">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap className="w-3 h-3 fill-current" /> Programación Rápida (Elite Catalog)
              </label>
              <select 
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white font-bold outline-none focus:border-emerald-500/50 appearance-none transition-all cursor-pointer"
              >
                <option value="">Selecciona una plantilla para clonar...</option>
                
                <optgroup label="--- HERO WODS ---" className="bg-slate-950 text-slate-500 text-[10px] font-black">
                  {heroWods.map(t => (
                    <option key={t.id} value={t.id} className="text-white text-sm bg-slate-900">{t.titulo}</option>
                  ))}
                </optgroup>

                <optgroup label="--- GIRL WODS ---" className="bg-slate-950 text-slate-500 text-[10px] font-black">
                  {girlWods.map(t => (
                    <option key={t.id} value={t.id} className="text-white text-sm bg-slate-900">{t.titulo}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm space-y-8">
              
              {/* Grid 1: Fecha y Tipo Estructural */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha de Sesión</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="date" 
                      required
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de Estructura</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select 
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black appearance-none"
                    >
                      {WOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Input Título (Impacto Visual) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Título del WOD</label>
                <div className="relative">
                  <Dumbbell className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Ej. Murph Hero, The Girls: Fran..." 
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 font-bold"
                  />
                </div>
              </div>

              {/* Grid 2: Configuración del Timer (Fase 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modalidad Timer</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select 
                      value={formData.timerType}
                      onChange={(e) => setFormData({...formData, timerType: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-black appearance-none"
                    >
                      <option value="STOPWATCH">STOPWATCH (Hacia arriba)</option>
                      <option value="COUNTDOWN">COUNTDOWN (AMRAP/CAP)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Time Cap / Valor (Seg)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="number" 
                      placeholder="Ej: 1200 para 20 mins" 
                      value={formData.timerValue}
                      onChange={(e) => setFormData({...formData, timerValue: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Input Esquema de Resultados */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Esquema de Registro (Campos dinámicos)</label>
                <div className="relative">
                  <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Ej: tiempo  O  rondas,reps" 
                    required
                    value={formData.fields}
                    onChange={(e) => setFormData({...formData, fields: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white font-bold"
                  />
                </div>
              </div>

              {/* Textarea Descripción */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descripción y Protocolo</label>
                <textarea 
                  rows={4}
                  placeholder="Escribe el entrenamiento detallado..." 
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl p-6 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-300 font-mono placeholder:text-slate-700 resize-none leading-relaxed"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/10 group active:scale-95"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Programando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Publicar Entrenamiento
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Columna: Previsualización en Vivo */}
          <section className="space-y-8 sticky top-12 self-start">
            <div className="flex items-center gap-2 px-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Vista Previa del Atleta
              </h2>
            </div>

            {/* Réplica de WodCard UI del Dashboard */}
            <div className="relative group overflow-hidden max-w-sm mx-auto lg:mx-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-3xl space-y-6">
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">
                      {formData.fecha ? formatDateToApi(formData.fecha) : "DD-MM-YYYY"}
                    </h3>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white break-words">
                      {formData.titulo || "Título del Entrenamiento"}
                    </h2>
                  </div>
                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg h-fit">
                    {formData.tipo}
                  </span>
                </div>

                <div className="bg-black/50 p-6 rounded-2xl border border-slate-800/50 min-h-[160px] flex flex-col">
                  {formData.descripcion ? (
                    <p className="text-slate-300 whitespace-pre-line font-mono text-xs leading-relaxed tracking-tight">
                      {formData.descripcion}
                    </p>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-700 italic text-xs gap-3">
                      <Layout className="w-6 h-6 opacity-20" />
                      Esperando contenido...
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> Nivel: RX</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-cyan-500" /> Box Hub</span>
                </div>
              </div>
            </div>

            {/* Tip Estético */}
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4 text-emerald-400 max-w-sm">
              <Eye className="w-5 h-5 mt-1 flex-shrink-0" />
              <p className="text-[11px] leading-relaxed font-medium">
                Esta es la vista exacta que recibirá el atleta en su móvil.
                Asegúrate de que la descripción sea clara y use saltos de línea para mejor legibilidad.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Dumbbell, 
  Activity, 
  ArrowLeft,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Flame,
  Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import EliteTimer from "@/components/EliteTimer";

interface WodTemplate {
  id: string;
  id_wod: string;
  titulo: string;
  tipo: string;
  descripcion: string;
  timerType: 'STOPWATCH' | 'COUNTDOWN';
  timerValue: number;
  levels: {
    rx: string;
    scaled: string;
    novato: string;
  };
  category: string;
}

export default function FreeTrainingPage() {
  const [templates, setTemplates] = useState<WodTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedWod, setSelectedWod] = useState<WodTemplate | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<"RX" | "SCALED" | "NOVATO">("SCALED");

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/wods/templates");
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error("Error cargando biblioteca:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => 
    t.titulo.toLowerCase().includes(search.toLowerCase()) ||
    t.id_wod.toLowerCase().includes(search.toLowerCase()) ||
    t.tipo.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-500 font-black uppercase text-[10px] tracking-widest italic">Accediendo a la Biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50 contrast-150"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto min-h-screen flex flex-col">
        
        <Navbar />

        <main className="flex-grow p-6 space-y-8">
          
          {!selectedWod ? (
            <div className="space-y-6">
              {/* Selector / Search */}
              <div className="space-y-4">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                  Elige tu <span className="text-emerald-500">Desafío</span>
                </h2>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder="BUSCAR WOD (POR NOMBRE O TIPO)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {/* Lista de WODs */}
              <div className="grid grid-cols-3 gap-3">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((wod) => (
                    <button 
                      key={wod.id}
                      onClick={() => setSelectedWod(wod)}
                      className="group relative bg-slate-900 border border-slate-800 rounded-xl text-left transition-all hover:border-emerald-500/50 hover:bg-slate-900/80 overflow-hidden flex flex-col h-full min-h-[120px]"
                    >
                      {/* Grid Interno de 2 Columnas */}
                      <div className="grid grid-cols-2 h-full">
                        {/* Columna 1: Info Actual */}
                        <div className="p-3 border-r border-[#1a1a1a] flex flex-col justify-between">
                          <div>
                            <div className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[6px] font-black uppercase tracking-widest rounded inline-block mb-1">
                              {wod.tipo}
                            </div>
                            <h3 className="text-[10px] font-black italic uppercase tracking-tighter text-white group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2">
                              {wod.titulo}
                            </h3>
                          </div>
                          <p className="text-[6px] font-bold text-slate-600 uppercase tracking-widest">
                            {wod.id_wod}
                          </p>
                        </div>

                        {/* Columna 2: El WOD (Snippet) */}
                        <div className="p-3 bg-black/20 flex flex-col gap-1.5 overflow-hidden">
                          <p className="text-[6px] font-black text-emerald-500 uppercase tracking-widest opacity-50">Content</p>
                          <p className="text-[8px] font-medium text-slate-400 leading-tight line-clamp-4 italic">
                            {wod.levels.rx || wod.descripcion || "Protocolo técnico pendiente..."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="absolute top-1 right-1 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Dumbbell className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center border-2 border-dashed border-slate-900 rounded-[2.5rem]">
                    <Activity className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">No se hallaron protocolos compatibles</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Botón Volver */}
              <button 
                onClick={() => setSelectedWod(null)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Cambiar Entrenamiento
              </button>

              {/* Visor Técnico */}
              <section className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-md">{selectedWod.tipo}</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{selectedWod.id_wod}</span>
                  </div>
                  <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
                    {selectedWod.titulo}
                  </h2>
                </div>

                {/* SELECTOR DE INTENSIDAD (Estética Imagen Referencia) */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                    Intensidad Técnica
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "RX", label: "RX", icon: Flame, color: "text-orange-500", border: "border-orange-500/50", bg: "bg-orange-500/10", val: selectedWod.levels.rx },
                      { id: "SCALED", label: "SCALED", icon: Zap, color: "text-orange-500", border: "border-orange-500/50", bg: "bg-orange-500/10", val: selectedWod.levels.scaled },
                      { id: "NOVATO", label: "NOVATO", icon: Shield, color: "text-orange-500", border: "border-orange-500/50", bg: "bg-orange-500/10", val: selectedWod.levels.novato }
                    ].map((level) => {
                      const isActive = selectedLevel === level.id;
                      return (
                        <button
                          key={level.id}
                          onClick={() => setSelectedLevel(level.id as any)}
                          className={`relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border transition-all duration-300 ${
                            isActive 
                            ? `${level.border} ${level.bg} ring-2 ring-orange-500/20 shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]` 
                            : "border-slate-800 bg-slate-900/30 hover:border-slate-700"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isActive ? "bg-orange-500/20 scale-110" : "bg-slate-800/50"
                          }`}>
                            <level.icon className={`w-6 h-6 ${isActive ? level.color : "text-slate-600"}`} />
                          </div>
                          <span className={`text-xs font-black italic uppercase tracking-widest ${
                            isActive ? level.color : "text-slate-600"
                          }`}>
                            {level.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dinámico Protocolo */}
                  <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                       <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] italic">
                         Protocolo {selectedLevel}
                       </h4>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-6 py-2">
                       <p className="text-2xl md:text-3xl font-black text-white uppercase leading-[1.1] tracking-tight whitespace-pre-wrap">
                         {selectedLevel === "RX" ? selectedWod.levels.rx : 
                          selectedLevel === "SCALED" ? selectedWod.levels.scaled : 
                          selectedWod.levels.novato || "Estándar de Seguridad Activo"}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Descripción General (Opcional si existe) */}
                {selectedWod.descripcion && (
                  <div className="bg-slate-900/20 border border-slate-800/30 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mb-2 opacity-50">Notas del Coach</p>
                    <p className="text-[11px] font-medium text-slate-400 uppercase leading-relaxed tracking-wider">
                      {selectedWod.descripcion}
                    </p>
                  </div>
                )}
              </section>

              {/* Cronómetro */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">
                  Control de Esfuerzo / V3.1
                </h4>
                <EliteTimer 
                  type={selectedWod.timerType}
                  initialSeconds={selectedWod.timerValue}
                />
              </section>

            </div>
          )}

        </main>

        <footer className="p-8 text-center mt-auto">
          <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em] italic">
            RorroBox Protocol · <a href="https://instagram.com/rorrofx" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">@rorrofx</a> · Open Gym Mode
          </p>
        </footer>

      </div>
    </div>
  );
}

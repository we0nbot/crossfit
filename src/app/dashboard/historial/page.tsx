export const dynamic = "force-dynamic";

import { sheets } from "@/lib/google";
import Link from "next/link";
import { 
  History, 
  ChevronLeft, 
  Dumbbell, 
  CalendarDays,
  Zap,
  TrendingUp
} from "lucide-react";

interface WodItem {
  id: string;
  fecha: string;
  titulo: string;
  tipo: string;
  descripcion: string;
}

/**
 * HistorialPage - Archivo Maestro de Programación RorroBox.
 * Diseño Mobile-First con alto peso visual para consulta rápida de PRs.
 */
export default async function HistorialPage() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  let wods: WodItem[] = [];

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A2:K100",
    });
    
    // Mapeo seguro y reversión para ver lo más reciente primero
    wods = (res.data.values || []).map((row: any[]) => ({
      id: row[0],
      fecha: row[1],
      titulo: row[2],
      tipo: row[3],
      descripcion: row[4]
    })).reverse();
  } catch (error) {
    console.error("Error cargando historial:", error);
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 pb-20">
      
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-10">
        
        {/* Header de Navegación */}
        <header className="flex items-center justify-between">
          <Link href="/dashboard" className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90">
             <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="text-right">
             <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Historial <span className="text-emerald-500">PRs</span></h1>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Archivo de Programación</p>
          </div>
        </header>

        {/* Lista de WODs con Gran Peso Visual */}
        <div className="space-y-6">
          {wods.length > 0 ? wods.map((wod, i) => (
            <Link 
              key={i} 
              href={`/dashboard?date=${(wod.fecha || "").split('-').reverse().join('-') || ""}`} // Convierte DD-MM-YYYY a YYYY-MM-DD para el input con fallback seguro
              className="group block bg-slate-950 border-4 border-slate-900 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <Dumbbell className="w-16 h-16" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                      <CalendarDays className="w-3 h-3" /> {wod.fecha}
                   </div>
                   <span className="px-3 py-1 bg-slate-900 text-slate-400 text-[8px] font-black rounded-md uppercase tracking-widest">
                      {wod.tipo}
                   </span>
                </div>

                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-emerald-400 transition-colors leading-none">
                  {wod.titulo || "Sin Título"}
                </h2>

                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  {wod.descripcion}
                </p>

                <div className="pt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                   <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Analizar Protocolo</span>
                   <span className="flex items-center gap-1 group-hover:text-emerald-500 transition-colors"><TrendingUp className="w-3 h-3" /> Repetir Intento</span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-900 rounded-[3rem]">
               <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No hay datos históricos disponibles</p>
            </div>
          )}
        </div>

        {/* Footer Rebranding */}
        <section className="pt-12 border-t border-slate-900 flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
           <Zap className="w-4 h-4 text-emerald-500 mr-2" /> RorroBox Archive
        </section>

      </div>
    </div>
  );
}

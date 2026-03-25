export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  Calendar,
  ChevronRight,
  ClipboardList,
  Users,
  Trophy,
  Zap,
  Target
} from "lucide-react";
import { sheets } from "@/lib/google";
import IntensityHistogram from "@/components/IntensityHistogram";
import IntensityAnalysis from "@/components/IntensityAnalysis";
import LoadSemaphore from "@/components/LoadSemaphore";
import { Suspense } from "react";

interface Actividad {
  nombre: string;
  tiempo: string;
  modo: string;
  fecha: string;
}

const KpiCard = ({
  title,
  value,
  detail,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  detail: string;
  icon: any;
  trend?: string;
}) => (
  <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/50 hover:shadow-emerald-500/10">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
      <Icon className="w-24 h-24 text-white" />
    </div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {title}
        </span>
      </div>
      <div className="mt-auto">
        <h3 className="text-5xl font-black text-white italic tracking-tighter leading-none mb-2">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            {detail}
          </span>
          {trend && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500/40 px-2 py-0.5 rounded-full bg-emerald-500/5">
               <TrendingUp className="w-3 h-3" /> {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

/**
 * CoachMainDashboard - Centro de Mando Operativo (High Visual Weight V2)
 */
export default async function CoachMainDashboard() {
  const hoyChile = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Santiago",
  }).format(new Date()).replace(/\//g, "-");

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  // 1. Carga de Analíticas de Hoy para el Histograma
  let histogramData = [];
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://127.0.0.1:3001";
    const res = await fetch(`${baseUrl}/api/coach/analytics/today`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      histogramData = json.histogram?.map((h: any) => ({ 
        rango: h.rango, 
        RX: h.RX || 0,
        SCALED: h.SCALED || 0,
        NOVATO: h.NOVATO || 0,
        total: h.total || 0
      })) || [];
    }
  } catch (e) {
    console.error("Error cargando analíticas:", e);
  }

  // 2. Fetch dinámico de actividad real
  let totalMarcasHoy = "0";
  let actividadReciente: Actividad[] = [];

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A:F",
    });
    const rows = res.data.values || [];
    
    // Simulación de nombres para el monitor rápido
    actividadReciente = rows.slice(-5).reverse().map((row: string[]) => ({
      nombre: "Atleta Diwau",
      tiempo: row[3],
      modo: row[4],
      fecha: row[5]
    }));

    totalMarcasHoy = rows.filter(r => r[5]?.toString().includes(new Date().toISOString().split('T')[0])).length.toString();
  } catch (error) {
    console.error("Error al cargar datos reales:", error);
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Background Decorativo - Peso Visual */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
        
        {/* Header - Identidad Box Command */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-[0_0_20px_rgba(16,185,129,0.4)]">Live</div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">RorroBox Station / Chile</span>
             </div>
             <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
                Rorro<span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">Box</span>
             </h1>
          </div>
          <div className="flex items-center gap-6 text-right">
             <div className="hidden md:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Operativo</p>
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-2">
                   <ShieldCheck className="w-4 h-4" /> Sistemas Conectados
                </p>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center gap-4 shadow-xl">
                <Calendar className="w-6 h-6 text-slate-500" />
                <div className="text-left">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</p>
                   <p className="text-sm font-black italic uppercase tracking-tighter">{hoyChile}</p>
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Columna Izquierda: KPIs y Semáforo */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Atletas Activos" value="48" detail="Matrícula hoy" icon={Users} trend="12%" />
              <KpiCard title="WOD de Hoy" value="MURPH" detail="Prueba Hero" icon={Target} />
              <KpiCard title="Registros" value={totalMarcasHoy} detail="Hoy en vivo" icon={Activity} />
            </div>

            {/* Semáforo de Carga con Peso Visual */}
            <Suspense fallback={<div className="h-32 bg-slate-900 rounded-[2.5rem] animate-pulse" />}>
               <LoadSemaphore />
            </Suspense>

            {/* Analítica Central (Histograma) */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-4 lg:p-8 shadow-3xl min-h-[400px]">
               <IntensityHistogram data={histogramData} />
            </div>

            {/* Análisis Comparativo (WOD-1) */}
            <IntensityAnalysis wodId="WOD-1" />
          </div>

          {/* Columna Derecha: Monitor Live y Acciones */}
          <div className="space-y-8">
             
             {/* Monitor de Actividad Reciente */}
             <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-slate-800/50 bg-slate-950/50 flex items-center justify-between">
                 <h2 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" /> Monitor Live
                 </h2>
                 <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
               </div>
               <div className="divide-y divide-white/5">
                 {actividadReciente.length > 0 ? actividadReciente.map((item, i) => (
                   <div key={i} className="p-6 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors uppercase">{item.nombre}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.modo === 'Rx' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                           {item.modo}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-3xl font-black italic tracking-tighter text-white opacity-80">{item.tiempo}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase">Recién</p>
                      </div>
                   </div>
                 )) : (
                   <div className="p-12 text-center text-slate-700 text-xs font-black uppercase tracking-widest">Esperando Marcas...</div>
                 )}
               </div>
               <button className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-slate-800/50 hover:bg-white/[0.03] hover:text-white transition-all">
                  Ver Historial Completo
               </button>
             </section>

             {/* Acciones Críticas con Gradientes Pesados */}
             <div className="space-y-4">
                <Link href="/coach/programacion" className="group block relative p-8 rounded-[2.5rem] bg-emerald-500 overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.2)] transition-all duration-500 hover:-translate-y-2 hover:shadow-emerald-500/40">
                   <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-125 transition-transform duration-700">
                      <ClipboardList className="w-32 h-32 text-slate-900" />
                   </div>
                   <div className="relative z-10">
                      <p className="text-slate-950 font-black text-3xl italic uppercase tracking-tighter leading-none mb-2">Programar WOD</p>
                      <div className="h-1 w-12 bg-slate-950/20 rounded-full mb-4 group-hover:w-20 transition-all duration-500"></div>
                      <p className="text-slate-900 text-xs font-bold leading-relaxed max-w-[180px]">Configura el entrenamiento técnico para mañana.</p>
                   </div>
                   <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-slate-950 transform group-hover:translate-x-2 transition-transform" />
                </Link>

                <Link href="/coach/atletas" className="group block relative p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden transition-all duration-500 hover:border-white/20 hover:-translate-y-2 shadow-2xl">
                   <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4">
                      <Users className="w-32 h-32 text-white" />
                   </div>
                   <div className="relative z-10">
                      <p className="text-white font-black text-3xl italic uppercase tracking-tighter leading-none mb-2">CRM Atletas</p>
                      <div className="h-1 w-12 bg-emerald-500 rounded-full mb-4"></div>
                      <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-[180px]">Analiza perfiles y feedback individual.</p>
                   </div>
                   <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-white opacity-20 transform group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>

             {/* Badge de Rendimiento Global */}
             <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                   <Trophy className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Impacto Box</p>
                   <p className="text-lg font-black italic uppercase tracking-tighter">Élite Local</p>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}

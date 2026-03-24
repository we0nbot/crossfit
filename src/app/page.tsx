import Link from "next/link";
import { ChevronRight, ShieldCheck, Trophy, Dumbbell } from "lucide-react";

/**
 * LandingPage - Interfaz principal de Diwau Hub (Acceso Directo MVP).
 * Diseño minimalista con estética Dark-Athletic para acceso sin autenticación.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header Sutil con difuminado */}
      <header className="p-6 border-b border-slate-800/50 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
            <Dumbbell className="text-slate-950 w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Diwau <span className="font-light opacity-60 italic text-white">Hub</span>
          </span>
        </div>
      </header>

      {/* Hero Section Centrada */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        {/* Orbes de luz de fondo para profundidad */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

        <div className="max-w-4xl space-y-8 relative">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">Rendimiento</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Acceso directo al entorno de pruebas del <span className="text-white font-medium">MVP</span>. Selecciona tu perfil para comenzar.
          </p>
        </div>

        {/* Sección de Acciones (Botones) - Estilo Premium Card */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Botón Coach - Redirección Directa a CRM */}
          <Link href="/coach?mockId=ID-COACH-999" className="group block h-full">
            <div className="relative h-full p-10 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2rem] transition-all duration-500 hover:border-emerald-500/50 hover:bg-slate-900 hover:-translate-y-2 flex flex-col items-start text-left shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
              
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Administración</span>
              <h2 className="text-3xl font-black text-white mb-2 leading-none">Panel de Coach</h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8 flex-grow">
                Programación técnica, CRM de atletas y feedback biomecánico en tiempo real.
              </p>
              
              <div className="flex items-center gap-2 text-white font-black uppercase text-sm tracking-widest group-hover:gap-4 transition-all">
                Abrir CRM <ChevronRight className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </Link>

          {/* Botón Alumno - Redirección Directa a Dashboard */}
          <Link href="/dashboard?mockId=ID-ATLETA-001" className="group block h-full">
            <div className="relative h-full p-10 bg-emerald-500 rounded-[2rem] transition-all duration-500 hover:bg-emerald-400 hover:-translate-y-2 flex flex-col items-start text-left shadow-[0_20px_50px_rgba(16,185,129,0.2)] overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="w-32 h-32 text-slate-950" />
              </div>
              
              <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mb-6 shadow-xl">
                <Trophy className="text-emerald-500 w-6 h-6" />
              </div>
              
              <span className="text-xs font-black text-slate-950/60 uppercase tracking-widest mb-2">Entrenamiento</span>
              <h2 className="text-3xl font-black text-slate-950 mb-2 leading-none">Dashboard Atleta</h2>
              <p className="text-slate-950/80 text-base leading-relaxed mb-8 flex-grow font-medium">
                Visualiza el WOD, utiliza el cronómetro y mantén un registro histórico de tus PRs.
              </p>
              
              <div className="flex items-center gap-2 text-slate-950 font-black uppercase text-sm tracking-widest group-hover:ml-2 transition-all">
                Entrar a Entrenar <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="p-10 border-t border-slate-900 bg-slate-950 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} <span className="text-emerald-500 font-bold">Diwau Hub</span> - Entorno MVP
      </footer>
    </div>
  );
}

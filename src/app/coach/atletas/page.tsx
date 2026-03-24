import { ShieldCheck, Users, Search, PlusCircle } from "lucide-react";

/**
 * AtletasPage - Vista de CRM para el Coach.
 * Captura el mockId para simular la identidad operativa.
 */
export default async function AtletasPage(props: {
  searchParams: Promise<{ mockId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const coachId = searchParams.mockId || "ID-COACH-ANONIMO";

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header con Identidad Operativa */}
        <header className="flex items-center justify-between py-6 border-b border-slate-900">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">CRM Atletas</h1>
            <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Coach: <span className="text-white">{coachId}</span>
            </p>
          </div>
          <button className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10">
            <PlusCircle className="w-5 h-5" /> Nuevo Atleta
          </button>
        </header>

        {/* Buscador Simulado */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        {/* Lista de Atletas (Mock) */}
        <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> Directorio Activo
            </h2>
            <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-500 font-bold">4 ATLETAS MOSTRADOS</span>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {[
              { id: "ID-ATLETA-001", nombre: "Juan Pérez", status: "Activo", nivel: "RX" },
              { id: "ID-ATLETA-002", nombre: "Maria Lopez", status: "Activo", nivel: "Scaled" },
              { id: "ID-ATLETA-003", nombre: "Carlos Diaz", status: "Inactivo", nivel: "RX" },
              { id: "ID-ATLETA-004", nombre: "Elena Ruiz", status: "Activo", nivel: "RX" },
            ].map((atleta) => (
              <div key={atleta.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                    {atleta.nombre.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-none">{atleta.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{atleta.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    atleta.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {atleta.status}
                  </span>
                  <div className="text-xs text-slate-400 font-medium mt-1">Nivel: {atleta.nivel}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

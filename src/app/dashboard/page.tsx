import WodTimer from "@/components/WodTimer";
import PrChart from "@/components/PrChart";
import Leaderboard from "@/components/Leaderboard";
import WeightCoach from "@/components/WeightCoach";
import RecentMilestones from "@/components/RecentMilestones";
import BioUpdate from "@/components/BioUpdate";
import WodNavigator from "@/components/WodNavigator";
import { Dumbbell, Calendar, Info, PlayCircle, Trophy } from "lucide-react";

/**
 * AthleteDashboard - Panel principal para el atleta.
 * Diseño Mobile-First centrado en las necesidades del WOD diario y el PR.
 */
export default async function AthleteDashboard(props: {
  searchParams: Promise<{ mockId?: string; date?: string }>;
}) {
  const searchParams = await props.searchParams;
  const athleteId = searchParams.mockId || "ID-ATLETA-ANONIMO";
  const dateParam = searchParams.date; // Viene como YYYY-MM-DD del WodNavigator

  // Conversión técnica: YYYY-MM-DD -> DD-MM-YYYY (esperado por API/Sheets)
  const apiDate = dateParam ? dateParam.split("-").reverse().join("-") : "";

  // Carga Dinámica del WOD, Perfil y Progreso del Atleta
  let wod = null;
  let isRestDay = false;
  let userProfile = null;
  let userHistory = [];

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const wodUrl = `${baseUrl}/api/wods/today${apiDate ? `?date=${apiDate}` : ""}`;
    
    // Petición paralela para rendimiento óptimo (WOD + Perfil + Progreso)
    const [wodRes, profileRes, progressRes] = await Promise.all([
      fetch(wodUrl, { cache: "no-store" }),
      fetch(`${baseUrl}/api/user/profile?userId=${athleteId}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/user/progress?userId=${athleteId}`, { cache: "no-store" })
    ]);

    if (wodRes.status === 404) {
      isRestDay = true;
    } else if (wodRes.ok) {
      wod = await wodRes.json();
    }

    if (profileRes.ok) {
      userProfile = await profileRes.json();
    }

    if (progressRes.ok) {
      const progressData = await progressRes.json();
      // Asegurarse de que los datos estén ordenados por fecha para la visualización temporal
      userHistory = progressData.history ? 
        progressData.history.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()) : 
        [];
    }
  } catch (error) {
    console.error("Error cargando datos del dashboard:", error);
    isRestDay = true;
  }

  // Mapear datos para el gráfico de PR (ejemplo: Back Squat)
  const prChartData = userHistory
    .filter((item: any) => item.ejercicio === "Back Squat" && item.tipo === "PR")
    .map((item: any) => ({
      fecha: item.fecha,
      valor: item.valor,
    }));

  // Mapear datos para los hitos recientes (ejemplo: últimos 5 hitos)
  const recentMilestones = userHistory
    .filter((item: any) => item.tipo === "PR" || item.tipo === "Record") // Filtrar por tipo de hito
    .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Ordenar del más reciente al más antiguo
    .slice(0, 5); // Tomar los 5 más recientes

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-white relative">
      <div className="max-w-md mx-auto space-y-8 pb-16">
        {/* Header Saludando al Atleta */}
        <header className="flex items-center justify-between py-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter leading-none">
              Hola, <span className="text-emerald-500 italic">Atleta</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-1 uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> Martes, 24 de Marzo
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <PlayCircle className="w-8 h-8 opacity-20 absolute" />
            <Dumbbell className="w-6 h-6 relative z-10" />
          </div>
        </header>

        {/* Perfilador Biométrico (Actualización Rápida) */}
        {userProfile && (
          <BioUpdate 
            userId={athleteId} 
            currentWeight={userProfile.peso_actual_kg || 75} 
          />
        )}

        {/* Notificación Corta (Estado del WOD) */}
        {!isRestDay && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 text-emerald-400 group animate-pulse">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-black uppercase tracking-widest">
              WOD de hoy listo. ¡A por ello!
            </p>
          </div>
        )}

        {/* Navegador de Historial de WODs */}
        <WodNavigator />

        {/* Tarjeta del WOD del día o Descanso Activo */}
        <section className="relative group overflow-hidden">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-3xl space-y-6">
            {!isRestDay && wod ? (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">
                      Sesión Diaria
                    </h3>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                      {wod.titulo}
                    </h2>
                  </div>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                    {wod.tipo}
                  </span>
                </div>

                <div className="bg-black/50 p-6 rounded-2xl border border-slate-800/50">
                  <p className="text-slate-300 whitespace-pre-line font-mono text-sm leading-relaxed tracking-tight">
                    {wod.descripcion}
                  </p>
                </div>

                {/* Asistente Biomecánico de Cargas (Peso Corporal) */}
                {userProfile && (
                  <WeightCoach 
                    description={wod.descripcion || ""} 
                    userWeight={userProfile.peso_actual_kg || 75} 
                  />
                )}
              </>
            ) : (
              <div className="text-center py-10 space-y-4">
                <Dumbbell className="w-12 h-12 text-slate-700 mx-auto" />
                <h2 className="text-2xl font-black text-white italic tracking-tighter">
                  ¡DESCANSO ACTIVO!
                </h2>
                <p className="text-slate-500 text-sm">
                  Hoy no hay WOD programado. Aprovecha para trabajar movilidad
                  o técnica suave.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Nivel Sugerido: RX</span>
              <span className="text-emerald-400">Box Status: Abierto</span>
            </div>
          </div>
        </section>

        {/* Cronómetro Interactuable */}
        {!isRestDay && wod && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2 text-slate-500 uppercase">
              <h3 className="text-[10px] font-black tracking-widest">
                Control Técnico de Marca
              </h3>
            </div>
            <WodTimer wodId={wod.id_wod} userId={athleteId} />
          </section>
        )}

        {/* Leaderboard en Tiempo Real */}
        {!isRestDay && wod && (
          <section className="pt-6 space-y-4">
            <div className="flex items-center justify-between px-2 text-slate-500 uppercase">
              <h3 className="text-[10px] font-black tracking-widest flex items-center gap-2">
                <Trophy className="w-3 h-3 text-emerald-500" /> Comunidad en acción
              </h3>
            </div>
            <Leaderboard wodId={wod.id_wod} />
          </section>
        )}

        {/* Historial de Hitos y PRs (Grado Elite) */}
        <section className="pt-6 space-y-8">
          <RecentMilestones history={userHistory} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Curva de Rendimiento (Strength)
              </h3>
            </div>
            {/* Si no hay datos específicos de Back Squat, mostramos el historial general o un placeholder */}
            <PrChart 
              ejercicioNombre="Progreso General" 
              data={userHistory.length > 0 ? userHistory.map((h: any) => ({ fecha: h.fecha, valor: h.valor })) : []} 
              unidad="Score" 
            />
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 opacity-20 blur-[2px]"></footer>
    </div>
  );
}

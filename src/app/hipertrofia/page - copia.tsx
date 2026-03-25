"use client";

import React, { useState } from "react";

// --- BASE DE DATOS LOCAL (INMUTABLE) ---
const hypertrophyPlan = [
  {
    id: 1,
    dayName: "Día 1",
    focus: "Push (Pecho, Hombros, Tríceps)",
    exercises: [
      { name: "Floor Press pesado", gear: "Barra", setsReps: "4 x 6-8", tempo: "Bajar en 2s - Pausa 1s - Subir explosivo", notes: "Pausa total en el suelo, rompe la inercia." },
      { name: "Press Militar estricto", gear: "Barra", setsReps: "4 x 8-10", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Aprieta glúteos y core. Cero impulso." },
      { name: "Flexiones en Anillas", gear: "Anillas", setsReps: "3 x 8-12", tempo: "Bajar en 3s - Pausa 1s abajo - Subir en 1s", notes: "Profundidad máxima. Codos a 45 grados." },
      { name: "Elevaciones Laterales", gear: "Manc./Discos", setsReps: "4 x 12-15", tempo: "Bajar en 2s - Sin pausa - Sostener 1s arriba", notes: "Sostén 1 seg en la contracción máxima." },
      { name: "Rompecráneos", gear: "Mancuernas", setsReps: "3 x 10-12", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Tumbado en el suelo. Codos fijos apuntando al techo." }
    ]
  },
  {
    id: 2,
    dayName: "Día 2",
    focus: "Pull (Espalda, Bíceps, Posterior)",
    exercises: [
      { name: "Dominadas Lastradas", gear: "Barra/Chaleco", setsReps: "4 x 6-8", tempo: "Bajar en 2s - Sin pausa - Sostener 1s arriba", notes: "Barbilla por encima. Cero balanceo." },
      { name: "Pendlay Row", gear: "Barra", setsReps: "4 x 8-10", tempo: "Bajar en 1s - Sin pausa - Sostener 1s arriba", notes: "Espalda paralela al suelo. La barra descansa en cada rep." },
      { name: "Remo a una mano", gear: "Mancuerna", setsReps: "3 x 10-12", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Tracciona hacia la cadera, no hacia el pecho." },
      { name: "Face Pulls", gear: "Banda Elástica", setsReps: "4 x 15-20", tempo: "Bajar en 2s - Sin pausa - Sostener 1s arriba", notes: "Retracción escapular dura al final." },
      { name: "Curl Estricto", gear: "Barra", setsReps: "3 x 10-12", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Apoya la espalda en la pared si es necesario para no trampear." }
    ]
  },
  {
    id: 3,
    dayName: "Día 3",
    focus: "Piernas (Cuád., Isquios, Glúteos)",
    exercises: [
      { name: "Sentadilla Trasera", gear: "Barra", setsReps: "4 x 6-8", tempo: "Bajar en 3s - Pausa 1s abajo - Subir en 1s", notes: "Baja profundo (ATG). Torso vertical." },
      { name: "Peso Muerto Rumano", gear: "Barra", setsReps: "4 x 8-10", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Flexión de cadera profunda. Siente el estiramiento en el isquio." },
      { name: "Sentadilla Búlgara", gear: "Manc./Cajón", setsReps: "3 x 10-12", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "El pie trasero solo estabiliza, la carga va adelante." },
      { name: "Kettlebell Swings", gear: "KB", setsReps: "3 x 15-20", tempo: "Movimiento Explosivo y Continuo", notes: "Bisagra de cadera pura, el brazo es solo un cable." },
      { name: "Elevación de Gemelos", gear: "Manc./Disco", setsReps: "4 x 15-20", tempo: "Bajar en 2s - Pausa 2s abajo - Sostener 2s arriba", notes: "Máximo estiramiento abajo, máxima contracción arriba." }
    ]
  },
  {
    id: 4,
    dayName: "Día 4",
    focus: "Upper Body (Volumen Torso)",
    exercises: [
      { name: "Press Push/Jerk", gear: "Barra", setsReps: "3 x 8-10", tempo: "Bajar en 2s - Sin pausa - Subir explosivo", notes: "Transición de fuerza a hipertrofia." },
      { name: "Chin-ups", gear: "Barra", setsReps: "3 x 8-10", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Foco en el bíceps y dorsal ancho." },
      { name: "Fondos", gear: "Anillas/Cajones", setsReps: "3 x 10-12", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Torso inclinado hacia adelante para atacar el pecho." },
      { name: "Remo Invertido", gear: "Anillas", setsReps: "3 x 12-15", tempo: "Bajar en 2s - Sin pausa - Sostener 1s arriba", notes: "Pon los pies en un cajón para mayor déficit." },
      { name: "Curl Martillo alterno", gear: "Mancuernas", setsReps: "3 x 12-15", tempo: "Bajar en 2s - Sin pausa - Subir en 1s", notes: "Ataca el braquial para dar grosor al brazo." }
    ]
  },
  {
    id: 5,
    dayName: "Día 5",
    focus: "Lower Body (Volumen Pierna)",
    exercises: [
      { name: "Sentadilla Frontal", gear: "Barra", setsReps: "4 x 8-10", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Carga en cuádriceps. Codos siempre altos." },
      { name: "Zancadas Caminando", gear: "Mancuernas", setsReps: "3 x 20 pasos", tempo: "Movimiento Continuo Controlado", notes: "Paso largo para glúteo, paso corto para cuádriceps." },
      { name: "Goblet Squat Deficit", gear: "KB + 2 Discos", setsReps: "3 x 12-15", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Pies sobre discos para bajar más que el rango normal." },
      { name: "Hip Thrust (Suelo)", gear: "Barra", setsReps: "4 x 10-12", tempo: "Bajar en 2s - Sin pausa - Sostener 2s arriba", notes: "Aprieta el glúteo arriba por 2 segundos." },
      { name: "Gemelos Unilateral", gear: "Mancuerna", setsReps: "3 x 12-15", tempo: "Bajar en 2s - Pausa 1s abajo - Sostener 1s arriba", notes: "Apóyate en el rack para equilibrio." }
    ]
  }
];


// --- CALCULADORA DE CARGAS (1RM) ---
const LoadCalculator = () => {
  const [rm, setRm] = useState<number | "">("");
  const [unit, setUnit] = useState<"KG" | "LB">("LB");

  // Lógica Quirúrgica de Conversión
  const handleUnitToggle = (newUnit: "KG" | "LB") => {
    if (newUnit === unit) return; 
    
    if (typeof rm === "number") {
      const converted = newUnit === "KG" ? rm / 2.20462 : rm * 2.20462;
      setRm(Math.round(converted));
    }
    setUnit(newUnit);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
      
      {/* Cabecera Explicativa */}
      <div className="mb-4 border-b border-slate-800/50 pb-3">
        <div className="flex justify-between items-center gap-2 mb-1">
          <h3 className="font-bold text-white text-md">Calculadora de Cargas (1RM)</h3>
          <span className="bg-slate-800 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Inteligencia RorroBox
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Ingresa tu peso máximo a 1 repetición (1RM). El sistema calculará la carga exacta según el objetivo de tu serie.
        </p>
      </div>
      
      {/* Input y Selector de Unidades */}
      <div className="flex gap-2 mb-5">
        <input
          type="number"
          placeholder={`Tu 1RM en ${unit}...`}
          value={rm}
          onChange={(e) => setRm(e.target.value ? Number(e.target.value) : "")}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 font-bold"
        />
        
        {/* Toggle Switch Kg/Lb */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => handleUnitToggle("LB")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              unit === "LB" ? "bg-emerald-500 text-slate-950" : "text-slate-500 hover:text-white"
            }`}
          >
            LB
          </button>
          <button
            onClick={() => handleUnitToggle("KG")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              unit === "KG" ? "bg-emerald-500 text-slate-950" : "text-slate-500 hover:text-white"
            }`}
          >
            KG
          </button>
        </div>
      </div>

      {/* Grid de Resultados Condicional */}
      {typeof rm === 'number' && (
        <div className="grid grid-cols-3 gap-2 text-center text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800/50 flex flex-col justify-center">
            <span className="block text-slate-500 text-[9px] uppercase font-bold mb-0.5">Fuerza Pesada</span>
            <span className="block text-slate-400 text-[9px] mb-1">4-6 reps</span>
            <span className="text-white font-black text-lg">{Math.round(rm * 0.85)} <span className="text-[10px] font-normal text-slate-500">{unit}</span></span>
          </div>
          
          <div className="bg-slate-950 rounded-lg p-2 border border-emerald-500/50 relative overflow-hidden flex flex-col justify-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <span className="block text-emerald-500 text-[9px] uppercase font-bold mb-0.5 mt-1">Hipertrofia</span>
            <span className="block text-emerald-400/70 text-[9px] mb-1">8-10 reps</span>
            <span className="text-emerald-400 font-black text-xl">{Math.round(rm * 0.75)} <span className="text-[10px] font-normal text-emerald-700">{unit}</span></span>
          </div>
          
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800/50 flex flex-col justify-center">
            <span className="block text-slate-500 text-[9px] uppercase font-bold mb-0.5">Bombeo Final</span>
            <span className="block text-slate-400 text-[9px] mb-1">12-15 reps</span>
            <span className="text-white font-black text-lg">{Math.round(rm * 0.65)} <span className="text-[10px] font-normal text-slate-500">{unit}</span></span>
          </div>

        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function HypertrophyPlan() {
  const [activeTab, setActiveTab] = useState(1);
  const currentDay = hypertrophyPlan.find(d => d.id === activeTab) || hypertrophyPlan[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="max-w-md mx-auto p-4 pt-8">

        {/* HEADER */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">
            Hipertrofia <span className="text-emerald-500">PRO</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            Programa de 5 Días • RorroBox
          </p>
        </header>

        {/* INYECCIÓN DE LA CALCULADORA */}
        <LoadCalculator />

        {/* TABS (Selector de Días) */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide no-scrollbar snap-x">
          {hypertrophyPlan.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveTab(day.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all snap-center ${activeTab === day.id
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
            >
              {day.dayName}
            </button>
          ))}
        </div>

        {/* CONTENIDO DEL DÍA ACTIVO */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-800 pb-2">
              {currentDay.focus}
            </h2>
          </div>

          <div className="space-y-4">
            {currentDay.exercises.map((ex, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm"
              >
                {/* Título y Badge */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-white text-lg leading-tight">
                    {index + 1}. {ex.name}
                  </h3>
                  <span className="bg-slate-800 text-emerald-500 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap">
                    {ex.gear}
                  </span>
                </div>

                {/* Grid de Datos Técnicos */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="bg-slate-950 rounded-lg p-2 border border-slate-800/50">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Volumen</span>
                    <span className="font-mono text-emerald-400 font-bold">{ex.setsReps}</span>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-2 border border-slate-800/50">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Tempo</span>
                    <span className="text-slate-300 leading-snug text-xs">{ex.tempo}</span>
                  </div>
                </div>

                {/* Notas / Foco Técnico */}
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5">
                  <p className="text-xs text-slate-300">
                    <span className="text-emerald-500 font-bold mr-1">Foco:</span>
                    {ex.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
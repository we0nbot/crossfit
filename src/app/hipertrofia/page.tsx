"use client";

import React, { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";

// --- MAPEADO TÉCNICO EXERCISEDB (GIFs) ---
const EXERCISE_MAPPING: Record<string, string> = {
  "Floor Press pesado": "vtusOWT",
  "Press Militar estricto": "wdRZISl",
  "Flexiones en Anillas": "8K7m2SS",
  "Elevaciones Laterales": "AQ0mC4Y",
  "Rompecráneos": "h8LFzo9",
  "Dominadas Lastradas": "72BC5Za",
  "Pendlay Row": "r0z6xzQ",
  "Remo a una mano": "xbkPfaw",
  "Peso Muerto Rumano": "wQ2c4XD",
  "Press Push/Jerk": "FS63wTN",
  "Fondos": "J60bN17",
  "Remo Invertido": "VPPtusI",
  "Sentadilla Frontal": "Y7YcmIJ",
  "Zancadas Caminando": "IZVHb27",
  "Goblet Squat Deficit": "yn8yg1r",
  "Hip Thrust (Suelo)": "Pjbc0Kt",
  "Dominadas": "72BC5Za",
  "Chin-ups": "G97-mID", // Búsqueda aproximada
};

const hypertrophyPlan = [
  {
    id: 1,
    dayName: "Día 1",
    focus: "Push",
    subtitle: "Pecho, Hombros, Tríceps",
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
    focus: "Pull",
    subtitle: "Espalda, Bíceps, Posterior",
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
    focus: "Piernas",
    subtitle: "Cuád., Isquios, Glúteos",
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
    focus: "Upper",
    subtitle: "Volumen Torso",
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
    focus: "Lower",
    subtitle: "Volumen Pierna",
    exercises: [
      { name: "Sentadilla Frontal", gear: "Barra", setsReps: "4 x 8-10", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Carga en cuádriceps. Codos siempre altos." },
      { name: "Zancadas Caminando", gear: "Mancuernas", setsReps: "3 x 20 pasos", tempo: "Movimiento Continuo Controlado", notes: "Paso largo para glúteo, paso corto para cuádriceps." },
      { name: "Goblet Squat Deficit", gear: "KB + 2 Discos", setsReps: "3 x 12-15", tempo: "Bajar en 3s - Sin pausa - Subir en 1s", notes: "Pies sobre discos para bajar más que el rango normal." },
      { name: "Hip Thrust (Suelo)", gear: "Barra", setsReps: "4 x 10-12", tempo: "Bajar en 2s - Sin pausa - Sostener 2s arriba", notes: "Aprieta el glúteo arriba por 2 segundos." },
      { name: "Gemelos Unilateral", gear: "Mancuerna", setsReps: "3 x 12-15", tempo: "Bajar en 2s - Pausa 1s abajo - Sostener 1s arriba", notes: "Apóyate en el rack para equilibrio." }
    ]
  }
];

const LoadCalculator = () => {
  const [rm, setRm] = useState<number | "">("");
  const [unit, setUnit] = useState<"KG" | "LB">("KG");

  const handleUnitToggle = (newUnit: "KG" | "LB") => {
    if (newUnit === unit) return;
    if (typeof rm === "number") {
      setRm(Math.round(newUnit === "KG" ? rm / 2.20462 : rm * 2.20462));
    }
    setUnit(newUnit);
  };

  const zones = [
    { label: "Fuerza pesada", reps: "4–6 reps", pct: 0.85 },
    { label: "Hipertrofia", reps: "8–10 reps", pct: 0.75, highlight: true },
    { label: "Bombeo final", reps: "12–15 reps", pct: 0.65 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555] mb-1">
            Inteligencia RorroBox
          </p>
          <h3 className="text-2xl font-black italic uppercase tracking-tight text-white leading-none">
            Calculadora <span className="text-emerald-500">1RM</span>
          </h3>
        </div>
        <p className="text-[10px] text-[#555] max-w-[140px] text-right leading-relaxed">
          Carga exacta según objetivo de serie
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a1a1a] relative">
        <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder={`1RM en ${unit}...`}
          value={rm}
          onChange={(e) => setRm(e.target.value ? Number(e.target.value) : "")}
          className="flex-1 bg-[#111] border border-[#222] rounded px-4 py-3 text-white font-bold placeholder:text-[#333] outline-none focus:border-emerald-500 transition-colors text-sm"
        />
        <div className="flex bg-[#111] border border-[#222] rounded p-1 gap-1">
          {(["KG", "LB"] as const).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitToggle(u)}
              className={`px-3 py-1.5 rounded text-xs font-black italic uppercase transition-all ${unit === u
                  ? "bg-emerald-500 text-white"
                  : "text-[#555] hover:text-[#aaa]"
                }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {typeof rm === "number" && rm > 0 && (
        <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {zones.map((z) => (
            <div
              key={z.label}
              className={`rounded px-3 py-3 flex flex-col gap-1 border ${z.highlight
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-[#222] bg-[#111]"
                }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-wider ${z.highlight ? "text-emerald-500" : "text-[#555]"}`}>
                {z.label}
              </span>
              <span className={`text-[9px] ${z.highlight ? "text-emerald-400/70" : "text-[#444]"}`}>
                {z.reps}
              </span>
              <span className={`text-xl font-black italic leading-none ${z.highlight ? "text-emerald-400" : "text-white"}`}>
                {Math.round((rm as number) * z.pct)}
                <span className={`text-[10px] font-normal ml-0.5 ${z.highlight ? "text-emerald-700" : "text-[#555]"}`}>
                  {unit}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE GUÍA TÉCNICA (ExerciseDB) ---
const TechnicalGuide = ({ exerciseName, isOpen, onToggle }: { exerciseName: string, isOpen: boolean, onToggle: () => void }) => {
  const exerciseId = EXERCISE_MAPPING[exerciseName];
  if (!exerciseId) return null;

  const gifUrl = `https://static.exercisedb.dev/media/${exerciseId}.gif`;

  return (
    <div className="mt-4">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isOpen
            ? "bg-red-500/10 text-red-500 border border-red-500/20"
            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
          }`}
      >
        {isOpen ? <X className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
        {isOpen ? "Cerrar Guía" : "Guía Técnica"}
      </button>

      {isOpen && (
        <div className="mt-4 rounded-xl overflow-hidden border border-[#222] bg-[#111] animate-in zoom-in-95 duration-200 aspect-square relative group">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none group-hover:bg-transparent transition-colors" />
          <img
            src={gifUrl}
            alt={exerciseName}
            className="w-full h-full object-cover scale-110 grayscale-[0.3] brightness-90 group-hover:grayscale-0 group-hover:scale-100 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">
              ExerciseDB Source
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE TARJETA DE EJERCICIO ---
const ExerciseCard = ({ ex, index, isLast }: { ex: any, index: number, isLast: boolean }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className={`py-6 space-y-4 animate-in fade-in duration-300 ${!isLast ? "border-b border-[#111]" : ""}`}>
      {/* Exercise header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black italic text-[#222] leading-none min-w-[28px]">
            {index + 1}
          </span>
          <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight">
            {ex.name}
          </h3>
        </div>
        <span className="shrink-0 px-2.5 py-1 border border-[#222] bg-[#111] text-[#555] text-[9px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
          {ex.gear}
        </span>
      </div>

      {/* Volumen + Tempo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border-l-[3px] border-emerald-500 pl-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#555] mb-1">
            Volumen
          </p>
          <p className="font-mono font-bold text-emerald-400 text-sm">
            {ex.setsReps}
          </p>
        </div>
        <div className="border-l-[3px] border-[#222] pl-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#555] mb-1">
            Tempo
          </p>
          <p className="text-[#aaa] text-xs leading-snug">
            {ex.tempo}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="flex items-start gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500 shrink-0 mt-0.5">
          Foco
        </span>
        <p className="text-xs text-[#aaa] leading-relaxed italic">
          {ex.notes}
        </p>
      </div>

      {/* Technical Guide Integration */}
      <TechnicalGuide
        exerciseName={ex.name}
        isOpen={isGuideOpen}
        onToggle={() => setIsGuideOpen(!isGuideOpen)}
      />
    </div>
  );
};

export default function HypertrophyPlan() {
  const [activeTab, setActiveTab] = useState(1);
  const currentDay = hypertrophyPlan.find((d) => d.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      <Navbar />

      <main className="w-full max-w-md mx-auto flex flex-col">
        {/* ── HERO ── */}
        <section className="px-5 pt-8">
          <div
            className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-[9px] font-black italic uppercase tracking-[0.15em] mb-4"
            style={{ clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,0 100%,6px 50%)" }}
          >
            Programa 5 Días
          </div>
          <h1
            className="font-black italic uppercase text-white tracking-tight leading-[0.82]"
            style={{ fontSize: "clamp(62px, 19vw, 62px)" }}
          >
            Hiper<span className="text-emerald-500">trofia</span>
          </h1>
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#555]">
              RorroBox · Entrenamiento de fuerza
            </span>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── CALCULADORA ── */}
        <section className="px-5 pt-6">
          <LoadCalculator />
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-7 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── DAY TABS ── */}
        <section className="px-5 pt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#555] mb-4">
            Seleccionar día
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {hypertrophyPlan.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveTab(day.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded text-xs font-black italic uppercase tracking-wide transition-all duration-150 ${activeTab === day.id
                    ? "bg-emerald-500 text-white"
                    : "bg-[#111] border border-[#222] text-[#555] hover:text-[#aaa] hover:border-[#333]"
                  }`}
              >
                {day.dayName}
              </button>
            ))}
          </div>
        </section>

        {/* ── DAY HEADER ── */}
        <section className="px-5 pt-6">
          <div className="flex items-baseline gap-3">
            <h2
              className="font-black italic uppercase text-white tracking-tight leading-none"
              style={{ fontSize: "clamp(42px, 13vw, 56px)" }}
            >
              {currentDay.focus}
            </h2>
            <span className="text-[#555] text-sm font-medium italic">
              {currentDay.subtitle}
            </span>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="mx-5 mt-5 h-px bg-[#1a1a1a] relative">
          <div className="absolute left-0 top-0 h-px w-10 bg-emerald-500" />
        </div>

        {/* ── EXERCISES ── */}
        <section className="px-5 pt-6 pb-20 space-y-0">
          {currentDay.exercises.map((ex, index) => (
            <ExerciseCard
              key={`${activeTab}-${index}`}
              ex={ex}
              index={index}
              isLast={index === currentDay.exercises.length - 1}
            />
          ))}
        </section>
      </main>

      <footer className="px-5 py-8 text-center border-t border-[#111]">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#333] italic">
          RorroBox Industrial · <a href="https://instagram.com/rorrofx" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">@rorrofx</a> · Curicó Archive
        </p>
      </footer>
    </div>
  );
}

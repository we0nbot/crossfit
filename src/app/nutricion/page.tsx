"use client";

import React, { useState } from "react";

// --- CALCULADORA DE MACROS (RorroBox Industrial) ---
const MacroCalculator = () => {
  const [weight, setWeight] = useState<number | "">("");
  const [unit, setUnit] = useState<"KG" | "LB">("KG");

  const handleUnitToggle = (newUnit: "KG" | "LB") => {
    if (newUnit === unit) return;
    if (typeof weight === "number") {
      const converted = newUnit === "KG" ? weight / 2.20462 : weight * 2.20462;
      setWeight(Math.round(converted));
    }
    setUnit(newUnit);
  };

  let protein = 0, carbs = 0, fats = 0, calories = 0;
  if (typeof weight === "number" && weight > 0) {
    const weightKg = unit === "KG" ? weight : weight / 2.20462;
    calories = Math.round(weightKg * 35);
    protein = Math.round(weightKg * 2.2);
    fats = Math.round(weightKg * 1);
    carbs = Math.round((calories - (protein * 4) - (fats * 9)) / 4);
  }

  return (
    <div className="bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-lg p-5 mb-8 shadow-2xl transition-all duration-300 hover:border-[#333333]">
      <div className="flex justify-between items-center gap-2 mb-4 border-b border-[#222222] pb-3">
        <h3 className="font-black italic uppercase tracking-tighter text-white text-lg">
          Motor de Combustible
        </h3>
        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest border border-amber-500/20">
          SYS.CALC
        </span>
      </div>

      {/* Input y Selector */}
      <div className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder={`PESO EN ${unit}...`}
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
          className="w-full bg-[#080808] border border-[#333333] rounded-md px-4 py-3 text-white font-mono tabular-nums text-lg focus:outline-none focus:border-amber-500 transition-colors placeholder:text-[#444444] placeholder:font-sans placeholder:italic placeholder:text-sm"
        />
        <div className="flex bg-[#080808] border border-[#333333] rounded-md p-1">
          <button
            onClick={() => handleUnitToggle("KG")}
            className={`px-4 py-1 rounded-sm text-xs font-bold font-mono transition-all ${unit === "KG" ? "bg-amber-500 text-[#080808]" : "text-[#666666] hover:text-white"}`}
          >
            KG
          </button>
          <button
            onClick={() => handleUnitToggle("LB")}
            className={`px-4 py-1 rounded-sm text-xs font-bold font-mono transition-all ${unit === "LB" ? "bg-amber-500 text-[#080808]" : "text-[#666666] hover:text-white"}`}
          >
            LB
          </button>
        </div>
      </div>

      {/* Resultados con Monospace Tabular */}
      {typeof weight === 'number' && weight > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#080808] rounded-md p-4 border border-[#222222] mb-3 text-center hover:scale-[1.01] transition-transform">
            <span className="block text-[#666666] text-[10px] font-mono uppercase tracking-widest mb-1">Carga Calórica</span>
            <span className="text-white font-mono font-bold tabular-nums text-3xl">{calories} <span className="text-xs font-sans font-normal text-[#666666] italic">kcal</span></span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-[#080808] rounded-md p-3 border border-amber-500/40 relative overflow-hidden flex flex-col justify-center hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500 animate-pulse"></div>
              <span className="block text-amber-500 text-[9px] font-mono uppercase tracking-widest mb-1 mt-1">Proteína</span>
              <span className="text-amber-400 font-mono font-bold tabular-nums text-xl">{protein}g</span>
            </div>
            <div className="bg-[#080808] rounded-md p-3 border border-[#222222] flex flex-col justify-center hover:scale-[1.02] transition-transform">
              <span className="block text-[#666666] text-[9px] font-mono uppercase tracking-widest mb-1">Carbos</span>
              <span className="text-white font-mono font-bold tabular-nums text-xl">{carbs}g</span>
            </div>
            <div className="bg-[#080808] rounded-md p-3 border border-[#222222] flex flex-col justify-center hover:scale-[1.02] transition-transform">
              <span className="block text-[#666666] text-[9px] font-mono uppercase tracking-widest mb-1">Grasas</span>
              <span className="text-white font-mono font-bold tabular-nums text-xl">{fats}g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- VISTA PRINCIPAL (PÁGINA) ---
export default function NutritionGuide() {
  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 font-sans pb-20 selection:bg-amber-500/30">
      <div className="max-w-md mx-auto p-4 pt-8">

        {/* HEADER BRETALISTA */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-1">
            Nutrición <span className="text-amber-500">PRO</span>
          </h1>
          <p className="text-xs text-[#888888] font-mono uppercase tracking-widest">
            Data // Alto Rendimiento
          </p>
        </header>

        <MacroCalculator />

        {/* GUÍA TÉCNICA - GLASSMORPHISM */}
        <div className="space-y-4">

          <section className="bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-lg p-5 shadow-sm hover:border-[#333333] transition-colors">
            <h3 className="font-black italic uppercase tracking-tighter text-white text-xl mb-4 flex items-center gap-2 border-b border-[#222222] pb-2">
              <div className="w-2 h-2 bg-amber-500 animate-pulse"></div>
              Arsenal [Consumir]
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="text-amber-500 font-mono uppercase text-[11px] tracking-widest mb-1">Proteínas_</h4>
                <p className="text-[#999999] leading-relaxed">Huevos enteros, pechuga de pollo, vacuno magro (posta rosada/negra, asiento), salmón, atún al agua, yogur alto en proteína.</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-mono uppercase text-[11px] tracking-widest mb-1">Combustible_</h4>
                <p className="text-[#999999] leading-relaxed">Avena integral, arroz, papas cocidas, plátanos (pre/post entreno), frutos rojos congelados.</p>
              </div>
              <div>
                <h4 className="text-amber-500 font-mono uppercase text-[11px] tracking-widest mb-1">Grasas_</h4>
                <p className="text-[#999999] leading-relaxed">Palta, aceite de oliva extra virgen, nueces, almendras.</p>
              </div>
            </div>
          </section>

          <section className="bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-lg p-5 shadow-sm relative overflow-hidden hover:border-[#333333] transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600/80"></div>
            <h3 className="font-black italic uppercase tracking-tighter text-white text-xl mb-4 flex items-center gap-2 ml-2 border-b border-[#222222] pb-2">
              <div className="w-2 h-2 bg-red-600"></div>
              Saboteadores [Evitar]
            </h3>
            <ul className="space-y-3 text-sm text-[#999999] ml-2">
              <li><strong className="text-red-500 font-mono text-[11px] uppercase tracking-widest">Azúcares_</strong> Disparan la insulina y almacenan grasa. (Bebidas, energéticas).</li>
              <li><strong className="text-red-500 font-mono text-[11px] uppercase tracking-widest">Trans/Fritos_</strong> Inflamación sistémica pura. (Aceite maravilla frito, comida rápida).</li>
              <li><strong className="text-red-500 font-mono text-[11px] uppercase tracking-widest">Alcohol_</strong> Reduce síntesis proteica en 37%. Enemigo #1 del rendimiento.</li>
            </ul>
          </section>

          <section className="bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-lg p-5 shadow-sm hover:border-[#333333] transition-colors">
            <h3 className="font-black italic uppercase tracking-tighter text-white text-xl mb-4 flex items-center gap-2 border-b border-[#222222] pb-2">
              <span className="text-[#666666] font-mono">{`{/>}`}</span> Protocolo Timing
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-[#080808] p-3 rounded-md border border-[#222222] hover:scale-[1.01] transition-transform">
                <span className="block text-amber-500 font-mono uppercase text-[10px] tracking-widest mb-1">01 // Pre-Entreno (1-2 hrs)</span>
                <p className="text-[#888888]">Carbos rápidos + Proteína moderada. Cero grasas. Ej: Plátano + 1 scoop.</p>
              </div>
              <div className="bg-[#080808] p-3 rounded-md border border-[#222222] hover:scale-[1.01] transition-transform">
                <span className="block text-amber-500 font-mono uppercase text-[10px] tracking-widest mb-1">02 // Post-Entreno (Ventana 2 hrs)</span>
                <p className="text-[#888888]">Proteína rápida + Carbos. Ej: Pechuga de pollo con arroz o batido con avena.</p>
              </div>
              <div className="bg-[#080808] p-3 rounded-md border border-[#222222] hover:scale-[1.01] transition-transform">
                <span className="block text-amber-500 font-mono uppercase text-[10px] tracking-widest mb-1">03 // Hidratación</span>
                <p className="text-[#888888]">3-4 litros diarios. Añade sal de mar al agua intra-entreno para electrolitos.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
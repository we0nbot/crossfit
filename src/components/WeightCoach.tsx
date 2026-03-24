"use client";

import React from "react";
import { Calculator, Scale, Zap, Info } from "lucide-react";

interface WeightCoachProps {
  description: string;
  userWeight: number;
}

/**
 * WeightCoach - Calculadora Inteligente de Pesos Relativos.
 * Escanea la descripción del WOD buscando patrones de 'Bodyweight' (BW)
 * y calcula automáticamente la carga real recomendada para el atleta.
 */
export default function WeightCoach({ description, userWeight }: WeightCoachProps) {
  
  // Lógica para redondear a discos reales (múltiplos de 2.5kg estándar de Box)
  const calcularPesoReal = (factor: number, pesoAtleta: number) => {
    const pesoBruto = factor * pesoAtleta;
    return Math.round(pesoBruto / 2.5) * 2.5;
  };

  /**
   * Motor de Detección Quirúrgica:
   * Busca en la descripción literales técnicos y calcula el peso exacto.
   */
  const detectarPesosCalculados = (desc: string, peso: number) => {
    const lineas = desc.split('\n');
    const hallazgos: { label: string; valor: number; factor: number }[] = [];

    lineas.forEach(linea => {
      const text = linea.toLowerCase();

      if (text.includes('1 ½ bodyweight') || text.includes('1.5 bodyweight')) {
        hallazgos.push({ label: 'Deadlift (1.5x BW)', valor: calcularPesoReal(1.5, peso), factor: 1.5 });
      } else if (text.includes('bodyweight') || text.includes('1 bw') || text.includes('1.0 bw')) {
        // Evitamos duplicar si ya detectamos 1.5
        if (!text.includes('1.5') && !text.includes('1 ½')) {
          hallazgos.push({ label: 'Bench Press / Movement (1.0x BW)', valor: calcularPesoReal(1.0, peso), factor: 1.0 });
        }
      } else if (text.includes('¾ bodyweight') || text.includes('0.75 bodyweight') || text.includes('3/4 bodyweight')) {
        hallazgos.push({ label: 'Clean / Movement (0.75x BW)', valor: calcularPesoReal(0.75, peso), factor: 0.75 });
      }
    });

    return hallazgos;
  };

  const calculos = detectarPesosCalculados(description, userWeight);

  // Si no hay menciones de BW, el componente se mantiene latente (invisible)
  if (calculos.length === 0) return null;

  return (
    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-6 space-y-4 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.1)] relative overflow-hidden group">
      
      {/* Indicador Visual de Inteligencia */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

      <div className="flex items-center gap-3 border-b border-emerald-500/10 pb-4">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
           <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-black italic uppercase tracking-tighter text-lg leading-tight">
            Asistente de <span className="text-emerald-500">Peso Corporal</span>
          </h3>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Cálculo Operativo en Discos (múltiplos 2.5kg)</p>
        </div>
      </div>

      <div className="space-y-3">
        {calculos.map((calc, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-emerald-500/10 group/row hover:border-emerald-500/30 transition-all">
            <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{calc.label}</p>
               <div className="flex items-center gap-2">
                 <Zap className="w-3 h-3 text-emerald-500" />
                 <p className="text-sm font-black text-white italic uppercase tracking-tight">Carga Recomendada</p>
               </div>
            </div>
            
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {calc.valor}
              </span>
              <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">kg</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 pt-2 text-slate-600 bg-black/20 p-4 rounded-2xl">
         <Info className="w-3 h-3 mt-1 flex-shrink-0" />
         <p className="text-[9px] leading-relaxed font-medium">
            Pesos basados en tu ficha biométrica activa de <span className="text-emerald-500 font-black font-mono">{userWeight}kg</span>.
            El asistente redondea al disco más cercano para facilitar la carga en barra.
         </p>
      </div>

      <div className="flex justify-between items-center pt-2">
         <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
            <Scale className="w-3 h-3" /> Peso Real Estimado
         </div>
         <span className="bg-emerald-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Calculadora Táctica</span>
      </div>
    </div>
  );
}

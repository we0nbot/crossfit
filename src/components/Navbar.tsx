"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Activity, Apple, ArrowLeft } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Identificar sección activa para el indicador (Pill)
  const getStatusPill = () => {
    if (pathname === "/hipertrofia") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#222] rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#555]">
            Hipertrofia PRO
          </span>
        </div>
      );
    }
    if (pathname === "/nutricion") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Apple className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">
            Nutri Guide
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <header className="px-5 py-4 border-b border-[#1a1a1a] flex justify-between items-center bg-[#080808]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        {!isHome ? (
          <Link href="/" className="w-10 h-10 rounded bg-[#111] border border-[#222] flex items-center justify-center text-[#555] hover:text-emerald-500 hover:border-emerald-500/30 transition-all mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : (
          <Dumbbell className="text-emerald-500 w-4 h-4" />
        )}
        <span className="text-xl font-black italic uppercase tracking-tight text-white">
          Rorro<span className="text-emerald-500">Box</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Solo mostrar links a SECCIONES DISTINTAS a la actual */}
        {pathname !== "/libre" && (
          <Link
            href="/libre"
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-all group"
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
              Libre
            </span>
          </Link>
        )}

        {pathname !== "/hipertrofia" && (
          <Link
            href="/hipertrofia"
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 transition-all group"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-500">
              Pump
            </span>
          </Link>
        )}

        {pathname !== "/nutricion" && (
          <Link
            href="/nutricion"
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-all group"
          >
            <Apple className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">
              Nutri
            </span>
          </Link>
        )}

        {/* Status Pill dinámico */}
        {getStatusPill()}
      </div>
    </header>
  );
}

import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic';

/**
 * WOD Activo API (Fase 2 - CEREBRO)
 * Configura la interfaz dinámica para los atletas basándose en la programación técnica.
 */
export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Consulta maestra de la programación (A2:H100)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A2:H100",
    });

    const rows = res.data.values || [];
    
    // 2. Localización de la fecha actual en formato local (DD-MM-YYYY)
    const today = new Date().toLocaleDateString('es-CL', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      timeZone: 'America/Santiago'
    }).replace(/\//g, '-');

    // 3. Selección del WOD del día
    const activeRow = rows.find(row => row[1] === today);

    if (!activeRow) {
      return NextResponse.json(
        { error: "No hay WOD programado para hoy. ¡Disfruta el descanso!" }, 
        { status: 404 }
      );
    }

    // 4. Construcción del objeto de configuración dinámica
    // Estructura optimizada para el Dashboard del Atleta
    const wodData = {
      id_wod: activeRow[0],
      titulo: activeRow[2],
      tipo: activeRow[3],
      descripcion: activeRow[4],
      settings: {
        // 'STOPWATCH' (Hacia arriba) o 'COUNTDOWN' (EMOM/AMRAP con tiempo límite)
        timerType: (activeRow[5] || 'STOPWATCH').toUpperCase().trim(),
        // Segundos totales para el reloj (ej: 1200 para 20 mins)
        timerValue: parseInt(activeRow[6]) || 0,
        // Esquema de inputs para el registro (ej: ['rondas', 'reps'])
        fields: activeRow[7] 
          ? activeRow[7].split(',').map(s => s.trim()) 
          : ['tiempo']
      }
    };

    return NextResponse.json(wodData);

  } catch (error: any) {
    console.error("[CRITICAL_ACTIVE_WOD_FETCH]", error.message);
    return NextResponse.json(
      { error: "Error de servidor en el motor de configuración." }, 
      { status: 500 }
    );
  }
}

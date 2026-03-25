import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * WOD Activo API (Fase 2 - CEREBRO)
 * Configura la interfaz dinámica para los atletas basándose en la programación técnica.
 * Soporta navegación histórica mediante ?date=DD-MM-YYYY o YYYY-MM-DD
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get("date");
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Normalización de fecha técnica (DD-MM-YYYY)
    const normalizeDate = (d: any) => {
      if (!d) return "";
      
      // Manejar números de serie (Excel/Sheets)
      const num = Number(d);
      if (!isNaN(num) && num > 40000 && num < 60000) {
        // Excel/Sheets base date is Dec 30, 1899
        const date = new Date((num - 25569) * 86400 * 1000);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
      }

      const parts = d.toString().split(/[-/.]/); // Soporte para puntos
      if (parts.length !== 3) return d.toString();
      
      let day, month, year;
      // Si viene YYYY-MM-DD
      if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      } else {
        // Si viene D-M-YYYY o DD-MM-YYYY o DD-MM-YY
        day = parts[0];
        month = parts[1];
        year = parts[2];
      }
      
      // Asegurar Año de 4 dígitos
      if (year.toString().length === 2) year = `20${year}`;
      
      return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    };

    const todayChile = new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Santiago",
    }).format(new Date()).replace(/\//g, "-");

    const targetDate = dateQuery ? normalizeDate(dateQuery) : todayChile;

    console.log(`[DEBUG_WOD] Buscando WOD para: ${targetDate} (ISO/Query: ${dateQuery || 'today'})`);

    // 2. Ejecución de Consultas Paralelas (Motor de Lookup)
    const [programacionRes, libraryRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Programacion!A2:B500", // Rango acotado para alto rendimiento
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "WODs!A2:K500", // Rango acotado para alto rendimiento
      })
    ]);

    const programacionRows = programacionRes.data.values || [];
    const libraryRows = libraryRes.data.values || [];
    
    console.log(`[DEBUG_WOD] Filas encontradas: Agenda: ${programacionRows.length}, Biblioteca: ${libraryRows.length}`);

    // 3. PASO 1 (LOOKUP AGENDA): Buscar ID_WOD programado para la fecha activa (DD-MM-YYYY)
    const scheduledRow = [...programacionRows].reverse().find(row => {
      if (!row || !row[0]) return false;
      return normalizeDate(row[0]) === targetDate;
    });

    if (!scheduledRow) {
      console.warn(`[DEBUG_WOD] No se encontró programación para: ${targetDate}`);
      return NextResponse.json(
        { error: `Sin programación para: ${targetDate}`, status: "REST_DAY", fecha: targetDate }, 
        { status: 404 }
      );
    }

    const targetWodId = scheduledRow[1]?.toString().trim().toUpperCase();

    if (!targetWodId) {
      return NextResponse.json(
        { error: `Día de descanso activo: ${targetDate}`, status: "REST_DAY", fecha: targetDate }, 
        { status: 200 }
      );
    }

    // 4. PASO 2 (LOOKUP BIBLIOTECA): Buscar especificación técnica por ID_WOD
    const libraryRow = libraryRows.find(row => {
      const rowId = row[0]?.toString().trim().toUpperCase();
      return rowId === targetWodId;
    });

    if (!libraryRow) {
      console.error(`[DEBUG_WOD] ERROR: ID '${targetWodId}' no hallado en la biblioteca.`);
      return NextResponse.json(
        { 
          error: `ID '${targetWodId}' no hallado.`, 
          status: "LIBRARY_ERROR",
          targetWodId,
          fecha: targetDate 
        }, 
        { status: 404 }
      );
    }
    
    // 5. MAPEADO MAESTRO (11 Columnas de Alto Rendimiento)
    const wodData = {
      id: libraryRow[0],
      id_wod: libraryRow[0],
      titulo: libraryRow[2] || "Mantenimiento Técnico",
      tipo: libraryRow[3] || "AMRAP",
      descripcion: libraryRow[4] || "",
      config: {
        timerType: (libraryRow[5] || "STOPWATCH").toUpperCase().trim(),
        timerValue: parseInt(libraryRow[6]) || 0,
        fields: libraryRow[7] 
          ? libraryRow[7].split(",").map((s: string) => s.trim()) 
          : ["tiempo"]
      },
      levels: {
        rx: libraryRow[8] || "",
        scaled: libraryRow[9] || "",
        novato: libraryRow[10] || ""
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

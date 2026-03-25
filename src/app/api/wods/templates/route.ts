import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * WOD Templates API - Catálogo Maestro Sincronizado.
 * Recupera todas las estructuras técnicas de la hoja 'WODs'.
 */
export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    // 1. Obtener toda la Biblioteca Maestra (Lookup Masivo)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A2:L1000", // Ampliado por si hay categoría en col L
    });

    const allRows = res.data.values || [];
    
    // 2. Deduplicación por ID (Evita errores de 'Duplicate Key' en React)
    const uniqueRows = Array.from(new Map(allRows.map(row => [row[0], row])).values());
    
    // 3. Mapeo Profesional de Hoja a Estructura de Datos
    const templates = uniqueRows.map((row) => ({
      id: row[0],
      id_wod: row[0],
      titulo: row[2] || "Sin Título",
      tipo: row[3] || "AMRAP",
      descripcion: row[4] || "",
      timerType: (row[5] || "STOPWATCH").toUpperCase().trim(),
      timerValue: parseInt(row[6]) || 0,
      inputSchema: row[7] || "tiempo",
      levels: {
        rx: row[8] || "",
        scaled: row[9] || "",
        novato: row[10] || ""
      },
      // Si la columna L existe, es la categoría (HERO/GIRL). Fallback: GENERAL.
      category: (row[11] || "GENERAL").toUpperCase()
    }));

    return NextResponse.json(templates);

  } catch (error: any) {
    console.error("[TEMPLATES_SYNC_ERROR]", error.message);
    return NextResponse.json({ error: "No se pudieron cargar las plantillas de la biblioteca." }, { status: 500 });
  }
}

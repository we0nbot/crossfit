import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const revalidate = 60; // Cache de 1 minuto para optimización en producción

/**
 * Route Handler para obtener el WOD del día desde Google Sheets.
 * Sincronizado con zona horaria America/Santiago.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date"); // Formato esperado: DD-MM-YYYY

    // 1. Obtención de fecha exacta
    const formatter = new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Santiago",
    });

    const targetDate = dateParam || formatter.format(new Date()).replace(/\//g, "-");
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 2. Consulta a Google Sheets (Pestaña 'WODs')
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A:E", // Estructura: A:ID, B:FECHA, C:TITULO, D:TIPO, E:DESCRIPCION
    });

    const rows = res.data.values || [];
    
    // 3. Búsqueda del WOD por fecha (Columna B / Índice 1)
    const wodFila = rows.find((row) => row[1] === targetDate);

    if (!wodFila) {
      return NextResponse.json(
        { 
          message: "No hay WOD programado para este día.", 
          estado: "descanso",
          fecha: targetDate 
        },
        { status: 404 }
      );
    }

    // 4. Mapeo seguro de datos
    const wodData = {
      id_wod: wodFila[0] || "anon-wod",
      titulo: wodFila[2] || "Sin título",
      tipo: wodFila[3] || "N/A",
      descripcion: wodFila[4] || "Sin descripción disponible.",
    };

    return NextResponse.json(wodData);
  } catch (error: any) {
    console.error("[API_ERROR_WOD_TODAY]", error.message);
    return NextResponse.json(
      { error: "Error al recuperar el WOD del servidor." },
      { status: 500 }
    );
  }
}

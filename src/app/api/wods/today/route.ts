import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic'; 

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

    // 2. Consulta a Google Sheets (Pestaña 'WODs' - Rango Maestro A:K)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A:K", 
    });

    const rows = res.data.values || [];
    
    // 3. Motor de Búsqueda de Última Versión
    const wodFila = [...rows].reverse().find((row) => row[1] === targetDate);

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

    // 4. Mapeo seguro de datos (Arquitectura 11-Col Sincronizada)
    const wodData = {
      id: wodFila[0] || "anon-wod",
      id_wod: wodFila[0] || "anon-wod",
      titulo: wodFila[2] || "Sin título",
      tipo: wodFila[3] || "N/A",
      descripcion: wodFila[4] || "", // Columna E (Gral)
      timer_type: wodFila[5] || "STOPWATCH", // Columna F
      timer_value: parseInt(wodFila[6] || "0"), // Columna G
      input_schema: wodFila[7] || "tiempo", // Columna H
      req_rx: wodFila[8] || "Sin descripción RX.", // Columna I
      req_scaled: wodFila[9] || "Sin descripción Scaled.", // Columna J
      req_novato: wodFila[10] || "Sin descripción Novato." // Columna K
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

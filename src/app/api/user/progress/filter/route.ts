import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic';

/**
 * Specialty Filter API - Escáner de Variables Técnicas.
 * Permite identificar y filtrar movimientos específicos dentro de los resultados JSON
 * para detectar estancamientos en gimnasia, levantamiento u otras áreas.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const movimiento = searchParams.get("movimiento");

    if (!userId) {
      return NextResponse.json({ error: "userId es obligatorio" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Obtención de el historial de métricas (Incluyendo JSON de resultados)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A2:E2000",
    });

    const rows = res.data.values || [];
    
    // 2. Filtrado inicial por usuario
    // Col B (index 1) es el userId
    const userRows = rows.filter(row => row[1] === userId);

    const processedData = userRows.map(row => {
      try {
        // Col D (index 3) es el dataString (JSON)
        return {
          id: row[0],
          data: JSON.parse(row[3]),
          fecha: row[4]
        };
      } catch (e) {
        return null;
      }
    }).filter(item => item !== null);

    // 3. CASO A: No hay movimiento específico -> Devolver catálogo de llaves únicas
    if (!movimiento) {
      const allKeys = new Set<string>();
      processedData.forEach(item => {
        Object.keys(item!.data).forEach(key => allKeys.add(key));
      });
      
      return NextResponse.json({ 
        userId,
        availableMovements: Array.from(allKeys).sort()
      });
    }

    // 4. CASO B: Hay movimiento específico -> Filtrar registros que lo contienen
    const filteredResults = processedData
      .filter(item => item!.data[movimiento] !== undefined)
      .map(item => ({
        fecha: item!.fecha?.split('T')[0] || "---",
        valor: parseFloat(item!.data[movimiento]) || 0,
        unidad: isNaN(parseFloat(item!.data[movimiento])) ? "string" : "numeric",
        originalValue: item!.data[movimiento]
      }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    return NextResponse.json({
      userId,
      movimiento,
      count: filteredResults.length,
      history: filteredResults
    });

  } catch (error: any) {
    console.error("[CRITICAL_FILTER_API_ERROR]", error.message);
    return NextResponse.json({ error: "Fallo al procesar el filtro de especialidad." }, { status: 500 });
  }
}

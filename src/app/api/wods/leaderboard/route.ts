import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

/**
 * Endpoint Leaderboard - Generación dinámica del Top 10 por modalidad.
 * Combina datos de 'Metricas' y 'Usuarios' para mostrar nombres reales.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wodId = searchParams.get("wodId");

  if (!wodId) {
    return NextResponse.json(
      { error: "Se requiere el identificador del WOD (wodId)." },
      { status: 400 }
    );
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Obtención paralela de Métricas y Usuarios para el "JOIN"
    const [metricsRes, usersRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Metricas!A:Z" }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Usuarios!A:F" }),
    ]);

    const metricsRows = metricsRes.data.values || [];
    const usersRows = usersRes.data.values || [];

    console.log(`[DEBUG_LEADERBOARD] Fetching: ${wodId}. Total métricas: ${metricsRows.length}.`);
    // 2. Mapeo de Usuarios para búsqueda eficiente [id]: nombre
    const userMap = usersRows.reduce((acc: any, row: string[]) => {
      acc[row[0]] = row[1]; // A: ID, B: Nombre
      return acc;
    }, {});

    const targetWodId = wodId.toString().trim().toUpperCase();

    // 3. Filtrado y Transformación Robusta (v15.9 - Soporte Multi-Esquema)
    const filteredMetrics = metricsRows
      .filter((row) => {
        // Ignorar encabezados y filas vacías
        if (!row || row[0] === "ID_METRICA" || row[2] === "ID_WOD") return false;
        return row[2]?.toString().trim().toUpperCase() === targetWodId;
      })
      .map((row) => {
        const isNewSchema = row.length >= 7;
        
        return {
          nombre_usuario: userMap[row[1]] || "Atleta Desconocido",
          // En el nuevo esquema (7+ cols), el resultado está en Col E (4)
          // En el esquema antiguo (6 cols), el resultado NO existía fuera del JSON (mostramos -- o intentamos parsear)
          resultado: isNewSchema ? (row[4] || "--") : "--", 
          modalidad: row[3],
          fecha_registro: isNewSchema ? row[6] : row[5],
        };
      })
      .filter(m => m.resultado !== "--"); // Opcional: Solo mostrar los que tienen resultado real
    // 4. Lógica de Ordenamiento y Categorización
    const sortByTime = (a: any, b: any) =>
      a.resultado.localeCompare(b.resultado);

    const rxLeaderboard = filteredMetrics
      .filter((m) => m.modalidad?.toLowerCase() === "rx")
      .sort(sortByTime)
      .slice(0, 10);
 
    const scaledLeaderboard = filteredMetrics
      .filter((m) => m.modalidad?.toLowerCase() === "scaled")
      .sort(sortByTime)
      .slice(0, 10);

    const novatoLeaderboard = filteredMetrics
      .filter((m) => m.modalidad?.toLowerCase() === "novato")
      .sort(sortByTime)
      .slice(0, 10);
 
    return NextResponse.json({
      wodId,
      leaderboard: {
        rx: rxLeaderboard,
        scaled: scaledLeaderboard,
        novato: novatoLeaderboard
      },
      metadata: {
        total_records: filteredMetrics.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[API_ERROR_LEADERBOARD]", error.message);
    return NextResponse.json(
      { error: "Error al generar el Leaderboard." },
      { status: 500 }
    );
  }
}

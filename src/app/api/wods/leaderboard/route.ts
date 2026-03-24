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
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Metricas!A:F" }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Usuarios!A:F" }),
    ]);

    const metricsRows = metricsRes.data.values || [];
    const usersRows = usersRes.data.values || [];

    // 2. Mapeo de Usuarios para búsqueda eficiente [id]: nombre
    const userMap = usersRows.reduce((acc: any, row: string[]) => {
      acc[row[0]] = row[1]; // A: ID, B: Nombre
      return acc;
    }, {});

    // 3. Filtrado y Transformación de Métricas por WOD específico
    const filteredMetrics = metricsRows
      .filter((row) => row[2] === wodId) // Col C: id_wod
      .map((row) => ({
        nombre_usuario: userMap[row[1]] || "Atleta Desconocido", // Col B: id_usuario
        resultado: row[3], // Col D: resultado (MM:SS:ms)
        modalidad: row[4], // Col E: modalidad
        fecha_registro: row[5], // Col F: timestamp
      }));

    // 4. Lógica de Ordenamiento y Categorización
    const sortByTime = (a: any, b: any) =>
      a.resultado.localeCompare(b.resultado);

    const rxLeaderboard = filteredMetrics
      .filter((m) => m.modalidad === "Rx")
      .sort(sortByTime)
      .slice(0, 10);

    const scaledLeaderboard = filteredMetrics
      .filter((m) => m.modalidad === "Scaled")
      .sort(sortByTime)
      .slice(0, 10);

    return NextResponse.json({
      wodId,
      leaderboard: {
        rx: rxLeaderboard,
        scaled: scaledLeaderboard,
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

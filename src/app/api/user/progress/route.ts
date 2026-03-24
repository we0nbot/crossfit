import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";
import { timeToSeconds } from "@/lib/utils";

export const dynamic = 'force-dynamic';

/**
 * User Progress API - Motor de trazabilidad atlética.
 * Extrae y procesa el historial de marcas de un usuario integrando analíticas de PR.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId es obligatorio" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Obtención de datos maestros (Metricas y WODs)
    const [metricsRes, wodsRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Metricas!A2:E2000" }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: "WODs!A2:C500" }),
    ]);

    const metricsRows = metricsRes.data.values || [];
    const wodsRows = wodsRes.data.values || [];

    // Diccionario de WODs para JOIN rápido [id_wod] -> titulo
    const wodsMap = Object.fromEntries(wodsRows.map(row => [row[0], row[2]]));

    // 2. Filtrado y Procesamiento Táctico
    // Metricas Index: 0:uuid, 1:userId, 2:wodId, 3:dataString(JSON), 4:timestamp
    const userProgress = metricsRows
      .filter(row => row[1] === userId)
      .map(row => {
        let parsedData: any = {};
        let numericValue = 0;

        try {
          parsedData = JSON.parse(row[3]);
          // Prioridad de extracción de valor para el gráfico:
          // 1. tiempo_final (convertido a seg)
          // 2. rondas (numérico)
          // 3. reps (numérico)
          if (parsedData.tiempo_final) {
            numericValue = timeToSeconds(parsedData.tiempo_final);
          } else if (parsedData.rondas) {
            numericValue = parseInt(parsedData.rondas) || 0;
          } else if (parsedData.reps) {
            numericValue = parseInt(parsedData.reps) || 0;
          }
        } catch (e) {
          // Fallback si no es JSON (marcas antiguas)
          numericValue = timeToSeconds(row[3]);
        }

        return {
          id: row[0],
          wodId: row[2],
          wodNombre: wodsMap[row[2]] || "WOD Desconocido",
          data: parsedData,
          valor: numericValue,
          fecha: row[4]?.split('T')[0] || "---",
          timestamp: new Date(row[4]).getTime()
        };
      })
      .filter(item => item.valor > 0) // Limpiar registros inválidos
      .sort((a, b) => a.timestamp - b.timestamp);

    // 3. Detección de PRs (Récords Personales)
    // Heurística de PR por WOD:
    const prTracker: Record<string, number> = {};
    const finalProgress = userProgress.map(item => {
      let esPR = false;
      const currentBest = prTracker[item.wodId];

      // Si es tiempo, menor es mejor. Si es rondas, mayor es mejor.
      const isTimeBased = item.data?.tiempo_final !== undefined;
      
      if (currentBest === undefined) {
        esPR = true;
        prTracker[item.wodId] = item.valor;
      } else {
        if (isTimeBased) {
          if (item.valor < currentBest) {
            esPR = true;
            prTracker[item.wodId] = item.valor;
          }
        } else {
          if (item.valor > currentBest) {
            esPR = true;
            prTracker[item.wodId] = item.valor;
          }
        }
      }

      return {
        fecha: item.fecha,
        wodNombre: item.wodNombre,
        valor: item.valor,
        esPR,
        modalidad: item.data?.modalidad || "Rx"
      };
    });

    return NextResponse.json({
      userId,
      count: finalProgress.length,
      history: finalProgress
    });

  } catch (error: any) {
    console.error("[CRITICAL_PROGRESS_API_ERROR]", error.message);
    return NextResponse.json({ error: "Fallo al procesar el historial atlético." }, { status: 500 });
  }
}

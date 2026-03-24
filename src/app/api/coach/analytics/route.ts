import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

/**
 * Endpoint Coach Analytics - Procesamiento estadístico de rendimiento.
 * Genera métricas avanzadas (Media, Mediana, StdDev) e Histogramas.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wodId = searchParams.get("wodId");

  if (!wodId) {
    return NextResponse.json(
      { error: "Se requiere un identificador de WOD válido." },
      { status: 400 }
    );
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const [metricsRes, usersRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Metricas!A:F" }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Usuarios!A:F" }),
    ]);

    const metricsRows = metricsRes.data.values || [];
    const usersRows = usersRes.data.values || [];

    const userMap = usersRows.reduce((acc: any, row: string[]) => {
      acc[row[0]] = row[1];
      return acc;
    }, {});
    
    // 1. Filtrado y conversión de tiempos 
    const todosLosRegistros = metricsRows
      .filter((row) => row[2] === wodId) // Col C: id_wod
      .map((row) => {
        const [min, sec, ms] = row[3].split(":").map(Number);
        const segundos = min * 60 + sec + ms / 100;
        return {
          id: row[0],
          nombre: userMap[row[1]] || "Atleta Desconocido",
          segundos,
          resultado: row[3],
          modalidad: row[4],
        };
      })
      .sort((a, b) => a.segundos - b.segundos);

    if (todosLosRegistros.length === 0) {
      return NextResponse.json(
        { message: "No hay registros suficientes para este WOD." },
        { status: 404 }
      );
    }

    const tiemposSegundos = todosLosRegistros.map(r => r.segundos);

    // 2. Cálculos Estadísticos
    const count = tiemposSegundos.length;
    const mean = tiemposSegundos.reduce((a, b) => a + b, 0) / count;
    
    const median = count % 2 === 0
      ? (tiemposSegundos[count / 2 - 1] + tiemposSegundos[count / 2]) / 2
      : tiemposSegundos[Math.floor(count / 2)];

    const variance = tiemposSegundos.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    // 3. Generación de Histograma (5 Buckets)
    const minTime = tiemposSegundos[0];
    const maxTime = tiemposSegundos[count - 1];
    const range = maxTime - minTime || 1;
    const bucketSize = range / 5;

    const histogram = Array.from({ length: 5 }, (_, i) => {
      const lower = minTime + i * bucketSize;
      const upper = lower + bucketSize;
      const atletasEnBucket = tiemposSegundos.filter(
        (t) => t >= lower && (i === 4 ? t <= upper : t < upper)
      ).length;

      return {
        rango: `${Math.floor(lower / 60)}:${Math.floor(lower % 60).toString().padStart(2, '0')}`,
        frecuencia: atletasEnBucket,
      };
    });

    // 4. Insight de Carga (Flag de Varianza)
    // Umbral arbitrario para el MVP: Si StdDev es > 20% de la media, es alta varianza
    const high_variance = stdDev > (mean * 0.2);

    return NextResponse.json({
      wodId,
      stats: {
        total_atletas: count,
        media: mean.toFixed(2),
        mediana: median.toFixed(2),
        desviacion_estandar: stdDev.toFixed(2),
        high_variance,
      },
      histogram,
      records: todosLosRegistros, // Array completo para tablas de outliers
    });
  } catch (error: any) {
    console.error("[API_ERROR_COACH_ANALYTICS]", error.message);
    return NextResponse.json(
      { error: "Fallo en el cálculo analítico." },
      { status: 500 }
    );
  }
}

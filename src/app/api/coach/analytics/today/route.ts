import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";
import { timeToSeconds } from "@/lib/utils";

/**
 * Endpoint Coach Analytics Today - El monitor analítico diario para el Coach.
 * Combina la obtención del WOD actual con las estadísticas de rendimiento en tiempo real.
 */
export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Obtención de fecha exacta de Chile (Santiago)
    const formatter = new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Santiago",
    });
    const hoyChile = formatter.format(new Date()).replace(/\//g, "-");

    // 2. Localización del WOD de Hoy
    const wodsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "WODs!A:E",
    });
    const wodsRows = wodsRes.data.values || [];
    const wodHoy = wodsRows.find((row) => row[1] === hoyChile);

    if (!wodHoy) {
      return NextResponse.json({ message: "Descanso Activo: No hay WOD programado hoy." }, { status: 404 });
    }

    const id_wod = wodHoy[0];
    const descripcion = wodHoy[4] || "";

    // 3. Extracción heurística del Time Cap (Optimista)
    // Busca patrones como "TIME CAP: 15:00" o "CAP: 20:00"
    const capMatch = descripcion.match(/(?:TIME CAP|CAP):\s*(\d{1,2}:\d{2})/i);
    const targetTimeSec = capMatch ? timeToSeconds(`${capMatch[1]}:00`) : 900; // Default 15 mins (900s)

    // 4. Procesamiento de Métricas (Solo para este WOD)
    const metricsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A:F",
    });
    const metricsRows = metricsRes.data.values || [];

    const tiemposSegundos = metricsRows
      .filter((row) => row[2] === id_wod)
      .map((row) => timeToSeconds(row[3]))
      .sort((a, b) => a - b);

    if (tiemposSegundos.length === 0) {
      return NextResponse.json({ 
        message: "No hay registros registrados para el WOD de hoy todavía.",
        id_wod 
      }, { status: 200 });
    }

    // 5. Cálculos Estadísticos
    const count = tiemposSegundos.length;
    const mean = tiemposSegundos.reduce((a, b) => a + b, 0) / count;
    const median = count % 2 === 0
      ? (tiemposSegundos[count / 2 - 1] + tiemposSegundos[count / 2]) / 2
      : tiemposSegundos[Math.floor(count / 2)];

    const variance = tiemposSegundos.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const high_variance = stdDev > (mean * 0.2);

    // 6. Generador de Histograma (Buckets)
    const minTime = tiemposSegundos[0];
    const maxTime = tiemposSegundos[count - 1];
    const range = (maxTime - minTime) || 1;
    const bucketSize = range / 5;

    const histogram = Array.from({ length: 5 }, (_, i) => {
      const lower = minTime + i * bucketSize;
      const upper = lower + bucketSize;
      const countBucket = tiemposSegundos.filter(t => t >= lower && (i === 4 ? t <= upper : t < upper)).length;
      return { 
        rango: `${Math.floor(lower / 60).toString().padStart(2, '0')}:${Math.floor(lower % 60).toString().padStart(2, '0')}`, 
        atletas: countBucket 
      };
    });

    // 7. Procesador de Insights (Lógica de Semáforo)
    const getTechnicalInsight = (mean: number, target: number) => {
      const diff = ((mean - target) / target) * 100;
      if (diff > 25) return { status: 'RED', msg: 'CARGA CRÍTICA: La media superó el objetivo por +25%. Escalamiento insuficiente o peso excesivo.' };
      if (diff < -25) return { status: 'YELLOW', msg: 'INTENSIDAD BAJA: WOD terminado demasiado rápido (+25% bajo CAP). Aumentar complejidad técnica o carga.' };
      return { status: 'GREEN', msg: 'CARGA ÓPTIMA: El estímulo de hoy fue el correcto para la mayoría del grupo (Sweet Spot).' };
    };

    const technicalInsight = getTechnicalInsight(mean, targetTimeSec);

    return NextResponse.json({
      wodId: id_wod,
      stats: {
        total: count,
        media: mean,
        mediana: median,
        std_dev: stdDev.toFixed(2),
        high_variance,
      },
      histogram,
      insight: technicalInsight,
      target_time_seconds: targetTimeSec
    });

  } catch (error: any) {
    console.error("[API_ERROR_ANALYTICS_TODAY]", error.message);
    return NextResponse.json({ error: "Fallo al procesar métricas diarias." }, { status: 500 });
  }
}

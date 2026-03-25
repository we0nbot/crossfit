import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";
import { timeToSeconds } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Dynamic Stats API (v4.5 - Multi-Level Ready)
 * Metricas: [UUID, UserID, WodID, Nivel, ResultsJSON, Timestamp]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ wodId: string }> }
) {
  try {
    const { wodId } = await params;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A2:F3000",
    });

    const rows = res.data.values || [];
    
    // 1. Filtrado por WOD (Columna C / Index 2)
    const filteredRows = rows.filter(
      (row: any[]) => row[2]?.toString().trim() === wodId.toString().trim()
    );

    const stats = {
      rx: [] as number[],
      scaled: [] as number[],
      novato: [] as number[],
    };

    filteredRows.forEach((row: any[]) => {
      try {
        const modalidad = (row[3] || "SCALED").toUpperCase();
        const results = JSON.parse(row[4] || "{}");
        // Extraemos el tiempo final del JSON de resultados
        const timeStr = results.tiempo_final || "00:00:00";
        const seconds = timeToSeconds(timeStr);
        
        if (seconds > 0) {
          if (modalidad === "RX") stats.rx.push(seconds);
          else if (modalidad === "SCALED") stats.scaled.push(seconds);
          else if (modalidad === "NOVATO") stats.novato.push(seconds);
        }
      } catch (e) {
        console.warn("Fila corrupta omitida:", row[0]);
      }
    });

    const segundosArr = [...stats.rx, ...stats.scaled, ...stats.novato].sort((a, b) => a - b);

    if (segundosArr.length === 0) {
      return NextResponse.json(
        { 
          wodId,
          mensaje: "Tiempos inválidos en registros",
          histograma: [],
          stats: { promedio: 0, total: 0 } 
        }, 
        { status: 200 }
      );
    }

    // 4. Lógica de Cubetas (Histograma de 5 bins)
    const min = segundosArr[0];
    const max = segundosArr[segundosArr.length - 1];
    const range = (max - min) || 60; // Evitar division por cero (mínimo 1 min si son iguales)
    const anchoCubeta = range / 5;

    const histograma = Array.from({ length: 5 }, (_, i) => {
      const inicio = min + i * anchoCubeta;
      const fin = inicio + anchoCubeta;
      
      const count = segundosArr.filter(
        (s) => s >= inicio && (i === 4 ? s <= fin : s < fin)
      ).length;

      // Etiqueta legible: "Xm - Ym"
      return {
        rango: `${Math.floor(inicio / 60)}m - ${Math.floor(fin / 60)}m`,
        atletas: count,
      };
    });

    // 5. Cálculo Final de Estadísticas
    const total = segundosArr.length;
    const promedio = segundosArr.reduce((a, b) => a + b, 0) / total;

    return NextResponse.json({
      stats: {
        promedio: promedio.toFixed(2),
        total
      },
      histograma
    });

  } catch (error: any) {
    console.error("[STAT_API_CRITICAL]", error.message);
    return NextResponse.json({ error: "Fallo en procesamiento de datos" }, { status: 500 });
  }
}

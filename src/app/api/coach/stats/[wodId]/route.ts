import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = "force-dynamic";

/**
 * Dynamic Stats API (Atomic Rewrite / Fixed Schema)
 * Procesa métricas de CrossFit desde Google Sheets siguiendo el esquema:
 * Metricas: [id_metrica, nombre_usuario, id_usuario, id_wod (Col D), resultado (Col E), modalidad (Col F), fecha]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ wodId: string }> }
) {
  try {
    const { wodId } = await params;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Obtención de métricas con rango extendido (Metricas!A2:G1000)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A2:G1000",
    });

    const rows = res.data.values || [];
    
    // 2. Filtrado robusto (id_wod en Columna D / Index 3)
    const registrosFiltrados = rows.filter((row) => {
      const rowWodId = row[3]?.toString().trim();
      return rowWodId === wodId.trim();
    });

    if (registrosFiltrados.length === 0) {
      return NextResponse.json(
        { 
          wodId,
          mensaje: "No hay datos para este WOD",
          histograma: [],
          stats: { promedio: 0, total: 0 } 
        }, 
        { status: 200 }
      );
    }

    // 3. Conversión de tiempo y sanitización (Columna E / Index 4)
    const segundosArr = registrosFiltrados
      .map((row) => {
        const timeStr = row[4] || ""; // MM:SS:ms
        const parts = timeStr.split(":").map(Number);
        if (parts.length < 2 || parts.some(isNaN)) return null;
        
        const [min, sec, ms] = parts;
        return min * 60 + sec + (ms || 0) / 100;
      })
      .filter((s): s is number => s !== null)
      .sort((a, b) => a - b);

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

import { NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * API de Filtrado de Progresión - Lógica Quirúrgica.
 * Extrae métricas específicas de un JSON guardado en Google Sheets.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const movimientoBuscado = searchParams.get("movimiento");

  if (!userId || !movimientoBuscado) {
    return NextResponse.json(
      { error: "Se requiere userId y movimiento." },
      { status: 400 }
    );
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Sanitización de la llave privada
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n").replace(/"/g, "")
      : "";

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 1. Obtención de todos los registros de Métricas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Metricas!A:G", // Capturamos un rango amplio para los índices del snippet
    });

    const rows = response.data.values || [];
    
    // 2. Lógica Quirúrgica: El Extractor de Métricas Dinámicas
    const userRows = rows.filter((r) => r[2] === userId);

    const resultadosFiltrados = userRows
      .map((row) => {
        const dataJson = JSON.parse(row[3] || "{}"); // Columna de datos JSON en r[3]

        // Si el usuario busca 'peso_deadlift', buscamos esa key en el JSON
        if (dataJson[movimientoBuscado] || dataJson["ejercicio"] === movimientoBuscado) {
          return {
            fecha: row[6], // Fecha de registro en r[6]
            wod: row[4],   // ID o nombre del WOD en r[4]
            valor: parseFloat(dataJson[movimientoBuscado] || dataJson["resultado"] || "0"), // Valor numérico para el eje Y
            unidad: movimientoBuscado.toLowerCase().includes("peso") ? "kg" : "reps",
            modalidad: dataJson["modalidad"] || "Rx",
          };
        }
        return null;
      })
      .filter(Boolean); // Limpiamos nulos

    return NextResponse.json({
      movimiento: movimientoBuscado,
      total_records: resultadosFiltrados.length,
      history: resultadosFiltrados,
    });

  } catch (error: any) {
    console.error("[HISTORY_API_ERROR]", error.message);
    return NextResponse.json(
      { error: "Error al procesar el historial del atleta." },
      { status: 500 }
    );
  }
}

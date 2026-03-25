import { sheets } from "@/lib/google";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, wodId: rawWodId, nivel, results } = body;
    const wodId = rawWodId ? rawWodId.toString().trim().toUpperCase() : "";
    if (!userId || !wodId || !nivel) {
      return NextResponse.json(
        { error: "Fallo de Integridad: Datos Requeridos" },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();

    // Normalización de Resultado Principal (Columna E para Ranking)
    // Priorizamos 'tiempo_final' si existe, si no el primer valor útil.
    const primaryResult = results?.tiempo_final || Object.values(results || {}).find(v => !!v) || "--";
    const dataString = JSON.stringify(results || {});

    // Registro atómico (7 Columnas v15.0)
    // [UUID, USER_ID, WOD_ID, NIVEL, RESULTADO, DATA_JSON, TIMESTAMP]
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Metricas!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[uuid, userId, wodId, nivel, primaryResult, dataString, timestamp]],
      },
    });

    return NextResponse.json({ success: true, id: uuid, primaryResult }, { status: 201 });

  } catch (error: any) {
    console.error("[CRITICAL_METRICS_ERROR]", error.message);
    return NextResponse.json(
      { error: "Error en Persistencia de Datos", detalle: error.message },
      { status: 500 }
    );
  }
}

import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, wodId, data } = body;

    // Validación de grado bancario: Aborto inmediato si faltan identificadores críticos
    if (!userId || !wodId) {
      return Response.json(
        { 
          error: "Fallo de Integridad: Identificadores Requeridos", 
          detalle: "wodId y userId son campos de carácter obligatorio para la trazabilidad." 
        },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const dataString = JSON.stringify(data || {});
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();

    // Sanitización de la llave privada para el entorno de ejecución
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n").replace(/"/g, "")
      : "";

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheetsService = google.sheets({ version: "v4", auth });

    // Registro atómico en la hoja de 'Metricas'
    await sheetsService.spreadsheets.values.append({
      spreadsheetId,
      range: "Metricas!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            uuid,
            userId,
            wodId,
            dataString,
            timestamp,
          ],
        ],
      },
    });

    return Response.json({ 
      success: true, 
      id: uuid,
      timestamp: timestamp 
    }, { status: 201 });

  } catch (error: any) {
    const googleError = error?.response?.data?.error?.message || error.message;
    console.error("[CRITICAL_METRICS_ERROR]", googleError);

    return Response.json(
      { error: "Error en Persistencia de Datos", detalle: googleError },
      { status: 500 }
    );
  }
}

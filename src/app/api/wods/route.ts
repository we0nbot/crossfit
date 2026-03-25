import { sheets } from "@/lib/google";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Endpoint POST para registrar un nuevo WOD en Google Sheets (Hoja 'WODs').
 * Diseño de Máxima Flexibilidad: Sin validaciones externas para agilizar la carga.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Params Extraction (Atómica de 11 Columnas)
    const fecha = body.fecha || "00-00-0000";
    const titulo = (body.titulo || "WOD SIN TÍTULO").trim();
    const id_wod = body.id_wod || `WOD-${Date.now()}`;
    const tipo = body.tipo || "AMRAP";
    const descripcion = body.descripcion || "";
    const config_timer = body.config_timer || "STOPWATCH";
    const timer_value = body.timer_value || 0;
    const input_schema = Array.isArray(body.input_schema) 
       ? body.input_schema.join(",") 
       : (body.input_schema || "tiempo");
    const req_rx = body.req_rx || "";
    const req_scaled = body.req_scaled || "";
    const req_novato = body.req_novato || "";

    console.log(`[DEBUG_POST] Iniciando JOIN Técnico: ${titulo} (${id_wod})`);
    
    // A. Registro en Agenda (A:B)
    const agendaPromise = sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Programacion!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[fecha, id_wod]],
      },
    });
 
    // B. Registro en Biblioteca (A:K)
    const libraryPromise = sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "WODs!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          id_wod, 
          fecha, 
          titulo, 
          tipo, 
          descripcion, 
          config_timer, 
          timer_value, 
          input_schema, 
          req_rx, 
          req_scaled, 
          req_novato
        ]],
      },
    });

    const [agendaRes, libraryRes] = await Promise.all([agendaPromise, libraryPromise]);
    console.log(`[DEBUG_POST] Sincronización exitosa. Agenda=${agendaRes.data.updates?.updatedRange}, WODs=${libraryRes.data.updates?.updatedRange}`);

    // 3. Invalidadación de Caché
    revalidatePath("/dashboard");
    revalidatePath("/api/wods/active");

    return NextResponse.json({ 
      success: true, 
      message: "Publicación Industrial Completada: Agenda y Biblioteca sincronizadas.",
      id_wod,
      fecha 
    }, { status: 201 });

  } catch (error: any) {
    console.error("[API_ERROR_WOD_POST_JOIN]", error.message);
    const googleError = error?.response?.data?.error?.message || error.message;
    return NextResponse.json({ error: "Error en el pipeline de datos.", detalle: googleError }, { status: 500 });
  }
}

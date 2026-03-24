import { z } from "zod";
import { google } from "googleapis";
import { sheets } from "@/lib/google";
import { NextResponse } from "next/server";

// Esquema de validación para la creación de un WOD
const WodSchema = z.object({
  fecha: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Formato DD-MM-YYYY requerido"),
  titulo: z.string().min(3).max(100),
  tipo: z.enum(["AMRAP", "EMOM", "FOR TIME", "TABATA", "PR"]),
  descripcion: z.string().min(5),
});

/**
 * Endpoint POST para registrar un nuevo WOD en Google Sheets (Hoja 'WODs').
 * Permite la programación técnica desde el panel del coach.
 */
export async function POST(request: Request) {
  try {
    // 1. Parseo y validación del payload
    const body = await request.json();
    const result = WodSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validación fallida", detalles: result.error.issues },
        { status: 400 }
      );
    }

    const { fecha, titulo, tipo, descripcion } = result.data;

    // 2. Generación de identificador único (Primary Key)
    const id_wod = crypto.randomUUID();

    // 3. Sanitización de descripción (Aplanar saltos de línea si es necesario para celdas simples o mantenerlos)
    // Google Sheets acepta \n para saltos de línea internos en una celda
    const sanitizedDescripcion = descripcion.trim();

    // 4. Inserción técnica en Google Sheets (Hoja 'WODs', Rango A:E)
    // Estructura: [ID, FECHA, TITULO, TIPO, DESCRIPCION]
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "WODs!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id_wod, fecha, titulo, tipo, sanitizedDescripcion]],
      },
    });

    return NextResponse.json(
      { 
        message: "WOD programado con éxito", 
        id_wod,
        fecha 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[API_ERROR_WOD_POST]", error.message);
    
    // Extracción profunda del error de Google API para depuración
    const googleError = error?.response?.data?.error?.message || error.message;
    
    return NextResponse.json(
      { error: "Error al registrar el WOD en el servidor.", detalle: googleError },
      { status: 500 }
    );
  }
}

import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sheets } from "@/lib/google";

// Esquema de validación y sanitización de seguridad
const FeedbackSchema = z.object({
  id_atleta: z.string().uuid(), // ID del atleta al que se le da feedback
  comentario: z
    .string()
    .min(10)
    .max(1000)
    // Sanitización: Eliminación de etiquetas HTML para prevenir XSS
    .transform((s) => s.replace(/[<>]/g, "")),
});

export async function POST(request: Request) {
  try {
    // 1. Recuperación de sesión segura del lado del servidor
    const session = await getServerSession(authOptions);

    // 2. Validación de autorización implícita (Aislamiento de Privilegios)
    // Se ignora cualquier rol o id enviado en el body, se usa solo la sesión
    if (!session || session.user.rol !== "Coach") {
      console.error(`Intento de escalado de privilegios de usuario: ${session?.user?.email || "Anónimo"}`);
      return Response.json(
        { error: "Escalado de privilegios detectado o no autorizado" },
        { status: 403 }
      );
    }

    // 3. Extracción y validación del payload
    const body = await request.json();
    const result = FeedbackSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Payload inválido o texto sospechoso", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { id_atleta, comentario } = result.data;
    // Extraemos el ID del Coach directamente de la sesión (Seguridad Crítica)
    const id_coach = session.user.id;
    const timestamp = new Date().toISOString();

    // 4. Persistencia atómica en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Feedback_Biomecanico!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id_atleta, id_coach, comentario, timestamp]],
      },
    });

    return Response.json(
      { message: "Feedback registrado correctamente", timestamp },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error crítico en endpoint de feedback:", error);
    return Response.json(
      { error: "Fallo interno en el procesamiento del feedback" },
      { status: 500 }
    );
  }
}

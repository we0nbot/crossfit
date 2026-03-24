import { NextResponse } from "next/server";
import { sheets } from "@/lib/google";

export const dynamic = 'force-dynamic';

/**
 * User Profile API - Motor de Identidad Atlética.
 * Recupera perfiles biométricos y de usuario desde la hoja 'Usuarios'.
 * Incluye fallback de datos críticos para calculadoras de rendimiento operativo.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Falta Identificador de Usuario" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Lectura de la hoja de Usuarios (Index: A:ID, B:Nombre, C:Email, D:Peso, E:Rol)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Usuarios!A2:E500",
    });

    const rows = res.data.values || [];
    
    // 2. Localización quirúrgica del perfil
    const userRow = rows.find(row => row[0].toString().trim() === userId.toString().trim());

    if (!userRow) {
      return NextResponse.json({ error: "Usuario no localizado en el ecosistema Hub" }, { status: 404 });
    }

    // 3. Extracción de valores con validación de seguridad (Calculadora Fallback)
    const pesoRaw = parseFloat(userRow[3]);
    const pesoActual = (!isNaN(pesoRaw) && pesoRaw > 0) ? pesoRaw : 75; // 75kg por defecto para evitar divisiones por cero

    const profile = {
      id_usuario: userRow[0],
      nombre: userRow[1],
      email: userRow[2],
      peso_actual_kg: pesoActual,
      rol: userRow[4] || "atleta",
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json(profile);

  } catch (error: any) {
    console.error("[CRITICAL_PROFILE_API_ERROR]", error.message);
    return NextResponse.json(
      { error: "Fallo de Integridad en el Perfil", detalle: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * Perfil Update (POST) - Actualización Biométrica.
 * Permite al atleta sincronizar su peso actual con el ecosistema de inteligencia técnica.
 */
export async function POST(request: Request) {
  try {
    const { userId, newWeight } = await request.json();

    if (!userId || !newWeight) {
      return NextResponse.json({ error: "userId y newWeight son obligatorios" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 1. Localizar la fila del usuario
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Usuarios!A2:A500", // Solo ID para búsqueda rápida
    });

    const ids = res.data.values || [];
    const rowIndex = ids.findIndex(row => row[0].toString().trim() === userId.toString().trim());

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Usuario no identificado" }, { status: 404 });
    }

    // El índice real es rowIndex + 2 (A2 es el inicio)
    const googleSheetIndex = rowIndex + 2;

    // 2. Ejecutar actualización atómica en Columna D (Peso)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!D${googleSheetIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[newWeight]],
      },
    });

    return NextResponse.json({ success: true, updatedWeight: newWeight });

  } catch (error: any) {
    console.error("[CRITICAL_BIO_UPDATE_ERROR]", error.message);
    return NextResponse.json({ error: "Fallo al sincronizar peso biométrico" }, { status: 500 });
  }
}

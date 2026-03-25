import { google } from "googleapis";

const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
const private_key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

// Configuración de Identidad Google Cloud (Fase Diagnóstico)
if (client_email) {
  console.log(`[GOOGLE_AUTH] Motor de Datos usando Identidad: ${client_email}`);
}

// Configuración de Google Sheets Auth (Servidor)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email,
    private_key,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

if (!private_key) {
  console.warn("GOOGLE_PRIVATE_KEY no está definida en el entorno (.env / Vercel)");
}

if (!client_email) {
  console.warn("CLIENT_EMAIL (Service Account) no está definido en el entorno.");
}

export const sheets = google.sheets({ version: "v4", auth });

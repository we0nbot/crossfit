import { google } from "googleapis";

// Configuración de Google Sheets Auth (Servidor)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

if (!process.env.GOOGLE_PRIVATE_KEY) {
  console.warn("GOOGLE_PRIVATE_KEY no está definida en .env.local");
}

export const sheets = google.sheets({ version: "v4", auth });

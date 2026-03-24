import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sheets } from "@/lib/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
          range: "Usuarios!A:F",
        });

        const rows = response.data.values || [];
        // Col 2 (C) es el Email, Col 4 (E) es el Estado, Col 5 (F) es el Rol
        const dbUser = rows.find((row) => row[2] === user.email);

        // Validación de Lista Blanca (Zero Trust)
        if (!dbUser || dbUser[4] !== "Activo") {
          console.warn(`Intento de login denegado para: ${user.email}`);
          return false;
        }

        // Inyección segura de credenciales locales para los siguientes callbacks
        user.id = dbUser[0];
        (user as any).rol = dbUser[5];

        return true;
      } catch (error) {
        console.error("Error conectando con Google Sheets:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Pasar el ID y Rol del objeto user al token en el login inicial
      if (user) {
        token.id = user.id;
        token.rol = (user as any).rol;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar el ID y Rol del token a la sesión
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).rol = token.rol;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Opcional: Personalizar página de login
    error: "/auth/error",   // Opcional: Personalizar página de errores
  },
  secret: process.env.NEXTAUTH_SECRET,
};

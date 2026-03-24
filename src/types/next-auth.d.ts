import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extiende el objeto User de NextAuth para incluir el Rol y el ID de base de datos.
   */
  interface User {
    id: string; // ID original del login (puede ser un string)
    rol: string; // Rol del usuario definido en la base de datos (Ej: 'admin', 'coach', 'atleta')
  }

  /**
   * Extiende la Session para incluir el Rol y el ID del usuario.
   */
  interface Session {
    user: {
      id: string;
      rol: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende el Token del JWT para incluir el ID de la base de datos y el Rol.
   */
  interface JWT {
    id: string;
    rol: string;
  }
}

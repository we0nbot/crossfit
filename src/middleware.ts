import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SWITCH MAESTRO DE SEGURIDAD
 * Cambiar a 'true' para reactivar la protección perimetral con NextAuth.
 * Actualmente en 'false' para facilitar el desarrollo y pruebas del MVP.
 */
const IS_AUTH_ENABLED = false;

export function middleware(request: NextRequest) {
  // MODO DESARROLLO / MVP SIN AUTH: Bypass total del tráfico
  if (!IS_AUTH_ENABLED) {
    return NextResponse.next();
  }

  /* --- LÓGICA DE PRODUCCIÓN PROTEGIDA (Comentada para uso futuro) ---
  
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/coach")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.rol !== "Coach") {
        console.warn(`Acceso denegado: Rol ${payload.rol} insuficiente.`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  ------------------------------------------------------------------ */

  return NextResponse.next();
}

/**
 * Configuración del matcher para el Edge Runtime.
 * Intercepta las rutas críticas del coach para optimizar el rendimiento.
 */
export const config = {
  matcher: ["/coach/:path*"],
};

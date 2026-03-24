/**
 * Utility function to merge Tailwind CSS classes safely.
 * Temporariamente simplificado para evitar errores de módulo en el entorno.
 */
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Convierte un string de tiempo en formato MM:SS:ms (00:00:00) a segundos totales.
 */
export const timeToSeconds = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(":")) return 0;
  const parts = timeStr.split(":").map(Number);
  const min = parts[0] || 0;
  const sec = parts[1] || 0;
  const ms = parts[2] || 0;
  return min * 60 + sec + ms / 100;
};

/**
 * Convierte segundos totales de vuelta a formato legible MM:SS:ms.
 */
export const secondsToTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 100);
  
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
};

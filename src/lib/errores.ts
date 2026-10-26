import { isAxiosError } from 'axios';

/**
 * Traduce errores de red/API a mensajes aptos para la interfaz.
 * No expone detalles internos ni datos de configuración.
 */
export function mensajeDeError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
    }

    const estado = error.response.status;

    if (estado === 404) {
      return 'No se encontró el recurso solicitado.';
    }
    if (estado === 429) {
      return 'Demasiadas solicitudes. Espera unos segundos antes de reintentar.';
    }
    if (estado >= 500) {
      return 'El servidor no está disponible en este momento. Inténtalo más tarde.';
    }
    return `La solicitud falló con el código ${estado}.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

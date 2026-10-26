import { create } from 'axios';

/**
 * URL base del proyecto MockAPI, sin barra final.
 * El recurso concreto (`/notas`) se añade en el servicio.
 */
export const URL_BASE_MOCKAPI =
  process.env.EXPO_PUBLIC_MOCKAPI_URL?.trim().replace(/\/+$/, '') ?? '';

/**
 * Evita que una petición se envíe a una URL relativa o vacía cuando falta
 * la configuración de entorno.
 */
export function asegurarMockApiConfigurada(): void {
  if (!URL_BASE_MOCKAPI) {
    throw new Error(
      'Falta EXPO_PUBLIC_MOCKAPI_URL. Configura la URL base del proyecto MockAPI.',
    );
  }
}

/**
 * Cliente de escritura/lectura de MockAPI.
 * Se mantiene separado de publicClient porque la fuente y la URL base difieren.
 */
export const mockApiClient = create({
  baseURL: URL_BASE_MOCKAPI,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

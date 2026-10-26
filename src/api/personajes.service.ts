import { publicClient } from './publicClient';
import type { Personaje, RespuestaPersonajes } from '@/types/personaje';

export interface OpcionesPersonajes {
  pagina?: number;
  nombre?: string;
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function validarLista(datos: unknown): RespuestaPersonajes {
  if (
    !esObjeto(datos) ||
    !esObjeto(datos.info) ||
    !Array.isArray(datos.results) ||
    typeof datos.info.count !== 'number' ||
    typeof datos.info.pages !== 'number'
  ) {
    throw new Error('La API devolvió un listado de personajes con un formato inesperado.');
  }

  return datos as unknown as RespuestaPersonajes;
}

function validarPersonaje(datos: unknown): Personaje {
  if (
    !esObjeto(datos) ||
    typeof datos.id !== 'number' ||
    typeof datos.name !== 'string' ||
    typeof datos.image !== 'string'
  ) {
    throw new Error('La API devolvió un personaje con un formato inesperado.');
  }

  return datos as unknown as Personaje;
}

/** Consulta paginada de personajes. Endpoint real: GET /character */
export async function obtenerPersonajes({
  pagina = 1,
  nombre,
}: OpcionesPersonajes = {}): Promise<RespuestaPersonajes> {
  const parametros: Record<string, string | number> = { page: pagina };
  const filtro = nombre?.trim();

  if (filtro) {
    parametros.name = filtro;
  }

  const { data } = await publicClient.get<unknown>('/character', { params: parametros });
  return validarLista(data);
}

/** Consulta individual. Endpoint real: GET /character/:id */
export async function obtenerPersonaje(id: number): Promise<Personaje> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El identificador del personaje no es válido.');
  }

  const { data } = await publicClient.get<unknown>(`/character/${id}`);
  return validarPersonaje(data);
}

import { mockApiClient, asegurarMockApiConfigurada } from './client';
import type { DatosNota, Nota, VariablesActualizarNota } from '@/types/nota';

const RECURSO = '/notas';

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function validarNota(datos: unknown): Nota {
  if (
    !esObjeto(datos) ||
    typeof datos.id !== 'string' ||
    datos.id.length === 0 ||
    typeof datos.personajeId !== 'string' ||
    typeof datos.titulo !== 'string' ||
    typeof datos.contenido !== 'string' ||
    typeof datos.categoria !== 'string' ||
    typeof datos.createdAt !== 'number' ||
    !Number.isFinite(datos.createdAt)
  ) {
    throw new Error('MockAPI devolvió una nota con un formato inesperado.');
  }

  return datos as unknown as Nota;
}

function validarDatos(datos: DatosNota): DatosNota {
  const titulo = datos.titulo.trim();
  const contenido = datos.contenido.trim();
  const categoria = datos.categoria.trim();
  const personajeId = datos.personajeId.trim();

  if (!personajeId) {
    throw new Error('El identificador del personaje no es válido.');
  }
  if (!titulo) {
    throw new Error('El título de la nota es obligatorio.');
  }
  if (!contenido) {
    throw new Error('El contenido de la nota es obligatorio.');
  }
  if (!categoria) {
    throw new Error('La categoría de la nota es obligatoria.');
  }
  if (!Number.isFinite(datos.createdAt)) {
    throw new Error('La fecha de creación de la nota no es válida.');
  }

  return {
    ...datos,
    personajeId,
    titulo,
    contenido,
    categoria,
    createdAt: datos.createdAt,
  };
}

/** Listado completo de notas. Endpoint real: GET /notas */
export async function listarNotas(): Promise<Nota[]> {
  asegurarMockApiConfigurada();
  const { data } = await mockApiClient.get<unknown>(RECURSO);

  if (!Array.isArray(data)) {
    throw new Error('MockAPI devolvió un listado de notas con un formato inesperado.');
  }

  return data.map(validarNota);
}

/** Creación de una nota. Endpoint real: POST /notas */
export async function crearNota(datos: DatosNota): Promise<Nota> {
  asegurarMockApiConfigurada();
  const cuerpo = validarDatos(datos);
  const { data } = await mockApiClient.post<unknown>(RECURSO, cuerpo);
  return validarNota(data);
}

/**
 * Actualización completa de una nota existente.
 * Endpoint real: PUT /notas/:id
 */
export async function actualizarNota({
  id,
  datos,
}: VariablesActualizarNota): Promise<Nota> {
  asegurarMockApiConfigurada();

  if (!id.trim()) {
    throw new Error('El identificador de la nota no es válido.');
  }

  const cuerpo = validarDatos(datos);
  const { data } = await mockApiClient.put<unknown>(
    `${RECURSO}/${encodeURIComponent(id.trim())}`,
    cuerpo,
  );
  return validarNota(data);
}

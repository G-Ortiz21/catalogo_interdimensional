/** Registro de la bitácora con la forma observada en la respuesta de MockAPI. */
export interface Nota {
  /** Identificador asignado por MockAPI. Es una cadena. */
  id: string;
  personajeId: string;
  titulo: string;
  contenido: string;
  categoria: string;
  /** MockAPI serializa el campo Date como un número en la respuesta JSON. */
  createdAt: number;
}

/** Datos enviados al crear o actualizar; MockAPI asigna únicamente `id`. */
export type DatosNota = Omit<Nota, 'id'>;

/** Variables de la mutación de edición. */
export interface VariablesActualizarNota {
  id: string;
  datos: DatosNota;
}

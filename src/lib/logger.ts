export type NivelLog = 'info' | 'exito' | 'alerta' | 'error' | 'red' | 'cache';

export interface EntradaLog {
  id: number;
  fecha: Date;
  nivel: NivelLog;
  mensaje: string;
}

type Oyente = () => void;

const MAX_ENTRADAS = 200;

let entradas: EntradaLog[] = [];
let siguienteId = 1;
let instantanea: EntradaLog[] = entradas;
const oyentes = new Set<Oyente>();

function notificar() {
  instantanea = entradas;
  oyentes.forEach((oyente) => oyente());
}

export function registrarEvento(mensaje: string, nivel: NivelLog = 'info'): EntradaLog {
  const entrada: EntradaLog = {
    id: siguienteId++,
    fecha: new Date(),
    nivel,
    mensaje,
  };

  entradas = [...entradas, entrada].slice(-MAX_ENTRADAS);
  notificar();
  return entrada;
}

export function obtenerEventos(): EntradaLog[] {
  return instantanea;
}

export function limpiarEventos() {
  entradas = [];
  notificar();
}

export function suscribirEventos(oyente: Oyente): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

export function formatearHora(fecha: Date): string {
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  const ss = String(fecha.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

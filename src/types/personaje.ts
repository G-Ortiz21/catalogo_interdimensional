export type EstadoPersonaje = 'Alive' | 'Dead' | 'unknown';

export interface OrigenPersonaje {
  name: string;
  url: string;
}

export interface Personaje {
  id: number;
  name: string;
  status: EstadoPersonaje;
  species: string;
  type: string;
  gender: string;
  origin: OrigenPersonaje;
  location: OrigenPersonaje;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface InfoPaginacion {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RespuestaPersonajes {
  info: InfoPaginacion;
  results: Personaje[];
}

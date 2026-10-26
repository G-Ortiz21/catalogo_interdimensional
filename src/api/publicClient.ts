import { create } from 'axios';

const URL_BASE =
  process.env.EXPO_PUBLIC_RICK_AND_MORTY_URL?.trim().replace(/\/+$/, '') ||
  'https://rickandmortyapi.com/api';

/**
 * Cliente de solo lectura para Rick and Morty API.
 * No se realizan operaciones de escritura contra esta fuente.
 */
export const publicClient = create({
  baseURL: URL_BASE,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
  },
});

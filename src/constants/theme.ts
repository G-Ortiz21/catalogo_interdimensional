/**
 * Tema visual centralizado de Catálogo Interdimensional.
 * Paleta basada en DISENIO.md. No usar hexadecimales sueltos en pantallas.
 */

import { Platform } from 'react-native';

export const colores = {
  espacioProfundo: '#141534',
  nebulosaOscura: '#232345',
  portalVioleta: '#480B7F',
  violetaElectrico: '#7518AD',
  magentaCosmico: '#9D36AC',
  verdeExtraterrestre: '#7FBA5B',
  verdePortal: '#A0CE69',
  cianEnergetico: '#41E2BF',
  turquesaEspacial: '#2495A3',
  azulProfundo: '#12678B',
  cremaEstelar: '#DCE1B9',
  blancoCosmico: '#F6F6F8',
  salmonExtraterrestre: '#EFB495',
  naranjaAlienigena: '#DD9057',
  /* Tonos derivados solo para transparencias y bordes. */
  bordeSutil: 'rgba(220, 225, 185, 0.22)',
  bordeSeparador: 'rgba(220, 225, 185, 0.10)',
  bordeCian: 'rgba(65, 226, 191, 0.55)',
  brilloPortal: 'rgba(117, 24, 173, 0.45)',
  exito: '#A0CE69',
  alerta: '#DD9057',
  error: '#EFB495',
} as const;

export const espacios = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radios = {
  ninguno: 0,
  sm: 2,
  md: 6,
} as const;

export const tipografia = {
  display: 38,
  displayCompacto: 27,
  titulo: 30,
  subtitulo: 21,
  cuerpo: 16,
  pequeno: 13,
  tecnica: 10,
  etiqueta: 11,
  mono: 12,
  nombreTarjeta: 17,
  nombreDetalle: 36,
} as const;

/** Familias del sistema: no se instalan fuentes adicionales en esta etapa. */
export const fuentes = {
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
} as const;

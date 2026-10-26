import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { actualizarNota, crearNota } from '@/api/notas.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';

const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;

// Keep online-mode queries paused until Expo Network confirms the initial state.
onlineManager.setOnline(false);

/** Estrategia de caché para la API pública (datos estables). */
export const CACHE_API_PUBLICA = {
  staleTime: 30 * MINUTO,
  gcTime: 48 * HORA,
} as const;

/** Estrategia de caché para MockAPI (datos propios, cambian con frecuencia). */
export const CACHE_MOCKAPI = {
  staleTime: 10 * 1000,
  gcTime: 24 * HORA,
} as const;

export const CONFIG_PERSISTENCIA = {
  key: 'catalogo-interdimensional:cache',
  maxAge: 24 * HORA,
  buster: 'v2',
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
      retry: (intentos, error) => {
        if (isAxiosError(error) && error.response?.status === 404) {
          return false;
        }
        return intentos < 2;
      },
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'online',
      retry: 2,
      gcTime: CONFIG_PERSISTENCIA.maxAge,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: CONFIG_PERSISTENCIA.key,
  throttleTime: 1000,
});

/**
 * Las funciones de mutación no se serializan con la caché persistida.
 * Deben registrarse con la misma mutationKey que usan los hooks para que
 * TanStack Query pueda reanudar operaciones pausadas después de un reinicio.
 */
queryClient.setMutationDefaults(mutationKeys.notas.crear, {
  mutationFn: crearNota,
  networkMode: 'online',
  retry: 2,
  onSuccess: async (nota) => {
    registrarEvento(`Nota creada en MockAPI: ${nota.id}`, 'exito');
    // También se ejecuta cuando una mutación restaurada se reanuda sin que el
    // hook original siga montado.
    await queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
  },
  onError: (error) => {
    registrarEvento(`Error al crear nota: ${mensajeDeError(error)}`, 'error');
  },
});

queryClient.setMutationDefaults(mutationKeys.notas.editar, {
  mutationFn: actualizarNota,
  networkMode: 'online',
  retry: 2,
  onSuccess: async (nota) => {
    registrarEvento(`Nota actualizada en MockAPI: ${nota.id}`, 'exito');
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.notas.lists() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.notas.detail(nota.id) }),
    ]);
  },
  onError: (error) => {
    registrarEvento(`Error al actualizar nota: ${mensajeDeError(error)}`, 'error');
  },
});


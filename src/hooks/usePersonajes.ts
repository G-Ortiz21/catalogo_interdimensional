import { isAxiosError } from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerPersonaje, obtenerPersonajes } from '@/api/personajes.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { queryKeys } from '@/lib/queryKeys';
import { CACHE_API_PUBLICA } from '@/lib/queryClient';

export function usePersonajes(pagina = 1, nombre = '') {
  const filtro = nombre.trim();

  return useQuery({
    queryKey: queryKeys.personajes.list(pagina, filtro),
    queryFn: async () => {
      registrarEvento(
        filtro
          ? `Consultando personajes (página ${pagina}, filtro: ${filtro})`
          : `Consultando personajes (página ${pagina})`,
        'red',
      );
      try {
        const respuesta = await obtenerPersonajes({ pagina, nombre: filtro });
        registrarEvento(
          `Personajes recibidos: ${respuesta.results.length} de ${respuesta.info.count}`,
          'exito',
        );
        return respuesta;
      } catch (error) {
        if (filtro && isAxiosError(error) && error.response?.status === 404) {
          registrarEvento(`Sin coincidencias de personajes para: ${filtro}`, 'info');
        } else {
          registrarEvento(`Error al consultar personajes: ${mensajeDeError(error)}`, 'error');
        }
        throw error;
      }
    },
    staleTime: CACHE_API_PUBLICA.staleTime,
    gcTime: CACHE_API_PUBLICA.gcTime,
    placeholderData: keepPreviousData,
  });
}

export function usePersonaje(id: number | null) {
  return useQuery({
    queryKey: queryKeys.personajes.detail(id ?? 0),
    queryFn: async () => {
      if (id === null) {
        throw new Error('El identificador del personaje no es válido.');
      }

      registrarEvento(`Consultando personaje #${id}`, 'red');
      try {
        const personaje = await obtenerPersonaje(id);
        registrarEvento(`Personaje #${id} recibido: ${personaje.name}`, 'exito');
        return personaje;
      } catch (error) {
        registrarEvento(`Error al consultar personaje #${id}: ${mensajeDeError(error)}`, 'error');
        throw error;
      }
    },
    enabled: id !== null,
    staleTime: CACHE_API_PUBLICA.staleTime,
    gcTime: CACHE_API_PUBLICA.gcTime,
  });
}

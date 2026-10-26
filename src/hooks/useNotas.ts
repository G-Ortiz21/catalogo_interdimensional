import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { actualizarNota, crearNota, listarNotas } from '@/api/notas.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';
import { CACHE_MOCKAPI } from '@/lib/queryClient';
import type { DatosNota, Nota, VariablesActualizarNota } from '@/types/nota';

/** Consulta del listado de notas propias. */
export function useNotas() {
  return useQuery({
    queryKey: queryKeys.notas.list(),
    queryFn: async () => {
      registrarEvento('Consultando notas en MockAPI', 'red');
      try {
        const notas = await listarNotas();
        registrarEvento(`Notas recibidas: ${notas.length}`, 'exito');
        return notas;
      } catch (error) {
        registrarEvento(`Error al consultar notas: ${mensajeDeError(error)}`, 'error');
        throw error;
      }
    },
    staleTime: CACHE_MOCKAPI.staleTime,
    gcTime: CACHE_MOCKAPI.gcTime,
  });
}

/** Crea una nota y refresca las consultas de la bitácora solo tras el éxito real. */
export function useCrearNota() {
  const queryClient = useQueryClient();

  return useMutation<Nota, Error, DatosNota>({
    mutationKey: mutationKeys.notas.crear,
    mutationFn: crearNota,
    onSuccess: async (nota) => {
      registrarEvento(`Nota creada en MockAPI: ${nota.id}`, 'exito');
      await queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
    },
    onError: (error) => {
      registrarEvento(`Error al crear nota: ${mensajeDeError(error)}`, 'error');
    },
  });
}

/** Actualiza una nota completa y mantiene coherentes listado y detalle. */
export function useActualizarNota() {
  const queryClient = useQueryClient();

  return useMutation<Nota, Error, VariablesActualizarNota>({
    mutationKey: mutationKeys.notas.editar,
    mutationFn: actualizarNota,
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
}

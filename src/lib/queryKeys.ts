/**
 * Claves centralizadas y jerárquicas.
 *
 * personajes
 * ├── listas (todas)
 * │   └── pagina + filtro
 * └── detalles (todos)
 *     └── id
 *
 * notas (bitácora propia en MockAPI)
 * ├── listas
 * └── detalles
 */
export const queryKeys = {
  personajes: {
    all: ['personajes'] as const,
    lists: () => [...queryKeys.personajes.all, 'listas'] as const,
    list: (pagina: number, filtro?: string) =>
      [...queryKeys.personajes.lists(), { pagina, filtro: filtro?.trim() ?? '' }] as const,
    details: () => [...queryKeys.personajes.all, 'detalles'] as const,
    detail: (id: number) => [...queryKeys.personajes.details(), id] as const,
  },
  notas: {
    all: ['notas'] as const,
    lists: () => [...queryKeys.notas.all, 'listas'] as const,
    list: () => [...queryKeys.notas.lists()] as const,
    details: () => [...queryKeys.notas.all, 'detalles'] as const,
    detail: (id: string) => [...queryKeys.notas.details(), id] as const,
  },
} as const;

/**
 * Claves de mutación centralizadas. Deben coincidir con las registradas
 * mediante setMutationDefaults para poder reanudar mutaciones persistidas.
 */
export const mutationKeys = {
  notas: {
    all: ['notas', 'mutaciones'] as const,
    crear: [...['notas', 'mutaciones'], 'crear'] as const,
    editar: [...['notas', 'mutaciones'], 'editar'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;

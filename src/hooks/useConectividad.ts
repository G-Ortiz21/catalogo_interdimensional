import { useEffect, useRef, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

import { registrarEvento } from '@/lib/logger';

interface EstadoConectividad {
  comprobado: boolean;
  conectado: boolean;
  tipo: string;
}

function interpretarEstado(estado: Network.NetworkState): { conectado: boolean; tipo: string } {
  // La conexión a una red no garantiza acceso al servidor; se usa también
  // isInternetReachable cuando el sistema lo informa.
  const conectado = estado.isConnected !== false && estado.isInternetReachable !== false;
  return { conectado, tipo: estado.type ?? 'UNKNOWN' };
}

/**
 * Sincroniza onlineManager antes de reanudar mutaciones persistidas.
 * Si la detección falla, se asume conectado para no bloquear la reanudación.
 */
export async function sincronizarConectividadInicial(): Promise<boolean> {
  try {
    const red = await Network.getNetworkStateAsync();
    const { conectado } = interpretarEstado(red);
    onlineManager.setOnline(conectado);
    return conectado;
  } catch {
    onlineManager.setOnline(true);
    return true;
  }
}

/**
 * Mantiene sincronizado onlineManager de TanStack Query con expo-network.
 * Debe existir una sola suscripción activa en la aplicación.
 */
export function useConectividad(): EstadoConectividad {
  const [estado, setEstado] = useState<EstadoConectividad>({
    comprobado: false,
    conectado: true,
    tipo: 'UNKNOWN',
  });
  const ultimoEstado = useRef<boolean | null>(null);

  useEffect(() => {
    let activo = true;

    const aplicar = (red: Network.NetworkState) => {
      if (!activo) {
        return;
      }

      const { conectado, tipo } = interpretarEstado(red);
      onlineManager.setOnline(conectado);
      setEstado({ comprobado: true, conectado, tipo });

      if (ultimoEstado.current !== conectado) {
        ultimoEstado.current = conectado;
        registrarEvento(
          conectado ? 'Conectividad disponible' : 'Sin conexión a Internet',
          'red',
        );
      }
    };

    Network.getNetworkStateAsync()
      .then(aplicar)
      .catch(() => {
        // Si la detección falla, no se bloquea la interfaz: se asume conectado
        // y TanStack Query seguirá gestionando los errores reales de red.
        if (activo) {
          setEstado((anterior) => ({ ...anterior, comprobado: true }));
        }
      });

    const suscripcion = Network.addNetworkStateListener(aplicar);

    return () => {
      activo = false;
      suscripcion.remove();
    };
  }, []);

  return estado;
}

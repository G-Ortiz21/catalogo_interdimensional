import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BannerRed } from '@/components/BannerRed';
import { colores } from '@/constants/theme';
import { sincronizarConectividadInicial } from '@/hooks/useConectividad';
import { registrarEvento } from '@/lib/logger';
import { queryKeys } from '@/lib/queryKeys';
import { CONFIG_PERSISTENCIA, persister, queryClient } from '@/lib/queryClient';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [restauracionFinalizada, setRestauracionFinalizada] = useState(false);

  const finalizarRestauracion = useCallback(() => {
    setRestauracionFinalizada(true);
  }, []);

  const alRestaurar = useCallback(() => {
    registrarEvento('Caché persistida restaurada o sin datos previos', 'cache');
    finalizarRestauracion();

    // Las funciones de mutación ya están registradas en queryClient mediante
    // setMutationDefaults. Se comprueba la red antes de reanudar para que una
    // mutación restaurada sin conexión permanezca pausada.
    sincronizarConectividadInicial()
      .then((conectado) => {
        const hayMutacionesPausadas = queryClient
          .getMutationCache()
          .getAll()
          .some((mutacion) => mutacion.state.isPaused);

        if (!hayMutacionesPausadas) {
          return false;
        }

        if (!conectado) {
          registrarEvento('Mutaciones pausadas conservadas hasta recuperar conexión', 'cache');
          return false;
        }

        return queryClient.resumePausedMutations().then(() => true);
      })
      .then((reanudadas) => {
        if (!reanudadas) {
          return;
        }

        registrarEvento('Mutaciones pausadas reanudadas', 'cache');
        return queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
      })
      .catch((error: unknown) => {
        const detalle = error instanceof Error ? error.message : 'error desconocido';
        registrarEvento(`No se pudieron reanudar las mutaciones: ${detalle}`, 'error');
      });
  }, [finalizarRestauracion]);

  const alFallarRestauracion = useCallback(() => {
    registrarEvento('No se pudo restaurar la caché persistida', 'error');
    finalizarRestauracion();
  }, [finalizarRestauracion]);

  useEffect(() => {
    if (!restauracionFinalizada) {
      return;
    }

    SplashScreen.hideAsync().catch(() => undefined);
  }, [restauracionFinalizada]);

  // Salvaguarda: la interfaz nunca debe quedar oculta indefinidamente si la
  // restauración no responde.
  useEffect(() => {
    const temporizador = setTimeout(() => setRestauracionFinalizada(true), 4000);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CONFIG_PERSISTENCIA.maxAge,
        buster: CONFIG_PERSISTENCIA.buster,
        // Solo las mutaciones pausadas (por ejemplo, sin conexión) necesitan
        // conservarse para reanudarse tras reiniciar la aplicación.
        dehydrateOptions: {
          shouldDehydrateMutation: (mutation) => mutation.state.isPaused,
        },
      }}
      onSuccess={alRestaurar}
      onError={alFallarRestauracion}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.raiz}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colores.espacioProfundo },
              animation: 'fade',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="bitacora" />
            <Stack.Screen name="personaje/[id]" />
          </Stack>
          <BannerRed />
        </View>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: colores.espacioProfundo,
  },
});

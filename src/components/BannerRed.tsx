import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { useConectividad } from '@/hooks/useConectividad';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

/**
 * Indicador de conectividad. También es el único punto donde se suscribe
 * expo-network y se actualiza onlineManager.
 */
export function BannerRed() {
  const { comprobado, conectado, tipo } = useConectividad();
  const insets = useSafeAreaInsets();

  if (!comprobado || conectado) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel="Sin conexión a Internet. Se muestran los datos disponibles en caché."
      style={[styles.contenedor, { paddingBottom: Math.max(insets.bottom, espacios.md) }]}>
      <View style={styles.marca} />
      <View style={styles.textos}>
        <Text style={styles.titulo}>SIN CONEXIÓN</Text>
        <Text style={styles.detalle}>
          {tipo === 'NONE' || tipo === 'UNKNOWN'
            ? 'Se usarán los datos guardados en caché si están disponibles.'
            : `Red ${tipo.toLowerCase()} sin acceso al servidor. Se usa la caché disponible.`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    zIndex: 100,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espacios.md,
    paddingTop: espacios.md,
    paddingHorizontal: espacios.lg,
    backgroundColor: colores.alerta,
    borderTopWidth: 2,
    borderTopColor: colores.espacioProfundo,
  },
  marca: {
    width: 6,
    backgroundColor: colores.espacioProfundo,
    borderRadius: radios.sm,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    color: colores.espacioProfundo,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
    letterSpacing: 0,
    fontFamily: fuentes.mono,
  },
  detalle: {
    color: colores.espacioProfundo,
    fontSize: tipografia.pequeno,
    fontWeight: '600',
    lineHeight: 18,
  },
});

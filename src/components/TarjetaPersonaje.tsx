import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import type { Personaje } from '@/types/personaje';

interface Props {
  personaje: Personaje;
  onPress: () => void;
  variante?: 'cuadricula' | 'muestra';
  composicion?: 'normal' | 'vertical';
}

function datosEstado(estado: Personaje['status']) {
  if (estado === 'Alive') {
    return { etiqueta: 'VIVO', color: colores.verdePortal };
  }
  if (estado === 'Dead') {
    return { etiqueta: 'MUERTO', color: colores.salmonExtraterrestre };
  }
  return { etiqueta: 'DESCONOCIDO', color: colores.cremaEstelar };
}

export function TarjetaPersonaje({
  personaje,
  onPress,
  variante = 'cuadricula',
  composicion = 'normal',
}: Props) {
  const estado = datosEstado(personaje.status);
  const muestra = variante === 'muestra';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${personaje.name}, ${estado.etiqueta}, ${personaje.species}. Abrir ficha.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tarjeta,
        { borderTopColor: estado.color },
        muestra && styles.tarjetaMuestra,
        pressed && styles.presionada,
      ]}>
      <View style={styles.marcoImagen}>
        <Image
          source={{ uri: personaje.image }}
          style={[styles.imagen, composicion === 'vertical' && styles.imagenVertical]}
          contentFit="cover"
          accessibilityLabel={`Retrato de ${personaje.name}`}
        />
        <Text style={styles.numero}>#{String(personaje.id).padStart(3, '0')}</Text>
        <View style={[styles.estado, { borderColor: estado.color }]}>
          <View style={[styles.punto, { backgroundColor: estado.color }]} />
          <Text style={[styles.estadoTexto, { color: estado.color }]}>{estado.etiqueta}</Text>
        </View>
      </View>
      <View style={styles.datos}>
        <Text style={styles.nombre} numberOfLines={2}>
          {personaje.name}
        </Text>
        <Text style={styles.especie} numberOfLines={1}>
          {personaje.species}
        </Text>
        <View style={styles.flecha}>
          <Text style={styles.flechaTexto}>ABRIR FICHA</Text>
          <View style={styles.linea} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderTopWidth: 3,
    borderTopColor: colores.violetaElectrico,
    borderRadius: radios.sm,
    overflow: 'hidden',
  },
  tarjetaMuestra: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: 158,
  },
  presionada: {
    opacity: 0.75,
  },
  marcoImagen: {
    position: 'relative',
    backgroundColor: colores.portalVioleta,
  },
  imagen: {
    width: '100%',
    aspectRatio: 1,
  },
  imagenVertical: {
    aspectRatio: 0.82,
  },
  numero: {
    position: 'absolute',
    top: espacios.sm,
    right: espacios.sm,
    overflow: 'hidden',
    paddingHorizontal: espacios.sm,
    paddingVertical: espacios.xs,
    color: colores.blancoCosmico,
    backgroundColor: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
  },
  estado: {
    position: 'absolute',
    left: espacios.sm,
    bottom: espacios.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs,
    paddingHorizontal: espacios.sm,
    paddingVertical: 3,
    backgroundColor: colores.espacioProfundo,
    borderWidth: 1,
    borderRadius: radios.sm,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  estadoTexto: {
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  datos: {
    padding: espacios.md,
    gap: 2,
  },
  nombre: {
    color: colores.blancoCosmico,
    fontSize: tipografia.nombreTarjeta,
    fontWeight: '900',
    lineHeight: 20,
  },
  especie: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
  },
  flecha: {
    marginTop: espacios.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.sm,
  },
  flechaTexto: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: colores.bordeSutil,
  },
});

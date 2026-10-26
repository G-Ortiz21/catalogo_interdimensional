import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

interface Props {
  tipo: 'cargando' | 'error' | 'vacio';
  titulo: string;
  mensaje?: string;
  textoAccion?: string;
  onAccion?: () => void;
}

export function EstadoPantalla({ tipo, titulo, mensaje, textoAccion, onAccion }: Props) {
  return (
    <View style={styles.contenedor} accessibilityRole={tipo === 'error' ? 'alert' : undefined}>
      <View style={[styles.marca, tipo === 'error' && styles.marcaError]}>
        <Text style={styles.codigo}>
          {tipo === 'cargando' ? '···' : tipo === 'error' ? '!!' : '00'}
        </Text>
      </View>

      {tipo === 'cargando' ? (
        <ActivityIndicator color={colores.cianEnergetico} size="small" />
      ) : null}

      <Text style={styles.titulo}>{titulo}</Text>
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      {textoAccion && onAccion ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAccion}
          style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
          <Text style={styles.textoBoton}>{textoAccion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'flex-start',
    gap: espacios.sm,
    padding: espacios.lg,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderLeftWidth: 4,
    borderLeftColor: colores.violetaElectrico,
    borderRadius: radios.sm,
  },
  marca: {
    paddingHorizontal: espacios.sm,
    paddingVertical: 2,
    backgroundColor: colores.cianEnergetico,
    borderRadius: radios.sm,
  },
  marcaError: {
    backgroundColor: colores.error,
  },
  codigo: {
    color: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontWeight: '900',
    fontSize: tipografia.etiqueta,
    letterSpacing: 0,
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
    lineHeight: 25,
  },
  mensaje: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
    lineHeight: 23,
  },
  boton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: espacios.xs,
    paddingVertical: espacios.sm,
    paddingHorizontal: espacios.md,
    borderWidth: 1,
    borderColor: colores.cianEnergetico,
    borderRadius: radios.sm,
  },
  presionado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});

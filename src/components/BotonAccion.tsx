import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario' | 'fantasma';
  deshabilitado?: boolean;
  compacto?: boolean;
  etiquetaAccesibilidad?: string;
}

export function BotonAccion({
  titulo,
  onPress,
  variante = 'principal',
  deshabilitado = false,
  compacto = false,
  etiquetaAccesibilidad,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesibilidad ?? titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compacto ? styles.compacto : styles.normal,
        variante === 'principal' && styles.principal,
        variante === 'secundario' && styles.secundario,
        variante === 'fantasma' && styles.fantasma,
        pressed && !deshabilitado && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}>
      <Text
        style={[
          styles.texto,
          variante === 'principal' ? styles.textoOscuro : styles.textoClaro,
          variante === 'fantasma' && styles.textoFantasma,
        ]}>
        {titulo}
      </Text>
      <View
        style={[
          styles.acento,
          variante === 'principal' ? styles.acentoOscuro : styles.acentoClaro,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.md,
    borderWidth: 2,
    borderRadius: radios.sm,
  },
  normal: {
    paddingVertical: espacios.md,
    paddingHorizontal: espacios.lg,
  },
  compacto: {
    paddingVertical: espacios.sm,
    paddingHorizontal: espacios.md,
  },
  principal: {
    backgroundColor: colores.verdePortal,
    borderColor: colores.verdePortal,
  },
  secundario: {
    backgroundColor: colores.cianEnergetico,
    borderColor: colores.cianEnergetico,
  },
  fantasma: {
    backgroundColor: 'transparent',
    borderColor: colores.bordeCian,
  },
  presionado: {
    opacity: 0.72,
  },
  deshabilitado: {
    opacity: 0.42,
  },
  texto: {
    fontSize: tipografia.pequeno,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  textoOscuro: {
    color: colores.espacioProfundo,
  },
  textoClaro: {
    color: colores.espacioProfundo,
  },
  textoFantasma: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
  },
  acento: {
    width: 18,
    height: 2,
  },
  acentoOscuro: {
    backgroundColor: colores.espacioProfundo,
  },
  acentoClaro: {
    backgroundColor: colores.espacioProfundo,
  },
});


import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colores, espacios, fuentes, tipografia } from '@/constants/theme';
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

const acentos = [
  colores.cianEnergetico,
  colores.magentaCosmico,
  colores.verdePortal,
  colores.violetaElectrico,
] as const;

export function TarjetaPersonaje({
  personaje,
  onPress,
  variante = 'cuadricula',
  composicion = 'normal',
}: Props) {
  const { width } = useWindowDimensions();
  const estado = datosEstado(personaje.status);
  const muestra = variante === 'muestra';
  const compacto = width < 600;
  const acento = acentos[personaje.id % acentos.length];
  const origen = personaje.origin.name;
  const ubicacion = personaje.location.name;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${personaje.name}, ${estado.etiqueta}, ${personaje.species}, origen ${origen}. Abrir ficha.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tarjeta,
        muestra && styles.tarjetaMuestra,
        pressed && styles.presionada,
      ]}>
      {/* Cabecera técnica del expediente */}
      <View style={styles.cabecera}>
        <View style={styles.codigoBloque}>
          <Text style={styles.codigoEtiqueta}>EXPEDIENTE</Text>
          <Text style={[styles.codigoNumero, { color: acento }]}>
            #{String(personaje.id).padStart(3, '0')}
          </Text>
        </View>

        <View style={[styles.estado, { borderColor: estado.color }]}>
          <View style={[styles.puntoEstado, { backgroundColor: estado.color }]} />
          <Text style={[styles.estadoTexto, { color: estado.color }]}>
            {estado.etiqueta}
          </Text>
        </View>

        <View style={[styles.marcaCabecera, { backgroundColor: acento }]} />
      </View>

      {/* Retrato dominante */}
      <View style={[styles.escenario, { borderColor: acento }]}>
        <View style={styles.frangaVertical} />

        <View style={styles.imagenContenedor}>
          <Image
            source={{ uri: personaje.image }}
            style={[
              styles.imagen,
              composicion === 'vertical' && styles.imagenVertical,
            ]}
            contentFit="cover"
            accessibilityLabel={`Retrato de ${personaje.name}`}
          />
        </View>

        {/* Información integrada en el borde inferior del retrato */}
        <View style={styles.selloImagen}>
          <Text style={styles.selloTexto}>SUJETO</Text>
          <Text style={[styles.selloNumero, { color: acento }]}>
            {String(personaje.id).padStart(3, '0')}
          </Text>
        </View>
      </View>

      {/* Nombre con jerarquía editorial */}
      <View style={styles.bloqueNombre}>
        <View style={[styles.indiceNombre, { backgroundColor: acento }]}>
          <Text style={styles.indiceTexto}>ID</Text>
        </View>

        <View style={styles.nombreContenido}>
          <Text style={styles.nombreEtiqueta}>IDENTIDAD REGISTRADA</Text>
          <Text style={styles.nombre} numberOfLines={2}>
            {personaje.name}
          </Text>
        </View>

        <View style={styles.simboloNombre}>
          <View style={[styles.simboloDiagonal, { backgroundColor: acento }]} />
          <View style={[styles.simboloDiagonal, { backgroundColor: acento }]} />
        </View>
      </View>

      {/* Paneles independientes de información */}
      <View style={styles.paneles}>
        <View style={[styles.panel, styles.panelEspecie]}>
          <View style={styles.panelCabecera}>
            <Text style={styles.panelEtiqueta}>01 / ESPECIE</Text>
            <View style={[styles.panelPunto, { backgroundColor: acento }]} />
          </View>
          <Text style={styles.panelValor} numberOfLines={2}>
            {personaje.species}
          </Text>
        </View>

        <View style={[styles.panel, styles.panelOrigen]}>
          <View style={styles.panelCabecera}>
            <Text style={styles.panelEtiqueta}>02 / ORIGEN</Text>
            <View style={[styles.panelPunto, { backgroundColor: colores.magentaCosmico }]} />
          </View>
          <Text style={styles.panelValor} numberOfLines={2}>
            {origen}
          </Text>
        </View>
      </View>

      {/* Registro complementario */}
      <View style={styles.registro}>
        <View style={styles.registroTexto}>
          <Text style={styles.registroEtiqueta}>ÚLTIMA UBICACIÓN CONOCIDA</Text>
          <Text style={styles.registroValor} numberOfLines={1}>
            {ubicacion}
          </Text>
        </View>

        <View style={[styles.acceso, { backgroundColor: acento }]}>
          <Text style={styles.accesoTexto}>↗</Text>
        </View>
      </View>

      {/* Pie técnico */}
      <View style={styles.pie}>
        <Text style={styles.pieTexto}>CATÁLOGO INTERDIMENSIONAL</Text>
        <View style={styles.pieMarcas}>
          <View style={[styles.pieMarca, { backgroundColor: acento }]} />
          <View style={[styles.pieMarca, { backgroundColor: acento }]} />
          <View style={[styles.pieMarca, { backgroundColor: acento }]} />
          <View style={styles.pieMarcaInactiva} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    overflow: 'hidden',
    padding: espacios.sm,
    gap: espacios.sm,
  },

  tarjetaMuestra: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: 210,
  },

  presionada: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  cabecera: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSutil,
    paddingBottom: espacios.sm,
  },

  codigoBloque: {
    flex: 1,
    gap: 2,
  },

  codigoEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '700',
  },

  codigoNumero: {
    fontFamily: fuentes.mono,
    fontSize: tipografia.nombreTarjeta,
    fontWeight: '900',
  },

  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    borderWidth: 1,
    paddingHorizontal: espacios.xs,
    paddingVertical: 5,
  },

  puntoEstado: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },

  estadoTexto: {
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
  },

  marcaCabecera: {
    width: 5,
    height: 28,
    transform: [{ skewY: '-15deg' }],
  },

  escenario: {
    height: 224,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colores.espacioProfundo,
    borderWidth: 1,
    borderBottomWidth: 4,
  },

  imagenContenedor: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 13,
    overflow: 'hidden',
  },

  imagen: {
    width: '100%',
    height: '100%',
  },

  imagenVertical: {
    transform: [{ scale: 1.08 }],
  },

  frangaVertical: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: colores.portalVioleta,
  },

  selloImagen: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.xs,
    backgroundColor: colores.espacioProfundo,
    borderRightWidth: 3,
    borderRightColor: colores.verdePortal,
  },

  selloTexto: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
  },

  selloNumero: {
    fontFamily: fuentes.mono,
    fontSize: tipografia.pequeno,
    fontWeight: '900',
  },

  bloqueNombre: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espacios.sm,
    minHeight: 66,
  },

  indiceNombre: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indiceTexto: {
    color: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    transform: [{ rotate: '-90deg' }],
  },

  nombreContenido: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },

  nombreEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '700',
  },

  nombre: {
    color: colores.blancoCosmico,
    fontSize: tipografia.nombreTarjeta,
    fontWeight: '900',
    lineHeight: 22,
  },

  simboloNombre: {
    width: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  simboloDiagonal: {
    width: 13,
    height: 3,
    transform: [{ rotate: '-45deg' }],
  },

  paneles: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espacios.sm,
  },

  panel: {
    flex: 1,
    minWidth: 0,
    minHeight: 72,
    padding: espacios.sm,
    gap: espacios.sm,
    borderTopWidth: 2,
  },

  panelEspecie: {
    backgroundColor: colores.espacioProfundo,
    borderTopColor: colores.verdePortal,
    borderRightWidth: 1,
    borderRightColor: colores.bordeSutil,
  },

  panelOrigen: {
    backgroundColor: colores.nebulosaOscura,
    borderTopColor: colores.magentaCosmico,
    borderLeftWidth: 1,
    borderLeftColor: colores.bordeSutil,
  },

  panelCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },

  panelEtiqueta: {
    flexShrink: 1,
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '700',
  },

  panelPunto: {
    width: 5,
    height: 5,
  },

  panelValor: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    fontWeight: '800',
    lineHeight: 17,
  },

  registro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.sm,
    paddingTop: espacios.sm,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
  },

  registroTexto: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  registroEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '700',
  },

  registroValor: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
  },

  acceso: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  accesoTexto: {
    color: colores.espacioProfundo,
    fontSize: 22,
    fontWeight: '900',
  },

  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.xs,
    paddingTop: espacios.xs,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
  },

  pieTexto: {
    flexShrink: 1,
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 8,
    fontWeight: '700',
  },

  pieMarcas: {
    flexDirection: 'row',
    gap: 3,
  },

  pieMarca: {
    width: 4,
    height: 9,
  },

  pieMarcaInactiva: {
    width: 4,
    height: 9,
    backgroundColor: colores.bordeSutil,
  },
});

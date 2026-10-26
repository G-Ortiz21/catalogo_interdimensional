import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { TarjetaPersonaje } from '@/components/TarjetaPersonaje';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { usePersonajes } from '@/hooks/usePersonajes';
import { mensajeDeError } from '@/lib/errores';

export default function InicioScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, isPending, isError, error, refetch, isFetching } = usePersonajes(1);
  const muestras = data?.results.slice(0, 4) ?? [];

  return (
    <View style={styles.raiz}>
      <SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.contenido}
          showsVerticalScrollIndicator={false}>
          <View style={styles.barraSuperior}>
            <Text style={styles.codigo}>ARCHIVO // C-137</Text>
            <View style={styles.chip}>
              <View style={styles.punto} />
              <Text style={styles.chipTexto}>API PÚBLICA</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.portalStage}>
              <View pointerEvents="none" style={styles.reticula}>
                <View style={styles.lineaHorizontal} />
                <View style={styles.lineaVertical} />
                <View style={styles.cruz} />
              </View>
              <View pointerEvents="none" style={styles.decoracion}>
                <View style={styles.orbitaExterior} />
                <View style={styles.orbitaMedia} />
                <View style={styles.orbitaInterior} />
                <View style={styles.anilloEnergia} />
                <View style={styles.nucleo} />
              </View>
              <View style={styles.etiquetaPortal}>
                <Text style={styles.etiquetaPortalTexto}>PORTAL DE ACCESO</Text>
                <Text style={styles.etiquetaPortalDato}>
                  {data ? `${data.info.count} SEÑALES` : isFetching ? 'BUSCANDO' : 'EN ESPERA'}
                </Text>
              </View>
              <Text style={styles.coordenada}>C-137 // EJE 01</Text>
            </View>

            <Text style={styles.kicker}>COORDENADAS DESCONOCIDAS · DIMENSIÓN VARIABLE</Text>
            <Text style={[styles.titulo, width < 360 && styles.tituloCompacto]}>
              CATÁLOGO{'\n'}
              <Text style={styles.tituloAcento}>
                INTER{'\n'}DIMENSIONAL
              </Text>
            </Text>
            <View style={styles.regla} />
            <Text style={styles.descripcion}>
              Un registro de personajes recuperados de todas las realidades. Consulta el archivo,
              abre una ficha y sigue las coordenadas.
            </Text>

            <BotonAccion
              titulo="EXPLORAR PERSONAJES"
              etiquetaAccesibilidad="Explorar el listado de personajes"
              onPress={() => router.push('/explore')}
            />
            <BotonAccion
              titulo="ABRIR BITÁCORA"
              etiquetaAccesibilidad="Abrir la bitácora de exploración"
              variante="secundario"
              onPress={() => router.push('/bitacora')}
            />
          </View>

          <View style={styles.lectura}>
            <Text style={styles.lecturaEtiqueta}>SEÑAL DETECTADA</Text>
            <Text style={styles.lecturaValor}>
              {data ? `${data.info.count} PERSONAJES` : isFetching ? 'SINCRONIZANDO' : 'EN ESPERA'}
            </Text>
            <Text style={styles.lecturaNota}>
              {data
                ? `${data.info.pages} páginas disponibles en la API pública.`
                : 'La caché local se conserva durante 24 horas.'}
            </Text>
          </View>

          <View style={styles.seccion}>
            <View style={styles.cabeceraSeccion}>
              <Text style={styles.seccionTitulo}>MUESTRAS DEL ARCHIVO</Text>
              <Text style={styles.seccionMeta}>
                {isFetching && data ? 'ACTUALIZANDO' : 'PÁGINA 01'}
              </Text>
            </View>

            {isPending ? (
              <EstadoPantalla
                tipo="cargando"
                titulo="ABRIENDO EL PORTAL"
                mensaje="Recuperando las primeras muestras del archivo."
              />
            ) : isError && !data ? (
              <EstadoPantalla
                tipo="error"
                titulo="SEÑAL INTERRUMPIDA"
                mensaje={mensajeDeError(error)}
                textoAccion="REINTENTAR"
                onAccion={() => void refetch()}
              />
            ) : (
              <>
                {isError ? (
                  <EstadoPantalla
                    tipo="error"
                    titulo="NO SE PUDO ACTUALIZAR"
                    mensaje={`${mensajeDeError(error)} Se conservan los datos disponibles en caché.`}
                    textoAccion="REINTENTAR"
                    onAccion={() => void refetch()}
                  />
                ) : null}
                {muestras.length === 0 ? (
                  <EstadoPantalla
                    tipo="vacio"
                    titulo="ARCHIVO VACÍO"
                    mensaje="La API no devolvió personajes para esta dimensión."
                    textoAccion="ACTUALIZAR"
                    onAccion={() => void refetch()}
                  />
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filaMuestras}>
                    {muestras.map((personaje) => (
                      <TarjetaPersonaje
                        key={personaje.id}
                        personaje={personaje}
                        variante="muestra"
                        onPress={() =>
                          router.push({
                            pathname: '/personaje/[id]',
                            params: { id: String(personaje.id) },
                          })
                        }
                      />
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </View>

          <View style={styles.pie}>
            <Text style={styles.pieTexto}>FUENTE: RICK AND MORTY API</Text>
            <Text style={styles.pieTexto}>SOLO LECTURA · CACHÉ PERSISTENTE</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: colores.espacioProfundo,
  },
  areaSegura: {
    flex: 1,
  },
  contenido: {
    paddingHorizontal: espacios.lg,
    paddingBottom: espacios.xxxl + espacios.xl,
    gap: espacios.xl,
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: espacios.md,
  },
  codigo: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    letterSpacing: 0,
    fontWeight: '700',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs + 2,
    paddingHorizontal: espacios.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colores.bordeCian,
    borderRadius: radios.sm,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colores.cianEnergetico,
  },
  chipTexto: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    gap: espacios.md,
    padding: espacios.xl,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderTopWidth: 5,
    borderTopColor: colores.magentaCosmico,
    borderRadius: radios.sm,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  portalStage: {
    height: 194,
    marginBottom: espacios.xs,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colores.espacioProfundo,
    borderWidth: 1,
    borderColor: colores.bordeCian,
  },
  reticula: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineaHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colores.bordeSeparador,
  },
  lineaVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colores.bordeSeparador,
  },
  cruz: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: colores.cianEnergetico,
    transform: [{ rotate: '45deg' }],
  },
  decoracion: {
    position: 'absolute',
    right: 16,
    top: -8,
    width: 210,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitaExterior: {
    position: 'absolute',
    width: 188,
    height: 148,
    borderRadius: 94,
    borderWidth: 2,
    borderColor: colores.magentaCosmico,
    transform: [{ rotate: '-24deg' }],
  },
  orbitaMedia: {
    position: 'absolute',
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 2,
    borderColor: colores.cianEnergetico,
    transform: [{ rotate: '28deg' }],
  },
  orbitaInterior: {
    position: 'absolute',
    width: 100,
    height: 126,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: colores.portalVioleta,
    backgroundColor: colores.violetaElectrico,
    opacity: 0.78,
    transform: [{ rotate: '-18deg' }],
  },
  anilloEnergia: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colores.verdePortal,
    backgroundColor: colores.espacioProfundo,
  },
  nucleo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colores.verdePortal,
  },
  etiquetaPortal: {
    zIndex: 1,
    alignSelf: 'flex-start',
    gap: 2,
    margin: espacios.sm,
    paddingVertical: espacios.xs,
    paddingHorizontal: espacios.sm,
    backgroundColor: colores.nebulosaOscura,
    borderLeftWidth: 3,
    borderLeftColor: colores.verdePortal,
  },
  etiquetaPortalTexto: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
  },
  etiquetaPortalDato: {
    color: colores.blancoCosmico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
  },
  coordenada: {
    position: 'absolute',
    top: espacios.sm,
    left: espacios.sm,
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
  },
  kicker: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    fontWeight: '700',
    maxWidth: '78%',
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.display,
    fontWeight: '900',
    letterSpacing: 0,
    maxWidth: '100%',
    lineHeight: 39,
  },
  tituloCompacto: {
    fontSize: tipografia.displayCompacto,
    lineHeight: 30,
  },
  tituloAcento: {
    color: colores.verdePortal,
  },
  regla: {
    height: 3,
    width: 88,
    backgroundColor: colores.magentaCosmico,
    marginVertical: espacios.xs,
  },
  descripcion: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
    lineHeight: 24,
    maxWidth: '94%',
    marginBottom: espacios.xs,
  },
  lectura: {
    gap: espacios.xs,
    paddingVertical: espacios.md,
    paddingHorizontal: espacios.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colores.bordeSutil,
  },
  lecturaEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    fontWeight: '900',
  },
  lecturaValor: {
    color: colores.blancoCosmico,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
    letterSpacing: 0,
  },
  lecturaNota: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
    lineHeight: 19,
  },
  seccion: {
    gap: espacios.md,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  cabeceraSeccion: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: espacios.md,
  },
  seccionTitulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    fontWeight: '900',
    letterSpacing: 0,
  },
  seccionMeta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
  },
  filaMuestras: {
    gap: espacios.md,
    paddingRight: espacios.lg,
  },
  pie: {
    gap: espacios.xs,
    paddingTop: espacios.lg,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
  },
  pieTexto: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    opacity: 0.8,
  },
});

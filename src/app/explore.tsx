import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { TarjetaPersonaje } from '@/components/TarjetaPersonaje';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { usePersonajes } from '@/hooks/usePersonajes';
import { mensajeDeError } from '@/lib/errores';
import type { Personaje } from '@/types/personaje';

export default function ExplorarScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [pagina, setPagina] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [nombre, setNombre] = useState('');
  const listaRef = useRef<FlatList<Personaje>>(null);

  const {
    data,
    isPending,
    isError,
    isFetching,
    isRefetching,
    error,
    refetch,
  } = usePersonajes(pagina, nombre);

  const sinCoincidencias =
    Boolean(nombre) && isError && isAxiosError(error) && error.response?.status === 404;
  const totalPaginas = sinCoincidencias ? 0 : data?.info.pages ?? 0;
  const totalPersonajes = sinCoincidencias ? 0 : data?.info.count ?? '—';
  const puedeAtras = pagina > 1 && !isFetching;
  const puedeAvanzar = !sinCoincidencias && Boolean(data?.info.next) && !isFetching;

  useEffect(() => {
    listaRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [pagina]);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      const filtro = textoBusqueda.trim();
      setPagina(1);
      setNombre(filtro);
    }, 350);

    return () => clearTimeout(temporizador);
  }, [textoBusqueda]);

  const volver = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda('');
    setNombre('');
    setPagina(1);
  };

  return (
    <View style={styles.raiz}>
      <SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
        <View style={styles.cabecera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
            onPress={volver}
            hitSlop={12}
            style={({ pressed }) => [styles.volver, pressed && styles.presionado]}>
            <Text style={styles.volverTexto}>← VOLVER</Text>
          </Pressable>

          <View style={styles.cabeceraCentro}>
            <Text style={styles.codigo}>ARCHIVO DE PERSONAJES</Text>
            <Text style={[styles.titulo, width < 360 && styles.tituloCompacto]}>
              PERSONAJES
            </Text>
          </View>

          <View style={styles.contador}>
            <Text style={styles.contadorValor}>{totalPersonajes}</Text>
            <Text style={styles.contadorEtiqueta}>REGISTROS</Text>
          </View>
        </View>

        <View style={styles.subbarra}>
          <Text style={styles.subbarraTexto}>
            {isFetching
              ? 'SINCRONIZANDO CON LA API PÚBLICA'
              : 'FUENTE: RICK AND MORTY API · SOLO LECTURA'}
          </Text>
          {isFetching ? <ActivityIndicator color={colores.cianEnergetico} size="small" /> : null}
        </View>

        <View style={styles.bandaArchivo}>
          <View style={styles.bandaIndice}>
            <Text style={styles.bandaNumero}>01</Text>
            <Text style={styles.bandaRotulo}>ARCHIVO</Text>
          </View>
          <View style={styles.bandaContenido}>
            <Text style={styles.bandaTitulo}>ENTIDADES LOCALIZADAS</Text>
            <Text style={styles.bandaDetalle}>
              {data
                ? `${data.info.count} registros · página ${pagina} de ${data.info.pages}`
                : 'Exploración de señales recibidas'}
            </Text>
          </View>
          <View pointerEvents="none" style={styles.bandaMarca}>
            <View style={styles.bandaMarcaInterior} />
          </View>
        </View>

        <View style={styles.busqueda}>
          <Text style={styles.busquedaEtiqueta}>LOCALIZAR POR NOMBRE</Text>
          <View style={styles.busquedaFila}>
            <TextInput
              accessibilityLabel="Buscar personajes por nombre"
              value={textoBusqueda}
              onChangeText={setTextoBusqueda}
              placeholder="Ej. Rick Sanchez"
              placeholderTextColor={colores.cremaEstelar}
              selectionColor={colores.cianEnergetico}
              returnKeyType="search"
              style={styles.campoBusqueda}
            />
            {textoBusqueda ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                onPress={limpiarBusqueda}
                style={({ pressed }) => [styles.limpiarBusqueda, pressed && styles.presionado]}>
                <Text style={styles.limpiarTexto}>×</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {isPending ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="cargando"
              titulo="LOCALIZANDO COORDENADAS"
              mensaje="Consultando el archivo de personajes."
            />
          </View>
        ) : isError && !data && !sinCoincidencias ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="error"
              titulo="NO SE PUDO ABRIR EL ARCHIVO"
              mensaje={mensajeDeError(error)}
              textoAccion="REINTENTAR"
              onAccion={() => void refetch()}
            />
          </View>
        ) : (
          <>
            {isError && data && !sinCoincidencias ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Error al actualizar. Tocar para reintentar."
                onPress={() => void refetch()}
                style={styles.avisoError}>
                <Text style={styles.avisoErrorTexto}>
                  No se pudo actualizar. Se muestran datos en caché. Toca para reintentar.
                </Text>
              </Pressable>
            ) : null}

            <FlatList
              ref={listaRef}
              data={sinCoincidencias ? [] : data?.results ?? []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item, index }) => (
                <View style={[styles.celda, index % 2 === 1 && styles.celdaDesplazada]}>
                  <TarjetaPersonaje
                    personaje={item}
                    composicion={index % 2 === 1 ? 'vertical' : 'normal'}
                    onPress={() =>
                      router.push({
                        pathname: '/personaje/[id]',
                        params: { id: String(item.id) },
                      })
                    }
                  />
                </View>
              )}
              numColumns={2}
              columnWrapperStyle={styles.fila}
              contentContainerStyle={styles.lista}
              showsVerticalScrollIndicator={false}
              refreshing={isRefetching && !isPending}
              onRefresh={() => void refetch()}
              ListEmptyComponent={
                <EstadoPantalla
                  tipo="vacio"
                  titulo={nombre ? 'SIN COINCIDENCIAS' : 'SIN RESULTADOS'}
                  mensaje={
                    nombre
                      ? `La API no encontró personajes para “${nombre}”.`
                      : 'La API no devolvió personajes para esta página.'
                  }
                  textoAccion={nombre ? 'LIMPIAR BÚSQUEDA' : 'ACTUALIZAR'}
                  onAccion={nombre ? limpiarBusqueda : () => void refetch()}
                />
              }
            />

            <View style={styles.paginacion}>
              <BotonAccion
                titulo={width < 360 ? '←' : '← ANTERIOR'}
                etiquetaAccesibilidad="Página anterior"
                variante="fantasma"
                compacto
                deshabilitado={!puedeAtras}
                onPress={() => setPagina((actual) => Math.max(1, actual - 1))}
              />

              <View style={styles.indicador}>
                <Text style={styles.indicadorValor}>
                  {String(pagina).padStart(2, '0')}
                  <Text style={styles.indicadorTotal}>
                    {' '}
                    / {totalPaginas ? String(totalPaginas).padStart(2, '0') : nombre ? '00' : '—'}
                  </Text>
                </Text>
                <Text style={styles.indicadorEtiqueta}>PÁGINA</Text>
              </View>

              <BotonAccion
                titulo={width < 360 ? '→' : 'SIGUIENTE →'}
                etiquetaAccesibilidad="Página siguiente"
                variante="fantasma"
                compacto
                deshabilitado={!puedeAvanzar}
                onPress={() => setPagina((actual) => actual + 1)}
              />
            </View>
          </>
        )}
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
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.md,
    paddingHorizontal: espacios.lg,
    paddingTop: espacios.md,
    paddingBottom: espacios.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSutil,
  },
  volver: {
    paddingVertical: espacios.xs,
  },
  volverTexto: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  presionado: {
    opacity: 0.65,
  },
  cabeceraCentro: {
    flex: 1,
    gap: 1,
  },
  codigo: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    opacity: 0.8,
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.titulo,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 33,
  },
  tituloCompacto: {
    fontSize: tipografia.subtitulo,
    lineHeight: 24,
  },
  contador: {
    alignItems: 'flex-end',
    paddingLeft: espacios.sm,
    borderLeftWidth: 1,
    borderLeftColor: colores.bordeSutil,
  },
  contadorValor: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: 16,
    fontWeight: '900',
  },
  contadorEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
  },
  subbarra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.sm,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.sm,
    backgroundColor: colores.nebulosaOscura,
  },
  subbarraTexto: {
    flex: 1,
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
  },
  bandaArchivo: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.md,
    marginHorizontal: espacios.lg,
    marginTop: espacios.md,
    padding: espacios.md,
    overflow: 'hidden',
    backgroundColor: colores.portalVioleta,
    borderLeftWidth: 5,
    borderLeftColor: colores.verdePortal,
    borderBottomWidth: 2,
    borderBottomColor: colores.magentaCosmico,
  },
  bandaIndice: {
    width: 62,
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.verdePortal,
    transform: [{ rotate: '-3deg' }],
  },
  bandaNumero: {
    color: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
  },
  bandaRotulo: {
    color: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
  },
  bandaContenido: {
    zIndex: 1,
    flex: 1,
    gap: espacios.xs,
  },
  bandaTitulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    fontWeight: '900',
  },
  bandaDetalle: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
    lineHeight: 18,
  },
  bandaMarca: {
    position: 'absolute',
    right: -22,
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colores.bordeCian,
    borderRadius: 54,
    transform: [{ rotate: '24deg' }],
  },
  bandaMarcaInterior: {
    width: 68,
    height: 68,
    borderWidth: 1,
    borderColor: colores.magentaCosmico,
    borderRadius: 34,
  },
  busqueda: {
    gap: espacios.xs,
    paddingHorizontal: espacios.lg,
    paddingTop: espacios.md,
  },
  busquedaEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  busquedaFila: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeCian,
    borderRadius: radios.sm,
  },
  campoBusqueda: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: espacios.md,
    paddingVertical: espacios.sm,
    color: colores.blancoCosmico,
    fontSize: tipografia.cuerpo,
  },
  limpiarBusqueda: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colores.bordeSutil,
  },
  limpiarTexto: {
    color: colores.cianEnergetico,
    fontSize: 25,
    lineHeight: 28,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    padding: espacios.lg,
  },
  avisoError: {
    marginHorizontal: espacios.lg,
    marginTop: espacios.md,
    padding: espacios.sm,
    backgroundColor: colores.portalVioleta,
    borderLeftWidth: 4,
    borderLeftColor: colores.alerta,
    borderRadius: radios.sm,
  },
  avisoErrorTexto: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    lineHeight: 18,
  },
  lista: {
    gap: espacios.md,
    padding: espacios.lg,
    paddingBottom: espacios.xl,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
  },
  fila: {
    gap: espacios.md,
  },
  celda: {
    flex: 1,
    minWidth: 0,
  },
  celdaDesplazada: {
    marginTop: espacios.lg,
  },
  paginacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.sm,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.md,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
    backgroundColor: colores.nebulosaOscura,
  },
  indicador: {
    alignItems: 'center',
    gap: 1,
  },
  indicadorValor: {
    color: colores.blancoCosmico,
    fontFamily: fuentes.mono,
    fontSize: 14,
    fontWeight: '900',
  },
  indicadorTotal: {
    color: colores.cremaEstelar,
    fontSize: 10,
  },
  indicadorEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
  },
});

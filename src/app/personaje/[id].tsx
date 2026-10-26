import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { usePersonaje } from '@/hooks/usePersonajes';
import { mensajeDeError } from '@/lib/errores';
import type { Personaje } from '@/types/personaje';

function normalizarId(valor: string | string[] | undefined): number | null {
  const texto = Array.isArray(valor) ? valor[0] : valor;
  if (!texto || !/^\d+$/.test(texto)) {
    return null;
  }
  const numero = Number(texto);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function estadoVisual(estado: Personaje['status']) {
  if (estado === 'Alive') {
    return { texto: 'VIVO', color: colores.verdePortal };
  }
  if (estado === 'Dead') {
    return { texto: 'MUERTO', color: colores.salmonExtraterrestre };
  }
  return { texto: 'DESCONOCIDO', color: colores.cremaEstelar };
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return 'SIN REGISTRO';
  }
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

function BloqueDato({
  etiqueta,
  valor,
  anchoCompleto = false,
}: {
  etiqueta: string;
  valor: string;
  anchoCompleto?: boolean;
}) {
  return (
    <View style={[styles.bloqueDato, anchoCompleto && styles.bloqueDatoCompleto]}>
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor || 'DESCONOCIDO'}</Text>
    </View>
  );
}

export default function DetallePersonajeScreen() {
  const router = useRouter();
  const parametros = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizarId(parametros.id);
  const { data, isPending, isError, error, refetch } = usePersonaje(id);
  const personajeNoEncontrado = isAxiosError(error) && error.response?.status === 404;

  const volver = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/explore');
  };

  return (
    <View style={styles.raiz}>
      <SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
        <View style={styles.cabecera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al archivo de personajes"
            onPress={volver}
            hitSlop={12}
            style={({ pressed }) => [styles.volver, pressed && styles.presionado]}>
            <Text style={styles.volverTexto}>← ARCHIVO</Text>
          </Pressable>
          <Text style={styles.codigoFicha}>
            FICHA // {id ? String(id).padStart(3, '0') : '???'}
          </Text>
        </View>

        {id === null ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="error"
              titulo="COORDENADA INVÁLIDA"
              mensaje="El identificador del personaje no es válido."
              textoAccion="VOLVER AL ARCHIVO"
              onAccion={() => router.replace('/explore')}
            />
          </View>
        ) : isPending ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="cargando"
              titulo="ABRIENDO FICHA"
              mensaje={`Recuperando el registro #${id}.`}
            />
          </View>
        ) : isError ? (
          data ? (
            <Ficha
              personaje={data}
              onVolver={() => router.replace('/explore')}
              mensajeError={mensajeDeError(error)}
              onReintentar={() => void refetch()}
            />
          ) : (
            <View style={styles.centro}>
              <EstadoPantalla
                tipo={personajeNoEncontrado ? 'vacio' : 'error'}
                titulo={personajeNoEncontrado ? 'PERSONAJE NO ENCONTRADO' : 'FICHA NO DISPONIBLE'}
                mensaje={
                  personajeNoEncontrado
                    ? `La API no encontró un personaje con el identificador ${id}.`
                    : mensajeDeError(error)
                }
                textoAccion={personajeNoEncontrado ? 'VOLVER A EXPLORAR' : 'REINTENTAR'}
                onAccion={() =>
                  personajeNoEncontrado ? router.replace('/explore') : void refetch()
                }
              />
            </View>
          )
        ) : (
          <Ficha
            personaje={data}
            onVolver={() => router.replace('/explore')}
            onReintentar={() => void refetch()}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function Ficha({
  personaje,
  onVolver,
  mensajeError,
  onReintentar,
}: {
  personaje: Personaje;
  onVolver: () => void;
  mensajeError?: string;
  onReintentar: () => void;
}) {
  const estado = estadoVisual(personaje.status);

  return (
    <ScrollView
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}>
      {mensajeError ? (
        <EstadoPantalla
          tipo="error"
          titulo="NO SE PUDO ACTUALIZAR"
          mensaje={`${mensajeError} Se conserva la ficha disponible en caché.`}
          textoAccion="REINTENTAR"
          onAccion={onReintentar}
        />
      ) : null}
      <View style={styles.hero}>
        <View style={styles.marcoImagen}>
          <Image
            source={{ uri: personaje.image }}
            style={styles.imagen}
            contentFit="cover"
            accessibilityLabel={`Retrato de ${personaje.name}`}
          />
          <View style={[styles.estado, { borderColor: estado.color }]}>
            <View style={[styles.puntoEstado, { backgroundColor: estado.color }]} />
            <Text style={[styles.estadoTexto, { color: estado.color }]}>{estado.texto}</Text>
          </View>
        </View>

        <View style={styles.identidad}>
          <Text style={styles.etiqueta}>REGISTRO #{String(personaje.id).padStart(3, '0')}</Text>
          <Text style={styles.nombre}>{personaje.name}</Text>
          <Text style={styles.especie}>
            {personaje.species}
            {personaje.type ? ` · ${personaje.type}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.panelCabecera}>
          <View>
            <Text style={styles.panelSobrelinea}>DATOS RECUPERADOS</Text>
            <Text style={styles.panelTitulo}>EXPEDIENTE</Text>
          </View>
          <Text style={styles.panelIndice}>05 CAMPOS</Text>
        </View>
        <View style={styles.matrizDatos}>
          <BloqueDato etiqueta="GÉNERO" valor={personaje.gender} />
          <BloqueDato etiqueta="EPISODIOS" valor={String(personaje.episode.length)} />
          <BloqueDato etiqueta="ORIGEN" valor={personaje.origin.name} anchoCompleto />
          <BloqueDato
            etiqueta="UBICACIÓN ACTUAL"
            valor={personaje.location.name}
            anchoCompleto
          />
          <BloqueDato
            etiqueta="PRIMER REGISTRO"
            valor={formatearFecha(personaje.created)}
            anchoCompleto
          />
        </View>
      </View>

      <View style={styles.nota}>
        <Text style={styles.notaEtiqueta}>NOTA DEL ARCHIVO</Text>
        <Text style={styles.notaTexto}>
          Los datos de esta ficha provienen de la API pública de Rick and Morty y se conservan en
          caché para consultas posteriores.
        </Text>
      </View>

      <BotonAccion
        titulo="← VOLVER AL ARCHIVO"
        variante="fantasma"
        onPress={onVolver}
        etiquetaAccesibilidad="Volver al listado de personajes"
      />
    </ScrollView>
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
    justifyContent: 'space-between',
    gap: espacios.md,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSutil,
  },
  volver: {
    paddingVertical: espacios.xs,
  },
  volverTexto: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
  },
  presionado: {
    opacity: 0.65,
  },
  codigoFicha: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    padding: espacios.lg,
  },
  contenido: {
    padding: espacios.lg,
    paddingBottom: espacios.xxxl + espacios.xl,
    gap: espacios.lg,
  },
  hero: {
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderTopWidth: 4,
    borderTopColor: colores.verdePortal,
    backgroundColor: colores.nebulosaOscura,
    borderRadius: radios.sm,
    overflow: 'hidden',
  },
  marcoImagen: {
    position: 'relative',
    backgroundColor: colores.portalVioleta,
  },
  imagen: {
    width: '100%',
    aspectRatio: 1.15,
  },
  estado: {
    position: 'absolute',
    left: espacios.md,
    bottom: espacios.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs,
    paddingHorizontal: espacios.sm,
    paddingVertical: 4,
    borderWidth: 1,
    backgroundColor: colores.espacioProfundo,
    borderRadius: radios.sm,
  },
  puntoEstado: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  estadoTexto: {
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
    letterSpacing: 0,
  },
  identidad: {
    padding: espacios.lg,
    gap: espacios.xs,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
    borderLeftWidth: 5,
    borderLeftColor: colores.verdePortal,
  },
  etiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    fontWeight: '700',
  },
  nombre: {
    color: colores.blancoCosmico,
    fontSize: tipografia.nombreDetalle,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: 0,
  },
  especie: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
  },
  panel: {
    gap: espacios.md,
    padding: espacios.lg,
    backgroundColor: colores.portalVioleta,
    borderWidth: 1,
    borderColor: colores.violetaElectrico,
    borderRadius: radios.sm,
  },
  panelCabecera: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: espacios.sm,
    paddingBottom: espacios.sm,
    borderBottomWidth: 2,
    borderBottomColor: colores.magentaCosmico,
  },
  panelSobrelinea: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
  },
  panelTitulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
  },
  panelIndice: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    fontWeight: '900',
  },
  matrizDatos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacios.sm,
  },
  bloqueDato: {
    flexGrow: 1,
    flexBasis: 132,
    minWidth: 0,
    minHeight: 78,
    justifyContent: 'space-between',
    gap: espacios.sm,
    padding: espacios.md,
    backgroundColor: colores.espacioProfundo,
    borderLeftWidth: 3,
    borderLeftColor: colores.cianEnergetico,
  },
  bloqueDatoCompleto: {
    flexBasis: '100%',
    borderLeftColor: colores.verdePortal,
  },
  datoEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
  },
  datoValor: {
    color: colores.blancoCosmico,
    fontSize: tipografia.cuerpo,
    fontWeight: '700',
    lineHeight: 21,
  },
  nota: {
    padding: espacios.lg,
    backgroundColor: colores.portalVioleta,
    borderRadius: radios.sm,
    gap: espacios.xs,
  },
  notaEtiqueta: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: tipografia.tecnica,
    letterSpacing: 0,
    fontWeight: '900',
  },
  notaTexto: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    lineHeight: 20,
  },
});

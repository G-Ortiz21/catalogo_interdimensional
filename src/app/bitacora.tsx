import { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { LogPanel } from '@/components/LogPanel';
import { SelloPendiente } from '@/components/SelloPendiente';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { useActualizarNota, useCrearNota, useNotas } from '@/hooks/useNotas';
import { mensajeDeError } from '@/lib/errores';
import type { DatosNota, Nota } from '@/types/nota';

interface FormularioNota {
	titulo: string;
	contenido: string;
	categoria: string;
	personajeId: string;
}

const FORMULARIO_VACIO: FormularioNota = {
	titulo: '',
	contenido: '',
	categoria: '',
	personajeId: '',
};

interface PropsCampo {
	etiqueta: string;
	valor: string;
	onChangeText: (valor: string) => void;
	multilinea?: boolean;
	ayuda?: string;
}

function CampoTexto({ etiqueta, valor, onChangeText, multilinea = false, ayuda }: PropsCampo) {
	return (
		<View style={styles.grupoCampo}>
			<View style={styles.etiquetaFila}>
				<View style={styles.puntoActivo} />
				<Text style={styles.etiquetaCampo}>{etiqueta}</Text>
				<Text style={styles.codigoCampo}>INPUT_0{etiqueta === 'TÍTULO' ? '1' : etiqueta === 'CONTENIDO' ? '2' : etiqueta === 'CATEGORÍA' ? '3' : '4'}</Text>
			</View>
			<View style={[styles.marcoCampo, multilinea && styles.marcoCampoGrande]}>
				<View style={styles.esquinaCampoTL} />
				<TextInput
					accessibilityLabel={etiqueta}
					value={valor}
					onChangeText={onChangeText}
					multiline={multilinea}
					placeholder={ayuda}
					placeholderTextColor={colores.cremaEstelar}
					selectionColor={colores.cianEnergetico}
					textAlignVertical={multilinea ? 'top' : 'center'}
					style={[styles.campo, multilinea && styles.campoMultilinea]}
				/>
				<View style={styles.esquinaCampoBR} />
			</View>
		</View>
	);
}

function fechaDeCreacion(createdAt: number): string {
	if (!Number.isFinite(createdAt)) return 'Fecha no disponible';
	return new Intl.DateTimeFormat('es', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(createdAt * 1000));
}

export default function BitacoraScreen() {
	const router = useRouter();
	const { data: notas, isPending, isError, isFetching, error, refetch } = useNotas();
	const crearNota = useCrearNota();
	const actualizarNota = useActualizarNota();
	const [formulario, setFormulario] = useState<FormularioNota>(FORMULARIO_VACIO);
	const [notaEditando, setNotaEditando] = useState<Nota | null>(null);
	const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
	const guardando = crearNota.isPending || actualizarNota.isPending;
	const mutacionPausada = crearNota.isPaused || actualizarNota.isPaused;

	const volver = () => {
		if (router.canGoBack()) {
			router.back();
			return;
		}
		router.replace('/');
	};

	const cambiarCampo = (campo: keyof FormularioNota, valor: string) => {
		setFormulario((actual) => ({ ...actual, [campo]: valor }));
		setMensaje(null);
	};

	const limpiarFormulario = () => {
		setFormulario(FORMULARIO_VACIO);
		setNotaEditando(null);
	};

	const seleccionarParaEditar = (nota: Nota) => {
		setNotaEditando(nota);
		setFormulario({
			titulo: nota.titulo,
			contenido: nota.contenido,
			categoria: nota.categoria,
			personajeId: nota.personajeId,
		});
		setMensaje(null);
	};

	const guardar = () => {
		const titulo = formulario.titulo.trim();
		const contenido = formulario.contenido.trim();
		const categoria = formulario.categoria.trim();
		const personajeId = formulario.personajeId.trim();

		if (!titulo || !contenido || !categoria || !personajeId) {
			setMensaje({ tipo: 'error', texto: 'Completa todos los campos antes de guardar.' });
			return;
		}

		const datos: DatosNota = {
			titulo,
			contenido,
			categoria,
			personajeId,
			createdAt: notaEditando?.createdAt ?? Math.floor(Date.now() / 1000),
		};

		if (notaEditando) {
			actualizarNota.mutate(
				{ id: notaEditando.id, datos },
				{
					onSuccess: (nota) => {
						limpiarFormulario();
						setMensaje({ tipo: 'exito', texto: `Registro ${nota.id} actualizado.` });
					},
					onError: (errorDeGuardado) => {
						setMensaje({ tipo: 'error', texto: mensajeDeError(errorDeGuardado) });
					},
				},
			);
			return;
		}

		crearNota.mutate(datos, {
			onSuccess: (nota) => {
				limpiarFormulario();
				setMensaje({ tipo: 'exito', texto: `Registro ${nota.id} creado.` });
			},
			onError: (errorDeGuardado) => {
				setMensaje({ tipo: 'error', texto: mensajeDeError(errorDeGuardado) });
			},
		});
	};
	return (
		<View style={styles.raiz}>
			<View pointerEvents="none" style={styles.fondoDecorativo}>
				<View style={styles.lineaFondoUno} />
				<View style={styles.lineaFondoDos} />
				<View style={styles.orbeFondo} />
			</View>
			<SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
				<KeyboardAvoidingView style={styles.teclado} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
						<View style={styles.cabecera}>
							<Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={volver} hitSlop={12} style={({ pressed }) => [styles.volver, pressed && styles.presionado]}>
								<Text style={styles.volverTexto}>‹ VOLVER</Text>
							</Pressable>
							<View style={styles.cabeceraCentro}>
								<Text style={styles.codigo}>DIMENSIONAL ARCHIVE / SYS.04</Text>
								<Text style={styles.titulo}>BITÁCORA</Text>
								<View style={styles.subtituloLinea}><View style={styles.lineaCian} /><Text style={styles.subtitulo}>CENTRO DE EXPLORACIÓN</Text></View>
							</View>
							<View style={styles.contadorMarco}><Text style={styles.contadorEtiqueta}>LOGS</Text><Text style={styles.contador}>{notas?.length ?? '—'}</Text><View style={styles.contadorBarra} /></View>
						</View>

						<View style={styles.estadoBarra}>
							<View style={styles.estadoIndicador}><View style={[styles.estadoPunto, isFetching && styles.estadoPuntoActivo]} /><Text style={styles.estadoTexto}>{isFetching ? 'SINCRONIZANDO DATOS' : 'SISTEMA DE REGISTROS ACTIVO'}</Text></View>
							<View style={styles.accionesCabecera}>
								<SelloPendiente />
								<Pressable accessibilityRole="button" accessibilityLabel="Actualizar registros" disabled={isFetching} onPress={() => void refetch()} style={({ pressed }) => [styles.recargar, pressed && styles.presionado]}>
									<Text style={styles.recargarTexto}>{isFetching ? '···' : '↻ SYNC'}</Text>
								</Pressable>
							</View>
						</View>

						<View style={styles.formularioMarco}>
							<View style={styles.formularioPanel}>
								<View style={styles.panelEsquinaSup} />
								<View style={styles.panelCabecera}>
									<View style={styles.numeroSeccion}><Text style={styles.numeroSeccionTexto}>{notaEditando ? '02' : '01'}</Text></View>
									<View style={styles.tituloBloque}><Text style={styles.miniEtiqueta}>MODULE / DATA ENTRY</Text><Text style={styles.tituloFormulario}>{notaEditando ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</Text></View>
									<View style={styles.estadoModulo}><View style={styles.estadoModuloPunto} /><Text style={styles.estadoModuloTexto}>LIVE</Text></View>
								</View>
								<View style={styles.divisorNeon} />
								{notaEditando ? <Text style={styles.idSeleccionado}>// ID CONSERVADO: {notaEditando.id}</Text> : null}
								<CampoTexto etiqueta="TÍTULO" valor={formulario.titulo} onChangeText={(valor) => cambiarCampo('titulo', valor)} ayuda="Nombre del registro" />
								<CampoTexto etiqueta="CONTENIDO" valor={formulario.contenido} onChangeText={(valor) => cambiarCampo('contenido', valor)} multilinea ayuda="Describe el hallazgo..." />
								<View style={styles.filaCampos}>
									<View style={styles.campoFlexible}><CampoTexto etiqueta="CATEGORÍA" valor={formulario.categoria} onChangeText={(valor) => cambiarCampo('categoria', valor)} ayuda="Categoría" /></View>
									<View style={styles.campoFlexible}><CampoTexto etiqueta="ID DEL PERSONAJE" valor={formulario.personajeId} onChangeText={(valor) => cambiarCampo('personajeId', valor)} ayuda="ID como texto" /></View>
								</View>
								{mensaje ? <View accessibilityRole={mensaje.tipo === 'error' ? 'alert' : 'text'} style={[styles.mensaje, mensaje.tipo === 'error' ? styles.mensajeError : styles.mensajeExito]}><View style={styles.mensajeBarra} /><Text style={styles.mensajeTexto}>{mensaje.tipo === 'error' ? 'ERROR // ' : 'SISTEMA // '}{mensaje.texto}</Text></View> : null}
								<View style={styles.accionesFormulario}>
									<View style={styles.botonPrincipalMarco}><BotonAccion titulo={mutacionPausada ? 'PENDIENTE SIN CONEXIÓN' : guardando ? 'GUARDANDO…' : notaEditando ? 'GUARDAR CAMBIOS  ↗' : 'CREAR REGISTRO  ↗'} onPress={guardar} deshabilitado={guardando} /></View>
									{notaEditando ? <BotonAccion titulo="CANCELAR EDICIÓN" onPress={limpiarFormulario} variante="fantasma" compacto /> : null}
								</View>
								<View style={styles.panelEsquinaInf} />
							</View>
						</View>

						<View style={styles.listaSeccion}>
							<View style={styles.cabeceraLista}><View><Text style={styles.miniEtiqueta}>DATABASE / RECOVERED FILES</Text><Text style={styles.tituloLista}>ARCHIVOS RECUPERADOS</Text></View><View style={styles.metaMarco}><Text style={styles.metaLista}>{String(notas?.length ?? 0).padStart(2, '0')} // TOTAL</Text></View></View>
							<View style={styles.listaAcento} />
							{isPending ? <EstadoPantalla tipo="cargando" titulo="ABRIENDO EL ARCHIVO" mensaje="Consultando los registros de la bitácora." /> : isError && !notas ? <EstadoPantalla tipo="error" titulo="SEÑAL INTERRUMPIDA" mensaje={mensajeDeError(error)} textoAccion="REINTENTAR" onAccion={() => void refetch()} /> : <>
								{isError ? <View style={styles.avisoCache} accessibilityRole="alert"><Text style={styles.avisoCacheTexto}>{mensajeDeError(error)} Se conservan los registros disponibles en caché.</Text><Pressable accessibilityRole="button" onPress={() => void refetch()} style={({ pressed }) => [styles.reintentar, pressed && styles.presionado]}><Text style={styles.reintentarTexto}>REINTENTAR ↗</Text></Pressable></View> : null}
								{notas?.length ? <View style={styles.listaNotas}>{notas.map((nota, indice) => <View key={nota.id} style={[styles.notaMarco, indice % 2 === 1 && styles.notaMarcoAlterna]}><View style={styles.nota}><View style={styles.notaEsquinaSup} /><View style={styles.notaCabecera}><View style={styles.categoriaMarco}><Text style={styles.categoria}>{nota.categoria}</Text></View><Text style={styles.fecha}>{fechaDeCreacion(nota.createdAt)}</Text></View><View style={styles.notaIndiceFila}><Text style={styles.notaIndice}>FILE / {String(indice + 1).padStart(3, '0')}</Text><View style={styles.rayitas}><View /><View /><View /></View></View><Text style={styles.tituloNota}>{nota.titulo}</Text><Text style={styles.contenidoNota}>{nota.contenido}</Text><View style={styles.pieNota}><Text style={styles.idNota}>ENTITY ID // {nota.personajeId}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Editar ${nota.titulo}`} onPress={() => seleccionarParaEditar(nota)} style={({ pressed }) => [styles.botonEditar, pressed && styles.presionado]}><Text style={styles.botonEditarTexto}>EDITAR ↗</Text></Pressable></View><View style={styles.notaEsquinaInf} /></View></View>)}</View> : <EstadoPantalla tipo="vacio" titulo="BITÁCORA VACÍA" mensaje="Todavía no hay registros para esta dimensión. Puedes crear el primero arriba." textoAccion="ACTUALIZAR" onAccion={() => void refetch()} />}
							</>}
						</View>
						<View style={styles.logMarco}><View style={styles.logTitulo}><View style={styles.estadoPunto} /><Text style={styles.logTituloTexto}>SYSTEM EVENT STREAM</Text></View><LogPanel /></View>
						<Text style={styles.piePagina}>MOCKAPI // RESOURCE: NOTAS // PERSISTENT CACHE</Text>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	raiz: { flex: 1, backgroundColor: colores.espacioProfundo },
	areaSegura: { flex: 1 },
	teclado: { flex: 1 },
	fondoDecorativo: {position: 'absolute',top: 0,right: 0,bottom: 0,left: 0,overflow: 'hidden'},
	lineaFondoUno: { position: 'absolute', width: 280, height: 1, top: 175, right: -75, backgroundColor: colores.cianEnergetico, opacity: 0.18, transform: [{ rotate: '-36deg' }] },
	lineaFondoDos: { position: 'absolute', width: 230, height: 1, top: 460, left: -90, backgroundColor: colores.portalVioleta, opacity: 0.5, transform: [{ rotate: '-36deg' }] },
	orbeFondo: { position: 'absolute', width: 180, height: 180, top: 260, right: -130, borderRadius: 90, borderWidth: 1, borderColor: colores.cianEnergetico, opacity: 0.1 },
	contenido: { gap: espacios.xl, paddingHorizontal: espacios.lg, paddingTop: espacios.sm, paddingBottom: espacios.xxxl + espacios.xl },
	cabecera: { flexDirection: 'row', alignItems: 'center', gap: espacios.sm, paddingTop: espacios.md, paddingBottom: espacios.md, borderBottomWidth: 1, borderBottomColor: colores.bordeSutil },
	volver: { paddingVertical: espacios.sm, paddingRight: espacios.xs },
	volverTexto: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 10, fontWeight: '900' },
	presionado: { opacity: 0.62 },
	cabeceraCentro: { flex: 1, gap: 2 },
	codigo: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 8, letterSpacing: 1, fontWeight: '700' },
	titulo: { color: colores.blancoCosmico, fontSize: tipografia.titulo, fontWeight: '900', lineHeight: 35, letterSpacing: 1 },
	subtituloLinea: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
	lineaCian: { width: 18, height: 2, backgroundColor: colores.verdePortal },
	subtitulo: { color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, letterSpacing: 0.5 },
	contadorMarco: { minWidth: 49, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 7, backgroundColor: colores.nebulosaOscura, borderTopWidth: 2, borderTopColor: colores.verdePortal, borderBottomWidth: 1, borderBottomColor: colores.bordeSutil },
	contadorEtiqueta: { color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, letterSpacing: 1 },
	contador: { color: colores.verdePortal, fontFamily: fuentes.mono, fontSize: 20, fontWeight: '900' },
	contadorBarra: { width: 25, height: 2, backgroundColor: colores.cianEnergetico, marginTop: 2 },
	estadoBarra: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacios.sm, paddingVertical: espacios.sm, borderBottomWidth: 1, borderBottomColor: colores.bordeSutil },
	estadoIndicador: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
	estadoPunto: { width: 6, height: 6, backgroundColor: colores.verdePortal, borderRadius: 1 },
	estadoPuntoActivo: { backgroundColor: colores.cianEnergetico },
	estadoTexto: { flex: 1, color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.4 },
	accionesCabecera: { flexDirection: 'row', alignItems: 'center', gap: espacios.sm },
	recargar: { paddingVertical: 6, paddingHorizontal: espacios.sm, backgroundColor: colores.nebulosaOscura, borderWidth: 1, borderColor: colores.bordeCian, borderTopRightRadius: 0, borderBottomLeftRadius: 0 },
	recargarTexto: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
	formularioMarco: { padding: 1, backgroundColor: colores.cianEnergetico, shadowColor: colores.cianEnergetico, shadowOpacity: 0.24, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
	formularioPanel: { position: 'relative', overflow: 'hidden', gap: espacios.md, padding: espacios.lg, backgroundColor: colores.nebulosaOscura, borderWidth: 1, borderColor: colores.bordeSutil },
	panelEsquinaSup: { position: 'absolute', top: 0, right: 0, width: 35, height: 3, backgroundColor: colores.verdePortal },
	panelEsquinaInf: { position: 'absolute', bottom: 0, left: 0, width: 42, height: 3, backgroundColor: colores.portalVioleta },
	panelCabecera: { flexDirection: 'row', alignItems: 'center', gap: espacios.sm },
	numeroSeccion: { width: 39, height: 39, alignItems: 'center', justifyContent: 'center', backgroundColor: colores.verdePortal, borderTopRightRadius: 0, borderBottomLeftRadius: 0, transform: [{ skewX: '-5deg' }] },
	numeroSeccionTexto: { color: colores.espacioProfundo, fontFamily: fuentes.mono, fontSize: 17, fontWeight: '900', transform: [{ skewX: '5deg' }] },
	tituloBloque: { flex: 1, gap: 3 },
	miniEtiqueta: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 8, letterSpacing: 1, fontWeight: '700' },
	tituloFormulario: { color: colores.blancoCosmico, fontSize: tipografia.pequeno, fontWeight: '900', letterSpacing: 0.5 },
	estadoModulo: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 5, borderWidth: 1, borderColor: colores.bordeSutil },
	estadoModuloPunto: { width: 5, height: 5, backgroundColor: colores.verdePortal },
	estadoModuloTexto: { color: colores.verdePortal, fontFamily: fuentes.mono, fontSize: 8, fontWeight: '900' },
	divisorNeon: { height: 1, backgroundColor: colores.bordeCian, opacity: 0.8 },
	idSeleccionado: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 10 },
	grupoCampo: { gap: 6 },
	etiquetaFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	puntoActivo: { width: 5, height: 5, backgroundColor: colores.verdePortal, transform: [{ rotate: '45deg' }] },
	etiquetaCampo: { flex: 1, color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
	codigoCampo: { color: colores.cremaEstelar, opacity: 0.55, fontFamily: fuentes.mono, fontSize: 7 },
	marcoCampo: { position: 'relative', borderWidth: 1, borderColor: colores.bordeCian, backgroundColor: colores.espacioProfundo },
	marcoCampoGrande: { minHeight: 112 },
	campo: { minHeight: 43, paddingHorizontal: espacios.md, paddingVertical: espacios.sm, color: colores.blancoCosmico, backgroundColor: 'transparent', fontSize: tipografia.cuerpo },
	campoMultilinea: { minHeight: 108, paddingTop: espacios.md },
	esquinaCampoTL: { position: 'absolute', zIndex: 1, top: -1, left: -1, width: 10, height: 3, backgroundColor: colores.verdePortal },
	esquinaCampoBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 3, backgroundColor: colores.cianEnergetico },
	filaCampos: { flexDirection: 'row', gap: espacios.md },
	campoFlexible: { flex: 1, minWidth: 0 },
	mensaje: { flexDirection: 'row', alignItems: 'stretch', gap: espacios.sm, padding: espacios.md, backgroundColor: colores.nebulosaOscura, borderWidth: 1, borderColor: colores.bordeSutil },
	mensajeBarra: { width: 3, backgroundColor: colores.exito },
	mensajeError: { borderColor: colores.error },
	mensajeExito: { borderColor: colores.exito },
	mensajeTexto: { flex: 1, color: colores.blancoCosmico, fontSize: tipografia.pequeno, lineHeight: 20 },
	accionesFormulario: { gap: espacios.sm, marginTop: 2 },
	botonPrincipalMarco: { borderWidth: 1, borderColor: colores.verdePortal, padding: 2, backgroundColor: colores.espacioProfundo },
	listaSeccion: { gap: espacios.md },
	cabeceraLista: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: espacios.sm },
	tituloLista: { marginTop: 4, color: colores.blancoCosmico, fontSize: tipografia.pequeno, fontWeight: '900', letterSpacing: 0.5 },
	metaMarco: { paddingVertical: 5, paddingHorizontal: 7, borderLeftWidth: 2, borderLeftColor: colores.portalVioleta, backgroundColor: colores.nebulosaOscura },
	metaLista: { color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8 },
	listaAcento: { width: '42%', height: 2, backgroundColor: colores.cianEnergetico },
	listaNotas: { gap: espacios.md },
	notaMarco: { padding: 1, backgroundColor: colores.cianEnergetico, shadowColor: colores.cianEnergetico, shadowOpacity: 0.14, shadowRadius: 7, shadowOffset: { width: 0, height: 0 }, elevation: 2 },
	notaMarcoAlterna: { backgroundColor: colores.portalVioleta },
	nota: { position: 'relative', overflow: 'hidden', gap: espacios.sm, padding: espacios.lg, backgroundColor: colores.nebulosaOscura, borderWidth: 1, borderColor: colores.bordeSutil },
	notaEsquinaSup: { position: 'absolute', top: 0, right: 0, width: 38, height: 3, backgroundColor: colores.verdePortal },
	notaEsquinaInf: { position: 'absolute', bottom: 0, left: 0, width: 25, height: 3, backgroundColor: colores.cianEnergetico },
	notaCabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacios.sm },
	categoriaMarco: { maxWidth: '58%', padding: 1, backgroundColor: colores.cianEnergetico },
	categoria: { color: colores.espacioProfundo, backgroundColor: colores.cianEnergetico, paddingHorizontal: espacios.sm, paddingVertical: 4, fontFamily: fuentes.mono, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
	fecha: { flexShrink: 1, color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, textAlign: 'right' },
	notaIndiceFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: colores.bordeSutil },
	notaIndice: { color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, letterSpacing: 1, opacity: 0.75 },
	rayitas: { flexDirection: 'row', gap: 3 },
	tituloNota: { color: colores.blancoCosmico, fontSize: tipografia.subtitulo, fontWeight: '900', letterSpacing: 0.2 },
	contenidoNota: { color: colores.cremaEstelar, fontSize: tipografia.cuerpo, lineHeight: 23 },
	pieNota: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacios.md, paddingTop: espacios.sm, borderTopWidth: 1, borderTopColor: colores.bordeSutil },
	idNota: { flex: 1, color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8 },
	botonEditar: { paddingVertical: espacios.sm, paddingHorizontal: espacios.sm, borderWidth: 1, borderColor: colores.bordeCian, backgroundColor: colores.espacioProfundo },
	botonEditarTexto: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
	avisoCache: { gap: espacios.sm, padding: espacios.md, backgroundColor: colores.portalVioleta, borderLeftWidth: 3, borderLeftColor: colores.alerta },
	avisoCacheTexto: { color: colores.blancoCosmico, fontSize: tipografia.pequeno, lineHeight: 19 },
	reintentar: { alignSelf: 'flex-start', paddingVertical: espacios.xs, paddingHorizontal: espacios.sm, borderWidth: 1, borderColor: colores.bordeCian },
	reintentarTexto: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 9, fontWeight: '900' },
	logMarco: { padding: espacios.sm, borderWidth: 1, borderColor: colores.bordeSutil, backgroundColor: colores.nebulosaOscura },
	logTitulo: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingBottom: espacios.sm, marginBottom: espacios.sm, borderBottomWidth: 1, borderBottomColor: colores.bordeSutil },
	logTituloTexto: { color: colores.cianEnergetico, fontFamily: fuentes.mono, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
	piePagina: { color: colores.cremaEstelar, fontFamily: fuentes.mono, fontSize: 8, textAlign: 'center', letterSpacing: 0.4 },
});


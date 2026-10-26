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
			<Text style={styles.etiquetaCampo}>{etiqueta}</Text>
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
		</View>
	);
}

function fechaDeCreacion(createdAt: number): string {
	if (!Number.isFinite(createdAt)) {
		return 'Fecha no disponible';
	}

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
			<SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
				<KeyboardAvoidingView
					style={styles.teclado}
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<ScrollView
						contentContainerStyle={styles.contenido}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}>
						<View style={styles.cabecera}>
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="Volver"
								onPress={volver}
								hitSlop={12}
								style={({ pressed }) => [styles.volver, pressed && styles.presionado]}>
								<Text style={styles.volverTexto}>← VOLVER</Text>
							</Pressable>
							<View style={styles.cabeceraCentro}>
								<Text style={styles.codigo}>ARCHIVO PERSONAL // MOCKAPI</Text>
								<Text style={styles.titulo}>BITÁCORA</Text>
							</View>
							<Text style={styles.contador}>{notas?.length ?? '—'}</Text>
						</View>

						<View style={styles.estadoBarra}>
							<Text style={styles.estadoTexto}>
								{isFetching ? 'SINCRONIZANDO REGISTROS' : 'REGISTROS DE EXPLORACIÓN'}
							</Text>
							<View style={styles.accionesCabecera}>
								<SelloPendiente />
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Actualizar registros"
									disabled={isFetching}
									onPress={() => void refetch()}
									style={({ pressed }) => [styles.recargar, pressed && styles.presionado]}>
									<Text style={styles.recargarTexto}>{isFetching ? '···' : '↻ ACTUALIZAR'}</Text>
								</Pressable>
							</View>
						</View>

						<View style={styles.formularioPanel}>
							<View style={styles.tituloSeccion}>
								<Text style={styles.numeroSeccion}>{notaEditando ? '02' : '01'}</Text>
								<Text style={styles.tituloFormulario}>
									{notaEditando ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}
								</Text>
							</View>

							{notaEditando ? (
								<Text style={styles.idSeleccionado}>ID CONSERVADO: {notaEditando.id}</Text>
							) : null}

							<CampoTexto
								etiqueta="TÍTULO"
								valor={formulario.titulo}
								onChangeText={(valor) => cambiarCampo('titulo', valor)}
								ayuda="Nombre del registro"
							/>
							<CampoTexto
								etiqueta="CONTENIDO"
								valor={formulario.contenido}
								onChangeText={(valor) => cambiarCampo('contenido', valor)}
								multilinea
								ayuda="Describe el hallazgo..."
							/>
							<View style={styles.filaCampos}>
								<View style={styles.campoFlexible}>
									<CampoTexto
										etiqueta="CATEGORÍA"
										valor={formulario.categoria}
										onChangeText={(valor) => cambiarCampo('categoria', valor)}
										ayuda="Categoría"
									/>
								</View>
								<View style={styles.campoFlexible}>
									<CampoTexto
										etiqueta="ID DEL PERSONAJE"
										valor={formulario.personajeId}
										onChangeText={(valor) => cambiarCampo('personajeId', valor)}
										ayuda="ID como texto"
									/>
								</View>
							</View>

							{mensaje ? (
								<View
									accessibilityRole={mensaje.tipo === 'error' ? 'alert' : 'text'}
									style={[
										styles.mensaje,
										mensaje.tipo === 'error' ? styles.mensajeError : styles.mensajeExito,
									]}>
									<Text style={styles.mensajeTexto}>{mensaje.texto}</Text>
								</View>
							) : null}

							<View style={styles.accionesFormulario}>
								<BotonAccion
									titulo={
										mutacionPausada
											? 'PENDIENTE SIN CONEXIÓN'
											: guardando
												? 'GUARDANDO…'
												: notaEditando
													? 'GUARDAR CAMBIOS'
													: 'CREAR REGISTRO'
									}
									onPress={guardar}
									deshabilitado={guardando}
								/>
								{notaEditando ? (
									<BotonAccion
										titulo="CANCELAR EDICIÓN"
										onPress={limpiarFormulario}
										variante="fantasma"
										compacto
									/>
								) : null}
							</View>
						</View>

						<View style={styles.listaSeccion}>
							<View style={styles.cabeceraLista}>
								<Text style={styles.tituloLista}>ARCHIVOS RECUPERADOS</Text>
								<Text style={styles.metaLista}>{notas?.length ?? 0} EN TOTAL</Text>
							</View>

							{isPending ? (
								<EstadoPantalla
									tipo="cargando"
									titulo="ABRIENDO EL ARCHIVO"
									mensaje="Consultando los registros de la bitácora."
								/>
							) : isError && !notas ? (
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
										<View style={styles.avisoCache} accessibilityRole="alert">
											<Text style={styles.avisoCacheTexto}>
												{mensajeDeError(error)} Se conservan los registros disponibles en caché.
											</Text>
											<Pressable
												accessibilityRole="button"
												onPress={() => void refetch()}
												style={({ pressed }) => [styles.reintentar, pressed && styles.presionado]}>
												<Text style={styles.reintentarTexto}>REINTENTAR</Text>
											</Pressable>
										</View>
									) : null}
									{notas?.length ? (
										<View style={styles.listaNotas}>
											{notas.map((nota) => (
												<View
													key={nota.id}
													style={[
														styles.nota,
														notaEditando?.id === nota.id && styles.notaSeleccionada,
													]}>
													<View style={styles.notaCabecera}>
														<View style={styles.identificadoresNota}>
															<Text style={styles.codigoNota}>REGISTRO // {nota.id}</Text>
															<Text style={styles.categoria}>{nota.categoria}</Text>
															{notaEditando?.id === nota.id ? (
																<Text style={styles.etiquetaEdicion}>EN EDICIÓN</Text>
															) : null}
														</View>
														<Text style={styles.fecha}>{fechaDeCreacion(nota.createdAt)}</Text>
													</View>
													<Text style={styles.tituloNota}>{nota.titulo}</Text>
													<Text style={styles.contenidoNota}>{nota.contenido}</Text>
													<View style={styles.pieNota}>
														<Text style={styles.idNota}>PERSONAJE {nota.personajeId}</Text>
														<Pressable
															accessibilityRole="button"
															accessibilityLabel={`Editar ${nota.titulo}`}
															onPress={() => seleccionarParaEditar(nota)}
															style={({ pressed }) => [styles.botonEditar, pressed && styles.presionado]}>
															<Text style={styles.botonEditarTexto}>EDITAR ↗</Text>
														</Pressable>
													</View>
												</View>
											))}
										</View>
									) : (
										<EstadoPantalla
											tipo="vacio"
											titulo="BITÁCORA VACÍA"
											mensaje="Todavía no hay registros para esta dimensión. Puedes crear el primero arriba."
											textoAccion="ACTUALIZAR"
											onAccion={() => void refetch()}
										/>
									)}
								</>
							)}
						</View>

						<LogPanel />
						<Text style={styles.piePagina}>MOCKAPI // RECURSO NOTAS // CACHÉ PERSISTENTE</Text>
					</ScrollView>
				</KeyboardAvoidingView>
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
	teclado: {
		flex: 1,
	},
	contenido: {
		gap: espacios.xl,
		paddingHorizontal: espacios.lg,
		paddingBottom: espacios.xxxl + espacios.xl,
		width: '100%',
		maxWidth: 960,
		alignSelf: 'center',
	},
	cabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.md,
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
		fontSize: 10,
		fontWeight: '900',
	},
	presionado: {
		opacity: 0.65,
	},
	cabeceraCentro: {
		flex: 1,
		gap: 2,
	},
	codigo: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		letterSpacing: 0,
	},
	titulo: {
		color: colores.blancoCosmico,
		fontSize: tipografia.titulo,
		fontWeight: '900',
		lineHeight: 34,
	},
	contador: {
		color: colores.verdePortal,
		fontFamily: fuentes.mono,
		fontSize: tipografia.subtitulo,
		fontWeight: '900',
	},
	estadoBarra: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: espacios.sm,
		paddingBottom: espacios.sm,
		borderBottomWidth: 1,
		borderBottomColor: colores.bordeSutil,
	},
	estadoTexto: {
		flex: 1,
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '700',
	},
	accionesCabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.sm,
	},
	recargar: {
		minHeight: 44,
		justifyContent: 'center',
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeCian,
		borderRadius: radios.sm,
	},
	recargarTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	formularioPanel: {
		gap: espacios.md,
		padding: espacios.lg,
		backgroundColor: colores.nebulosaOscura,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderTopWidth: 5,
		borderTopColor: colores.verdePortal,
		borderRadius: radios.sm,
	},
	tituloSeccion: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.sm,
		paddingBottom: espacios.md,
		borderBottomWidth: 1,
		borderBottomColor: colores.bordeSutil,
	},
	numeroSeccion: {
		color: colores.espacioProfundo,
		backgroundColor: colores.verdePortal,
		paddingHorizontal: espacios.md,
		paddingVertical: espacios.sm,
		fontFamily: fuentes.mono,
		fontSize: tipografia.subtitulo,
		fontWeight: '900',
	},
	tituloFormulario: {
		color: colores.blancoCosmico,
		fontSize: tipografia.subtitulo,
		fontWeight: '900',
		letterSpacing: 0,
	},
	idSeleccionado: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: 10,
	},
	grupoCampo: {
		gap: espacios.xs,
	},
	etiquetaCampo: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: 10,
		fontWeight: '900',
	},
	campo: {
		minHeight: 44,
		paddingHorizontal: espacios.md,
		paddingVertical: espacios.sm,
		color: colores.blancoCosmico,
		backgroundColor: colores.espacioProfundo,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderRadius: radios.sm,
		fontSize: tipografia.cuerpo,
	},
	campoMultilinea: {
		minHeight: 104,
	},
	filaCampos: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: espacios.md,
	},
	campoFlexible: {
		flex: 1,
		flexBasis: 140,
		minWidth: 0,
	},
	mensaje: {
		padding: espacios.md,
		borderLeftWidth: 4,
		borderRadius: radios.sm,
	},
	mensajeError: {
		backgroundColor: colores.portalVioleta,
		borderLeftColor: colores.error,
	},
	mensajeExito: {
		backgroundColor: colores.nebulosaOscura,
		borderLeftColor: colores.exito,
	},
	mensajeTexto: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
		lineHeight: 20,
	},
	avisoCache: {
		gap: espacios.sm,
		padding: espacios.md,
		backgroundColor: colores.portalVioleta,
		borderLeftWidth: 4,
		borderLeftColor: colores.alerta,
		borderRadius: radios.sm,
	},
	avisoCacheTexto: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
		lineHeight: 19,
	},
	reintentar: {
		minHeight: 44,
		justifyContent: 'center',
		alignSelf: 'flex-start',
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeCian,
		borderRadius: radios.sm,
	},
	reintentarTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	accionesFormulario: {
		gap: espacios.sm,
	},
	listaSeccion: {
		gap: espacios.md,
	},
	cabeceraLista: {
		flexDirection: 'row',
		alignItems: 'baseline',
		justifyContent: 'space-between',
		gap: espacios.sm,
	},
	tituloLista: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
		fontWeight: '900',
		letterSpacing: 0,
	},
	metaLista: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
	},
	listaNotas: {
		gap: espacios.md,
	},
	nota: {
		gap: espacios.sm,
		padding: espacios.lg,
		backgroundColor: colores.nebulosaOscura,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderTopWidth: 3,
		borderTopColor: colores.cianEnergetico,
		borderRadius: radios.sm,
	},
	notaSeleccionada: {
		backgroundColor: colores.portalVioleta,
		borderTopColor: colores.verdePortal,
	},
	notaCabecera: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: espacios.sm,
	},
	identificadoresNota: {
		flex: 1,
		alignItems: 'flex-start',
		gap: espacios.xs,
	},
	codigoNota: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	etiquetaEdicion: {
		color: colores.espacioProfundo,
		backgroundColor: colores.verdePortal,
		paddingHorizontal: espacios.sm,
		paddingVertical: espacios.xs,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	categoria: {
		flexShrink: 1,
		maxWidth: '100%',
		color: colores.espacioProfundo,
		backgroundColor: colores.cianEnergetico,
		paddingHorizontal: espacios.sm,
		paddingVertical: 3,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
		textTransform: 'uppercase',
	},
	fecha: {
		maxWidth: '45%',
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		textAlign: 'right',
	},
	tituloNota: {
		color: colores.blancoCosmico,
		fontSize: tipografia.subtitulo,
		fontWeight: '900',
	},
	contenidoNota: {
		color: colores.cremaEstelar,
		fontSize: tipografia.cuerpo,
		lineHeight: 23,
	},
	pieNota: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: espacios.md,
		paddingTop: espacios.sm,
		borderTopWidth: 1,
		borderTopColor: colores.bordeSutil,
	},
	idNota: {
		flex: 1,
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
	},
	botonEditar: {
		minHeight: 44,
		justifyContent: 'center',
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeCian,
		borderRadius: radios.sm,
	},
	botonEditarTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	piePagina: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		textAlign: 'center',
	},
});

import { useMutationState } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { mutationKeys } from '@/lib/queryKeys';

export function SelloPendiente() {
	const mutaciones = useMutationState({
		filters: { mutationKey: mutationKeys.notas.all },
		select: (mutacion) => ({
			status: mutacion.state.status,
			isPaused: mutacion.state.isPaused,
			submittedAt: mutacion.state.submittedAt,
		}),
	});
	const pendientes = mutaciones.filter((mutacion) => mutacion.status === 'pending');
	const pausadas = pendientes.filter((mutacion) => mutacion.isPaused).length;
	const ultimoResultado = mutaciones
		.filter((mutacion) => mutacion.status === 'success' || mutacion.status === 'error')
		.sort((anterior, siguiente) => siguiente.submittedAt - anterior.submittedAt)[0];

	if (pendientes.length === 0 && !ultimoResultado) {
		return null;
	}

	const estado = pendientes.length > 0 ? (pausadas > 0 ? 'pausado' : 'sincronizando') : ultimoResultado.status;
	const texto =
		estado === 'pausado'
			? `${pausadas} ${pausadas === 1 ? 'PENDIENTE' : 'PENDIENTES'}`
			: estado === 'sincronizando'
				? `SINCRONIZANDO ${pendientes.length}`
				: estado === 'error'
					? 'ERROR DE SINCRONIZACIÓN'
					: 'SINCRONIZADO';
	const estilo =
		estado === 'pausado'
			? styles.pausado
			: estado === 'error'
				? styles.error
				: estado === 'success'
					? styles.completado
					: styles.sincronizando;
	const estiloTexto =
		estado === 'pausado' || estado === 'error' || estado === 'success'
			? styles.textoFinal
			: styles.textoActivo;
	const etiqueta =
		estado === 'pausado'
			? `${pausadas} mutaciones de notas pendientes de conexión`
			: estado === 'sincronizando'
				? `${pendientes.length} mutaciones de notas sincronizándose`
				: estado === 'error'
					? 'La última mutación de notas terminó con error'
					: 'La última mutación de notas se completó';

	return (
		<View
			accessibilityRole="text"
			accessibilityLabel={etiqueta}
			style={[styles.sello, estilo]}>
			<Text style={[styles.punto, estiloTexto]}>
				{estado === 'error' ? '×' : estado === 'success' ? '✓' : estado === 'pausado' ? '!' : '·'}
			</Text>
			<Text style={[styles.texto, estiloTexto]}>{texto}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	sello: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.xs,
		paddingHorizontal: espacios.sm,
		paddingVertical: 5,
		borderWidth: 1,
		borderRadius: radios.sm,
	},
	pausado: {
		backgroundColor: colores.alerta,
		borderColor: colores.alerta,
	},
	error: {
		backgroundColor: colores.error,
		borderColor: colores.error,
	},
	completado: {
		backgroundColor: colores.exito,
		borderColor: colores.exito,
	},
	sincronizando: {
		backgroundColor: colores.nebulosaOscura,
		borderColor: colores.bordeCian,
	},
	punto: {
		fontFamily: fuentes.mono,
		fontSize: 10,
		fontWeight: '900',
	},
	texto: {
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	textoFinal: {
		color: colores.espacioProfundo,
	},
	textoActivo: {
		color: colores.cianEnergetico,
	},
});

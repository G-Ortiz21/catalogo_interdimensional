import { useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import {
	limpiarEventos,
	obtenerEventos,
	suscribirEventos,
	type NivelLog,
} from '@/lib/logger';

const colorPorNivel: Record<NivelLog, string> = {
	info: colores.cremaEstelar,
	exito: colores.exito,
	alerta: colores.alerta,
	error: colores.error,
	red: colores.cianEnergetico,
	cache: colores.magentaCosmico,
};

export function LogPanel() {
	const eventos = useSyncExternalStore(suscribirEventos, obtenerEventos, obtenerEventos);
	const [expandido, setExpandido] = useState(false);
	const visibles = (expandido ? eventos : eventos.slice(-5)).slice().reverse();

	return (
		<View style={styles.panel}>
			<View style={styles.cabecera}>
				<View style={styles.titulos}>
					<Text style={styles.codigo}>TELEMETRÍA LOCAL</Text>
					<Text style={styles.titulo}>REGISTRO DE EVENTOS</Text>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Limpiar eventos"
					onPress={limpiarEventos}
					style={({ pressed }) => [styles.limpiar, pressed && styles.presionado]}>
					<Text style={styles.limpiarTexto}>LIMPIAR</Text>
				</Pressable>
			</View>

			{visibles.length === 0 ? (
				<Text style={styles.vacio}>Sin eventos registrados en esta sesión.</Text>
			) : (
				<View style={styles.eventos}>
					{visibles.map((evento) => (
						<View key={evento.id} style={styles.evento}>
							<Text style={styles.hora}>{evento.fecha.toLocaleTimeString()}</Text>
							<View style={[styles.marca, { backgroundColor: colorPorNivel[evento.nivel] }]} />
							<Text style={styles.mensaje} numberOfLines={expandido ? undefined : 2}>
								{evento.mensaje}
							</Text>
						</View>
					))}
				</View>
			)}

			{eventos.length > 5 ? (
				<Pressable
					accessibilityRole="button"
					onPress={() => setExpandido((actual) => !actual)}
					style={({ pressed }) => [styles.mas, pressed && styles.presionado]}>
					<Text style={styles.masTexto}>
						{expandido ? 'MOSTRAR MENOS' : `ÚLTIMOS 5 DE ${eventos.length}`}
					</Text>
				</Pressable>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	panel: {
		gap: espacios.md,
		padding: espacios.lg,
		backgroundColor: colores.espacioProfundo,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderRadius: radios.sm,
	},
	cabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: espacios.md,
	},
	titulos: {
		flex: 1,
		gap: 2,
	},
	codigo: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	titulo: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
		fontWeight: '900',
	},
	limpiar: {
		minHeight: 44,
		justifyContent: 'center',
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderRadius: radios.sm,
	},
	limpiarTexto: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
	presionado: {
		opacity: 0.6,
	},
	eventos: {
		gap: espacios.sm,
	},
	evento: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: espacios.sm,
	},
	hora: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
	},
	marca: {
		width: 6,
		height: 6,
		marginTop: 4,
		borderRadius: 3,
	},
	mensaje: {
		flex: 1,
		color: colores.blancoCosmico,
		fontSize: 11,
		lineHeight: 16,
	},
	vacio: {
		color: colores.cremaEstelar,
		fontSize: tipografia.pequeno,
	},
	mas: {
		alignSelf: 'flex-start',
		minHeight: 44,
		justifyContent: 'center',
		paddingTop: espacios.xs,
	},
	masTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: tipografia.tecnica,
		fontWeight: '900',
	},
});

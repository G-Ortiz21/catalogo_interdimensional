---
name: interdimensional-design
description: Utilízala siempre que crees o modifiques colores, estilos, componentes o pantallas de catalogo_interdimensional.
---

# Identidad visual de Catálogo Interdimensional

## 1. Dirección artística

Combina **maximalismo psicodélico, brutalismo digital y retrofuturismo de cómic**, inspirados en las tres portadas de referencia de Rick and Morty.

- **Maximalismo:** colores intensos, capas visuales, composiciones atrevidas y detalles extravagantes.
- **Brutalismo digital:** bloques contundentes, bordes marcados, geometría angular y jerarquía tipográfica fuerte.
- **Retrofuturismo psicodélico:** portales luminosos, fondos espaciales, colores eléctricos y detalles gráficos de ciencia ficción.

La interfaz debe sentirse como una bitácora de exploración interdimensional, con una identidad propia y reconocible. Evita diseños corporativos, plantillas genéricas de IA y tarjetas repetitivas.

El maximalismo debe aportar personalidad, el brutalismo debe organizar la información y la psicodelia debe construir la atmósfera. No sacrifiques legibilidad por decoración.

## 2. Paleta cromática

Colores aproximados inspirados en las imágenes proporcionadas; no son una paleta oficial de la serie.

| Nombre | Hexadecimal | Uso |
|---|---|---|
| Espacio profundo | `#141534` | Fondo principal |
| Nebulosa oscura | `#232345` | Paneles secundarios |
| Portal violeta | `#480B7F` | Superficies destacadas |
| Violeta eléctrico | `#7518AD` | Acentos decorativos |
| Magenta cósmico | `#9D36AC` | Detalles gráficos |
| Verde extraterrestre | `#7FBA5B` | Elementos decorativos |
| Verde portal | `#A0CE69` | Acciones principales |
| Cian energético | `#41E2BF` | Acentos tecnológicos |
| Turquesa espacial | `#2495A3` | Elementos secundarios |
| Azul profundo | `#12678B` | Paneles y acentos |
| Crema estelar | `#DCE1B9` | Texto secundario y detalles |
| Blanco cósmico | `#F6F6F8` | Texto principal |
| Salmón extraterrestre | `#EFB495` | Acentos cálidos |
| Naranja alienígena | `#DD9057` | Detalles cálidos |

## 3. Roles de color y contraste

- Fondo principal: `#141534`, con texto `#F6F6F8`.
- Paneles secundarios: `#232345`, con texto `#F6F6F8`.
- Paneles destacados: `#480B7F`, con texto `#F6F6F8`.
- Texto secundario: `#DCE1B9` sobre fondos oscuros.
- Botón principal: fondo `#A0CE69`, texto `#141534`.
- Botón secundario: fondo `#41E2BF`, texto `#141534`.
- Elementos decorativos: violeta, magenta, verde y turquesa. No los utilices automáticamente como colores de texto.

Comprueba cada combinación utilizada con la fórmula WCAG 2.x.

- Texto normal: contraste mínimo de 4.5:1.
- Texto grande: contraste mínimo de 3:1.
- No uses texto claro sobre fondos brillantes ni texto oscuro sobre fondos saturados sin verificar el contraste.
- No dependas exclusivamente del color para comunicar errores, conectividad o sincronización.

## 4. Reglas de composición

- Prioriza los fondos espaciales oscuros y los acentos verdes, cian, violetas y magenta.
- Combina formas orgánicas inspiradas en portales con bloques geométricos y bordes definidos.
- Utiliza títulos contundentes, etiquetas compactas y detalles de cómic.
- Incorpora elementos como `DIMENSIÓN`, `REGISTRO` y `COORDENADAS` cuando tengan sentido funcional o visual.
- Cada pantalla debe tener un foco principal y una jerarquía clara.
- Utiliza ilustraciones de personajes disponibles en la API, respetando sus proporciones.
- Evita degradados aleatorios, sombras excesivas, animaciones constantes y decoración que oculte información.
- No conviertas todos los componentes en tarjetas idénticas ni redondees todos los elementos.
- Mantén formularios, botones, navegación y textos fáciles de utilizar.

## 5. Aplicación en las pantallas

Adapta la identidad a las pantallas existentes, sin inventar funcionalidades.

- **Inicio:** composición espacial llamativa, título con personalidad y acceso claro al contenido.
- **Personajes:** imágenes protagonistas, paneles de cómic y acentos cromáticos.
- **Detalle:** personaje destacado y datos organizados como un expediente interdimensional.
- **Bitácora:** registros con apariencia de archivos de exploración, manteniendo los formularios legibles.
- **Eventos y conectividad:** etiquetas técnicas y estados visibles para operaciones pendientes, sincronizadas o fallidas.

Adapta estas directrices a la estructura real del proyecto.

## 6. Restricciones de implementación

- Inspecciona la estructura, los componentes y los estilos existentes antes de modificar código.
- Centraliza la paleta en un único archivo de tema; reutiliza el existente o crea uno apropiado para la estructura del proyecto.
- No disperses códigos hexadecimales por las pantallas.
- Conserva las rutas, los componentes y las funcionalidades actuales.
- No alteres TanStack Query, la caché persistente, las mutaciones offline ni los servicios de API por razones visuales.
- No reconstruyas la aplicación desde cero.
- No instales dependencias sin una necesidad justificada.
- No introduzcas colores nuevos sin justificar su uso y comprobar su contraste.
- No copies portadas completas ni presentes la aplicación como oficial de la serie.
- Comprueba el resultado en las plataformas compatibles con el proyecto.

## 7. Checklist de revisión

- [x] ¿Se combinan maximalismo, brutalismo y retrofuturismo de forma coherente?
- [x] ¿La interfaz tiene personalidad propia y evita una apariencia genérica?
- [x] ¿Los colores están centralizados y respetan la paleta?
- [x] ¿Las combinaciones opacas de texto y fondo se calcularon y documentaron?
- [x] ¿La decoración mantiene la legibilidad y no dificulta la navegación?
- [x] ¿Los estados de conexión y sincronización son comprensibles sin depender solo del color?
- [x] ¿Se conservaron las funcionalidades y se verificaron rutas y consultas en web?
- [x] ¿Se documentaron las pruebas pendientes?
- [ ] ¿Se verificó visualmente en dispositivo iOS y Android?

## 8. Informe al finalizar

Indica brevemente:

1. Archivos modificados.
2. Elementos de diseño implementados.
3. Combinaciones de color y contrastes comprobados.
4. Pruebas realizadas y resultados.
5. Problemas pendientes.

## 9. Sistema visual implementado

Los tokens viven en `src/constants/theme.ts`; pantallas y componentes deben consumirlos en lugar de definir valores hexadecimales locales.

### Color

- **Fondo y lectura:** espacio profundo para el lienzo; nebulosa oscura para superficies; blanco cósmico o crema estelar para contenido.
- **Acción:** verde portal para la acción primaria y cian energético para la secundaria y los focos de navegación.
- **Archivo/personajes:** violeta para marcos y secciones de expediente; el acento superior de una tarjeta de personaje sigue el estado real y se acompaña de una etiqueta textual.
- **Estados:** verde para vivo/éxito, salmón para muerto/error, crema para estado desconocido, naranja para alerta y cian para actividad. Cada estado conserva texto o símbolo explicativo; el color no es la única señal.
- Los bordes translúcidos y el brillo del portal son decoración, no superficies de texto. Las etiquetas superpuestas a imágenes usan un fondo opaco de espacio profundo para que su contraste no dependa de la ilustración.

### Espaciado y forma

Escala de espaciado: `xs 4`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `xxl 32`, `xxxl 48` (unidades lógicas de React Native). Radios: `0`, `2` y `6`; se prefieren esquinas casi rectas. Los bordes de 1–4 unidades organizan secciones y estados, no se usan para simular profundidad por sombra.

## 10. Tipografía, controles y accesibilidad

La jerarquía está centralizada en `tipografia`:

| Token | Tamaño | Uso |
|---|---:|---|
| `display` | 38 | Título del portal de inicio |
| `displayCompacto` | 27 | Título de inicio en pantallas menores a 360 unidades lógicas |
| `nombreDetalle` | 36 | Nombre protagonista en una ficha |
| `titulo` | 30 | Encabezados de pantalla |
| `subtitulo` | 21 | Títulos de sección/registro |
| `nombreTarjeta` | 17 | Nombre del personaje en una tarjeta |
| `cuerpo` | 16 | Lectura y campos de formulario |
| `pequeno` | 13 | Texto de apoyo |
| `etiqueta` | 11 | Identificadores compactos |
| `tecnica` | 10 | Metadatos densos, siempre secundarios |
| `mono` | 12 | Tamaño base para datos monoespaciados |

Los encabezados y datos técnicos usan mayúsculas y la familia monoespaciada disponible en el sistema: Courier New en iOS y `monospace` en Android/web. Las microetiquetas no deben bajar de `tecnica`; el contenido y los mensajes de estado deben conservar como mínimo `pequeno`, salvo el espacio estrecho de una etiqueta auxiliar.

- Los botones compartidos y las acciones de formulario/listado tienen una altura mínima de 44 unidades; los controles de navegación con `hitSlop` compensan su área visual compacta.
- Formularios distinguen etiqueta, campo y ayuda. El foco utiliza cian; el texto escrito es blanco cósmico sobre espacio profundo.
- Las tarjetas mantienen la imagen como foco, usan el color de estado en el borde superior y reiteran el estado con texto.
- Expedientes, notas y telemetría son paneles distintos: la ficha usa una barra violeta, la bitácora usa una barra cian y el formulario una barra verde.
- Errores, conectividad y sincronización deben expresarse mediante palabras, acciones o símbolos además del color. Mantener roles y nombres accesibles en botones y alertas.

## 11. Aplicación por pantalla y estados

- **Inicio:** un escenario de portal enmarcado concentra retícula, anillos elípticos y coordenadas de ambientación; el contador de señales usa el total real de la API. El título y los accesos quedan debajo del portal, con acciones verde y cian diferenciadas. En anchos menores a 360 unidades lógicas se reduce el título para evitar cortes de palabra.
- **Catálogo:** una banda de archivo separa la cabecera del buscador y comunica total y página reales. La cuadrícula mantiene dos columnas; los retratos alternan proporción vertical/cuadrada y muestran el identificador real sobre la imagen, con estado textual y acento de borde según el estado del personaje. En menos de 360 unidades lógicas, la paginación conserva botones accesibles con flechas compactas.
- **Detalle:** retrato protagonista e identidad se separan del expediente. Los datos se presentan en una matriz de bloques; origen, ubicación y fecha ocupan filas completas para facilitar la lectura, mientras género y episodios comparten una fila cuando cabe y se envuelven en anchuras estrechas. Solo se muestran campos de la API. La nota de procedencia usa una superficie violeta.
- **Bitácora:** panel de formulario con cabecera numerada y registros recuperados claramente separados. Cada nota muestra su ID real, categoría, fecha, contenido y personaje relacionado; la nota elegida para edición se resalta y lleva la etiqueta textual «EN EDICIÓN». Se conservan sello de mutación y telemetría.
- **Carga:** indicador más texto de actividad contextual.
- **Error:** alerta con explicación y acción de reintento cuando existe; los datos en caché se conservan y se identifican como tales.
- **Vacío:** mensaje descriptivo y acción para actualizar o limpiar búsqueda.
- **Sin conexión:** banner con texto explícito y nota sobre la caché. No se interpreta la conexión a una red como garantía de acceso al servidor.
- **Mutaciones:** el sello distingue pendiente, sincronizando, sincronizado y error con texto/símbolo y color.

## 12. Contraste comprobado

Se calcularon los valores con la fórmula de luminancia relativa sRGB de WCAG 2.x (`(L1 + 0.05) / (L2 + 0.05)`). Todas las combinaciones siguientes superan 4.5:1 para texto normal; no se depende del umbral más bajo de texto grande.

| Texto | Fondo opaco | Contraste |
|---|---|---:|
| Blanco cósmico `#F6F6F8` | Espacio profundo `#141534` | 16.40:1 |
| Crema estelar `#DCE1B9` | Espacio profundo `#141534` | 13.07:1 |
| Cian energético `#41E2BF` | Espacio profundo `#141534` | 10.83:1 |
| Verde portal `#A0CE69` | Espacio profundo `#141534` | 9.71:1 |
| Salmón extraterrestre `#EFB495` | Espacio profundo `#141534` | 9.80:1 |
| Blanco cósmico `#F6F6F8` | Nebulosa oscura `#232345` | 13.92:1 |
| Crema estelar `#DCE1B9` | Nebulosa oscura `#232345` | 11.10:1 |
| Cian energético `#41E2BF` | Nebulosa oscura `#232345` | 9.20:1 |
| Verde portal `#A0CE69` | Nebulosa oscura `#232345` | 8.25:1 |
| Blanco cósmico `#F6F6F8` | Portal violeta `#480B7F` | 11.94:1 |
| Verde portal `#A0CE69` | Portal violeta `#480B7F` | 7.07:1 |
| Crema estelar `#DCE1B9` | Portal violeta `#480B7F` | 9.52:1 |
| Espacio profundo `#141534` | Cian energético `#41E2BF` | 10.83:1 |
| Espacio profundo `#141534` | Verde portal `#A0CE69` | 9.71:1 |
| Espacio profundo `#141534` | Naranja alienígena `#DD9057` | 6.91:1 |
| Espacio profundo `#141534` | Salmón extraterrestre `#EFB495` | 9.80:1 |

Esto cubre las acciones principal/secundaria, estados de personajes, mensajes sobre superficies violeta y etiquetas sobre fotografías. Los valores no representan contraste de bordes translúcidos, imágenes, estados deshabilitados con opacidad ni cualquier combinación que no aparezca en la tabla; volver a medir si cambia el color de texto/fondo.

## 13. Adaptación multiplataforma y alcance verificado

`app.json` declara iOS, Android y web. Mantener áreas seguras en las pantallas, ajuste de teclado en bitácora y proporciones de imagen estables. La fila de categoría/ID de la bitácora envuelve los campos cuando no hay espacio horizontal suficiente; el catálogo conserva dos columnas y la portada usa una fila de muestras desplazable. Probar orientación, texto ampliado y los tamaños estrechos antes de añadir geometrías que dependan de dimensiones fijas.

En esta revisión se inspeccionó visualmente la aplicación web en anchuras de 320 y 830 unidades lógicas, y se comprobó la navegación a inicio, catálogo, detalle y bitácora. El formulario y las notas se comprobaron también a 320 unidades sin desbordamiento horizontal. No se afirma validación visual en dispositivo iOS/Android: queda pendiente hasta contar con simulador o dispositivo.

No afirmes que una prueba o comprobación se realizó si no se ejecutó realmente.

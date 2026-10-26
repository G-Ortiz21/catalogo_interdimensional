# PRUEBAS.md — Catálogo Interdimensional

## 1. Objetivo

Verificar el funcionamiento real de `catalogo_interdimensional`, incluyendo consultas a la API pública, operaciones de MockAPI, claves de consulta, caché persistente, conectividad y reanudación de mutaciones pendientes.

Las pruebas deben ejecutarse en el entorno disponible y registrar los resultados reales. No se debe marcar una prueba como aprobada si únicamente se revisó el código.

## 2. Reglas para ejecutar las pruebas

- Utilizar el proyecto real de MockAPI configurado en la aplicación.
- Registrar los identificadores de los datos creados durante las pruebas.
- Evitar usar registros de otras personas o datos que deban conservarse.
- No publicar secretos ni información privada en las capturas.
- Mantener visibles los registros de eventos cuando sean necesarios para demostrar el comportamiento.
- Distinguir entre una prueba aprobada, fallida, bloqueada y no ejecutada.
- Si el resultado difiere del esperado, registrar el error antes de corregirlo.
- Después de corregir un defecto, repetir la prueba afectada y las pruebas relacionadas.

## 3. Entorno de prueba

Entorno verificado durante la migración:

- Dispositivo: no disponible en el entorno de desarrollo usado.
- Sistema operativo: Windows (entorno de edición); no se ejecutó la app en dispositivo.
- Versión de Expo: 58.0.19 (configuración resuelta como SDK 58.0.0).
- Versión de Expo CLI: 58.1.15.
- Versión de React: 19.3.0.
- Versión de React Native: 0.88.0.
- Versión de TanStack Query: 5.104.5.
- Versión de la aplicación: 1.0.0.
- URL del recurso MockAPI: configurada en `.env` (no se publica).
- Método de validación de migración: `expo config`, `expo install --check`, TypeScript, ESLint y exportación estática web; no se ejecutó en dispositivo.
- Fecha de ejecución: 2026-10-26.
- Responsable: no indicado.

La interfaz de bitácora ya está implementada y conectada a los hooks existentes. Las pruebas de creación y edición siguen pendientes de una ejecución manual contra MockAPI.

La respuesta de auditoría de `GET /notas` fue `200` con 2 registros y los tipos observados coinciden con el esquema documentado. `createdAt` llegó como número (timestamp Unix en segundos). No se ejecutaron `POST` o `PUT` durante esta auditoría.

### Registro de migración a SDK 58

El manifiesto y el lockfile iniciales resolvían `expo@57.0.31` y Expo CLI/config-plugins 57, mientras Expo Router y varios módulos nativos estaban en 58. La configuración se interpretaba como SDK 57, lo que produjo avisos de incompatibilidad y el error `autoAddConfigPluginsAsync is not a function` durante la instalación de paquetes cruzados. La causa comprobable es la mezcla de CLI/config-plugins 57 con plugins y módulos 58; el stack trace original no estaba disponible para identificar una línea interna concreta. Se alineó el paquete `expo` a `~58.0.19`, se regeneró el lockfile con npm normal y `npx expo install --fix` terminó correctamente con Expo CLI `58.1.15` y `@expo/config-plugins@58.0.10`. No fue necesario modificar el código de las pantallas.

La exportación web y las comprobaciones de TypeScript y ESLint finalizaron correctamente. `npm audit` aún informa cinco vulnerabilidades altas en la cadena de herramientas de Expo y dependencias transitivas (`node-forge` y `zod`); no se forzaron actualizaciones. La app no se ejecutó en dispositivo móvil.

## 4. Estados de las pruebas

Utilizar los siguientes estados:

- **Pendiente:** todavía no se ha ejecutado.
- **Aprobada:** se ejecutó y el resultado coincidió con el esperado.
- **Fallida:** se ejecutó y el resultado no coincidió con el esperado.
- **Bloqueada:** no pudo ejecutarse por un impedimento externo.
- **No ejecutada:** no se dispone de evidencia de ejecución.

## 5. Pruebas funcionales

### P01. Consulta de personajes con conexión

**Objetivo:** comprobar que la aplicación obtiene personajes desde la API pública.

**Pasos:**

1. Iniciar la aplicación con conexión a Internet.
2. Abrir la pantalla que muestra los personajes.
3. Esperar a que finalice la consulta.
4. Revisar los datos mostrados.
5. Consultar los registros de eventos, si están disponibles.

**Resultado esperado:**

- Se muestran personajes procedentes de la API pública.
- La pantalla gestiona correctamente la carga inicial.
- Si ocurre un error de red, se muestra un mensaje comprensible.
- Los registros de eventos no presentan un éxito ficticio.

**Evidencia:** captura de la pantalla y registro de la consulta.

**Evidencia obtenida en web:** página 1 muestra 20 tarjetas con imágenes reales y 826 registros totales; la búsqueda `Rick` devuelve 107 coincidencias; un filtro sin coincidencias muestra el estado vacío; abrir Rick Sanchez navega a `/personaje/1` y la ficha recibe el ID `1`. `/personaje/999999999` muestra «PERSONAJE NO ENCONTRADO» y la acción de volver a explorar. En viewport 390 × 844 no hubo overflow horizontal.

**Estado:** [aprobada en web, con limitación CORS intermitente].

### P02. Consulta y listado de registros propios

**Objetivo:** comprobar que la aplicación lee el recurso configurado en MockAPI.

**Pasos:**

1. Confirmar que la URL de MockAPI está configurada.
2. Desde Inicio, abrir **ABRIR BITÁCORA**.
3. Esperar a que termine la consulta.
4. Comparar los registros mostrados con los existentes en MockAPI.

**Resultado esperado:**

- La aplicación consulta el recurso correcto.
- Los registros mostrados corresponden a la respuesta real del servidor.
- La aplicación maneja una lista vacía sin errores.
- Los errores de servidor o de conexión se muestran adecuadamente.

**Evidencia:** captura de la pantalla y comprobación del recurso remoto.

**Evidencia obtenida:** `GET /notas` respondió `200` con 2 registros; la pantalla `/bitacora` los mostró en Expo Web y el log registró `Notas recibidas: 2`.

**Estado:** [aprobada en web].

### P03. Creación de un registro con conexión

**Objetivo:** verificar la mutación de creación.

**Pasos:**

1. Confirmar que hay conexión.
2. Abrir el formulario de creación.
3. Introducir `titulo`, `contenido`, `categoria` y `personajeId` no vacíos.
4. Enviar el formulario una sola vez.
5. Esperar la respuesta de MockAPI.
6. Comprobar que aparece el nuevo registro.
7. Verificar el registro en MockAPI.

**Resultado esperado:**

- Se ejecuta la mutación correcta.
- La petición se envía al recurso configurado.
- El servidor devuelve una respuesta satisfactoria.
- El listado se actualiza mediante la estrategia de caché implementada.
- La solicitud no incluye `id` y envía `createdAt` como número en segundos.
- Se muestra una confirmación únicamente después del éxito real.
- El registro aparece en MockAPI.

**Evidencia:** registro creado, respuesta del servidor y captura de la aplicación.

**Estado:** [pendiente].

### P04. Edición de un registro con conexión

**Objetivo:** verificar la mutación de edición.

**Pasos:**

1. Seleccionar un registro existente.
2. Abrir su formulario de edición.
3. Cambiar uno o varios campos y comprobar que `createdAt` se conserva.
4. Guardar los cambios.
5. Esperar la respuesta del servidor.
6. Comprobar el listado y el detalle, si existen.
7. Verificar los cambios en MockAPI.

**Resultado esperado:**

- Se actualiza el registro correcto.
- No se crea un registro adicional por error.
- El `id` sigue siendo el mismo antes y después de la edición.
- Se invalidan las consultas relacionadas.
- Los cambios coinciden con la respuesta real de MockAPI.

**Evidencia:** comparación de los datos antes y después.

**Estado:** [pendiente].

### P05. Validación de claves de consulta

**Objetivo:** comprobar que las consultas y mutaciones usan claves centralizadas.

**Pasos:**

1. Abrir `src/lib/queryKeys.ts`.
2. Identificar las claves de listados y detalles.
3. Revisar los hooks de personajes y registros propios.
4. Revisar las mutaciones de creación y edición.
5. Comparar las claves utilizadas con las documentadas en `README.md`.

**Resultado esperado:**

- Las claves están centralizadas.
- Las consultas utilizan las claves previstas.
- Las mutaciones tienen `mutationKey`.
- Las invalidaciones utilizan las claves apropiadas.
- No existen diferencias injustificadas entre el código y la documentación.

**Evidencia:** archivos revisados y, si procede, pruebas automatizadas.

**Estado:** [pendiente].

### P06. Invalidación después de crear un registro

**Objetivo:** verificar que la creación actualiza las consultas relacionadas.

**Pasos:**

1. Abrir el listado de registros.
2. Crear un registro con conexión.
3. Esperar el éxito de la mutación.
4. Revisar el listado.
5. Revisar los registros de eventos o las herramientas de depuración disponibles.

**Resultado esperado:**

- La creación se completa en el servidor.
- Las consultas relacionadas quedan invalidadas según la estrategia implementada.
- El nuevo registro aparece en el listado actualizado.
- Las consultas no relacionadas no se invalidan innecesariamente.

**Evidencia:** captura del listado actualizado y registro de la operación.

**Estado:** [pendiente].

### P07. Invalidación después de editar un registro

**Objetivo:** verificar que la edición mantiene actualizados los datos relacionados.

**Pasos:**

1. Abrir el listado y seleccionar un registro.
2. Cambiar un campo.
3. Guardar la edición.
4. Revisar el listado.
5. Abrir el detalle, si existe.
6. Comprobar los datos en MockAPI.

**Resultado esperado:**

- Los datos modificados se reflejan correctamente.
- El listado y el detalle no muestran versiones contradictorias de los datos.
- La invalidación corresponde a las claves realmente afectadas.

**Evidencia:** captura de la aplicación y verificación del servidor.

**Estado:** [pendiente].

### P08. Restauración de caché después de reiniciar

**Objetivo:** comprobar que las consultas persistidas se restauran después de cerrar la aplicación.

**Pasos:**

1. Con conexión, abrir la aplicación.
2. Consultar personajes y registros propios.
3. Esperar a que los datos estén disponibles.
4. Confirmar que la persistencia se haya ejecutado.
5. Cerrar completamente la aplicación.
6. Volver a abrirla.
7. Observar la interfaz y los registros de eventos durante el inicio.

**Resultado esperado:**

- La caché válida se restaura.
- Los datos disponibles pueden mostrarse antes de que terminen las nuevas consultas.
- No se crea una segunda instancia de QueryClient que impida usar la caché restaurada.
- Los datos pueden actualizarse desde la red según su configuración.
- No se afirma que la restauración funcionó únicamente porque los datos aparezcan después de una respuesta nueva del servidor.

**Evidencia:** registros de hidratación y observación del comportamiento al iniciar.

**Evidencia obtenida en Expo Web:** `catalogo-interdimensional:cache` se escribió en `localStorage` (728 caracteres). Tras recargar `/bitacora`, las dos notas reaparecieron y el panel registró la restauración antes de `Notas recibidas: 2`. No se probó cierre del proceso ni almacenamiento nativo.

**Estado:** [aprobada en web; nativa pendiente].

### P09. Creación de un registro sin conexión

**Objetivo:** comprobar que la aplicación puede dejar una creación pendiente cuando no existe conexión.

**Pasos:**

1. Con conexión, abrir la aplicación y esperar a que se encuentre estable.
2. Confirmar que se muestran los datos necesarios.
3. Desactivar Wi-Fi y datos móviles, o utilizar un mecanismo fiable para desconectar el dispositivo.
4. Confirmar que la aplicación detecta la pérdida de conexión.
5. Abrir el formulario de creación.
6. Introducir datos válidos y enviar la operación.
7. Observar el estado de la mutación y los registros.
8. Comprobar que la interfaz continúa siendo utilizable.

**Resultado esperado:**

- La aplicación detecta la pérdida de conexión.
- La operación queda pendiente según la configuración de TanStack Query.
- La interfaz identifica el cambio como pendiente de sincronización.
- No se muestra una confirmación de creación remota antes de que el servidor la acepte.
- No se bloquea la interfaz esperando indefinidamente una respuesta de red.
- Los datos necesarios para reanudar la mutación se conservan según la estrategia implementada.

**Evidencia:** pantalla sin conexión, indicador de pendiente y registros de eventos.

**Estado:** [pendiente].

### P10. Persistencia de la mutación pendiente después de cerrar la aplicación

**Objetivo:** comprobar que una mutación pendiente se puede restaurar tras un cierre completo.

**Precondición:** P09 debe haberse ejecutado y la mutación debe estar pendiente.

**Pasos:**

1. Mantener el dispositivo sin conexión.
2. Confirmar que la mutación sigue pendiente.
3. Cerrar completamente la aplicación, sin limitarse a navegar a otra pantalla.
4. Abrir nuevamente la aplicación, todavía sin conexión.
5. Esperar a que termine el proceso de restauración.
6. Revisar el estado de las mutaciones y los registros de eventos.

**Resultado esperado:**

- La aplicación vuelve a hidratar la caché persistida válida.
- La mutación pendiente se restaura si se configuró y persistió correctamente.
- La aplicación vuelve a registrar las funciones necesarias para ejecutar la mutación.
- La operación no se pierde silenciosamente.
- La interfaz muestra la operación pendiente cuando corresponde.

**Importante:** la persistencia de la caché de consultas no demuestra por sí sola que las mutaciones se hayan persistido. Ambos estados deben verificarse por separado.

**Evidencia:** registros de restauración y estado visible de la mutación.

**Estado:** [pendiente].

### P11. Recuperación de conexión y reanudación automática

**Objetivo:** comprobar que la mutación pendiente se envía después de recuperar la conexión.

**Precondición:** P09 y P10 deben haber dejado una mutación pendiente.

**Pasos:**

1. Mantener la aplicación abierta con la mutación pendiente.
2. Restaurar la conexión a Internet.
3. Esperar a que el sistema detecte el cambio.
4. Observar los registros de eventos.
5. Esperar a que la mutación se reanude.
6. Comprobar la respuesta de MockAPI.
7. Revisar el listado actualizado.
8. Comprobar el recurso remoto.

**Resultado esperado:**

- La aplicación detecta la conectividad restaurada.
- La mutación se reanuda sin requerir que el usuario vuelva a introducir los datos.
- Se ejecuta la función de mutación registrada.
- MockAPI acepta la operación.
- El indicador de pendiente cambia al estado correspondiente.
- La interfaz refleja el resultado real.
- La operación no se envía repetidamente de manera innecesaria.

**Evidencia:** registros con marcas de tiempo, estado de la interfaz y verificación en MockAPI.

**Estado:** [pendiente].

### P12. Edición sin conexión

**Objetivo:** comprobar el comportamiento offline de una edición, si esta operación está incluida en la estrategia de mutaciones pendientes.

**Pasos:**

1. Con conexión, abrir un registro existente.
2. Desactivar la conexión.
3. Editar el registro.
4. Guardar los cambios.
5. Confirmar el estado pendiente.
6. Recuperar la conexión.
7. Esperar la sincronización.
8. Verificar el registro en MockAPI.

**Resultado esperado:**

- La aplicación maneja la edición sin conexión de acuerdo con su implementación.
- La interfaz diferencia el cambio pendiente de una edición confirmada por el servidor.
- La edición se reanuda y el servidor refleja los cambios cuando la operación logra completarse.

Si la implementación solo admite creación offline, registrar la prueba como no implementada y documentar la limitación. No marcarla como aprobada.

**Evidencia:** estado de la edición y datos finales del servidor.

**Estado:** [pendiente].

### P13. Manejo de errores de red

**Objetivo:** comprobar que los errores de conectividad no provocan fallos de interfaz ni mensajes engañosos.

**Pasos:**

1. Intentar consultar datos sin conexión.
2. Observar la pantalla.
3. Intentar una operación contra MockAPI.
4. Observar el estado de la mutación.
5. Recuperar la conexión y revisar el comportamiento de recuperación.

**Resultado esperado:**

- La aplicación muestra un estado de error o de espera comprensible.
- No se presenta un éxito ficticio.
- Los datos de caché válidos se mantienen disponibles cuando corresponda.
- Las mutaciones pendientes siguen el comportamiento de reintento configurado.
- La aplicación no entra en un ciclo de errores que impida utilizar la interfaz.

**Evidencia:** captura de la pantalla y registros del error.

**Evidencia obtenida en Expo Web:** Playwright simuló `offline`; apareció el banner, las notas cacheadas y el formulario continuaron visibles. Se restauró `online`; no se intentó una mutación mientras estaba desconectado.

**Estado:** [parcial en web; mutación offline pendiente].

### P14. Verificación de configuración de caché

**Objetivo:** comprobar los valores de caché y la compatibilidad de la persistencia.

**Pasos:**

1. Revisar la configuración de QueryClient.
2. Identificar los valores de `staleTime` y `gcTime` para cada fuente.
3. Identificar el `maxAge` del persister.
4. Comparar los valores.
5. Revisar el comportamiento de hidratación.
6. Comparar los valores con la documentación.

**Resultado esperado:**

- Las fuentes de datos tienen la configuración prevista.
- Los valores definitivos están documentados.
- Para las consultas que deben conservarse durante todo el periodo de persistencia, se cumple `gcTime >= maxAge`.
- Se entiende la diferencia entre la caché en memoria y la caché persistida.
- No se atribuye a `gcTime` el borrado inmediato de datos de AsyncStorage.

**Evidencia:** configuración revisada y documentación actualizada.

**Evidencia obtenida:** revisión estática confirmó Query v5.104.5, `staleTime`/`gcTime` diferenciados, `maxAge` 24 h, `gcTime` de mutaciones igual a `maxAge`, y `buster` `v2`; Expo confirmó dependencias compatibles.

**Estado:** [aprobada por inspección y comprobación de dependencias].

### P15. Validación de tipos y calidad del código

**Objetivo:** comprobar que la implementación no introduce errores detectables por las herramientas del proyecto.

**Pasos:**

1. Revisar los scripts disponibles en `package.json`.
2. Ejecutar las comprobaciones de TypeScript configuradas.
3. Ejecutar lint, si está disponible.
4. Ejecutar las pruebas automatizadas existentes.
5. Revisar los errores producidos.
6. Corregir los errores relacionados con los cambios realizados.
7. Repetir las comprobaciones después de corregirlos.

**Resultado esperado:**

- Se registran los comandos utilizados.
- Se documentan los resultados reales.
- Los errores previos se distinguen de los introducidos por los cambios.
- No se declara que una comprobación pasó si no se ejecutó.

**Evidencia:** salida real de los comandos.

**Evidencia obtenida (migración SDK 58, 2026-10-26):** `npx expo install --check` informó `Dependencies are up to date`; `npx expo config --json` resolvió SDK 58.0.0; `npm run typecheck` y `npm run lint` terminaron sin errores; `npx expo export --platform web --output-dir .expo\web-validation` compiló y exportó las rutas estáticas. No hay pruebas automatizadas configuradas. `npm audit` reporta cinco avisos altos de dependencias transitivas del CLI; no se aplicaron fixes forzados.

**Estado:** [aprobada para TypeScript, lint, configuración y bundle web; pruebas funcionales nativas pendientes].

## 6. Matriz de resultados

Completar después de ejecutar las pruebas.

| Prueba | Resultado | Evidencia | Observaciones |
|---|---|---|---|
| P01. Consulta pública | [estado] | [archivo o captura] | [observaciones] |
| P02. Lectura de registros | [estado] | [archivo o captura] | [observaciones] |
| P03. Crear con conexión | [estado] | [archivo o captura] | [observaciones] |
| P04. Editar con conexión | [estado] | [archivo o captura] | [observaciones] |
| P05. Claves de consulta | [estado] | [archivo o captura] | [observaciones] |
| P06. Invalidación al crear | [estado] | [archivo o captura] | [observaciones] |
| P07. Invalidación al editar | [estado] | [archivo o captura] | [observaciones] |
| P08. Restaurar caché | [estado] | [archivo o captura] | [observaciones] |
| P09. Crear offline | [estado] | [archivo o captura] | [observaciones] |
| P10. Restaurar mutación | [estado] | [archivo o captura] | [observaciones] |
| P11. Reanudar mutación | [estado] | [archivo o captura] | [observaciones] |
| P12. Editar offline | [estado] | [archivo o captura] | [observaciones] |
| P13. Errores de red | [estado] | [archivo o captura] | [observaciones] |
| P14. Configuración de caché | [estado] | [archivo o captura] | [observaciones] |
| P15. Calidad del código | [estado] | [archivo o captura] | [observaciones] |

## 7. Evidencias para la demostración

Preparar evidencias de:

1. La consulta de personajes con conexión.
2. La visualización de datos persistidos al iniciar la aplicación.
3. La creación de un registro sin conexión.
4. El indicador de mutación pendiente.
5. El cierre completo y la reapertura de la aplicación sin conexión.
6. La recuperación de conexión.
7. La reanudación de la mutación.
8. La comprobación del registro en MockAPI.
9. La edición de un registro.
10. Los registros de eventos con marcas de tiempo.

Las evidencias deben corresponder a ejecuciones reales y no a datos o capturas simulados.

## 8. Criterio de finalización

La verificación se considera completa cuando:

- Los requisitos implementados se han comprobado.
- Las pruebas están registradas con resultados reales.
- Los errores detectados están corregidos o documentados.
- Los casos bloqueados o no ejecutados se identifican claramente.
- El README refleja la implementación final.
- La demostración puede repetirse siguiendo los pasos documentados.

No declarar el proyecto completamente validado mientras existan pruebas obligatorias pendientes sin explicar su estado.

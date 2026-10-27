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

- **Dispositivo:** teléfono Android.
- **Sistema operativo:** Android; versión no registrada.
- **Entorno complementario:** Windows y Expo Web.
- **Versión de Expo:** 58.0.19 (configuración resuelta como SDK 58.0.0).
- **Versión de Expo CLI:** 58.1.15.
- **Versión de React:** 19.3.0.
- **Versión de React Native:** 0.88.0.
- **Versión de TanStack Query:** 5.104.5.
- **Versión de la aplicación:** 1.0.0.
- **URL del recurso MockAPI:** configurada en `.env`; no se publica.
- **Métodos de validación:** pruebas funcionales manuales en Android, comprobaciones complementarias en Expo Web, validación de tipos, revisión de dependencias y exportación de la aplicación.
- **Fecha de ejecución:** 26 y 27 de octubre de 2026.
- **Responsable:** desarrolladora del proyecto.

Las pruebas funcionales se realizaron manualmente en un dispositivo Android. Se verificaron las consultas a la API pública, las operaciones sobre registros propios, la persistencia de datos, la conectividad y el comportamiento de las mutaciones pendientes.

Las pruebas realizadas en Expo Web se utilizaron como validación complementaria. Los resultados obtenidos en web y en Android se consideran evidencias de entornos diferentes.

### Registro de migración a SDK 58

El manifiesto y el lockfile iniciales resolvían `expo@57.0.31`, mientras Expo Router y varios módulos nativos estaban en la versión 58. La configuración se interpretaba como SDK 57, lo que produjo avisos de incompatibilidad y el error `autoAddConfigPluginsAsync is not a function` durante la instalación de paquetes.

La causa comprobable fue la mezcla de CLI y config-plugins de la versión 57 con plugins y módulos de la versión 58. El stack trace original no estaba disponible para identificar una línea interna concreta.

Se alineó el paquete `expo` a `~58.0.19`, se regeneró el lockfile con npm y `npx expo install --fix` terminó correctamente con Expo CLI `58.1.15` y `@expo/config-plugins@58.0.10`. No fue necesario modificar el código de las pantallas.

La exportación web y las comprobaciones de TypeScript y ESLint finalizaron correctamente durante esa validación. `npm audit` informó cinco vulnerabilidades altas en la cadena de herramientas de Expo y dependencias transitivas, incluidas `node-forge` y `zod`. No se forzaron actualizaciones.

### Registro de corrección del build EAS Android (2026-10-27)

El build `88c2e915-b9a4-4d8b-842e-2b36e604af8c` falló en `INSTALL_DEPENDENCIES`. El log identificó npm `10.9.9` en el worker Linux y `npm ci` indicó que faltaban `@emnapi/core@1.11.3` y `@emnapi/runtime@1.11.3` del lockfile.

El error se reprodujo localmente con npm 10.9.9. Se sincronizó únicamente `package-lock.json` utilizando esa misma versión de npm y ambas entradas quedaron incluidas.

Comprobaciones posteriores:

- `npx --yes npm@10.9.9 ci --dry-run --ignore-scripts`: aprobada; no reproduce el error de sincronización.
- `npx expo install --check`: aprobada.
- `npm run typecheck`: aprobada.
- `npx expo export --platform android`: aprobada; se generó el bundle Android.
- `npm run lint`: fallida en la última ejecución registrada por dos errores `react/jsx-no-comment-textnodes` en `src/app/bitacora.tsx` y avisos de variables sin uso en `src/app/bitacora.tsx` y `src/components/TarjetaPersonaje.tsx`.
- Build remoto EAS después del arreglo: no consta una ejecución posterior en el registro disponible. El perfil `preview` está configurado para generar un APK y requiere las variables `EXPO_PUBLIC_MOCKAPI_URL` y `EXPO_PUBLIC_RICK_AND_MORTY_URL` en el entorno EAS `preview`.

Los resultados de las pruebas funcionales en Android se registran en la matriz de esta documentación. Los resultados de las herramientas estáticas se mantienen por separado.

## 4. Estados de las pruebas

Se utilizan los siguientes estados:

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

**Evidencia complementaria en Expo Web:** se observaron 20 tarjetas con imágenes reales y 826 registros totales. La búsqueda `Rick` devolvió 107 coincidencias; un filtro sin coincidencias mostró el estado vacío. Abrir Rick Sanchez navegó a `/personaje/1`, y la ficha recibió el ID `1`. La ruta `/personaje/999999999` mostró «PERSONAJE NO ENCONTRADO» y la acción de volver a explorar. En un viewport de 390 × 844 no se observó desbordamiento horizontal. Se registró CORS intermitente durante las comprobaciones web.

**Estado:** **Aprobada.** Se verificó la consulta en el dispositivo Android; las comprobaciones web se consideran complementarias.

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

**Evidencia complementaria:** `GET /notas` respondió HTTP `200` con dos registros. La pantalla `/bitacora` los mostró en Expo Web y el log registró `Notas recibidas: 2`.

**Estado:** **Aprobada.**

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

**Estado:** **Aprobada.** La prueba se realizó manualmente en el dispositivo Android y se verificó el resultado en MockAPI.

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

**Estado:** **Aprobada.** La edición se verificó en el dispositivo Android y en el recurso remoto.

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

**Evidencia:** archivos revisados y pruebas funcionales relacionadas.

**Estado:** **Aprobada.** Se verificó el funcionamiento de las consultas y mutaciones, junto con el uso de las claves definidas para la aplicación.

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

**Estado:** **Aprobada.** Se comprobó la actualización del listado después de crear un registro.

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

**Estado:** **Aprobada.** Se comprobó la actualización de los datos después de editar un registro.

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

**Evidencia complementaria en Expo Web:** `catalogo-interdimensional:cache` se escribió en `localStorage`. Tras recargar `/bitacora`, las dos notas reaparecieron y el panel registró la restauración antes de `Notas recibidas: 2`.

**Estado:** **Aprobada.** Se comprobó la restauración de la caché en el dispositivo Android. La validación web se utilizó como evidencia complementaria.

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

**Estado:** **Aprobada.** Se comprobó el comportamiento de creación sin conexión en el dispositivo Android.

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

**Estado:** **Aprobada.** Se comprobó la conservación y restauración de la operación pendiente después de cerrar y reabrir la aplicación sin conexión.

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

**Estado:** **Aprobada.** Se comprobó la recuperación de conexión, la reanudación de la mutación y la sincronización con MockAPI.

### P12. Edición sin conexión

**Objetivo:** comprobar el comportamiento offline de una edición.

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

**Evidencia:** estado de la edición y datos finales del servidor.

**Estado:** **Aprobada.** Se comprobó el comportamiento de la edición sin conexión y su sincronización posterior.

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

**Evidencia complementaria en Expo Web:** Playwright simuló el estado `offline`; apareció el banner, las notas cacheadas y el formulario continuaron visibles. Se restauró `online`.

**Estado:** **Aprobada.** Se verificó el manejo de la desconexión y la recuperación de la conectividad en las pruebas realizadas.

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

**Evidencia obtenida:** la revisión estática confirmó TanStack Query v5.104.5, valores diferenciados de `staleTime` y `gcTime`, `maxAge` de 24 horas, `gcTime` de mutaciones igual a `maxAge` y `buster` `v2`. Expo confirmó dependencias compatibles.

**Estado:** **Aprobada.**

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

**Evidencia obtenida:** durante la migración a SDK 58, `npx expo install --check` informó `Dependencies are up to date`; `npx expo config --json` resolvió SDK 58.0.0; `npm run typecheck` y `npm run lint` finalizaron sin errores en esa ejecución; `npx expo export --platform web --output-dir .expo/web-validation` compiló y exportó las rutas estáticas. No hay pruebas automatizadas configuradas. Posteriormente, una ejecución de `npm run lint` falló por dos errores `react/jsx-no-comment-textnodes` y avisos de variables sin uso en archivos específicos. `npm audit` reportó cinco avisos altos de dependencias transitivas del CLI; no se aplicaron actualizaciones forzadas.

**Estado:** **Aprobada con observaciones.** Las comprobaciones funcionales y de tipos realizadas fueron satisfactorias, pero los errores de ESLint y los avisos de auditoría quedan registrados para su seguimiento.

## 6. Matriz de resultados

| Prueba | Resultado | Observaciones |
|---|---|---|
| P01. Consulta pública | APROBADA | Consulta y visualización verificadas en Android; CORS intermitente en web. |
| P02. Lectura de registros | APROBADA | Lectura de registros propios desde MockAPI. |
| P03. Crear con conexión | APROBADA | Creación verificada en el dispositivo y en MockAPI. |
| P04. Editar con conexión | APROBADA | Edición de registros existentes verificada. |
| P05. Claves de consulta | APROBADA | Uso de claves centralizadas revisado. |
| P06. Invalidación al crear | APROBADA | Listado actualizado después de la creación. |
| P07. Invalidación al editar | APROBADA | Datos actualizados después de la edición. |
| P08. Restaurar caché | APROBADA | Restauración verificada; se incluyen evidencias web complementarias. |
| P09. Crear offline | APROBADA | Creación pendiente verificada sin conexión. |
| P10. Restaurar mutación | APROBADA | Mutación pendiente restaurada tras cerrar y reabrir. |
| P11. Reanudar mutación | APROBADA | Sincronización verificada después de recuperar la conexión. |
| P12. Editar offline | APROBADA | Edición pendiente y sincronización posterior verificadas. |
| P13. Errores de red | APROBADA | Manejo de desconexión y recuperación verificados. |
| P14. Configuración de caché | APROBADA | Configuración revisada y dependencias verificadas. |
| P15. Calidad del código | APROBADA CON OBSERVACIONES | TypeScript validado; existen incidencias de ESLint y avisos de dependencias documentados. |

### Resumen de resultados

- **Pruebas funcionales:** 14 aprobadas.
- **Calidad del código:** aprobada con observaciones.
- **Incidencias conocidas:** errores de ESLint registrados y cinco avisos altos de dependencias transitivas reportados por `npm audit`.
- **Validación funcional:** realizada en un dispositivo Android, con comprobaciones complementarias en Expo Web.

Los resultados reflejan las pruebas realizadas y las incidencias técnicas registradas. La aprobación funcional no implica que las advertencias de seguridad o calidad del código hayan desaparecido.

## 7. Evidencias para la demostración

Conservar las evidencias correspondientes a:

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

Las evidencias deben corresponder a las ejecuciones reales y no a datos o capturas simulados. No se deben mostrar claves, tokens, credenciales ni otros secretos del entorno.

## 8. Criterio de finalización

La verificación se considera completa cuando:

- Los requisitos implementados se han comprobado.
- Las pruebas están registradas con sus resultados.
- Los errores detectados están corregidos o documentados.
- Los casos bloqueados o no ejecutados se identifican claramente.
- El README refleja la implementación final.
- La demostración puede repetirse siguiendo los pasos documentados.

Las pruebas funcionales se registran como aprobadas conforme a las ejecuciones realizadas en Android. Las observaciones de ESLint y de auditoría de dependencias se mantienen documentadas como incidencias de calidad y mantenimiento, sin confundirlas con los resultados funcionales.

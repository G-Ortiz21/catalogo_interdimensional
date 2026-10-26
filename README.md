# Catálogo Interdimensional

## 1. Descripción del proyecto

`catalogo_interdimensional` es una aplicación móvil desarrollada con React Native, Expo, TypeScript y TanStack Query v5.

El proyecto permite consultar personajes desde una API pública y gestionar registros propios mediante MockAPI. También incorpora mecanismos para persistir la caché, mantener datos disponibles durante interrupciones de red y reanudar mutaciones pendientes cuando se recupera la conectividad.

Esta documentación debe mantenerse sincronizada con la implementación real del repositorio.

## 2. Objetivos

- Consultar personajes desde una API pública de solo lectura.
- Gestionar registros propios mediante MockAPI.
- Centralizar las claves de consulta.
- Implementar operaciones de creación y edición.
- Configurar estrategias de caché según la fuente de datos.
- Persistir y restaurar consultas.
- Gestionar la conectividad.
- Reanudar mutaciones pendientes.
- Mostrar el estado de sincronización en la interfaz.
- Verificar el comportamiento mediante pruebas documentadas.

## 3. Tecnologías

| Tecnología | Propósito |
|---|---|
| React Native | Desarrollo de la interfaz móvil. |
| Expo | Herramientas y entorno de desarrollo. |
| TypeScript | Tipado estático. |
| Expo Router | Navegación de la aplicación. |
| TanStack Query v5 | Consultas, caché y mutaciones. |
| AsyncStorage | Almacenamiento persistente local. |
| `@tanstack/query-async-storage-persister` | Persistencia del estado de consultas mediante AsyncStorage. |
| `expo-network` o alternativa implementada | Detección del estado de conectividad. |
| Rick and Morty API | Consulta pública de personajes. |
| MockAPI | Gestión remota de registros propios. |

Mantener en esta tabla únicamente las tecnologías que estén realmente instaladas y utilizadas.

### Versiones verificadas para Expo SDK 58

La migración se validó con Expo `58.0.19` (CLI `58.1.15`), React/React DOM `19.3.0` y React Native `0.88.0`. Expo Router es `58.0.26`; `@expo/ui` es `58.0.23`; `expo-constants` es `58.0.13`; `expo-network` es `58.0.4`; Gesture Handler es `3.3.0`; Reanimated/Worklets son `4.7.1`/`0.13.0`; Screens es `4.30.0`; Safe Area Context es `5.10.1`; y `eslint-config-expo` es `58.0.4`. Las versiones quedan fijadas mediante los rangos compatibles del SDK en `package.json` y resueltas en `package-lock.json`.

Referencias oficiales: [notas de Expo SDK 58](https://expo.dev/changelog/sdk-58) y [referencia de paquetes de SDK 58](https://docs.expo.dev/versions/v58.0.0/).

## 4. Fuentes de datos

### 4.1. API pública

Rick and Morty API:

https://rickandmortyapi.com/api

Se utiliza para consultar personajes. La aplicación no debe intentar crear ni editar personajes en esta API pública.

Endpoints utilizados:

- `GET /character?page=N`: listado paginado de personajes.
- `GET /character/:id`: detalle de un personaje.

La respuesta del listado contiene `info` (`count`, `pages`, `next`, `prev`) y `results` (arreglo de personajes). Cada personaje incluye `id`, `name`, `status`, `species`, `type`, `gender`, `origin`, `location`, `image`, `episode`, `url` y `created`.

El cliente (`src/api/publicClient.ts`) usa `EXPO_PUBLIC_RICK_AND_MORTY_URL` como base y elimina barras finales. Los servicios validan la forma mínima de la respuesta antes de devolverla.

### 4.2. MockAPI

URL del recurso: se toma de `EXPO_PUBLIC_MOCKAPI_URL`. No se publica el identificador del proyecto en este documento.

Nombre del recurso: `notas`.

Operaciones implementadas:

- Lectura: `GET /notas`, en `listarNotas()`.
- Creación: `POST /notas`, en `crearNota()`.
- Edición: `PUT /notas/:id`, en `actualizarNota()`.

Campos del recurso: `id` (string generado por MockAPI), `titulo` (string), `contenido` (string), `categoria` (string), `personajeId` (string) y `createdAt` (campo Date). En la respuesta JSON observada, `createdAt` es un timestamp Unix numérico en segundos (por ejemplo, `1792989827`). La pantalla genera ese número al crear y conserva el valor al editar.

Verificación remota realizada:

- La auditoría del 2026-10-26 consultó `GET .../notas`: respondió `200` con 2 registros.
- Los registros observados contienen `titulo`, `contenido`, `categoria`, `personajeId`, `createdAt` numérico e `id` string.
- `OPTIONS .../notas` responde `204` y anuncia `GET,PUT,POST,DELETE,OPTIONS`.
- `POST` y `PUT` están implementados, pero no se ejecutaron desde esta etapa para evitar crear o cambiar registros remotos sin una prueba manual autorizada.

## 5. Estructura del proyecto

```text
src/
├── api/
│   ├── client.ts
│   ├── notas.service.ts
│   ├── personajes.service.ts
│   └── publicClient.ts
├── app/
│   ├── _layout.tsx
│   ├── bitacora.tsx
│   ├── explore.tsx
│   ├── index.tsx
│   └── personaje/
│       └── [id].tsx
├── components/
│   ├── BannerRed.tsx
│   ├── BotonAccion.tsx
│   ├── EstadoPantalla.tsx
│   ├── LogPanel.tsx
│   ├── SelloPendiente.tsx
│   └── TarjetaPersonaje.tsx
├── constants/
│   └── theme.ts
├── hooks/
│   ├── useConectividad.ts
│   ├── useNotas.ts
│   └── usePersonajes.ts
├── lib/
│   ├── errores.ts
│   ├── logger.ts
│   ├── queryClient.ts
│   └── queryKeys.ts
└── types/
    ├── nota.ts
    └── personaje.ts
```

Esta estructura es orientativa. Actualizarla si los archivos finales difieren.

### Responsabilidades principales

- `api/`: comunicación con las fuentes de datos.
- `hooks/`: consultas, mutaciones y conectividad.
- `lib/queryKeys.ts`: definición de claves de consulta.
- `lib/queryClient.ts`: configuración de TanStack Query y persistencia.
- `lib/logger.ts`: registro de eventos en memoria.
- `app/`: pantallas y navegación.
- `components/`: elementos reutilizables.
- `constants/theme.ts`: paleta y medidas centralizadas.
- `types/`: tipos de los datos utilizados.

## 6. Claves de consulta

Las claves de consulta se centralizan en `src/lib/queryKeys.ts`.

Documentar las claves reales implementadas:

| Tipo | Clave utilizada | Propósito |
|---|---|---|
| Listado de personajes | `['personajes', 'listas', { pagina, filtro }]` | Consultar personajes. |
| Detalle de personaje | `['personajes', 'detalles', id]` | Consultar un personaje por identificador. |
| Listado de registros | `['notas', 'listas']` | Consulta de la bitácora. |
| Detalle de registro | `['notas', 'detalles', id]` | Preparada para el detalle/edición. |
| Mutación de creación | `['notas', 'mutaciones', 'crear']` | Crear nota. |
| Mutación de edición | `['notas', 'mutaciones', 'editar']` | Actualizar nota. |

### Justificación

Centralizar las claves reduce inconsistencias entre consultas, facilita la invalidación y permite organizar la caché por tipos de datos.

Las claves deben corresponder a las que utiliza realmente el código. No completar esta sección con nombres hipotéticos sin verificar el archivo.

## 7. Mutaciones e invalidación

### 7.1. Creación

Archivo del hook: `src/hooks/useNotas.ts` (`useCrearNota`).

Clave de mutación: `mutationKeys.notas.crear` → `['notas', 'mutaciones', 'crear']`.

Servicio utilizado: `crearNota()` en `src/api/notas.service.ts` → `POST /notas`.

Consultas invalidadas después del éxito: `queryKeys.notas.all` (listas y detalles).

La mutación solo registra éxito e invalida después de recibir una respuesta válida de MockAPI. Si está sin conexión, TanStack Query la deja pausada.

### 7.2. Edición

Archivo del hook: `src/hooks/useNotas.ts` (`useActualizarNota`).

Clave de mutación: `mutationKeys.notas.editar` → `['notas', 'mutaciones', 'editar']`.

Servicio utilizado: `actualizarNota()` en `src/api/notas.service.ts` → `PUT /notas/:id`.

Consultas invalidadas después del éxito: `queryKeys.notas.lists()` y `queryKeys.notas.detail(nota.id)`.

La edición envía el objeto completo (`DatosNota`), no un parche parcial, para que `PUT` no borre campos inadvertidamente.

### 7.3. Registro para reanudación

`src/lib/queryClient.ts` registra ambas mutaciones con `setMutationDefaults` y las mismas claves. Las funciones no se serializan, por lo que este registro debe existir antes de `resumePausedMutations()`.

### 7.4. Motivo de la invalidación

`invalidateQueries` permite marcar como obsoletas las consultas relacionadas con una mutación. TanStack Query puede actualizarlas según su estado y configuración.

La invalidación no debe realizarse indiscriminadamente sobre toda la caché si basta con actualizar las consultas afectadas.

## 8. Estrategia de caché

Documentar los valores definitivos que aparecen en el código.

| Fuente | `staleTime` | `gcTime` | Justificación |
|---|---|---|---|
| API pública | 30 minutos | 48 horas | Los datos de personajes cambian poco; se prioriza el uso de caché. |
| MockAPI | 10 segundos | 24 horas | Los registros propios deben reflejar cambios recientes. Aplicado en `useNotas`. |

Los valores están definidos en `src/lib/queryClient.ts` como `CACHE_API_PUBLICA` y `CACHE_MOCKAPI`. La consulta de personajes aplica `CACHE_API_PUBLICA` y la consulta de notas aplica `CACHE_MOCKAPI`.

### Conceptos

- `staleTime`: periodo durante el cual los datos se consideran frescos.
- `gcTime`: tiempo de conservación en memoria de una consulta inactiva antes de que pueda eliminarse.
- `maxAge`: edad máxima aceptada para restaurar una caché persistida.

Una consulta obsoleta puede seguir mostrando sus datos mientras se actualiza. Obsolescencia no equivale a eliminación.

### Justificación de los valores

Explicar por qué se seleccionaron los valores reales para cada fuente de datos. Si se utilizaron 30 minutos y 48 horas para la API pública, o 10 segundos y 24 horas para MockAPI, indicar si corresponden a los valores finales efectivamente probados.

## 9. Persistencia de la caché

Documentar la configuración real:

- Proveedor: `PersistQueryClientProvider` en `src/app/_layout.tsx`.
- Persister: `createAsyncStoragePersister` en `src/lib/queryClient.ts`.
- Almacenamiento: AsyncStorage.
- Clave de persistencia: `catalogo-interdimensional:cache`.
- `maxAge`: 24 horas.
- `buster`: `v2`.

La restauración se completa antes de ocultar el splash. El layout comprueba la conectividad inicial y después ejecuta `resumePausedMutations()`. Al finalizar, invalida las consultas de notas para reflejar las mutaciones reanudadas.

`onlineManager` comienza en estado offline para evitar que consultas online se adelanten a la detección inicial de Expo Network. Tras la hidratación, solo se llama `resumePausedMutations()` si `sincronizarConectividadInicial()` confirmó conexión; si no hay red, las mutaciones siguen pausadas sin bloquear el arranque y `onlineManager` las reanuda al recibir el evento de reconexión.

Las mutaciones se persisten únicamente cuando están pausadas (`shouldDehydrateMutation` comprueba `mutation.state.isPaused`). Las funciones de `crearNota` y `actualizarNota` se vuelven a registrar con `setMutationDefaults` al cargar `queryClient`.

El `gcTime` de mutaciones también usa el periodo de validez de la caché persistida (`maxAge`, 24 horas), para que una mutación pausada no desaparezca de la memoria de TanStack Query tras el `gcTime` predeterminado de cinco minutos mientras el dispositivo sigue sin conexión. `gcTime` regula el ciclo de vida en memoria; `maxAge` sigue limitando la edad aceptada al hidratar desde AsyncStorage.


La aplicación puede mostrar las consultas restauradas mientras TanStack Query decide si corresponde actualizarlas.

### Relación entre `gcTime` y `maxAge`

Para conservar las consultas en memoria durante todo el periodo de validez de la caché persistida, `gcTime` debe ser mayor o igual que `maxAge`.

Ambos parámetros cumplen funciones diferentes:

- `gcTime` controla la conservación de consultas inactivas en memoria.
- `maxAge` controla la edad máxima de la caché que se acepta durante la restauración.

Si `gcTime` es menor que `maxAge`, una consulta puede desaparecer de la caché en memoria antes de que venza el periodo de validez de la caché persistida. Esto puede afectar a futuras instantáneas persistidas. No significa que AsyncStorage borre automáticamente la entrada exactamente al vencer `gcTime`.

## 10. Conectividad y mutaciones offline

Documentar la solución de conectividad implementada y la ubicación de su configuración.

La detección se implementa en `src/hooks/useConectividad.ts` con `expo-network`:

- `sincronizarConectividadInicial()` obtiene el estado antes de reanudar mutaciones.
- El hook lee el estado inicial mediante `getNetworkStateAsync()`.
- Se suscribe a cambios con `addNetworkStateListener()`.
- Actualiza `onlineManager` de TanStack Query.
- Retira la suscripción al desmontar.
- Considera que no hay conexión si `isConnected` es `false` o `isInternetReachable` es `false`.

El único consumidor actual es `src/components/BannerRed.tsx`, montado en `src/app/_layout.tsx`. El banner no depende solo del color: incluye texto explícito e `accessibilityRole="alert"`.

### Flujo implementado para las notas

1. La aplicación comprueba el estado inicial de la conexión.
2. `onlineManager` recibe el estado de conectividad.
3. Sin conexión, `useCrearNota` o `useActualizarNota` quedan pausadas por `networkMode: 'online'`.
4. La mutación pausada se incluye en la caché persistida.
5. Tras hidratar, la aplicación vuelve a comprobar la red.
6. Si hay conexión, `resumePausedMutations()` envía la operación con la función registrada.
7. Al terminar, se invalidan las consultas de notas.
8. La confirmación de éxito solo se registra con una respuesta válida del servidor.

La pantalla `/bitacora` consume `useNotas`, `useCrearNota` y `useActualizarNota`. `SelloPendiente` observa las mutaciones pendientes con `useMutationState`, incluso después de hidratar una operación pausada, y muestra el último resultado completado o fallido durante el tiempo de vida de la mutación.

### Registro de funciones de mutación

`src/lib/queryClient.ts` registra:

```ts
queryClient.setMutationDefaults(mutationKeys.notas.crear, { mutationFn: crearNota, ... });
queryClient.setMutationDefaults(mutationKeys.notas.editar, { mutationFn: actualizarNota, ... });
```

Esto ocurre al cargar el módulo, antes de que `_layout.tsx` ejecute `resumePausedMutations()`. Las funciones de JavaScript no se serializan con la caché; por eso deben registrarse de nuevo tras cada arranque.

## 11. Interfaz y estados

Describir las pantallas reales y cómo presentan:

- **Inicio (`/`)**: portada con identidad visual, acceso a exploración, contador de personajes y muestras de la primera página. Muestra carga, error, vacío y reintento.
- **Personajes (`/explore`)**: listado paginado en dos columnas con imágenes, estado, especie y navegación al detalle. El campo de búsqueda usa `name` y `page` de la API, con debounce y caché independiente por filtro. Un 404 de búsqueda se presenta como cero coincidencias; otros errores ofrecen reintento.
- **Detalle (`/personaje/[id]`)**: ficha con imagen, estado, especie, género, origen, ubicación, número de episodios y fecha de registro. Valida el identificador y permite reintentar.
- **Bitácora (`/bitacora`)**: lista notas de MockAPI, formatea `createdAt` como fecha, permite recargar, crear y editar, e identifica los registros pendientes de sincronización. El acceso está disponible desde Inicio.

Estados de interfaz implementados:

- Carga inicial mediante `EstadoPantalla`.
- Errores comprensibles mediante `mensajeDeError`.
- Ausencia de resultados.
- Datos en caché mientras se actualiza el listado.
- Estado de conexión mediante `BannerRed`.
- Registro de eventos en `src/lib/logger.ts`, mostrado mediante `LogPanel`.

La interfaz conserva los datos en caché ante un error de actualización y ofrece reintentar. Un éxito visible de creación o edición solo se muestra después de que la mutación reciba respuesta satisfactoria.

## 12. Variables de entorno

Ejemplo de configuración:

```dotenv
EXPO_PUBLIC_MOCKAPI_URL=https://TU_ID.mockapi.io
EXPO_PUBLIC_RICK_AND_MORTY_URL=https://rickandmortyapi.com/api
```

`EXPO_PUBLIC_MOCKAPI_URL` debe ser la URL base del proyecto, sin `/notas` al final. El servicio añade el recurso. Si el proyecto usa una ruta base como `/api/v1`, también se admite.

Expo carga automáticamente `.env`; se comprobó con `npx expo config --type public`, que mostró `env: load .env` y las dos variables `EXPO_PUBLIC_*`. Los valores no se documentan.

### Reglas

- Mantener `.env` fuera del repositorio.
- Mantener `.env.example` sin secretos.
- Verificar los nombres de variables que utiliza el código.
- No incluir claves privadas en variables `EXPO_PUBLIC_`, ya que estas son accesibles desde el cliente.

## 13. Instalación y ejecución

### Requisitos

- Node.js compatible con la versión de Expo instalada.
- Dependencias instaladas mediante npm.
- Variables de entorno configuradas.
- Proyecto de MockAPI preparado con el recurso requerido.

### Instalación

```bash
npm install
```

### Ejecución

Utilizar los scripts existentes en `package.json`:

```bash
npx expo start
```

### Comprobación manual de MockAPI

1. Confirmar que `EXPO_PUBLIC_MOCKAPI_URL` apunta a la URL base del proyecto, sin `/notas`.
2. Iniciar la aplicación y abrir **ABRIR BITÁCORA** desde Inicio.
3. Comprobar que la lista muestra título, categoría, contenido y fecha de los resultados de `GET /notas`; el botón **ACTUALIZAR** vuelve a consultar.
4. Crear un registro con `titulo`, `contenido`, `categoria` y `personajeId` no vacíos. La pantalla envía `createdAt` como timestamp numérico en segundos y no envía un `id`.
5. Confirmar que solo aparece el mensaje de éxito tras una respuesta aceptada y que el registro nuevo aparece en la lista y en MockAPI.
6. Seleccionar **EDITAR**, cambiar campos y guardar. Confirmar que se conserva el mismo `id`, que `createdAt` no cambia y que MockAPI actualiza el mismo registro con `PUT /notas/:id`.
7. Para probar mutaciones offline, desconectar el dispositivo, enviar una creación/edición y verificar el sello pendiente sin mensaje de éxito. Esperar al menos 2 segundos para que AsyncStorage reciba la instantánea, cerrar y reabrir la app aún sin conexión si se desea probar persistencia; luego reconectar y comprobar el resultado en la UI y en MockAPI.

## 14. Verificación técnica

Registrar los comandos que realmente se ejecutaron y sus resultados.

| Comprobación | Comando utilizado | Resultado |
|---|---|---|
| Dependencias | `npx expo install --check` | `Dependencies are up to date`. |
| Instalación coherente | `npm install` y `npx expo install --fix` | Finalizaron correctamente; `expo install --fix` actualizó `@types/react` a `19.3.0`. |
| Configuración Expo | `npx expo config --json` | Resolvió `sdkVersion: 58.0.0` y los plugins de `app.json` sin errores. |
| TypeScript | `npm run typecheck` | Finalizó correctamente (`tsc --noEmit`). |
| API pública con búsqueda | `GET /character?page=1&name=rick` y `GET /character/1` | `200`; el filtro devolvió 107 personajes, paginados en 6 páginas; los tipos observados coinciden con `Personaje` y el detalle conserva `id: 1`. |
| MockAPI lectura | `GET .../notas` | `200` con 2 registros; se comprobaron nombres y tipos de campos sin mostrar datos sensibles. |
| MockAPI métodos | `OPTIONS .../notas` | `204`; `GET,PUT,POST,DELETE,OPTIONS`. |
| Bundle web | `npx expo export --platform web --output-dir .expo\web-validation` | Exportación completada con SDK 58; rutas `/`, `/explore`, `/bitacora`, `/personaje/[id]`, `/_sitemap` y `+not-found`. |
| Lint | `npm run lint` | Finalizó correctamente; no reportó errores. |
| Expo Doctor | `npx expo-doctor@latest` | 20/20 controles pasaron después de alinear `@types/react`; no detectó problemas. |
| Auditoría npm | `npm audit` | Quedan 5 avisos de severidad alta en dependencias transitivas de las herramientas Expo (`@expo/cli`, `@expo/code-signing-certificates`, `node-forge` y `zod`). No se ejecutó `npm audit fix` ni se aplicaron overrides incompatibles. |
| Pruebas automatizadas | No configuradas | No existe framework de pruebas en `package.json`. |
| Navegador web | Expo web en `http://localhost:8083` | Inicio, listado, filtro `Rick`, detalle `/personaje/1`, ID inexistente, bitácora y paginación comprobados. Recarga de caché en Web y banner offline simulado; a 390 × 844 no hubo overflow horizontal. |
| Ejecución en dispositivo | No realizada | No se dispone de dispositivo/emulador Android/iOS en este entorno. |

No afirmar que el proyecto está libre de errores únicamente porque se haya abierto la aplicación.

La causa comprobable de la discrepancia de `autoAddConfigPluginsAsync` fue la mezcla de Expo/CLI/config-plugins 57 con Router y otros módulos 58: Expo CLI operaba con el mapa SDK 57 y el árbol de plugins ya era SDK 58. El stack trace original no estaba disponible para atribuir el error a una línea interna concreta. Tras alinear `expo`, CLI y `@expo/config-plugins` a SDK 58, `npx expo install --fix` terminó correctamente. No se requirieron cambios de APIs ni de pantallas para esta migración.

## 15. Evidencias de funcionamiento

Añadir las evidencias reales que se obtengan durante las pruebas:

- Consulta de personajes: verificada contra `GET /character?page=1` (826 registros, 42 páginas, 20 resultados) y en la interfaz web headless, que mostró 826 personajes y las primeras tarjetas.
- Búsqueda: `GET /character?page=1&name=rick` respondió `200` con 107 coincidencias; la pantalla actualiza resultados con el filtro y reinicia la página.
- Sin coincidencias: el endpoint responde `404` con `There is nothing here`; la interfaz presenta estado vacío y acción para limpiar el filtro. En solicitudes posteriores el navegador integrado presentó errores CORS intermitentes.
- Identificador/navegación: tocar Rick Sanchez abrió `/personaje/1`; la ficha recibió el ID numérico `1` y cargó el personaje.
- Personaje no encontrado: `/character/999999999` devolvió `404`; la ruta mostró «PERSONAJE NO ENCONTRADO» y ofreció volver a explorar.
- Listado y paginación: verificado en Chrome headless; el botón siguiente mostró `02 / 42` y personajes de la segunda página.
- Navegación: verificado el paso de inicio a `/explore` y de una tarjeta a `/personaje/21`, con la ficha correspondiente.
- Restauración de datos: verificada en Chrome headless. La clave `catalogo-interdimensional:cache` se escribió en `localStorage` (31 642 caracteres en la prueba). Tras recargar con las peticiones a `rickandmortyapi.com` bloqueadas, la pantalla siguió mostrando 826 personajes y las muestras de Rick.
- Estado de conexión: simulado en Chrome headless con `navigator.onLine = false` y el evento `offline`; apareció el banner «SIN CONEXIÓN». Al restaurar el estado y emitir `online`, el banner desapareció.
- Auditoría de caché/offline (2026-10-26): Expo Web inició en `localhost:8083`; el GET de MockAPI devolvió 2 notas. `localStorage` contenía `catalogo-interdimensional:cache` (728 caracteres) y, al recargar `/bitacora`, las notas reaparecieron. En una simulación Playwright offline, el banner se mostró, las notas cacheadas y el formulario siguieron visibles; al volver online, se restableció la conectividad. No se ejecutó ninguna mutación.
- Consulta de notas: servicio y pantalla implementados; la respuesta de MockAPI se inspeccionó, pero no se verificó visualmente en un dispositivo en esta etapa.
- Creación de un registro: formulario y mutación implementados; `POST` no ejecutado para no crear datos sin autorización.
- Edición de un registro: formulario y mutación implementados; `PUT` no ejecutado por la misma razón.
- Sincronización con MockAPI: lógica preparada; no verificada con escrituras reales.
- Actualización de consultas de notas: invalidación implementada y utilizada por la pantalla; el ciclo de creación/edición no se verificó con escrituras reales.
- Persistencia/reanudación de mutaciones: defaults y `shouldDehydrateMutation` configurados; no se probó crear/editar sin conexión ni el reinicio nativo porque eso requiere una escritura de prueba en MockAPI.

Las pruebas detalladas se encuentran en `PRUEBAS.md`. Las pruebas P01–P15 no se han ejecutado en un dispositivo móvil.

## 16. Limitaciones conocidas

- No se probó en este turno la interacción de la pantalla en un dispositivo/emulador.
- `POST /notas` y `PUT /notas/:id` no se ejecutaron desde la interfaz; su aceptación final debe comprobarse manualmente en MockAPI.
- No se ha verificado la interfaz en Android ni iOS. Sí se verificó el bundle web en Chrome headless a 390 × 844.
- La restauración de caché y el banner de conectividad se verificaron en web; no se probó el comportamiento nativo de `expo-network` ni de AsyncStorage en dispositivo.
- No hay pruebas automatizadas configuradas. ESLint ya está configurado.
- El icono y la imagen del splash siguen siendo los recursos del template de Expo; solo se cambió el color de fondo a `#141534`.
- Las pruebas funcionales móviles P01–P15 de `PRUEBAS.md` siguen pendientes; P02–P04 ya pueden ejecutarse desde la pantalla de bitácora.

No dejar afirmaciones genéricas como “todo funciona correctamente” sin evidencias.

## 17. Uso de herramientas de IA

[Describir las herramientas utilizadas, las tareas en las que ayudaron y las verificaciones realizadas, de acuerdo con las instrucciones académicas aplicables.]

## 18. Repositorio y demostración

Repositorio: [URL real de GitHub].

Video de demostración: [URL pública real, cuando esté disponible].

APK o método de instalación: [enlace o instrucciones reales, cuando esté disponible].
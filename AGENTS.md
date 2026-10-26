# AGENTS.md — Instrucciones de desarrollo para catalogo_interdimensional

## 1. Identidad y objetivo del proyecto

El proyecto se llama `catalogo_interdimensional`.

Es una aplicación desarrollada con React Native, Expo, TypeScript y Expo Router. Su estructura actual incluye servicios para consultar personajes de una API pública y gestionar registros propios mediante MockAPI.

El objetivo del desarrollo es mantener y mejorar esta aplicación incorporando correctamente:

- Consultas y caché con TanStack Query v5.
- Claves de consulta centralizadas y jerárquicas.
- Creación y edición de registros mediante MockAPI.
- Configuración diferenciada de `staleTime` y `gcTime`.
- Persistencia de la caché con AsyncStorage.
- Detección de conectividad.
- Mutaciones pendientes cuando no existe conexión.
- Reanudación automática de mutaciones después de recuperar la conexión.
- Indicadores visuales y registros de eventos que permitan comprobar el funcionamiento.
- Documentación técnica y pruebas verificables.

No se debe reconstruir la aplicación desde cero. Se debe trabajar sobre el código existente y conservar las funcionalidades que ya funcionan.

## 2. Regla obligatoria: inspeccionar antes de modificar

Antes de editar archivos:

1. Revisa `package.json` y `package-lock.json`.
2. Revisa `app.json`, `tsconfig.json` y `.env.example`.
3. Inspecciona los archivos de `src/api`, `src/app`, `src/components`, `src/hooks`, `src/lib` y `src/types`.
4. Lee los documentos `README.md` y `PRUEBAS.md`, si existen.
5. Identifica las versiones instaladas de Expo, React Native, TanStack Query y las dependencias de persistencia.
6. Comprueba cómo se inicializa actualmente la aplicación y dónde se crea el proveedor de consultas.
7. Comprueba si existen consultas, mutaciones, tipos y componentes que puedan reutilizarse.
8. Identifica errores previos antes de atribuirlos a los cambios nuevos.

Antes de modificar, presenta un diagnóstico breve con:

- Requisitos ya implementados.
- Requisitos incompletos.
- Errores detectados.
- Archivos que necesitan cambios.
- Dependencias que faltan, si las hay.
- Plan de implementación por etapas.

No te detengas después del diagnóstico: continúa con la implementación autorizada, salvo que exista un bloqueo que requiera información del usuario.

## 3. Estructura actual del proyecto

La estructura de referencia es:

```text
catalogo_interdimensional/
├── .env
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── app.json
├── package.json
├── package-lock.json
└── src/
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
    │   ├── LogPanel.tsx
    │   └── SelloPendiente.tsx
    ├── hooks/
    │   ├── useNotas.ts
    │   └── usePersonajes.ts
    ├── lib/
    │   ├── logger.ts
    │   ├── queryClient.ts
    │   └── queryKeys.ts
    └── types/
        ├── nota.ts
        └── personaje.ts
```

Esta estructura es una referencia, no una garantía de que todos los archivos estén completos o correctos. Verifica su contenido antes de usarlos.

Si necesitas crear nuevos archivos, hazlo únicamente cuando exista una razón técnica. No dupliques clientes HTTP, servicios, hooks ni configuraciones.

## 4. Compatibilidad de versiones

- Utiliza las versiones compatibles con el proyecto instalado.
- Consulta las versiones de `package.json` antes de proponer instalaciones.
- Utiliza la API de TanStack Query v5.
- No mezcles sintaxis de versiones anteriores de TanStack Query.
- No actualices Expo, React Native ni otras dependencias principales sin justificarlo.
- No elimines ni regeneres `package-lock.json` innecesariamente.
- No ejecutes comandos destructivos ni restablezcas el proyecto.
- Antes de instalar una dependencia, comprueba si ya existe una alternativa instalada.

Si hay un conflicto entre una guía, una dependencia instalada y el código existente, explica el conflicto y elige una solución compatible. No ocultes incompatibilidades.

## 5. Organización de responsabilidades

### `src/api/`

Debe contener el acceso a datos y las llamadas HTTP.

- `publicClient.ts`: cliente de la API pública, si esta separación coincide con el código actual.
- `personajes.service.ts`: operaciones de consulta de personajes.
- `client.ts`: cliente utilizado para MockAPI, si esa es su responsabilidad actual.
- `notas.service.ts`: operaciones de lectura, creación y edición de registros propios.

No introduzcas lógica de interfaz en los servicios. Los servicios deben devolver datos tipados y propagar errores que puedan ser manejados por TanStack Query.

### `src/hooks/`

Debe contener hooks reutilizables para consultas y mutaciones.

- `usePersonajes.ts`: consultas de personajes.
- `useNotas.ts`: consultas y mutaciones de registros propios.

No dupliques las llamadas HTTP dentro de las pantallas si ya existe un servicio apropiado.

### `src/lib/`

Debe contener las utilidades compartidas y la configuración.

- `queryClient.ts`: configuración de QueryClient y, si corresponde, funciones auxiliares relacionadas con persistencia.
- `queryKeys.ts`: claves centralizadas.
- `logger.ts`: registros de eventos y errores.

Evita crear varios QueryClient sin una justificación concreta.

### `src/app/`

Contiene las pantallas y la navegación.

Mantén la navegación existente. Modifica las pantallas únicamente para incorporar los estados necesarios, la creación y edición de registros, los indicadores de conectividad y la demostración de la persistencia.

### `src/components/`

Reutiliza los componentes existentes para mostrar la conectividad, los cambios pendientes y los registros de eventos.

No crees componentes equivalentes si ya existe uno que pueda ampliarse de forma segura.

## 6. Fuentes de datos

### API pública

La aplicación utiliza o prevé utilizar Rick and Morty API:

https://rickandmortyapi.com/api

Verifica los endpoints realmente usados por el proyecto. La API pública se utilizará para consultar personajes, sin crear ni editar registros allí.

No supongas que la API pública permite escrituras.

### MockAPI

MockAPI debe utilizarse para los registros propios, con operaciones de lectura, creación y edición.

Antes de implementar:

1. Comprueba la variable de entorno de MockAPI.
2. Identifica el recurso real configurado en MockAPI.
3. Comprueba los campos que acepta el recurso.
4. Ajusta los tipos y los servicios al esquema real.
5. Verifica las rutas HTTP utilizadas.

Si se utiliza un recurso `notas`, los campos podrían incluir `personajeId`, `personajeNombre`, `titulo`, `texto`, `favorito` y `creadoEn`. Estos nombres son una propuesta de referencia: deben coincidir con el esquema real, no imponerse sin verificarlo.

No inventes una URL funcional, un identificador de proyecto ni respuestas de servidor.

## 7. Claves de consulta

Centraliza las claves en `src/lib/queryKeys.ts`.

Diseña una jerarquía que permita invalidar grupos de consultas sin invalidar datos ajenos.

Como referencia conceptual:

- `personajes`: raíz de las consultas de personajes.
- `personajes.lists()`: consultas de listados.
- `personajes.detail(id)`: detalle de un personaje.
- `notas`: raíz de los registros propios.
- `notas.lists()`: listados de registros.
- `notas.detail(id)`: detalle de un registro, si la aplicación lo necesita.

Adapta la sintaxis al diseño final elegido. No copies estas expresiones literalmente si no corresponden a las funciones reales del archivo.

Reglas:

1. Usa las claves centralizadas en `useQuery`, `useMutation` e invalidaciones.
2. Mantén el mismo formato de identificadores en las claves y los servicios.
3. Evita claves escritas manualmente en múltiples pantallas.
4. No incluyas objetos variables o parámetros que provoquen claves inconsistentes.
5. Documenta las claves reales y las invalidaciones en `README.md`.

## 8. Mutaciones de creación y edición

Implementa al menos:

- Una mutación para crear un registro en MockAPI.
- Una mutación para editar un registro existente en MockAPI.

Cada mutación debe definir `mutationKey` y utilizar el servicio correspondiente.

### Creación

1. Validar los datos antes de enviarlos.
2. Ejecutar la petición de creación contra MockAPI.
3. Manejar errores y respuestas inválidas.
4. Invalidar las consultas relacionadas después de una respuesta exitosa.
5. Mostrar confirmación de éxito solo cuando exista evidencia de que el servidor aceptó la operación.
6. Evitar que una reanudación o un doble toque provoquen registros duplicados innecesariamente.

### Edición

1. Comprobar que el identificador del registro sea válido.
2. Enviar los campos admitidos por el recurso de MockAPI.
3. Manejar errores de red y respuestas de error del servidor.
4. Invalidar las consultas afectadas tras el éxito.
5. Mantener coherentes el listado y el detalle, cuando ambos existan.

Usa `invalidateQueries` con las claves centralizadas. No invalidez todas las consultas de la aplicación si basta con invalidar las relacionadas.

No confundas una mutación pausada con una mutación completada.

## 9. Configuración de caché

Configura valores diferenciados de `staleTime` y `gcTime` para la API pública y MockAPI.

Valores iniciales de referencia que se pueden utilizar si son apropiados para el proyecto:

| Fuente | `staleTime` | `gcTime` |
|---|---:|---:|
| API pública | 30 minutos | 48 horas |
| MockAPI | 10 segundos | 24 horas |

No apliques estos valores sin revisar la configuración existente. Si se usan otros valores, documenta los definitivos y explica la razón.

Conceptos que deben respetarse:

- `staleTime` define durante cuánto tiempo una consulta se considera fresca.
- `gcTime` determina cuánto tiempo se conserva en memoria una consulta inactiva antes de que pueda ser recolectada.
- Una consulta obsoleta no significa que sus datos hayan sido borrados.
- Una consulta fresca puede seguir apareciendo mientras la aplicación utiliza su caché.

Evita usar configuraciones globales que anulen accidentalmente los valores específicos de cada consulta.

## 10. Persistencia de la caché

Implementa la persistencia mediante:

- `PersistQueryClientProvider`.
- `@tanstack/query-async-storage-persister`.
- AsyncStorage.
- Una instancia coherente de QueryClient.
- `maxAge` para determinar la edad máxima aceptada de la caché persistida.

Comprueba la compatibilidad de las dependencias instaladas antes de implementar.

### Requisitos

1. La aplicación debe restaurar la caché persistida al iniciar.
2. La interfaz debe poder mostrar los datos disponibles en caché mientras se realizan las peticiones de red correspondientes.
3. La persistencia debe conservarse al cerrar y volver a abrir la aplicación.
4. Los errores de red no deben eliminar innecesariamente datos válidos ya disponibles.
5. Debe existir una estrategia coherente para invalidar o versionar la caché cuando cambie su estructura.
6. No debe crearse una segunda instancia de QueryClient que impida utilizar la caché restaurada.
7. Las pantallas deben manejar los estados de carga inicial, datos disponibles, actualización y error.

Como referencia, puede usarse un `maxAge` de 24 horas, si es compatible con los requisitos y con el resto de la configuración.

### Relación entre `gcTime` y `maxAge`

Para las consultas que deban conservarse durante todo el periodo de validez de la caché persistida, configura `gcTime >= maxAge`.

Explica en el README que `gcTime` regula la conservación en memoria de consultas inactivas, mientras que `maxAge` determina la edad máxima admitida al restaurar el estado persistido.

No afirmes que ambos valores controlan exactamente el mismo almacenamiento ni que la eliminación de una consulta implica necesariamente el borrado instantáneo de su copia en AsyncStorage.

## 11. Funcionamiento sin conexión

Utiliza un mecanismo compatible con Expo, como `expo-network`, para mantener actualizado el estado de conectividad.

Requisitos:

1. Obtener el estado inicial de la conexión.
2. Suscribirse a los cambios de conectividad.
3. Actualizar `onlineManager` de TanStack Query.
4. Retirar la suscripción cuando corresponda.
5. Evitar considerar que la conexión a una red implica necesariamente acceso al servidor.
6. No bloquear la interfaz durante la falta de conexión.
7. Mostrar un indicador claro cuando no exista conexión.
8. Permitir crear o editar un registro mientras no haya conexión, siempre que la operación se pueda guardar y reanudar correctamente.

La detección de conectividad es una señal para gestionar las solicitudes; no garantiza que MockAPI esté disponible.

## 12. Mutaciones pendientes y reanudación

Las mutaciones pendientes deben poder reanudarse después de recuperar la conexión y, cuando lo exija el escenario de prueba, después de reiniciar la aplicación.

Implementa lo siguiente:

1. Configura el comportamiento de reintento y pausa según TanStack Query v5.
2. Registra las funciones de mutación necesarias mediante `queryClient.setMutationDefaults`.
3. Usa claves de mutación coherentes con las funciones registradas.
4. Configura el proveedor de persistencia para reanudar las mutaciones en el momento apropiado, después de la hidratación.
5. Ejecuta `resumePausedMutations()` cuando corresponda.
6. Evita que la reanudación se dispare prematuramente antes de que las mutaciones persistidas estén disponibles.
7. Muestra las mutaciones pendientes en la interfaz, incluso cuando se restauren después de un reinicio.
8. Distingue visualmente entre pendiente, en proceso, completada y fallida.
9. Maneja los errores de reintento sin eliminar silenciosamente los datos del usuario.
10. Comprueba que la mutación realmente llegue a MockAPI cuando se recupera la conexión.

Recuerda que las funciones de JavaScript no se serializan como parte del estado persistido de una mutación. Por eso deben registrarse de nuevo mediante `setMutationDefaults` antes de reanudar las operaciones restauradas.

No dependas exclusivamente de `onMutate` para mostrar mutaciones restauradas. Examina el estado de las mutaciones mediante los mecanismos compatibles con TanStack Query v5, como `useMutationState`, cuando sea necesario.

No esperes indefinidamente una promesa de mutación que debe permanecer pausada mientras el dispositivo está sin conexión.

## 13. Registros de eventos

Utiliza `src/lib/logger.ts` y el componente `LogPanel.tsx` si son apropiados para la implementación.

Los registros deben facilitar la demostración del comportamiento.

Cuando corresponda, registrar:

- Inicio de la aplicación.
- Estado de conectividad.
- Restauración de caché.
- Inicio y finalización de consultas.
- Inicio de creación o edición.
- Pausa de una mutación por falta de conexión.
- Reanudación de una mutación.
- Respuesta exitosa o error de MockAPI.

Incluye marcas de tiempo legibles.

No registres contraseñas, tokens, secretos ni información innecesaria del usuario.

Los registros deben representar eventos reales. No generes mensajes de éxito antes de recibir una respuesta exitosa del servidor.

## 14. Interfaz y experiencia de usuario

Mantén el estilo y la navegación existentes.

La interfaz debe mostrar, según corresponda:

- Datos consultados.
- Datos disponibles en caché.
- Estado de conexión.
- Formularios de creación y edición.
- Errores comprensibles.
- Mutaciones pendientes.
- Estado de sincronización.
- Registros de eventos útiles para la demostración.

Evita rediseñar toda la aplicación. Prioriza cambios pequeños y consistentes con los componentes existentes.

## 15. Variables de entorno y seguridad

Revisa `.env`, `.env.example` y `.gitignore`.

Como referencia, las variables podrían ser:

```dotenv
EXPO_PUBLIC_MOCKAPI_URL=https://TU_ID.mockapi.io/api/v1
EXPO_PUBLIC_RICK_AND_MORTY_URL=https://rickandmortyapi.com/api
```

Los nombres y las rutas deben coincidir con el código real.

Reglas:

- No inventar el identificador de MockAPI.
- No subir `.env` al repositorio.
- Mantener `.env.example` sin secretos.
- Recordar que las variables `EXPO_PUBLIC_` son accesibles desde el código cliente.
- No colocar claves privadas en una aplicación móvil.

## 16. Documentación

Actualiza `README.md` y `PRUEBAS.md` al finalizar cada etapa relevante.

La documentación debe describir el código real, no una implementación ideal que todavía no existe.

No declares que una prueba pasó si no se ejecutó.

No inventes enlaces de repositorios, APK, videos ni servicios.

## 17. Verificaciones técnicas

Ejecuta los comandos apropiados disponibles en `package.json`.

Como mínimo, cuando exista la configuración necesaria:

- Comprobación de TypeScript.
- Lint.
- Pruebas automatizadas disponibles.
- Verificación de dependencias y compatibilidad.
- Ejecución de la aplicación en el entorno disponible.

Si una comprobación falla, informa del error y determina si está relacionado con tus cambios.

Si no se puede ejecutar la aplicación en un dispositivo real, indícalo explícitamente.

## 18. Informe final obligatorio

Al terminar, informa:

1. Qué se implementó.
2. Qué archivos se crearon o modificaron.
3. Qué requisitos quedaron completos.
4. Qué comandos se ejecutaron y sus resultados.
5. Qué pruebas se realizaron realmente.
6. Qué configuraciones debe completar el usuario manualmente.
7. Qué limitaciones o errores siguen pendientes.
No consideres terminado el trabajo únicamente porque el código se haya escrito. La implementación debe estar revisada y verificada en la medida que permita el entorno.
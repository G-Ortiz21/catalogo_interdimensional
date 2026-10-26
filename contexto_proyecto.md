# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
ðŸ“„ ARCHIVO: .env
================================================

EXPO_PUBLIC_MOCKAPI_URL=https://6adecc054e88f1bba4a556c4.mockapi.io
EXPO_PUBLIC_RICK_AND_MORTY_URL=https://rickandmortyapi.com/api

================================================
ðŸ“„ ARCHIVO: .env.example
================================================

EXPO_PUBLIC_MOCKAPI_URL=https://TU_ID.mockapi.io
EXPO_PUBLIC_RICK_AND_MORTY_URL=https://rickandmortyapi.com/api

================================================
ðŸ“„ ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local
.env
!.env.example

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android


================================================
ðŸ“„ ARCHIVO: AGENTS.md
================================================

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

================================================
ðŸ“„ ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "catalogo_interdimensional",
    "slug": "catalogo_interdimensional",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "catalogointerdimensional",
    "userInterfaceStyle": "dark",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#141534",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ],
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
ðŸ“„ ARCHIVO: DISENIO.md
================================================

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

- [ ] ¿Se combinan maximalismo, brutalismo y retrofuturismo de forma coherente?
- [ ] ¿La interfaz tiene personalidad propia y evita una apariencia genérica?
- [ ] ¿Los colores están centralizados y respetan la paleta?
- [ ] ¿Las combinaciones de texto y fondo cumplen los contrastes requeridos?
- [ ] ¿La decoración mantiene la legibilidad y no dificulta la navegación?
- [ ] ¿Los estados de conexión y sincronización son comprensibles sin depender solo del color?
- [ ] ¿Se conservaron las funcionalidades existentes?
- [ ] ¿Se verificaron las pantallas y se documentaron las pruebas pendientes?

## 8. Informe al finalizar

Indica brevemente:

1. Archivos modificados.
2. Elementos de diseño implementados.
3. Combinaciones de color y contrastes comprobados.
4. Pruebas realizadas y resultados.
5. Problemas pendientes.

No afirmes que una prueba o comprobación se realizó si no se ejecutó realmente.


================================================
ðŸ“„ ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);


================================================
ðŸ“„ ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ðŸ“„ ARCHIVO: package.json
================================================

{
  "name": "catalogo_interdimensional",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.26",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@tanstack/query-async-storage-persister": "^5.104.5",
    "@tanstack/react-query": "^5.104.5",
    "@tanstack/react-query-persist-client": "^5.104.5",
    "axios": "^1.20.0",
    "expo": "~57.0.31",
    "expo-constants": "~57.0.22",
    "expo-device": "~57.0.2",
    "expo-font": "~57.0.4",
    "expo-glass-effect": "~57.0.4",
    "expo-image": "~57.0.5",
    "expo-linking": "~57.0.13",
    "expo-network": "~57.0.3",
    "expo-router": "~57.0.29",
    "expo-splash-screen": "~57.0.10",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.3",
    "expo-system-ui": "~57.0.4",
    "expo-web-browser": "~57.0.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~57.0.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit"
  },
  "private": true
}


================================================
ðŸ“„ ARCHIVO: PRUEBAS.md
================================================

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

Completar antes de comenzar:

- Dispositivo: no disponible en el entorno de desarrollo usado.
- Sistema operativo: Windows (entorno de edición); no se ejecutó la app en dispositivo.
- Versión de Expo: 57.0.31.
- Versión de React Native: 0.86.3.
- Versión de TanStack Query: 5.104.5.
- Versión de la aplicación: 1.0.0.
- URL del recurso MockAPI: configurada en `.env` (no se publica).
- Método de ejecución: Expo web en navegador local; no se ejecutó en dispositivo.
- Fecha de ejecución: 2026-10-26.
- Responsable: no indicado.

La interfaz de bitácora ya está implementada y conectada a los hooks existentes. Las pruebas de creación y edición siguen pendientes de una ejecución manual contra MockAPI.

La respuesta de auditoría de `GET /notas` fue `200` con 2 registros y los tipos observados coinciden con el esquema documentado. `createdAt` llegó como número (timestamp Unix en segundos). No se ejecutaron `POST` o `PUT` durante esta auditoría.

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

**Evidencia obtenida:** `npm run lint` terminó sin errores; `npm run typecheck` fue omitido desde la terminal; `get_errors` no encontró errores en `src/`. No hay pruebas automatizadas configuradas.

**Estado:** [parcial; typecheck pendiente].

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


================================================
ðŸ“„ ARCHIVO: README.md
================================================

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
| Configuración Expo | `npx expo config --type public` | Configuración cargada; `.env` detectado; sin errores. |
| TypeScript | `npm run typecheck` | No ejecutado en esta auditoría; la llamada a terminal fue omitida. `get_errors` no encontró errores en `src/`; el análisis global también detecta problemas en el `tsconfig.json` de `node_modules/expo-modules-core`. |
| API pública con búsqueda | `GET /character?page=1&name=rick` y `GET /character/1` | `200`; el filtro devolvió 107 personajes, paginados en 6 páginas; los tipos observados coinciden con `Personaje` y el detalle conserva `id: 1`. |
| MockAPI lectura | `GET .../notas` | `200` con 2 registros; se comprobaron nombres y tipos de campos sin mostrar datos sensibles. |
| MockAPI métodos | `OPTIONS .../notas` | `204`; `GET,PUT,POST,DELETE,OPTIONS`. |
| Bundle web | `npx expo export --platform web` | Exportación completada; 945 módulos; rutas `/`, `/explore`, `/bitacora`, `/personaje/[id]`. |
| Lint | `npm run lint` | Ejecutado después de configurar ESLint con `eslint` y `eslint-config-expo`; no reportó errores. |
| Pruebas automatizadas | No configuradas | No existe framework de pruebas en `package.json`. |
| Navegador web | Expo web en `http://localhost:8083` | Inicio, listado, filtro `Rick`, detalle `/personaje/1`, ID inexistente, bitácora y paginación comprobados. Recarga de caché en Web y banner offline simulado; a 390 × 844 no hubo overflow horizontal. |
| Ejecución en dispositivo | No realizada | No se dispone de dispositivo/emulador Android/iOS en este entorno. |

No afirmar que el proyecto está libre de errores únicamente porque se haya abierto la aplicación.

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

================================================
ðŸ“„ ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /src and /scripts directories to /example based on user input and creates a new /src/app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["src", "scripts"];
const exampleDir = "example";
const newAppDir = "src/app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /src/app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /src/app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 src/app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 src/app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        userInput === "y"
          ? `\n4. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
ðŸ“„ ARCHIVO: src\api\client.ts
================================================

import { create } from 'axios';

/**
 * URL base del proyecto MockAPI, sin barra final.
 * El recurso concreto (`/notas`) se añade en el servicio.
 */
export const URL_BASE_MOCKAPI =
  process.env.EXPO_PUBLIC_MOCKAPI_URL?.trim().replace(/\/+$/, '') ?? '';

/**
 * Evita que una petición se envíe a una URL relativa o vacía cuando falta
 * la configuración de entorno.
 */
export function asegurarMockApiConfigurada(): void {
  if (!URL_BASE_MOCKAPI) {
    throw new Error(
      'Falta EXPO_PUBLIC_MOCKAPI_URL. Configura la URL base del proyecto MockAPI.',
    );
  }
}

/**
 * Cliente de escritura/lectura de MockAPI.
 * Se mantiene separado de publicClient porque la fuente y la URL base difieren.
 */
export const mockApiClient = create({
  baseURL: URL_BASE_MOCKAPI,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


================================================
ðŸ“„ ARCHIVO: src\api\notas.service.ts
================================================

import { mockApiClient, asegurarMockApiConfigurada } from './client';
import type { DatosNota, Nota, VariablesActualizarNota } from '@/types/nota';

const RECURSO = '/notas';

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function validarNota(datos: unknown): Nota {
  if (
    !esObjeto(datos) ||
    typeof datos.id !== 'string' ||
    datos.id.length === 0 ||
    typeof datos.personajeId !== 'string' ||
    typeof datos.titulo !== 'string' ||
    typeof datos.contenido !== 'string' ||
    typeof datos.categoria !== 'string' ||
    typeof datos.createdAt !== 'number' ||
    !Number.isFinite(datos.createdAt)
  ) {
    throw new Error('MockAPI devolvió una nota con un formato inesperado.');
  }

  return datos as unknown as Nota;
}

function validarDatos(datos: DatosNota): DatosNota {
  const titulo = datos.titulo.trim();
  const contenido = datos.contenido.trim();
  const categoria = datos.categoria.trim();
  const personajeId = datos.personajeId.trim();

  if (!personajeId) {
    throw new Error('El identificador del personaje no es válido.');
  }
  if (!titulo) {
    throw new Error('El título de la nota es obligatorio.');
  }
  if (!contenido) {
    throw new Error('El contenido de la nota es obligatorio.');
  }
  if (!categoria) {
    throw new Error('La categoría de la nota es obligatoria.');
  }
  if (!Number.isFinite(datos.createdAt)) {
    throw new Error('La fecha de creación de la nota no es válida.');
  }

  return {
    ...datos,
    personajeId,
    titulo,
    contenido,
    categoria,
    createdAt: datos.createdAt,
  };
}

/** Listado completo de notas. Endpoint real: GET /notas */
export async function listarNotas(): Promise<Nota[]> {
  asegurarMockApiConfigurada();
  const { data } = await mockApiClient.get<unknown>(RECURSO);

  if (!Array.isArray(data)) {
    throw new Error('MockAPI devolvió un listado de notas con un formato inesperado.');
  }

  return data.map(validarNota);
}

/** Creación de una nota. Endpoint real: POST /notas */
export async function crearNota(datos: DatosNota): Promise<Nota> {
  asegurarMockApiConfigurada();
  const cuerpo = validarDatos(datos);
  const { data } = await mockApiClient.post<unknown>(RECURSO, cuerpo);
  return validarNota(data);
}

/**
 * Actualización completa de una nota existente.
 * Endpoint real: PUT /notas/:id
 */
export async function actualizarNota({
  id,
  datos,
}: VariablesActualizarNota): Promise<Nota> {
  asegurarMockApiConfigurada();

  if (!id.trim()) {
    throw new Error('El identificador de la nota no es válido.');
  }

  const cuerpo = validarDatos(datos);
  const { data } = await mockApiClient.put<unknown>(
    `${RECURSO}/${encodeURIComponent(id.trim())}`,
    cuerpo,
  );
  return validarNota(data);
}


================================================
ðŸ“„ ARCHIVO: src\api\personajes.service.ts
================================================

import { publicClient } from './publicClient';
import type { Personaje, RespuestaPersonajes } from '@/types/personaje';

export interface OpcionesPersonajes {
  pagina?: number;
  nombre?: string;
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function validarLista(datos: unknown): RespuestaPersonajes {
  if (
    !esObjeto(datos) ||
    !esObjeto(datos.info) ||
    !Array.isArray(datos.results) ||
    typeof datos.info.count !== 'number' ||
    typeof datos.info.pages !== 'number'
  ) {
    throw new Error('La API devolvió un listado de personajes con un formato inesperado.');
  }

  return datos as unknown as RespuestaPersonajes;
}

function validarPersonaje(datos: unknown): Personaje {
  if (
    !esObjeto(datos) ||
    typeof datos.id !== 'number' ||
    typeof datos.name !== 'string' ||
    typeof datos.image !== 'string'
  ) {
    throw new Error('La API devolvió un personaje con un formato inesperado.');
  }

  return datos as unknown as Personaje;
}

/** Consulta paginada de personajes. Endpoint real: GET /character */
export async function obtenerPersonajes({
  pagina = 1,
  nombre,
}: OpcionesPersonajes = {}): Promise<RespuestaPersonajes> {
  const parametros: Record<string, string | number> = { page: pagina };
  const filtro = nombre?.trim();

  if (filtro) {
    parametros.name = filtro;
  }

  const { data } = await publicClient.get<unknown>('/character', { params: parametros });
  return validarLista(data);
}

/** Consulta individual. Endpoint real: GET /character/:id */
export async function obtenerPersonaje(id: number): Promise<Personaje> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El identificador del personaje no es válido.');
  }

  const { data } = await publicClient.get<unknown>(`/character/${id}`);
  return validarPersonaje(data);
}


================================================
ðŸ“„ ARCHIVO: src\api\publicClient.ts
================================================

import { create } from 'axios';

const URL_BASE =
  process.env.EXPO_PUBLIC_RICK_AND_MORTY_URL?.trim().replace(/\/+$/, '') ||
  'https://rickandmortyapi.com/api';

/**
 * Cliente de solo lectura para Rick and Morty API.
 * No se realizan operaciones de escritura contra esta fuente.
 */
export const publicClient = create({
  baseURL: URL_BASE,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\bitacora.tsx
================================================

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
												<View key={nota.id} style={styles.nota}>
													<View style={styles.notaCabecera}>
														<Text style={styles.categoria}>{nota.categoria}</Text>
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
		fontSize: 8,
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
		fontSize: 9,
		fontWeight: '700',
	},
	accionesCabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.sm,
	},
	recargar: {
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeCian,
		borderRadius: radios.sm,
	},
	recargarTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: 9,
		fontWeight: '900',
	},
	formularioPanel: {
		gap: espacios.md,
		padding: espacios.lg,
		backgroundColor: colores.nebulosaOscura,
		borderLeftWidth: 4,
		borderLeftColor: colores.verdePortal,
		borderRadius: radios.sm,
	},
	tituloSeccion: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacios.sm,
	},
	numeroSeccion: {
		color: colores.espacioProfundo,
		backgroundColor: colores.verdePortal,
		paddingHorizontal: espacios.sm,
		paddingVertical: 3,
		fontFamily: fuentes.mono,
		fontSize: tipografia.etiqueta,
		fontWeight: '900',
	},
	tituloFormulario: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
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
		gap: espacios.md,
	},
	campoFlexible: {
		flex: 1,
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
		fontSize: 9,
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
		fontSize: 9,
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
		borderLeftWidth: 4,
		borderLeftColor: colores.cianEnergetico,
		borderRadius: radios.sm,
	},
	notaCabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: espacios.sm,
	},
	categoria: {
		flexShrink: 1,
		color: colores.espacioProfundo,
		backgroundColor: colores.cianEnergetico,
		paddingHorizontal: espacios.sm,
		paddingVertical: 3,
		fontFamily: fuentes.mono,
		fontSize: 9,
		fontWeight: '900',
		textTransform: 'uppercase',
	},
	fecha: {
		flexShrink: 1,
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: 9,
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
		fontSize: 9,
	},
	botonEditar: {
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeCian,
		borderRadius: radios.sm,
	},
	botonEditarTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: 9,
		fontWeight: '900',
	},
	piePagina: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: 9,
		textAlign: 'center',
	},
});


================================================
ðŸ“„ ARCHIVO: src\app\explore.tsx
================================================

import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { TarjetaPersonaje } from '@/components/TarjetaPersonaje';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { usePersonajes } from '@/hooks/usePersonajes';
import { mensajeDeError } from '@/lib/errores';
import type { Personaje } from '@/types/personaje';

export default function ExplorarScreen() {
  const router = useRouter();
  const [pagina, setPagina] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [nombre, setNombre] = useState('');
  const listaRef = useRef<FlatList<Personaje>>(null);

  const {
    data,
    isPending,
    isError,
    isFetching,
    isRefetching,
    error,
    refetch,
  } = usePersonajes(pagina, nombre);

  const sinCoincidencias =
    Boolean(nombre) && isError && isAxiosError(error) && error.response?.status === 404;
  const totalPaginas = sinCoincidencias ? 0 : data?.info.pages ?? 0;
  const totalPersonajes = sinCoincidencias ? 0 : data?.info.count ?? '—';
  const puedeAtras = pagina > 1 && !isFetching;
  const puedeAvanzar = !sinCoincidencias && Boolean(data?.info.next) && !isFetching;

  useEffect(() => {
    listaRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [pagina]);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      const filtro = textoBusqueda.trim();
      setPagina(1);
      setNombre(filtro);
    }, 350);

    return () => clearTimeout(temporizador);
  }, [textoBusqueda]);

  const volver = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda('');
    setNombre('');
    setPagina(1);
  };

  return (
    <View style={styles.raiz}>
      <SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
        <View style={styles.cabecera}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
            onPress={volver}
            hitSlop={12}
            style={({ pressed }) => [styles.volver, pressed && styles.presionado]}>
            <Text style={styles.volverTexto}>← VOLVER</Text>
          </Pressable>

          <View style={styles.cabeceraCentro}>
            <Text style={styles.codigo}>ARCHIVO DE PERSONAJES</Text>
            <Text style={styles.titulo}>PERSONAJES</Text>
          </View>

          <View style={styles.contador}>
            <Text style={styles.contadorValor}>{totalPersonajes}</Text>
            <Text style={styles.contadorEtiqueta}>REGISTROS</Text>
          </View>
        </View>

        <View style={styles.subbarra}>
          <Text style={styles.subbarraTexto}>
            {isFetching
              ? 'SINCRONIZANDO CON LA API PÚBLICA'
              : 'FUENTE: RICK AND MORTY API · SOLO LECTURA'}
          </Text>
          {isFetching ? <ActivityIndicator color={colores.cianEnergetico} size="small" /> : null}
        </View>

        <View style={styles.busqueda}>
          <Text style={styles.busquedaEtiqueta}>LOCALIZAR POR NOMBRE</Text>
          <View style={styles.busquedaFila}>
            <TextInput
              accessibilityLabel="Buscar personajes por nombre"
              value={textoBusqueda}
              onChangeText={setTextoBusqueda}
              placeholder="Ej. Rick Sanchez"
              placeholderTextColor={colores.cremaEstelar}
              selectionColor={colores.cianEnergetico}
              returnKeyType="search"
              style={styles.campoBusqueda}
            />
            {textoBusqueda ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                onPress={limpiarBusqueda}
                style={({ pressed }) => [styles.limpiarBusqueda, pressed && styles.presionado]}>
                <Text style={styles.limpiarTexto}>×</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {isPending ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="cargando"
              titulo="LOCALIZANDO COORDENADAS"
              mensaje="Consultando el archivo de personajes."
            />
          </View>
        ) : isError && !data && !sinCoincidencias ? (
          <View style={styles.centro}>
            <EstadoPantalla
              tipo="error"
              titulo="NO SE PUDO ABRIR EL ARCHIVO"
              mensaje={mensajeDeError(error)}
              textoAccion="REINTENTAR"
              onAccion={() => void refetch()}
            />
          </View>
        ) : (
          <>
            {isError && data && !sinCoincidencias ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Error al actualizar. Tocar para reintentar."
                onPress={() => void refetch()}
                style={styles.avisoError}>
                <Text style={styles.avisoErrorTexto}>
                  No se pudo actualizar. Se muestran datos en caché. Toca para reintentar.
                </Text>
              </Pressable>
            ) : null}

            <FlatList
              ref={listaRef}
              data={sinCoincidencias ? [] : data?.results ?? []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TarjetaPersonaje
                  personaje={item}
                  onPress={() =>
                    router.push({
                      pathname: '/personaje/[id]',
                      params: { id: String(item.id) },
                    })
                  }
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.fila}
              contentContainerStyle={styles.lista}
              showsVerticalScrollIndicator={false}
              refreshing={isRefetching && !isPending}
              onRefresh={() => void refetch()}
              ListEmptyComponent={
                <EstadoPantalla
                  tipo="vacio"
                  titulo={nombre ? 'SIN COINCIDENCIAS' : 'SIN RESULTADOS'}
                  mensaje={
                    nombre
                      ? `La API no encontró personajes para “${nombre}”.`
                      : 'La API no devolvió personajes para esta página.'
                  }
                  textoAccion={nombre ? 'LIMPIAR BÚSQUEDA' : 'ACTUALIZAR'}
                  onAccion={nombre ? limpiarBusqueda : () => void refetch()}
                />
              }
            />

            <View style={styles.paginacion}>
              <BotonAccion
                titulo="← ANTERIOR"
                variante="fantasma"
                compacto
                deshabilitado={!puedeAtras}
                onPress={() => setPagina((actual) => Math.max(1, actual - 1))}
              />

              <View style={styles.indicador}>
                <Text style={styles.indicadorValor}>
                  {String(pagina).padStart(2, '0')}
                  <Text style={styles.indicadorTotal}>
                    {' '}
                    / {totalPaginas ? String(totalPaginas).padStart(2, '0') : nombre ? '00' : '—'}
                  </Text>
                </Text>
                <Text style={styles.indicadorEtiqueta}>PÁGINA</Text>
              </View>

              <BotonAccion
                titulo="SIGUIENTE →"
                variante="fantasma"
                compacto
                deshabilitado={!puedeAvanzar}
                onPress={() => setPagina((actual) => actual + 1)}
              />
            </View>
          </>
        )}
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
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.md,
    paddingHorizontal: espacios.lg,
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
    letterSpacing: 0,
  },
  presionado: {
    opacity: 0.65,
  },
  cabeceraCentro: {
    flex: 1,
    gap: 1,
  },
  codigo: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 8,
    letterSpacing: 0,
    opacity: 0.8,
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.titulo,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 33,
  },
  contador: {
    alignItems: 'flex-end',
    paddingLeft: espacios.sm,
    borderLeftWidth: 1,
    borderLeftColor: colores.bordeSutil,
  },
  contadorValor: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: 16,
    fontWeight: '900',
  },
  contadorEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 8,
    letterSpacing: 0,
  },
  subbarra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.sm,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.sm,
    backgroundColor: colores.nebulosaOscura,
  },
  subbarraTexto: {
    flex: 1,
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 8,
    letterSpacing: 0,
  },
  busqueda: {
    gap: espacios.xs,
    paddingHorizontal: espacios.lg,
    paddingTop: espacios.md,
  },
  busquedaEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  busquedaFila: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeCian,
    borderRadius: radios.sm,
  },
  campoBusqueda: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: espacios.md,
    paddingVertical: espacios.sm,
    color: colores.blancoCosmico,
    fontSize: tipografia.cuerpo,
  },
  limpiarBusqueda: {
    width: 42,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colores.bordeSutil,
  },
  limpiarTexto: {
    color: colores.cianEnergetico,
    fontSize: 25,
    lineHeight: 28,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    padding: espacios.lg,
  },
  avisoError: {
    marginHorizontal: espacios.lg,
    marginTop: espacios.md,
    padding: espacios.sm,
    backgroundColor: colores.portalVioleta,
    borderLeftWidth: 4,
    borderLeftColor: colores.alerta,
    borderRadius: radios.sm,
  },
  avisoErrorTexto: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    lineHeight: 18,
  },
  lista: {
    gap: espacios.md,
    padding: espacios.lg,
    paddingBottom: espacios.xl,
  },
  fila: {
    gap: espacios.md,
  },
  paginacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.sm,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.md,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
    backgroundColor: colores.nebulosaOscura,
  },
  indicador: {
    alignItems: 'center',
    gap: 1,
  },
  indicadorValor: {
    color: colores.blancoCosmico,
    fontFamily: fuentes.mono,
    fontSize: 14,
    fontWeight: '900',
  },
  indicadorTotal: {
    color: colores.cremaEstelar,
    fontSize: 10,
  },
  indicadorEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 8,
    letterSpacing: 0,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\index.tsx
================================================

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotonAccion } from '@/components/BotonAccion';
import { EstadoPantalla } from '@/components/EstadoPantalla';
import { TarjetaPersonaje } from '@/components/TarjetaPersonaje';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import { usePersonajes } from '@/hooks/usePersonajes';
import { mensajeDeError } from '@/lib/errores';

export default function InicioScreen() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch, isFetching } = usePersonajes(1);
  const muestras = data?.results.slice(0, 4) ?? [];

  return (
    <View style={styles.raiz}>
      <SafeAreaView style={styles.areaSegura} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.contenido}
          showsVerticalScrollIndicator={false}>
          <View style={styles.barraSuperior}>
            <Text style={styles.codigo}>ARCHIVO // C-137</Text>
            <View style={styles.chip}>
              <View style={styles.punto} />
              <Text style={styles.chipTexto}>API PÚBLICA</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View pointerEvents="none" style={styles.decoracion}>
              <View style={styles.orbitaExterior} />
              <View style={styles.orbitaMedia} />
              <View style={styles.orbitaInterior} />
              <View style={styles.nucleo} />
            </View>

            <Text style={styles.kicker}>COORDENADAS DESCONOCIDAS · DIMENSIÓN VARIABLE</Text>
            <Text style={styles.titulo}>
              CATÁLOGO{'\n'}
              <Text style={styles.tituloAcento}>
                INTER{'\n'}DIMENSIONAL
              </Text>
            </Text>
            <View style={styles.regla} />
            <Text style={styles.descripcion}>
              Un registro de personajes recuperados de todas las realidades. Consulta el archivo,
              abre una ficha y sigue las coordenadas.
            </Text>

            <BotonAccion
              titulo="EXPLORAR PERSONAJES"
              etiquetaAccesibilidad="Explorar el listado de personajes"
              onPress={() => router.push('/explore')}
            />
            <BotonAccion
              titulo="ABRIR BITÁCORA"
              etiquetaAccesibilidad="Abrir la bitácora de exploración"
              variante="secundario"
              onPress={() => router.push('/bitacora')}
            />
          </View>

          <View style={styles.lectura}>
            <Text style={styles.lecturaEtiqueta}>SEÑAL DETECTADA</Text>
            <Text style={styles.lecturaValor}>
              {data ? `${data.info.count} PERSONAJES` : isFetching ? 'SINCRONIZANDO' : 'EN ESPERA'}
            </Text>
            <Text style={styles.lecturaNota}>
              {data
                ? `${data.info.pages} páginas disponibles en la API pública.`
                : 'La caché local se conserva durante 24 horas.'}
            </Text>
          </View>

          <View style={styles.seccion}>
            <View style={styles.cabeceraSeccion}>
              <Text style={styles.seccionTitulo}>MUESTRAS DEL ARCHIVO</Text>
              <Text style={styles.seccionMeta}>
                {isFetching && data ? 'ACTUALIZANDO' : 'PÁGINA 01'}
              </Text>
            </View>

            {isPending ? (
              <EstadoPantalla
                tipo="cargando"
                titulo="ABRIENDO EL PORTAL"
                mensaje="Recuperando las primeras muestras del archivo."
              />
            ) : isError && !data ? (
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
                  <EstadoPantalla
                    tipo="error"
                    titulo="NO SE PUDO ACTUALIZAR"
                    mensaje={`${mensajeDeError(error)} Se conservan los datos disponibles en caché.`}
                    textoAccion="REINTENTAR"
                    onAccion={() => void refetch()}
                  />
                ) : null}
                {muestras.length === 0 ? (
                  <EstadoPantalla
                    tipo="vacio"
                    titulo="ARCHIVO VACÍO"
                    mensaje="La API no devolvió personajes para esta dimensión."
                    textoAccion="ACTUALIZAR"
                    onAccion={() => void refetch()}
                  />
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filaMuestras}>
                    {muestras.map((personaje) => (
                      <TarjetaPersonaje
                        key={personaje.id}
                        personaje={personaje}
                        variante="muestra"
                        onPress={() =>
                          router.push({
                            pathname: '/personaje/[id]',
                            params: { id: String(personaje.id) },
                          })
                        }
                      />
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </View>

          <View style={styles.pie}>
            <Text style={styles.pieTexto}>FUENTE: RICK AND MORTY API</Text>
            <Text style={styles.pieTexto}>SOLO LECTURA · CACHÉ PERSISTENTE</Text>
          </View>
        </ScrollView>
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
  contenido: {
    paddingHorizontal: espacios.lg,
    paddingBottom: espacios.xxxl + espacios.xl,
    gap: espacios.xl,
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: espacios.md,
  },
  codigo: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    letterSpacing: 0,
    fontWeight: '700',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs + 2,
    paddingHorizontal: espacios.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colores.bordeCian,
    borderRadius: radios.sm,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colores.cianEnergetico,
  },
  chipTexto: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    gap: espacios.md,
    padding: espacios.xl,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderLeftWidth: 5,
    borderLeftColor: colores.verdePortal,
    borderRadius: radios.sm,
  },
  decoracion: {
    position: 'absolute',
    right: -70,
    top: -50,
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  orbitaExterior: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: colores.brilloPortal,
  },
  orbitaMedia: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colores.violetaElectrico,
  },
  orbitaInterior: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 6,
    borderColor: colores.portalVioleta,
    backgroundColor: colores.brilloPortal,
  },
  nucleo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colores.verdePortal,
    opacity: 0.9,
  },
  kicker: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 10,
    letterSpacing: 0,
    fontWeight: '700',
    maxWidth: '78%',
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.display,
    fontWeight: '900',
    letterSpacing: 0,
    maxWidth: '92%',
    lineHeight: 39,
  },
  tituloAcento: {
    color: colores.verdePortal,
  },
  regla: {
    height: 3,
    width: 88,
    backgroundColor: colores.magentaCosmico,
    marginVertical: espacios.xs,
  },
  descripcion: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
    lineHeight: 24,
    maxWidth: '94%',
    marginBottom: espacios.xs,
  },
  lectura: {
    gap: espacios.xs,
    paddingVertical: espacios.md,
    paddingHorizontal: espacios.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colores.bordeSutil,
  },
  lecturaEtiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 9,
    letterSpacing: 0,
    fontWeight: '900',
  },
  lecturaValor: {
    color: colores.blancoCosmico,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
    letterSpacing: 0,
  },
  lecturaNota: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
    lineHeight: 19,
  },
  seccion: {
    gap: espacios.md,
  },
  cabeceraSeccion: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: espacios.md,
  },
  seccionTitulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    fontWeight: '900',
    letterSpacing: 0,
  },
  seccionMeta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 9,
    letterSpacing: 0,
  },
  filaMuestras: {
    gap: espacios.md,
    paddingRight: espacios.lg,
  },
  pie: {
    gap: espacios.xs,
    paddingTop: espacios.lg,
    borderTopWidth: 1,
    borderTopColor: colores.bordeSutil,
  },
  pieTexto: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 9,
    letterSpacing: 0,
    opacity: 0.8,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\personaje\[id].tsx
================================================

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

function FilaDato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.filaDato}>
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
        <Text style={styles.panelTitulo}>EXPEDIENTE INTERDIMENSIONAL</Text>
        <FilaDato etiqueta="GÉNERO" valor={personaje.gender} />
        <FilaDato etiqueta="ORIGEN" valor={personaje.origin.name} />
        <FilaDato etiqueta="UBICACIÓN ACTUAL" valor={personaje.location.name} />
        <FilaDato etiqueta="EPISODIOS" valor={String(personaje.episode.length)} />
        <FilaDato etiqueta="PRIMER REGISTRO" valor={formatearFecha(personaje.created)} />
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
    fontSize: 9,
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
    backgroundColor: colores.veloOscuro,
    borderRadius: radios.sm,
  },
  puntoEstado: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  estadoTexto: {
    fontFamily: fuentes.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  identidad: {
    padding: espacios.lg,
    gap: espacios.xs,
  },
  etiqueta: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 9,
    letterSpacing: 0,
    fontWeight: '700',
  },
  nombre: {
    color: colores.blancoCosmico,
    fontSize: 36,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: 0,
  },
  especie: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
  },
  panel: {
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderLeftWidth: 4,
    borderLeftColor: colores.violetaElectrico,
    borderRadius: radios.sm,
    padding: espacios.lg,
    gap: espacios.sm,
  },
  panelTitulo: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: 9,
    letterSpacing: 0,
    fontWeight: '900',
    marginBottom: espacios.xs,
  },
  filaDato: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espacios.lg,
    paddingVertical: espacios.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeSeparador,
  },
  datoEtiqueta: {
    color: colores.cremaEstelar,
    fontFamily: fuentes.mono,
    fontSize: 10,
    letterSpacing: 0,
    flexShrink: 0,
  },
  datoValor: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
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
    fontSize: 9,
    letterSpacing: 0,
    fontWeight: '900',
  },
  notaTexto: {
    color: colores.blancoCosmico,
    fontSize: tipografia.pequeno,
    lineHeight: 20,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\_layout.tsx
================================================

import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BannerRed } from '@/components/BannerRed';
import { colores } from '@/constants/theme';
import { sincronizarConectividadInicial } from '@/hooks/useConectividad';
import { registrarEvento } from '@/lib/logger';
import { queryKeys } from '@/lib/queryKeys';
import { CONFIG_PERSISTENCIA, persister, queryClient } from '@/lib/queryClient';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [restauracionFinalizada, setRestauracionFinalizada] = useState(false);

  const finalizarRestauracion = useCallback(() => {
    setRestauracionFinalizada(true);
  }, []);

  const alRestaurar = useCallback(() => {
    registrarEvento('Caché persistida restaurada o sin datos previos', 'cache');
    finalizarRestauracion();

    // Las funciones de mutación ya están registradas en queryClient mediante
    // setMutationDefaults. Se comprueba la red antes de reanudar para que una
    // mutación restaurada sin conexión permanezca pausada.
    sincronizarConectividadInicial()
      .then((conectado) => {
        const hayMutacionesPausadas = queryClient
          .getMutationCache()
          .getAll()
          .some((mutacion) => mutacion.state.isPaused);

        if (!hayMutacionesPausadas) {
          return false;
        }

        if (!conectado) {
          registrarEvento('Mutaciones pausadas conservadas hasta recuperar conexión', 'cache');
          return false;
        }

        return queryClient.resumePausedMutations().then(() => true);
      })
      .then((reanudadas) => {
        if (!reanudadas) {
          return;
        }

        registrarEvento('Mutaciones pausadas reanudadas', 'cache');
        return queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
      })
      .catch((error: unknown) => {
        const detalle = error instanceof Error ? error.message : 'error desconocido';
        registrarEvento(`No se pudieron reanudar las mutaciones: ${detalle}`, 'error');
      });
  }, [finalizarRestauracion]);

  const alFallarRestauracion = useCallback(() => {
    registrarEvento('No se pudo restaurar la caché persistida', 'error');
    finalizarRestauracion();
  }, [finalizarRestauracion]);

  useEffect(() => {
    if (!restauracionFinalizada) {
      return;
    }

    SplashScreen.hideAsync().catch(() => undefined);
  }, [restauracionFinalizada]);

  // Salvaguarda: la interfaz nunca debe quedar oculta indefinidamente si la
  // restauración no responde.
  useEffect(() => {
    const temporizador = setTimeout(() => setRestauracionFinalizada(true), 4000);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CONFIG_PERSISTENCIA.maxAge,
        buster: CONFIG_PERSISTENCIA.buster,
        // Solo las mutaciones pausadas (por ejemplo, sin conexión) necesitan
        // conservarse para reanudarse tras reiniciar la aplicación.
        dehydrateOptions: {
          shouldDehydrateMutation: (mutation) => mutation.state.isPaused,
        },
      }}
      onSuccess={alRestaurar}
      onError={alFallarRestauracion}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.raiz}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colores.espacioProfundo },
              animation: 'fade',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="bitacora" />
            <Stack.Screen name="personaje/[id]" />
          </Stack>
          <BannerRed />
        </View>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: colores.espacioProfundo,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\BannerRed.tsx
================================================

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { useConectividad } from '@/hooks/useConectividad';
import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

/**
 * Indicador de conectividad. También es el único punto donde se suscribe
 * expo-network y se actualiza onlineManager.
 */
export function BannerRed() {
  const { comprobado, conectado, tipo } = useConectividad();
  const insets = useSafeAreaInsets();

  if (!comprobado || conectado) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel="Sin conexión a Internet. Se muestran los datos disponibles en caché."
      style={[styles.contenedor, { paddingBottom: Math.max(insets.bottom, espacios.md) }]}>
      <View style={styles.marca} />
      <View style={styles.textos}>
        <Text style={styles.titulo}>SIN CONEXIÓN</Text>
        <Text style={styles.detalle}>
          {tipo === 'NONE' || tipo === 'UNKNOWN'
            ? 'Se usarán los datos guardados en caché si están disponibles.'
            : `Red ${tipo.toLowerCase()} sin acceso al servidor. Se usa la caché disponible.`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    zIndex: 100,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espacios.md,
    paddingTop: espacios.md,
    paddingHorizontal: espacios.lg,
    backgroundColor: colores.alerta,
    borderTopWidth: 2,
    borderTopColor: colores.espacioProfundo,
  },
  marca: {
    width: 6,
    backgroundColor: colores.espacioProfundo,
    borderRadius: radios.sm,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    color: colores.espacioProfundo,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
    letterSpacing: 0,
    fontFamily: fuentes.mono,
  },
  detalle: {
    color: colores.espacioProfundo,
    fontSize: tipografia.pequeno,
    fontWeight: '600',
    lineHeight: 18,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\BotonAccion.tsx
================================================

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario' | 'fantasma';
  deshabilitado?: boolean;
  compacto?: boolean;
  etiquetaAccesibilidad?: string;
}

export function BotonAccion({
  titulo,
  onPress,
  variante = 'principal',
  deshabilitado = false,
  compacto = false,
  etiquetaAccesibilidad,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesibilidad ?? titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compacto ? styles.compacto : styles.normal,
        variante === 'principal' && styles.principal,
        variante === 'secundario' && styles.secundario,
        variante === 'fantasma' && styles.fantasma,
        pressed && !deshabilitado && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}>
      <Text
        style={[
          styles.texto,
          variante === 'principal' ? styles.textoOscuro : styles.textoClaro,
          variante === 'fantasma' && styles.textoFantasma,
        ]}>
        {titulo}
      </Text>
      <View
        style={[
          styles.acento,
          variante === 'principal' ? styles.acentoOscuro : styles.acentoClaro,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacios.md,
    borderWidth: 2,
    borderRadius: radios.sm,
  },
  normal: {
    paddingVertical: espacios.md,
    paddingHorizontal: espacios.lg,
  },
  compacto: {
    paddingVertical: espacios.sm,
    paddingHorizontal: espacios.md,
  },
  principal: {
    backgroundColor: colores.verdePortal,
    borderColor: colores.verdePortal,
  },
  secundario: {
    backgroundColor: colores.cianEnergetico,
    borderColor: colores.cianEnergetico,
  },
  fantasma: {
    backgroundColor: 'transparent',
    borderColor: colores.bordeCian,
  },
  presionado: {
    opacity: 0.72,
  },
  deshabilitado: {
    opacity: 0.42,
  },
  texto: {
    fontSize: tipografia.pequeno,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  textoOscuro: {
    color: colores.espacioProfundo,
  },
  textoClaro: {
    color: colores.espacioProfundo,
  },
  textoFantasma: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
  },
  acento: {
    width: 18,
    height: 2,
  },
  acentoOscuro: {
    backgroundColor: colores.espacioProfundo,
  },
  acentoClaro: {
    backgroundColor: colores.espacioProfundo,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\EstadoPantalla.tsx
================================================

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';

interface Props {
  tipo: 'cargando' | 'error' | 'vacio';
  titulo: string;
  mensaje?: string;
  textoAccion?: string;
  onAccion?: () => void;
}

export function EstadoPantalla({ tipo, titulo, mensaje, textoAccion, onAccion }: Props) {
  return (
    <View style={styles.contenedor} accessibilityRole={tipo === 'error' ? 'alert' : undefined}>
      <View style={[styles.marca, tipo === 'error' && styles.marcaError]}>
        <Text style={styles.codigo}>
          {tipo === 'cargando' ? '···' : tipo === 'error' ? '!!' : '00'}
        </Text>
      </View>

      {tipo === 'cargando' ? (
        <ActivityIndicator color={colores.cianEnergetico} size="small" />
      ) : null}

      <Text style={styles.titulo}>{titulo}</Text>
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      {textoAccion && onAccion ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAccion}
          style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
          <Text style={styles.textoBoton}>{textoAccion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'flex-start',
    gap: espacios.sm,
    padding: espacios.lg,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderLeftWidth: 4,
    borderLeftColor: colores.violetaElectrico,
    borderRadius: radios.sm,
  },
  marca: {
    paddingHorizontal: espacios.sm,
    paddingVertical: 2,
    backgroundColor: colores.cianEnergetico,
    borderRadius: radios.sm,
  },
  marcaError: {
    backgroundColor: colores.error,
  },
  codigo: {
    color: colores.espacioProfundo,
    fontFamily: fuentes.mono,
    fontWeight: '900',
    fontSize: tipografia.etiqueta,
    letterSpacing: 0,
  },
  titulo: {
    color: colores.blancoCosmico,
    fontSize: tipografia.subtitulo,
    fontWeight: '900',
    lineHeight: 25,
  },
  mensaje: {
    color: colores.cremaEstelar,
    fontSize: tipografia.cuerpo,
    lineHeight: 23,
  },
  boton: {
    marginTop: espacios.xs,
    paddingVertical: espacios.sm,
    paddingHorizontal: espacios.md,
    borderWidth: 1,
    borderColor: colores.cianEnergetico,
    borderRadius: radios.sm,
  },
  presionado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\LogPanel.tsx
================================================

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
		fontSize: 9,
		fontWeight: '900',
	},
	titulo: {
		color: colores.blancoCosmico,
		fontSize: tipografia.pequeno,
		fontWeight: '900',
	},
	limpiar: {
		paddingVertical: espacios.xs,
		paddingHorizontal: espacios.sm,
		borderWidth: 1,
		borderColor: colores.bordeSutil,
		borderRadius: radios.sm,
	},
	limpiarTexto: {
		color: colores.cremaEstelar,
		fontFamily: fuentes.mono,
		fontSize: 8,
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
		fontSize: 9,
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
		paddingTop: espacios.xs,
	},
	masTexto: {
		color: colores.cianEnergetico,
		fontFamily: fuentes.mono,
		fontSize: 9,
		fontWeight: '900',
	},
});


================================================
ðŸ“„ ARCHIVO: src\components\SelloPendiente.tsx
================================================

import { useMutationState } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios } from '@/constants/theme';
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
		fontSize: 8,
		fontWeight: '900',
	},
	textoFinal: {
		color: colores.espacioProfundo,
	},
	textoActivo: {
		color: colores.cianEnergetico,
	},
});


================================================
ðŸ“„ ARCHIVO: src\components\TarjetaPersonaje.tsx
================================================

import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, radios, tipografia } from '@/constants/theme';
import type { Personaje } from '@/types/personaje';

interface Props {
  personaje: Personaje;
  onPress: () => void;
  variante?: 'cuadricula' | 'muestra';
}

function datosEstado(estado: Personaje['status']) {
  if (estado === 'Alive') {
    return { etiqueta: 'VIVO', color: colores.verdePortal };
  }
  if (estado === 'Dead') {
    return { etiqueta: 'MUERTO', color: colores.salmonExtraterrestre };
  }
  return { etiqueta: 'DESCONOCIDO', color: colores.cremaEstelar };
}

export function TarjetaPersonaje({ personaje, onPress, variante = 'cuadricula' }: Props) {
  const estado = datosEstado(personaje.status);
  const muestra = variante === 'muestra';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${personaje.name}, ${estado.etiqueta}, ${personaje.species}. Abrir ficha.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tarjeta,
        muestra && styles.tarjetaMuestra,
        pressed && styles.presionada,
      ]}>
      <View style={styles.marcoImagen}>
        <Image
          source={{ uri: personaje.image }}
          style={styles.imagen}
          contentFit="cover"
          accessibilityLabel={`Retrato de ${personaje.name}`}
        />
        <View style={[styles.estado, { borderColor: estado.color }]}>
          <View style={[styles.punto, { backgroundColor: estado.color }]} />
          <Text style={[styles.estadoTexto, { color: estado.color }]}>{estado.etiqueta}</Text>
        </View>
      </View>

      <View style={styles.datos}>
        <Text style={styles.id}>#{String(personaje.id).padStart(3, '0')}</Text>
        <Text style={styles.nombre} numberOfLines={2}>
          {personaje.name}
        </Text>
        <Text style={styles.especie} numberOfLines={1}>
          {personaje.species}
        </Text>
        <View style={styles.flecha}>
          <Text style={styles.flechaTexto}>ABRIR FICHA</Text>
          <View style={styles.linea} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colores.nebulosaOscura,
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderTopWidth: 3,
    borderTopColor: colores.violetaElectrico,
    borderRadius: radios.sm,
    overflow: 'hidden',
  },
  tarjetaMuestra: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: 158,
  },
  presionada: {
    opacity: 0.75,
  },
  marcoImagen: {
    position: 'relative',
    backgroundColor: colores.portalVioleta,
  },
  imagen: {
    width: '100%',
    aspectRatio: 1,
  },
  estado: {
    position: 'absolute',
    left: espacios.sm,
    bottom: espacios.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs,
    paddingHorizontal: espacios.sm,
    paddingVertical: 3,
    backgroundColor: colores.veloOscuro,
    borderWidth: 1,
    borderRadius: radios.sm,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  estadoTexto: {
    fontFamily: fuentes.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  datos: {
    padding: espacios.md,
    gap: 2,
  },
  id: {
    color: colores.cianEnergetico,
    fontFamily: fuentes.mono,
    fontSize: tipografia.etiqueta,
    letterSpacing: 0,
  },
  nombre: {
    color: colores.blancoCosmico,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  especie: {
    color: colores.cremaEstelar,
    fontSize: tipografia.pequeno,
  },
  flecha: {
    marginTop: espacios.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.sm,
  },
  flechaTexto: {
    color: colores.verdePortal,
    fontFamily: fuentes.mono,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: colores.bordeSutil,
  },
});


================================================
ðŸ“„ ARCHIVO: src\constants\theme.ts
================================================

/**
 * Tema visual centralizado de Catálogo Interdimensional.
 * Paleta basada en DISENIO.md. No usar hexadecimales sueltos en pantallas.
 */

import { Platform } from 'react-native';

export const colores = {
  espacioProfundo: '#141534',
  nebulosaOscura: '#232345',
  portalVioleta: '#480B7F',
  violetaElectrico: '#7518AD',
  magentaCosmico: '#9D36AC',
  verdeExtraterrestre: '#7FBA5B',
  verdePortal: '#A0CE69',
  cianEnergetico: '#41E2BF',
  turquesaEspacial: '#2495A3',
  azulProfundo: '#12678B',
  cremaEstelar: '#DCE1B9',
  blancoCosmico: '#F6F6F8',
  salmonExtraterrestre: '#EFB495',
  naranjaAlienigena: '#DD9057',
  /* Tonos derivados solo para transparencias y bordes. */
  bordeSutil: 'rgba(220, 225, 185, 0.22)',
  bordeSeparador: 'rgba(220, 225, 185, 0.10)',
  bordeCian: 'rgba(65, 226, 191, 0.55)',
  veloOscuro: 'rgba(20, 21, 52, 0.82)',
  brilloPortal: 'rgba(117, 24, 173, 0.45)',
  exito: '#A0CE69',
  alerta: '#DD9057',
  error: '#EFB495',
} as const;

export const espacios = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radios = {
  ninguno: 0,
  sm: 2,
  md: 6,
} as const;

export const tipografia = {
  display: 38,
  titulo: 30,
  subtitulo: 21,
  cuerpo: 16,
  pequeno: 13,
  etiqueta: 11,
  mono: 12,
} as const;

/** Familias del sistema: no se instalan fuentes adicionales en esta etapa. */
export const fuentes = {
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
} as const;


================================================
ðŸ“„ ARCHIVO: src\hooks\useConectividad.ts
================================================

import { useEffect, useRef, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

import { registrarEvento } from '@/lib/logger';

interface EstadoConectividad {
  comprobado: boolean;
  conectado: boolean;
  tipo: string;
}

function interpretarEstado(estado: Network.NetworkState): { conectado: boolean; tipo: string } {
  // La conexión a una red no garantiza acceso al servidor; se usa también
  // isInternetReachable cuando el sistema lo informa.
  const conectado = estado.isConnected !== false && estado.isInternetReachable !== false;
  return { conectado, tipo: estado.type ?? 'UNKNOWN' };
}

/**
 * Sincroniza onlineManager antes de reanudar mutaciones persistidas.
 * Si la detección falla, se asume conectado para no bloquear la reanudación.
 */
export async function sincronizarConectividadInicial(): Promise<boolean> {
  try {
    const red = await Network.getNetworkStateAsync();
    const { conectado } = interpretarEstado(red);
    onlineManager.setOnline(conectado);
    return conectado;
  } catch {
    onlineManager.setOnline(true);
    return true;
  }
}

/**
 * Mantiene sincronizado onlineManager de TanStack Query con expo-network.
 * Debe existir una sola suscripción activa en la aplicación.
 */
export function useConectividad(): EstadoConectividad {
  const [estado, setEstado] = useState<EstadoConectividad>({
    comprobado: false,
    conectado: true,
    tipo: 'UNKNOWN',
  });
  const ultimoEstado = useRef<boolean | null>(null);

  useEffect(() => {
    let activo = true;

    const aplicar = (red: Network.NetworkState) => {
      if (!activo) {
        return;
      }

      const { conectado, tipo } = interpretarEstado(red);
      onlineManager.setOnline(conectado);
      setEstado({ comprobado: true, conectado, tipo });

      if (ultimoEstado.current !== conectado) {
        ultimoEstado.current = conectado;
        registrarEvento(
          conectado ? 'Conectividad disponible' : 'Sin conexión a Internet',
          'red',
        );
      }
    };

    Network.getNetworkStateAsync()
      .then(aplicar)
      .catch(() => {
        // Si la detección falla, no se bloquea la interfaz: se asume conectado
        // y TanStack Query seguirá gestionando los errores reales de red.
        if (activo) {
          setEstado((anterior) => ({ ...anterior, comprobado: true }));
        }
      });

    const suscripcion = Network.addNetworkStateListener(aplicar);

    return () => {
      activo = false;
      suscripcion.remove();
    };
  }, []);

  return estado;
}


================================================
ðŸ“„ ARCHIVO: src\hooks\useNotas.ts
================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { actualizarNota, crearNota, listarNotas } from '@/api/notas.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';
import { CACHE_MOCKAPI } from '@/lib/queryClient';
import type { DatosNota, Nota, VariablesActualizarNota } from '@/types/nota';

/** Consulta del listado de notas propias. */
export function useNotas() {
  return useQuery({
    queryKey: queryKeys.notas.list(),
    queryFn: async () => {
      registrarEvento('Consultando notas en MockAPI', 'red');
      try {
        const notas = await listarNotas();
        registrarEvento(`Notas recibidas: ${notas.length}`, 'exito');
        return notas;
      } catch (error) {
        registrarEvento(`Error al consultar notas: ${mensajeDeError(error)}`, 'error');
        throw error;
      }
    },
    staleTime: CACHE_MOCKAPI.staleTime,
    gcTime: CACHE_MOCKAPI.gcTime,
  });
}

/** Crea una nota y refresca las consultas de la bitácora solo tras el éxito real. */
export function useCrearNota() {
  const queryClient = useQueryClient();

  return useMutation<Nota, Error, DatosNota>({
    mutationKey: mutationKeys.notas.crear,
    mutationFn: crearNota,
    onSuccess: async (nota) => {
      registrarEvento(`Nota creada en MockAPI: ${nota.id}`, 'exito');
      await queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
    },
    onError: (error) => {
      registrarEvento(`Error al crear nota: ${mensajeDeError(error)}`, 'error');
    },
  });
}

/** Actualiza una nota completa y mantiene coherentes listado y detalle. */
export function useActualizarNota() {
  const queryClient = useQueryClient();

  return useMutation<Nota, Error, VariablesActualizarNota>({
    mutationKey: mutationKeys.notas.editar,
    mutationFn: actualizarNota,
    onSuccess: async (nota) => {
      registrarEvento(`Nota actualizada en MockAPI: ${nota.id}`, 'exito');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.notas.lists() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notas.detail(nota.id) }),
      ]);
    },
    onError: (error) => {
      registrarEvento(`Error al actualizar nota: ${mensajeDeError(error)}`, 'error');
    },
  });
}


================================================
ðŸ“„ ARCHIVO: src\hooks\usePersonajes.ts
================================================

import { isAxiosError } from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerPersonaje, obtenerPersonajes } from '@/api/personajes.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { queryKeys } from '@/lib/queryKeys';
import { CACHE_API_PUBLICA } from '@/lib/queryClient';

export function usePersonajes(pagina = 1, nombre = '') {
  const filtro = nombre.trim();

  return useQuery({
    queryKey: queryKeys.personajes.list(pagina, filtro),
    queryFn: async () => {
      registrarEvento(
        filtro
          ? `Consultando personajes (página ${pagina}, filtro: ${filtro})`
          : `Consultando personajes (página ${pagina})`,
        'red',
      );
      try {
        const respuesta = await obtenerPersonajes({ pagina, nombre: filtro });
        registrarEvento(
          `Personajes recibidos: ${respuesta.results.length} de ${respuesta.info.count}`,
          'exito',
        );
        return respuesta;
      } catch (error) {
        if (filtro && isAxiosError(error) && error.response?.status === 404) {
          registrarEvento(`Sin coincidencias de personajes para: ${filtro}`, 'info');
        } else {
          registrarEvento(`Error al consultar personajes: ${mensajeDeError(error)}`, 'error');
        }
        throw error;
      }
    },
    staleTime: CACHE_API_PUBLICA.staleTime,
    gcTime: CACHE_API_PUBLICA.gcTime,
    placeholderData: keepPreviousData,
  });
}

export function usePersonaje(id: number | null) {
  return useQuery({
    queryKey: queryKeys.personajes.detail(id ?? 0),
    queryFn: async () => {
      if (id === null) {
        throw new Error('El identificador del personaje no es válido.');
      }

      registrarEvento(`Consultando personaje #${id}`, 'red');
      try {
        const personaje = await obtenerPersonaje(id);
        registrarEvento(`Personaje #${id} recibido: ${personaje.name}`, 'exito');
        return personaje;
      } catch (error) {
        registrarEvento(`Error al consultar personaje #${id}: ${mensajeDeError(error)}`, 'error');
        throw error;
      }
    },
    enabled: id !== null,
    staleTime: CACHE_API_PUBLICA.staleTime,
    gcTime: CACHE_API_PUBLICA.gcTime,
  });
}


================================================
ðŸ“„ ARCHIVO: src\lib\errores.ts
================================================

import { isAxiosError } from 'axios';

/**
 * Traduce errores de red/API a mensajes aptos para la interfaz.
 * No expone detalles internos ni datos de configuración.
 */
export function mensajeDeError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
    }

    const estado = error.response.status;

    if (estado === 404) {
      return 'No se encontró el recurso solicitado.';
    }
    if (estado === 429) {
      return 'Demasiadas solicitudes. Espera unos segundos antes de reintentar.';
    }
    if (estado >= 500) {
      return 'El servidor no está disponible en este momento. Inténtalo más tarde.';
    }
    return `La solicitud falló con el código ${estado}.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}


================================================
ðŸ“„ ARCHIVO: src\lib\logger.ts
================================================

export type NivelLog = 'info' | 'exito' | 'alerta' | 'error' | 'red' | 'cache';

export interface EntradaLog {
  id: number;
  fecha: Date;
  nivel: NivelLog;
  mensaje: string;
}

type Oyente = () => void;

const MAX_ENTRADAS = 200;

let entradas: EntradaLog[] = [];
let siguienteId = 1;
let instantanea: EntradaLog[] = entradas;
const oyentes = new Set<Oyente>();

function notificar() {
  instantanea = entradas;
  oyentes.forEach((oyente) => oyente());
}

export function registrarEvento(mensaje: string, nivel: NivelLog = 'info'): EntradaLog {
  const entrada: EntradaLog = {
    id: siguienteId++,
    fecha: new Date(),
    nivel,
    mensaje,
  };

  entradas = [...entradas, entrada].slice(-MAX_ENTRADAS);
  notificar();
  return entrada;
}

export function obtenerEventos(): EntradaLog[] {
  return instantanea;
}

export function limpiarEventos() {
  entradas = [];
  notificar();
}

export function suscribirEventos(oyente: Oyente): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

export function formatearHora(fecha: Date): string {
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  const ss = String(fecha.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}


================================================
ðŸ“„ ARCHIVO: src\lib\queryClient.ts
================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { actualizarNota, crearNota } from '@/api/notas.service';
import { mensajeDeError } from '@/lib/errores';
import { registrarEvento } from '@/lib/logger';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';

const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;

// Keep online-mode queries paused until Expo Network confirms the initial state.
onlineManager.setOnline(false);

/** Estrategia de caché para la API pública (datos estables). */
export const CACHE_API_PUBLICA = {
  staleTime: 30 * MINUTO,
  gcTime: 48 * HORA,
} as const;

/** Estrategia de caché para MockAPI (datos propios, cambian con frecuencia). */
export const CACHE_MOCKAPI = {
  staleTime: 10 * 1000,
  gcTime: 24 * HORA,
} as const;

export const CONFIG_PERSISTENCIA = {
  key: 'catalogo-interdimensional:cache',
  maxAge: 24 * HORA,
  buster: 'v2',
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
      retry: (intentos, error) => {
        if (isAxiosError(error) && error.response?.status === 404) {
          return false;
        }
        return intentos < 2;
      },
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'online',
      retry: 2,
      gcTime: CONFIG_PERSISTENCIA.maxAge,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: CONFIG_PERSISTENCIA.key,
  throttleTime: 1000,
});

/**
 * Las funciones de mutación no se serializan con la caché persistida.
 * Deben registrarse con la misma mutationKey que usan los hooks para que
 * TanStack Query pueda reanudar operaciones pausadas después de un reinicio.
 */
queryClient.setMutationDefaults(mutationKeys.notas.crear, {
  mutationFn: crearNota,
  networkMode: 'online',
  retry: 2,
  onSuccess: async (nota) => {
    registrarEvento(`Nota creada en MockAPI: ${nota.id}`, 'exito');
    // También se ejecuta cuando una mutación restaurada se reanuda sin que el
    // hook original siga montado.
    await queryClient.invalidateQueries({ queryKey: queryKeys.notas.all });
  },
  onError: (error) => {
    registrarEvento(`Error al crear nota: ${mensajeDeError(error)}`, 'error');
  },
});

queryClient.setMutationDefaults(mutationKeys.notas.editar, {
  mutationFn: actualizarNota,
  networkMode: 'online',
  retry: 2,
  onSuccess: async (nota) => {
    registrarEvento(`Nota actualizada en MockAPI: ${nota.id}`, 'exito');
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.notas.lists() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.notas.detail(nota.id) }),
    ]);
  },
  onError: (error) => {
    registrarEvento(`Error al actualizar nota: ${mensajeDeError(error)}`, 'error');
  },
});



================================================
ðŸ“„ ARCHIVO: src\lib\queryKeys.ts
================================================

/**
 * Claves centralizadas y jerárquicas.
 *
 * personajes
 * ├── listas (todas)
 * │   └── pagina + filtro
 * └── detalles (todos)
 *     └── id
 *
 * notas (bitácora propia en MockAPI)
 * ├── listas
 * └── detalles
 */
export const queryKeys = {
  personajes: {
    all: ['personajes'] as const,
    lists: () => [...queryKeys.personajes.all, 'listas'] as const,
    list: (pagina: number, filtro?: string) =>
      [...queryKeys.personajes.lists(), { pagina, filtro: filtro?.trim() ?? '' }] as const,
    details: () => [...queryKeys.personajes.all, 'detalles'] as const,
    detail: (id: number) => [...queryKeys.personajes.details(), id] as const,
  },
  notas: {
    all: ['notas'] as const,
    lists: () => [...queryKeys.notas.all, 'listas'] as const,
    list: () => [...queryKeys.notas.lists()] as const,
    details: () => [...queryKeys.notas.all, 'detalles'] as const,
    detail: (id: string) => [...queryKeys.notas.details(), id] as const,
  },
} as const;

/**
 * Claves de mutación centralizadas. Deben coincidir con las registradas
 * mediante setMutationDefaults para poder reanudar mutaciones persistidas.
 */
export const mutationKeys = {
  notas: {
    all: ['notas', 'mutaciones'] as const,
    crear: [...['notas', 'mutaciones'], 'crear'] as const,
    editar: [...['notas', 'mutaciones'], 'editar'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;


================================================
ðŸ“„ ARCHIVO: src\types\nota.ts
================================================

/** Registro de la bitácora con la forma observada en la respuesta de MockAPI. */
export interface Nota {
  /** Identificador asignado por MockAPI. Es una cadena. */
  id: string;
  personajeId: string;
  titulo: string;
  contenido: string;
  categoria: string;
  /** MockAPI serializa el campo Date como un número en la respuesta JSON. */
  createdAt: number;
}

/** Datos enviados al crear o actualizar; MockAPI asigna únicamente `id`. */
export type DatosNota = Omit<Nota, 'id'>;

/** Variables de la mutación de edición. */
export interface VariablesActualizarNota {
  id: string;
  datos: DatosNota;
}


================================================
ðŸ“„ ARCHIVO: src\types\personaje.ts
================================================

export type EstadoPersonaje = 'Alive' | 'Dead' | 'unknown';

export interface OrigenPersonaje {
  name: string;
  url: string;
}

export interface Personaje {
  id: number;
  name: string;
  status: EstadoPersonaje;
  species: string;
  type: string;
  gender: string;
  origin: OrigenPersonaje;
  location: OrigenPersonaje;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface InfoPaginacion {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RespuestaPersonajes {
  info: InfoPaginacion;
  results: Personaje[];
}


================================================
ðŸ“„ ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}

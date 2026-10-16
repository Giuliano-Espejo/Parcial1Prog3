## Context

Motivación y alcance: ver `proposal.md`. Comportamiento exigido: ver `specs/persistencia-local/spec.md` y los deltas de `datos-semilla`, `catalogo-filtro`, `listados-libros-clientes` y `documentacion-entrega`.

Estado actual observado en el código:

- `js/comun.js` tiene las secciones `Datos`, `Acceso a datos`, `Búsqueda y formato` y `DOM`. `cargarLibros()` / `cargarClientes()` devuelven copias de `LIBROS_SEMILLA` / `CLIENTES_SEMILLA` y su comentario ya anticipa que C-05 reemplaza el cuerpo (C-03 D3). Ningún archivo usa `localStorage` todavía.
- `catalogo.js` (`iniciarCatalogo`), `libros.js` y `clientes.js` llaman a `cargarX()` en `DOMContentLoaded` y renderizan; `ventas.js` e `historial.js` son placeholders vacíos.
- Las zonas de estado de los listados (`#estado-catalogo`, `#estado-libros`, `#estado-clientes`) se reescriben con `mostrarMensaje()` en cada render o tecleo del filtro: un aviso de almacenamiento puesto allí se borraría. Las zonas `#mensajes-libro` / `#mensajes-cliente` / `#mensajes-venta` son de operación de formularios (C-06/C-07).
- `css/componentes.css` ya tiene `.zona-mensajes:empty { margin: 0 }` y `.mensaje--error` con borde, fondo y prefijo textual: no hace falta CSS nuevo.
- Reglas duras (AGENTS.md): scripts clásicos, sin módulos; funciones puras separadas de DOM y `localStorage`; `textContent`; sin tests automatizados (verificación manual, nunca marcar casos sin ejecutarlos). El docente editará `libreria.libros` a mano en C-08.

## Goals / Non-Goals

**Goals:**
- Que `cargarLibros/Clientes()` cambien de fuente sin que ninguna página cambie la forma de usarlos.
- Un único punto de acceso a `localStorage`, que nunca lance errores hacia las páginas y que deje constancia de los problemas para mostrarlos.
- Datos guardados fáciles de encontrar y editar a mano, y fáciles de restaurar para repetir los casos manuales.
- Resolver SU-02 / P-02 con evidencia observada por el usuario en Chrome y Firefox.

**Non-Goals:**
- Altas de libros/clientes, composición y confirmación de ventas, historial (C-06, C-07, C-08). C-05 solo deja listos `cargarVentas()` / `guardarVentas()`.
- Sincronizar en vivo pestañas abiertas (evento `storage`): alcanza con recargar.
- Validar el contenido de cada registro guardado (tipos de `precio`, ids existentes). Solo se valida que el valor sea JSON y un arreglo; un registro raro se muestra con los textos de "desconocido" que ya existen.
- Migraciones o versionado del formato guardado.
- Botón de "reiniciar datos" en la interfaz.
- Reescritura completa del README (C-09).

## Decisions

### D1 — Sección `// ===== Almacenamiento =====` en `comun.js`, entre `Datos` y `Acceso a datos`

Contenido (nombres en español, como el resto del proyecto):

- `const CLAVES = { libros: 'libreria.libros', clientes: 'libreria.clientes', ventas: 'libreria.ventas' };`
- `const NOMBRES_COLECCION = { 'libreria.libros': 'libros', 'libreria.clientes': 'clientes', 'libreria.ventas': 'ventas' };` (para el texto del aviso).
- `const MENSAJE_SIN_ALMACENAMIENTO = 'No se pueden guardar datos en este navegador. Se muestran los datos iniciales y los cambios no se conservarán.';`
- Estado de módulo: `const avisosAlmacenamiento = [];` (textos sin repetir) y `const clavesDaniadas = {};` (clave → `true`).
- `registrarAvisoAlmacenamiento(texto)` → agrega si no está (deduplica: el aviso de "sin almacenamiento" aparece una sola vez aunque fallen las tres claves).
- `copiarDatos(datos)` → `JSON.parse(JSON.stringify(datos))`: copia profunda uniforme para la semilla (los datos leídos ya son objetos nuevos por venir de `JSON.parse`).
- `leerColeccion(clave, semilla)`:
  1. `getItem` dentro de `try`; si lanza → aviso `MENSAJE_SIN_ALMACENAMIENTO` y `return copiarDatos(semilla)`.
  2. `null` (clave ausente) → `guardarColeccion(clave, semilla)` (si falla, ya registró el aviso) y `return copiarDatos(semilla)`.
  3. `JSON.parse` dentro de `try`; si el resultado es `Array.isArray` → devolverlo.
  4. En otro caso (excepción o no-arreglo) → `clavesDaniadas[clave] = true`, aviso de datos dañados (D3) y `return []`.
- `guardarColeccion(clave, datos)`: si `clavesDaniadas[clave]` → `return false` sin escribir; si no, `setItem(clave, JSON.stringify(datos))` en `try` → `true`; si lanza (bloqueo o cuota) → aviso `MENSAJE_SIN_ALMACENAMIENTO` y `false`.

En `// ===== Acceso a datos =====` quedan los atajos de una línea: `cargarLibros()` → `leerColeccion(CLAVES.libros, LIBROS_SEMILLA)`, ídem clientes, `cargarVentas()` → `leerColeccion(CLAVES.ventas, [])`, y `guardarLibros/Clientes/Ventas(datos)` → `guardarColeccion(...)`. Se actualiza el comentario de cabecera de la sección.

**Por qué así**: es exactamente la firma prevista por C-03 D3 y CHANGES; el contrato "lo devuelto es una copia" se mantiene sin código extra. Las funciones de almacenamiento no tocan el DOM (regla dura): dejan constancia en `avisosAlmacenamiento` y la parte DOM los muestra (D2).
**Alternativas**: que `leerColeccion` devuelva `{ datos, error }` → rompe la firma de `cargarX()` que ya usan tres páginas; que llame a `mostrarMensaje` directamente → mezcla almacenamiento y DOM; una sola clave `libreria` con todo → descartada en DD-07.

### D2 — Zona de aviso de almacenamiento propia en las cinco páginas

- HTML: inmediatamente después del `<h1>` de cada página, `<div id="mensajes-almacenamiento" class="zona-mensajes" aria-live="polite"></div>`, **sin espacios ni saltos de línea dentro** para que aplique `:empty`. Se agrega también en `ventas.html` e `historial.html` (uniformidad; C-07/C-08 solo tendrán que llamar al helper).
- `comun.js`, sección DOM: `mostrarAvisosAlmacenamiento()` → busca `#mensajes-almacenamiento` (si no existe, no hace nada), la limpia y agrega un `<p class="mensaje mensaje--error" role="alert">` por aviso con `crearElemento('p', PREFIJOS_MENSAJE.error + texto, ...)`. No se usa `mostrarMensaje` porque reemplaza el contenido con un único mensaje y acá puede haber dos (por ejemplo, libros y clientes dañados).
- `catalogo.js` (`iniciarCatalogo`), `libros.js` y `clientes.js` (`Inicio`): llaman a `mostrarAvisosAlmacenamiento()` justo después de `cargarX()`.

**Por qué**: las zonas de estado de los listados se reescriben en cada render/tecla del filtro y borrarían el aviso; las de operación son de los formularios. Una zona arriba del contenido se ve primero y no interfiere. Prefijo "Error: " + texto cumple "error no expresado solo con color".
**Alternativa**: registrar un `DOMContentLoaded` propio en `comun.js` → se ejecutaría **antes** que el de la página (se registra primero) y todavía no habría avisos; por eso la llamada es explícita en cada página.

### D3 — JSON dañado (P-03): avisar, `[]` en memoria, no pisar y bloquear guardados de esa clave

Se considera dañado un valor que no parsea o que parsea a algo que no es arreglo (`{}`, `null`, `"x"`). Texto del aviso: `Los datos guardados de <colección> están dañados y no se pudieron leer. No se modificaron: corregí el valor o borrá la clave «<clave>» en las herramientas de desarrollo y recargá la página para recuperar los datos iniciales.`

Además, mientras dure esa carga de página, `guardarColeccion` rechaza escribir esa clave (devuelve `false`). Sin este bloqueo, la primera alta de C-06 guardaría `[libroNuevo]` encima del JSON dañado y el usuario perdería todo lo anterior sin aviso. C-06/C-07 usarán el `false` para mostrar "no se pudo guardar".
**Alternativa descartada**: restaurar la semilla automáticamente → pisa datos que el docente quizá solo dejó con una coma de más (contradice "no pisar sin avisar" de Flujo 1 y P-03).

### D4 — `localStorage` no disponible: semilla en memoria y aviso único

Cualquier excepción de `getItem`/`setItem` (incluye `localStorage` nulo en Firefox con `dom.storage.enabled=false`, `SecurityError` por cookies bloqueadas, `QuotaExceededError`) se trata igual: aviso `MENSAJE_SIN_ALMACENAMIENTO` (deduplicado) y la página sigue con la semilla en memoria (ventas `[]`). No se hace una "prueba de disponibilidad" previa con una clave auxiliar: crearía una clave más en el almacenamiento y el `try/catch` por operación ya cubre todos los casos.

### D5 — Escritura inmediata y JSON compacto

`guardarColeccion` escribe la colección completa en cada llamada (RN-PE-03), sin buffers. Formato `JSON.stringify(datos)` **compacto**: Chrome (Application → Local Storage) y Firefox (Almacenamiento → Almacenamiento local) editan el valor en una celda de una línea y además muestran el árbol del JSON en el panel lateral, así que un JSON con sangrías y saltos de línea se edita peor. Los nombres de propiedad son los del modelo (`id`, `titulo`, `isbn`, `precio`, …). El README documenta el patrón a buscar: `"precio":1500` (sin espacio).
**Alternativa**: `JSON.stringify(datos, null, 2)` → más legible en un editor de texto pero incómodo en la celda de DevTools y ocupa más espacio.

### D6 — Ventas: `cargarVentas()` / `guardarVentas()` se agregan ahora

Cuestan dos líneas, completan la capa de CHANGES y permiten verificar desde la consola que `libreria.ventas` arranca en `[]` sin semilla. Ninguna página las llama todavía (C-07/C-08).

### D7 — Restaurar los datos iniciales: pasos documentados, sin botón ni helper

README §7 documenta dos caminos: (a) DevTools → Almacenamiento local → origen `file://` → borrar una clave o todas; (b) consola: `localStorage.removeItem('libreria.libros')` o las tres claves. No se agrega botón ni función global de reinicio: no lo pide la consigna, sería código sin uso en la interfaz y un botón destructivo exigiría confirmación y casos propios. (El `localStorage` en la consola no rompe la regla de D1, que aplica a los scripts del proyecto.)

### D8 — Verificación SU-02 / P-02 (manual, la ejecuta el usuario)

Procedimiento, repetido en Chrome y en Firefox, con las claves borradas al empezar:

1. Doble clic en `libros.html` desde el explorador de archivos (barra de direcciones `file:///…`). Ver 6 libros.
2. En DevTools editar `libreria.libros`: `"precio":1500` → `"precio":9999` (o en la consola: `const l = cargarLibros(); l[0].precio = 9999; guardarLibros(l);`).
3. Ir a **Catálogo** desde el menú: "La noche del faro" debe mostrar `$ 9.999,00`.
4. Abrir `clientes.html` con doble clic en **otra pestaña** (no por el menú) y desde su menú ir a Libros: la fila debe mostrar `$ 9.999,00`.
5. Cerrar el navegador, reabrir `index.html`: el precio sigue en 9999.

El agente de apply le pide al usuario el resultado observado de cada navegador y lo escribe tal cual en README §7 (tabla Navegador · ¿Comparten datos las páginas? · Observado) y en la fila `P3` de §8; mientras no lo informe, "Pendiente de ejecutar".

**Plan si Firefox no comparte** (no tiene arreglo desde el código; las páginas no pueden forzar el origen): documentarlo en §7 como limitación observada, recomendar abrir el proyecto con Chrome (nota también en §2 "Cómo abrir"), y mencionar como opción para quien quiera usar Firefox la preferencia `about:config` → `security.fileuri.strict_origin_policy` = `false`, aclarando que relaja una protección del navegador y que es opcional. No se cambia la arquitectura multipágina (DD-01).

### D9 — README: actualización mínima ahora, reescritura en C-09

Con C-05 dejan de ser ciertas cuatro cosas del README: la línea de estado (§0), "Persistencia en `localStorage`" como pendiente (§5), "En este avance los datos viven en memoria" (§6) y "todavía no guarda datos" (§7). Mantenerlas violaría la regla de honestidad. C-05 entonces:

- §0: "**Estado: Etapa 2 en desarrollo.**" (el resto del párrafo igual).
- §4: fila "Todas las vistas" suma "Datos guardados en `localStorage` y compartidos entre las vistas" (sujeto al resultado de D8); Libros/Clientes dicen "desde los datos guardados".
- §5: mueve la persistencia a Implementadas.
- §6: la frase final pasa a "La semilla se copia a `localStorage` la primera vez; después se usan los datos guardados (ver sección 7)".
- §7: reescrita con lo que exige el delta de `documentacion-entrega` (claves, regla de semilla, ejemplo de `libreria.libros`, restaurar, errores, RN-PE-04, tabla SU-02 por navegador).
- §8: agrega filas `P1..P6` con "Pendiente de ejecutar" en Chrome y Firefox (A1–A12 no se tocan).

C-09 sigue siendo dueño del README final (reemplaza §8 por los 8 casos de la consigna, etc.).

### D10 — Casos manuales de persistencia (prefijo `P`)

| # | Caso | Pasos | Esperado |
|---|------|-------|----------|
| P1 | Primera apertura | Borrar las 3 claves; abrir `index.html` y `clientes.html` | Se crean `libreria.libros` (6) y `libreria.clientes` (3), sin aviso |
| P2 | Recargar no duplica | Recargar 3 veces `libros.html`, ir a Clientes y Catálogo | 6 libros, 3 clientes, 6 tarjetas |
| P3 | Datos compartidos entre páginas (SU-02) | Procedimiento D8 | Precio 9999 visible desde otra página y tras cerrar el navegador |
| P4 | Restaurar semilla | Borrar solo `libreria.libros` y recargar | 6 libros con precios originales; clientes intactos |
| P5 | JSON dañado | Quitar el `]` final de `libreria.libros`, recargar `index.html`; escribir "noche"; en consola `guardarLibros([])` | Aviso de error con la clave; catálogo vacío sin romperse; el aviso no desaparece al filtrar; `false` y el valor dañado intacto |
| P6 | Sin almacenamiento | Firefox: `about:config` → `dom.storage.enabled` = `false`, abrir `index.html` (luego volver a `true`) | 6 tarjetas, filtro funciona, un único aviso "Error: No se pueden guardar datos en este navegador…" |

P6 se ejecuta solo en Firefox (Chrome no ofrece un interruptor simple); la celda de Chrome dice "No aplica: Chrome no permite deshabilitar `localStorage` de forma simple" — es una constancia, no un aprobado.

## Risks / Trade-offs

- [Firefox no comparte `localStorage` entre archivos `file://`] → D8: se verifica con el usuario, se documenta como limitación y se recomienda Chrome; el código no cambia.
- [Una alta futura pisa datos dañados] → bloqueo de escritura por clave dañada (D3) y retorno `false` para que C-06/C-07 avisen.
- [Un registro guardado con forma inválida (por ejemplo `precio: "abc"`) pasa la validación de "arreglo"] → aceptado (Non-Goals): se muestra con `$ NaN` o "desconocido"; el README indica restaurar la clave. Validar cada registro duplicaría las validaciones de C-06.
- [El aviso queda debajo del `<h1>` y empuja el contenido] → solo aparece con un problema real; `:empty` evita margen cuando no hay avisos.
- [Pestañas abiertas desactualizadas] → sin evento `storage`; se documenta "recargar para ver cambios hechos en otra pestaña".
- [El agente completa resultados de P1..P6 o SU-02 sin ejecución] → las celdas arrancan "Pendiente de ejecutar" y solo se reemplazan con lo que informa el usuario (regla de C-04 D3).

## Migration Plan

No hay datos previos: hasta C-04 nada se guardaba, así que la primera apertura tras C-05 crea las claves desde la semilla. Para volver atrás basta con revertir `comun.js` y las tres llamadas, y borrar las tres claves en DevTools.

## Open Questions

> **Resueltas por el usuario (2026-10-15):** las 7 preguntas se aceptaron con la opción recomendada (JSON dañado: avisar sin pisar y bloquear guardado; zona de avisos en las 5 páginas; README mínimo en C-05; Firefox sin compartir: documentar y recomendar Chrome; JSON compacto; reinicio por pasos documentados en DevTools; `cargarVentas`/`guardarVentas` ya). Las decisiones D1–D10 quedan firmes.

Las siguientes decisiones ya están reflejadas en specs y tareas con la opción recomendada; si el usuario elige otra, se ajustan antes del apply:

1. **P-03 / D3**: ¿JSON dañado → avisar, `[]` y no pisar, con bloqueo de guardado de esa clave? (recomendado) — alternativa: restaurar la semilla.
2. **D2**: ¿zona `#mensajes-almacenamiento` debajo del `<h1>` en las **cinco** páginas? (recomendado) — alternativa: solo en las tres que hoy leen datos.
3. **D9**: ¿C-05 actualiza el README mínimamente (estado "Etapa 2 en desarrollo", §4–§8)? (recomendado) — alternativa: dejarlo para C-09 aceptando un README temporalmente falso.
4. **D8**: si Firefox no comparte, ¿documentar como limitación + recomendar Chrome + mencionar `security.fileuri.strict_origin_policy` como opción? (recomendado) — alternativa: solo recomendar Chrome sin mencionar `about:config`.
5. **D5**: ¿JSON compacto? (recomendado) — alternativa: con sangría de 2 espacios.
6. **D7**: ¿restaurar con pasos documentados, sin botón ni helper? (recomendado).
7. **D6**: ¿agregar `cargarVentas/guardarVentas` ya? (recomendado, lo pide CHANGES).

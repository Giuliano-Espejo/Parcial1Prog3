## Context

Ver proposal.md (Why). Estado actual observado en el código:

- `libros.html` / `clientes.html`: formularios con `novalidate`, ids `form-libro` (`libro-titulo`, `libro-isbn`, `libro-precio` `type="number"`, `libro-editorial`, `libro-genero`, `libro-autores` `multiple` con `aria-describedby="ayuda-autores"`) y `form-cliente` (`cliente-nombre`, `cliente-email` `type="email"`). Aviso `#aviso-libro` / `#aviso-cliente` con clase `aviso-maqueta`, referenciado por `aria-describedby` del botón. Zona de operación `#mensajes-libro` / `#mensajes-cliente` (`aria-live="polite"`) justo después del form. Los selects solo tienen las opciones placeholder ("Seleccioná una editorial", «Sin clasificar»); autores vacío.
- `js/comun.js`: secciones Datos / Almacenamiento / Acceso a datos / Búsqueda y formato / DOM. Ya existen `cargarLibros/Clientes`, `guardarLibros/Clientes` (→ `true`/`false`, bloqueo de claves dañadas, C-05 D3/D4), `buscarPorId`, `redondear2`, `normalizarBusqueda`, `crearElemento`, `limpiar`, `mostrarMensaje` (un único mensaje por zona) y `mostrarAvisosAlmacenamiento`.
- `js/libros.js` / `js/clientes.js`: solo Lógica (celdas) + Render (`actualizarListadoLibros/Clientes`, pensados para llamarse tras cada alta, C-03) + Inicio. Eventos vacía.
- `css/componentes.css`: `[aria-invalid="true"]` (borde 2 px + color, C-02 D8), `.mensaje--error` / `.mensaje--exito`. No se estila `:invalid`. No hace falta CSS nuevo.
- `js/catalogo.js` ya omite la `<img>` cuando `libro.imagen` es falsy.

Restricciones (AGENTS.md): JS clásico sin módulos, validaciones puras (sin DOM ni `localStorage`), nunca `innerHTML` con datos del usuario, secciones Lógica / Render / Eventos / Inicio, sin tests automatizados, verificación manual solo en Chrome (Firefox no disponible).

## Goals / Non-Goals

**Goals:**
- Lógica de validación y armado del registro 100 % pura y ejecutable desde la consola (para verificar casos que la UI de Chrome no deja tipear, como precio `abc`).
- Un único flujo de envío reutilizado en libros y clientes: leer → validar → (errores | crear → guardar → render).
- Reutilizar los contratos existentes (`guardarX` → booleano, `actualizarListadoX`, `mostrarMensaje`) sin cambiarlos.

**Non-Goals:**
- Editar o eliminar libros/clientes (la consigna no lo exige).
- Validar formato/dígito de control del ISBN (SU-03 / P-05).
- Subir o elegir imagen de tapa para libros nuevos.
- Selectores de la venta (C-07). Validación en vivo por campo (`input`/`blur`).
- Cambios de CSS.

## Decisions

### D1 — Capacidades: `alta-libros` y `alta-clientes` separadas; helpers en capacidades existentes
Dos capacidades nuevas (una por formulario: reglas, mensajes y casos distintos; C-07 depende de ambas por separado). Los helpers compartidos van como ADDED en las capacidades que ya poseen ese tipo de helper: normalizaciones e id siguiente → `datos-semilla` (dueña de `normalizarBusqueda`, `redondear2`); `mostrarErrores` → `utilidades-dom` (dueña de `mostrarMensaje`).
**Alternativa descartada**: una sola `altas-validadas` → mezcla dos formularios con reglas independientes y vuelve ilegibles los escenarios.

### D2 — Forma de los errores: `{ campo, mensaje }[]` (desvío menor de CHANGES.md)
CHANGES.md dice `validarLibro(datos, libros)` → `string[]`. Para llevar el foco al primer campo inválido y poner `aria-invalid` sin parsear textos, los validadores devuelven `[{ campo: 'isbn', mensaje: 'Ya existe…' }]`, siempre en el orden del formulario. `campo` es la clave de `datos` (`titulo`, `isbn`, `precio`, `editorialId`, `generoId`, `autorIds` / `nombreCompleto`, `email`); la capa de Eventos la traduce al id del control con un mapa constante (`CAMPOS_LIBRO = { titulo: 'libro-titulo', … }`). Sigue siendo pura: no conoce ids del DOM.
**Alternativa**: `string[]` + mapa paralelo → frágil (depende del texto).

### D3 — Firmas puras (sección Lógica)
- `comun.js` → Búsqueda y formato: `normalizarIsbn(texto)` (quita `\s` y `-`, mayúsculas; mayúsculas para que un ISBN-10 con `x` y con `X` choque), `normalizarEmail(texto)` (trim + minúsculas), `siguienteId(lista, prefijo)` (regex `^prefijo-(\d+)$`, máximo + 1, 1 si no hay).
- `libros.js` (Lógica) → `convertirPrecio(texto)` pura: `String(texto).trim()`, reemplaza **una** coma por punto, `Number(...)`; devuelve `NaN` si el texto queda vacío o no es número finito; si es número, `redondear2`. Queda en `libros.js` porque es su único consumidor (la cantidad de C-07 es entera y tiene otra regla).
- `libros.js`: `validarLibro(datos, libros)` → errores (D2); `crearLibro(datos, libros)` → objeto listo para guardar (`id: siguienteId(libros,'lib')`, `titulo.trim()`, `isbn.trim()`, `precio: convertirPrecio`, `editorialId`, `generoId: '' → null`, `autorIds` copia, `imagen: null`). `crearLibro` asume datos ya validados.
- `clientes.js`: `validarCliente(datos, clientes)` y `crearCliente(datos, clientes)` (`id: siguienteId(clientes,'cli')`, `nombreCompleto.trim()`, `email.trim()`).
- `datos` se lee del DOM en Eventos (`leerDatosLibro(form)`): strings crudos de los inputs, `autorIds` desde `Array.from(select.selectedOptions, o => o.value)` (orden del selector).
- Reglas de no duplicar errores: email vacío → solo "obligatorio"; formato inválido → no se chequea duplicado; ISBN vacío → no se chequea duplicado; editorial vacía → "Elegí una editorial." (no "no existe"); autores vacío → "Elegí al menos un autor.", si no, un único "Uno de los autores elegidos no existe." aunque falten varios.

### D4 — Presentación de errores: lista en la zona del formulario + `aria-invalid` + foco (Q1)
Coincide con KB Flujo 3 paso 4 ("un Error: por línea en la zona de mensajes del formulario"). Nuevo helper `mostrarErrores(contenedor, mensajes)` en comun.js (DOM): `limpiar` y un `p.mensaje.mensaje--error[role=alert]` con "Error: " + texto por mensaje (mismo patrón que `mostrarAvisosAlmacenamiento`; `mostrarMensaje` no se toca porque su contrato es "un único mensaje"). En cada envío: primero se quita `aria-invalid` de todos los controles del form; si hay errores se pone `aria-invalid="true"` a los campos con error y `focus()` al primero. Los mensajes nombran el campo, así que no se agrega `aria-describedby` por campo (WCAG 3.3.1 se cumple con el texto en la zona viva + alerta). Tras un alta correcta: `form.reset()`, limpiar `aria-invalid`, mensaje de éxito; el foco queda en el botón (no se mueve).
**Alternativa (no recomendada)**: mensaje por campo con `aria-describedby` → requiere marcado nuevo por campo, componer tokens con `ayuda-autores` y duplicar la zona de operación.

### D5 — ISBN: solo no vacío + único normalizado (Q2)
Según la consigna ("no se requiere implementar su dígito de control") y RN-LI-02/03. Se guarda tal como se escribió con `trim` (KB 04), se compara con `normalizarIsbn`. No se exige 10/13 dígitos.

### D6 — Email: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` sobre el valor con trim (Q3)
Cubre `algo@dominio.ext` sin espacios internos (RN-CL-03). Rechaza `diego`, `diego@example`, `diego paz@example.com`, `diego@@example.com`. Acepta casos raros como `a@b..c` (aceptable para el TPI). Se guarda con trim conservando mayúsculas (KB 04: "guardado con trim; se compara en minúsculas"); el listado muestra lo escrito.

### D7 — Precio: `type="number"` se mantiene, parseo tolerante a coma, guardado con `redondear2` (Q4)
Chrome entrega `value === ''` cuando el contenido no es número (p. ej. `1e`, `--5`) → error de precio. La validación evalúa el precio **ya redondeado** (0.004 → 0 → rechazado), así nunca se guarda un 0. La coma solo llega por consola (Chrome normaliza a punto), pero la función pura la acepta. Los atributos `min`/`step` del HTML se conservan (solo afectan las flechas; `novalidate` evita la validación nativa).

### D8 — Imagen de libros nuevos: `imagen: null`, tarjeta sin tapa (Q5, P-07)
Comportamiento ya especificado y probado en `catalogo-filtro` ("Libro sin imagen"). Cero trabajo y sin imágenes nuevas que declarar en el README §9. Se documenta en README §4.
**Alternativa**: `img/tapas/sin-tapa.svg` con `alt=""` → nueva imagen, nuevo caso y cambio en `catalogo-filtro`.

### D9 — Si `guardarX` devuelve `false`, el alta se rechaza (Q6)
Flujo: `nueva = lista.concat([registro])`; `if (!guardarLibros(nueva))` → `mostrarMensaje(zona,'error','No se pudo guardar el libro. Revisá el aviso de almacenamiento al principio de la página.')` y `mostrarAvisosAlmacenamiento()` (por si el fallo agregó un aviso nuevo, p. ej. cuota). No se reemplaza la lista en memoria, no se re-renderiza ni se resetea el form. Coherente con C-05 D3 (la clave dañada queda intacta) y con RN-UI-03 (guardar es parte de "todas las comprobaciones"). Consecuencia en D4 (sin `localStorage`): tampoco se pueden dar altas; README §7 se ajusta ("…usa los datos iniciales en memoria y no permite registrar libros ni clientes").
**Alternativa**: en navegador sin almacenamiento agregar solo en memoria con aviso → el registro se pierde al navegar (multipágina) y obliga a distinguir el motivo del `false`.

### D10 — Estado en memoria y orden de Inicio
Cada página guarda su colección en una variable de módulo de script (`let libros = []`) asignada en Inicio; el handler valida contra esa variable y la reemplaza solo tras un guardado exitoso. Inicio de `libros.js`: `cargarLibros()` → `mostrarAvisosAlmacenamiento()` → `renderOpcionesLibro()` (editoriales, géneros, autores con `new Option(nombre, id)` / `createElement` + `textContent`, agregadas después de los placeholders) → `actualizarListadoLibros(libros)` → `addEventListener('submit', …)`.

### D11 — Fin de la maqueta en Libros y Clientes (Q7)
Se borran `<p id="aviso-libro">` y `<p id="aviso-cliente">` y el `aria-describedby` de ambos botones. `aria-describedby="ayuda-autores"` se conserva. Ventas e Historial mantienen su aviso hasta C-07/C-08. La regla `main > .aviso-maqueta + section` de layout.css no aplica a estas páginas (el aviso estaba dentro de la sección) y no se toca.

### D12 — "Aparece en la selección de venta" se verifica en C-07 (Q8)
La consigna (Ej. 4 "las opciones relacionadas se actualizan"; Ej. 6 casos 2 y 3 "aparece en catálogo y selección de venta") se cumple por diseño multipágina: `ventas.html` construye sus selectores al cargar desde `libreria.*`, así que ve los registros nuevos. Hoy el selector de venta no existe; C-06 verifica listado + catálogo, y la parte "selección de venta" queda registrada en la columna esperada de los casos L/C del README como "(selección de venta: se verifica en el caso de C-07)". C-07 debe incluir un caso que use el libro y el cliente dados de alta aquí. Esto queda anotado en el engram de C-06 para el propose de C-07.

### D13 — README (§4, §5, §7, §8) y casos manuales
- §4: Libros y Clientes pasan a "Listado + alta validada (errores con "Error:", foco al primer campo inválido, actualización sin recargar)"; columna maqueta "Nada". Catálogo: mencionar que los libros dados de alta se ven sin tapa. Estado del encabezado sigue "Etapa 2 en desarrollo".
- §5: mover altas a Implementadas.
- §7: frase de "sin almacenamiento" según D9; sumar que un alta con la clave dañada se rechaza sin pisar lo guardado.
- §8: casos nuevos con prefijo `L` (libros) y `C` (clientes), mapeados a la consigna: L1 formulario vacío (orden de errores + foco), L2 ISBN existente con espacios, L3 ISBN existente con guiones/sin separadores, L4 precio 0 / -5 / `1e`, L5 sin autores, L6 editorial manipulada en DevTools, L7 alta válida (listado, mensaje, form vacío, `lib-7`) + catálogo sin tapa → **caso 2 de la consigna** = L2 + L7, L8 título con HTML, L9 clave dañada; C1 email inválido (4 variantes), C2 email existente en mayúsculas, C3 alta válida + persistencia → **caso 3 de la consigna** = C1 + C2 + C3, C4 formulario vacío. Celdas Chrome con lo observado por el autor (o "Pendiente de ejecutar"); Firefox "No ejecutado: Firefox no disponible en el equipo del autor". Volver a correr los "Controles de alcance" (`innerHTML`, etc.) y actualizar la fecha.

### D14 — Valores guardados con trim, sin normalizar
Título, ISBN, nombre y email se guardan con `trim` (sin otros cambios); el ISBN no se normaliza al guardar y el email no se pasa a minúsculas (KB 04). La normalización solo se usa para comparar.

## Risks / Trade-offs

- [Chrome no deja tipear texto libre en `type="number"`] → el caso "precio texto" se prueba con `1e` en la UI y con `validarLibro({ …, precio: 'abc' }, cargarLibros())` en la consola.
- [Desvío de CHANGES.md: errores como objetos] → documentado en D2; las funciones siguen siendo puras y C-07 puede seguir el mismo patrón.
- [Sin `localStorage` no hay altas (D9)] → no verificable en Chrome; documentado en README §7 y en el caso P6 existente.
- [Pegar `-` o `e` en precio deja `value` vacío y el mensaje no distingue "vacío" de "no numérico"] → un único mensaje "debe ser un número mayor que 0" cubre ambos.
- [`role="alert"` en varios párrafos puede anunciarse varias veces] → mismo patrón ya aceptado en `mostrarAvisosAlmacenamiento`; aceptable.
- [Pruebas de manipulación de selects con DevTools] → documentadas paso a paso en el caso L6.

## Migration Plan

Sin migración de datos: los registros nuevos usan el mismo esquema que la semilla (`imagen: null` ya admitido). Rollback: restaurar los 5 archivos tocados; los libros/clientes ya guardados siguen siendo válidos para la versión anterior (solo se listan).

## Open Questions

Governance MEDIO: las recomendaciones ya están aplicadas en specs y tareas; confirmar o cambiar antes de `/opsx:apply`.

1. **Presentación de errores** — (a) lista en `#mensajes-libro`/`#mensajes-cliente` + `aria-invalid` + foco al primero, sin `aria-describedby` por campo; (b) mensaje junto a cada campo con `aria-describedby`. **Recomendado: (a)** (KB Flujo 3, sin marcado nuevo).
2. **Formato de ISBN (P-05)** — (a) solo no vacío + único normalizado; (b) exigir 10 o 13 dígitos. **Recomendado: (a)** (la consigna lo excluye expresamente).
3. **Regex de email** — `^[^\s@]+@[^\s@]+\.[^\s@]+$` sobre el valor con trim. **Recomendado: esa** (cubre RN-CL-03 y los casos de la consigna).
4. **Precio** — mantener `type="number"`, aceptar coma en la función pura, validar después de `redondear2` y guardar con 2 decimales. **Recomendado: sí**. Alternativa: `type="text" inputmode="decimal"` para poder tipear texto en la UI (cambia el HTML y el spec de formularios).
5. **Imagen de libros nuevos (P-07)** — (a) `imagen: null`, tarjeta sin tapa; (b) placeholder SVG propio. **Recomendado: (a)**.
6. **`guardarX` devuelve `false`** — (a) rechazar el alta con error y conservar el formulario (también sin `localStorage`); (b) en memoria con aviso cuando no hay almacenamiento. **Recomendado: (a)** (consistente con C-05 D3/D4 y RN-UI-03; ajusta README §7).
7. **Errores como `{ campo, mensaje }[]`** en vez del `string[]` de CHANGES.md. **Recomendado: objetos** (foco y `aria-invalid` sin depender del texto).
8. **"Aparece en selección de venta"** — se verifica en C-07; C-06 verifica listado y catálogo y lo deja anotado en el README. **Recomendado: diferir a C-07** (el selector no existe todavía).
9. **Foco tras un alta correcta** — (a) queda en el botón; (b) vuelve al primer campo para cargar otro. **Recomendado: (a)** (no sorprende; el mensaje de éxito se anuncia por la zona viva).

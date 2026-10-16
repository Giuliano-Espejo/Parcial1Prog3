## Context

Motivación y alcance: ver `proposal.md`. Comportamiento exigido: ver `specs/` (`datos-semilla`, `catalogo-filtro`, `listados-libros-clientes` y el delta de `estructura-formularios-tablas`).

Estado actual observado:

- `js/comun.js` solo tiene la sección `// ===== DOM =====` con `crearElemento`, `limpiar` y `mostrarMensaje` (C-01 D8). `mostrarMensaje` crea un `<p class="mensaje mensaje--<tipo>">` con prefijo ("Aviso: ", "Error: ", "Éxito: ").
- `js/catalogo.js`, `js/libros.js` y `js/clientes.js` son placeholders con `'use strict';` y las cuatro secciones vacías. Se cargan con `defer` después de `comun.js`.
- `index.html`: `#form-busqueda[role=search]` > `#buscador-titulo[type=search]`, `#catalogo.grilla-tarjetas` vacío y `<p id="estado-catalogo" class="zona-mensajes" role="status">` con "Todavía no hay libros en el catálogo.".
- `libros.html` / `clientes.html`: `#tabla-libros-cuerpo` / `#tabla-clientes-cuerpo` vacíos, `<p id="estado-libros|estado-clientes" class="zona-mensajes" role="status">` con texto de lista vacía, formularios con aviso `p.aviso-maqueta` "Pendiente — Etapa 2" referenciado por `aria-describedby` del botón.
- CSS (C-02 D11): `.tarjeta` en columna con `gap`, `.tarjeta img` a todo el ancho con `aspect-ratio: 2/3; object-fit: cover`, `.tarjeta h3, .tarjeta p { margin: 0 }`. Contrato: `<article class="tarjeta">` con `<img>` primero y título en `h3`.
- `img/tapas/` existe y está vacío.

Restricciones (AGENTS.md): scripts clásicos sin módulos, sin librerías ni URLs en `*.html|*.css|*.js` (lo verifica un `grep` de `http://` / `https://` en C-04), sin `innerHTML`, funciones puras separadas de DOM y `localStorage`, secciones `Lógica / Render / Eventos / Inicio`, sin tests automatizados ni Strict TDD (verificación manual en el navegador). Persistencia fuera de alcance (C-05).

## Goals / Non-Goals

**Goals:**
- Que C-05 conecte `localStorage` cambiando solo el cuerpo de `cargarLibros()` / `cargarClientes()`, y que C-06 reutilice el render de los listados tras un alta sin reescribirlo.
- Que cada regla verificable (filtro, «Sin clasificar», 2 decimales, texto seguro) se pueda probar desde la consola con funciones globales, además de usando la página.
- Dejar los casos del filtro listos para que C-04 los copie al README (las tapas son de elaboración propia: no hay créditos de terceros que citar).

**Non-Goals:**
- Persistencia, `CLAVES`, `leerColeccion`/`guardarColeccion` (C-05).
- Poblar los selectores de editorial, género y autores de `libros.html`, validaciones y altas (C-06); quitar los avisos "Pendiente — Etapa 2" de Libros y Clientes (C-06).
- Ordenar el catálogo, búsqueda por autor o ISBN, ignorar tildes en el filtro.
- Cambios de CSS: la tarjeta usa solo elementos que C-02 ya estiliza.

## Decisions

### D1 — Capacidades: tres nuevas y un delta
**Decisión**: `datos-semilla` (modelo, semilla, acceso y helpers puros de `comun.js`), `catalogo-filtro` (vista Catálogo) y `listados-libros-clientes` (tablas de Libros y Clientes) como capacidades nuevas; `estructura-formularios-tablas` con `MODIFIED` en "Buscador del catálogo" y "Zonas de mensaje por vista".
**Alternativas**: (a) dos capacidades (`datos-semilla`, `catalogo-filtro`) metiendo los listados en `catalogo-filtro` → mezcla la vista Catálogo con tablas de otras vistas que C-06 modificará; (b) meter los listados como `MODIFIED` de `estructura-formularios-tablas` → esa capacidad describe estructura HTML, no render de datos.
**Por qué**: C-05 modificará `datos-semilla` (acceso persistente), C-06 modificará `listados-libros-clientes` (refresco tras alta) y `catalogo-filtro` queda estable; cada delta futuro toca una sola capacidad.

### D2 — Datos semilla (contenido concreto)
**Decisión**: constantes globales en `comun.js`, sección `// ===== Datos =====`. Todo es ficticio (la consigna lo indica); los ISBN usan el prefijo argentino 978-987 con dígito verificador correcto aunque no se valide (P-05); los emails usan dominios reservados `example.com` / `example.org` (RFC 2606).

| Colección | id | Contenido |
|-----------|----|-----------|
| `EDITORIALES` | `ed-1` / `ed-2` | Ediciones del Faro Austral / Editorial Cardón |
| `GENEROS` | `gen-1` / `gen-2` | Novela / Ensayo |
| `AUTORES` | `aut-1` / `aut-2` / `aut-3` | Marta Quiroga Vidal / Tomás Aldao / Inés Barrionuevo |

| id | `titulo` | `isbn` | `precio` | `editorialId` | `generoId` | `autorIds` | `imagen` |
|----|----------|--------|---------:|---------------|------------|------------|----------|
| `lib-1` | La noche del faro | 978-987-8000-01-5 | 1500 | ed-1 | gen-1 | aut-1 | img/tapas/lib-1.svg |
| `lib-2` | Cartas a la Noche | 978-987-8000-02-2 | 2000 | ed-2 | gen-2 | aut-2 | img/tapas/lib-2.svg |
| `lib-3` | Mapas del puerto | 978-987-8000-03-9 | 2499.9 | ed-1 | **null** | **aut-1, aut-3** | img/tapas/lib-3.svg |
| `lib-4` | Diario de una NOCHE sin luna | 978-987-8000-04-6 | 1850.75 | ed-2 | gen-1 | aut-3 | img/tapas/lib-4.svg |
| `lib-5` | El Puerto dormido | 978-987-8000-05-3 | 3200 | ed-1 | gen-1 | aut-2 | img/tapas/lib-5.svg |
| `lib-6` | Ensayos sobre el viento | 978-987-8000-06-0 | 2750 | ed-2 | gen-2 | **aut-2, aut-3** | img/tapas/lib-6.svg |

| id | `nombreCompleto` | `email` |
|----|------------------|---------|
| `cli-1` | Ana Sofía Méndez | ana.mendez@example.com |
| `cli-2` | Bruno Iriarte | bruno.iriarte@example.com |
| `cli-3` | Carla Domínguez Paz | carla.dominguez@example.org |

Cobertura: «Sin clasificar» (`lib-3`), varios autores (`lib-3`, `lib-6`), 1500 (`lib-1`) y 2000 (`lib-2`) para el caso de venta de C-07, decimales visibles (`2499.9` → "2.499,90", `1850.75`), "noche" en tres variantes de mayúsculas y "puerto" en dos. Cero ventas (no se define `VENTAS_SEMILLA`; C-05 inicializa `[]`).
**Alternativas**: títulos de libros reales → contradice "datos ficticios" y complica las tapas; ISBN sin dígito verificador → irrelevante hoy, pero válidos no cuestan nada si C-06 decide validar formato.

### D3 — Acceso a datos con la firma definitiva de C-05
**Decisión**: sección `// ===== Acceso a datos =====` con `cargarLibros()` y `cargarClientes()`, sin parámetros, que devuelven **un arreglo nuevo con copias** de la semilla (`Object.assign({}, libro, { autorIds: libro.autorIds.slice() })`; clientes con `Object.assign({}, cliente)`). C-05 reemplaza el cuerpo por `return leerColeccion(CLAVES.libros, LIBROS_SEMILLA);`, que también devuelve objetos nuevos (vienen de `JSON.parse`), así que el contrato "modificar lo devuelto no altera la semilla" se mantiene. Ninguna página lee `LIBROS_SEMILLA` / `CLIENTES_SEMILLA` directamente: siempre `cargarX()`.
**Alternativas**: devolver la constante tal cual → un `push` en C-06 antes de C-05 contaminaría la semilla y el cambio a storage alteraría el comportamiento; `Object.freeze` profundo de la semilla → protege igual pero lanza errores en modo estricto a quien intente mutar y agrega código sin necesidad.

### D4 — Helpers puros de búsqueda y formato
**Decisión**: sección `// ===== Búsqueda y formato =====` (funciones puras, sin DOM):
- `buscarPorId(lista, id)` → elemento o `null` (`find` + `|| null`).
- `nombreEditorial(id)` / `nombreGenero(id)` → nombre; `nombreGenero(null)` → `'Sin clasificar'`; id inexistente → `'Editorial desconocida'` / `'Género desconocido'`.
- `nombresAutores(ids)` → `ids.map(...)` con `'Autor desconocido'` para los inexistentes, unido con `', '`.
- `normalizarBusqueda(texto)` → `(texto === null || texto === undefined ? '' : String(texto)).trim().toLowerCase()`. No quita tildes (RN-CA-04 pide solo trim + minúsculas).
- `redondear2(n)` → `Math.round((n + Number.EPSILON) * 100) / 100` (resuelve `1.005 → 1.01`).
- `formatearPrecio(n)` → `FORMATO_PRECIO.format(redondear2(n))`, con `const FORMATO_PRECIO = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })` creado una vez.
**Cómo se cumple "precio con 2 decimales"**: los precios se guardan como `number` con a lo sumo 2 decimales (semilla escrita así; C-06 guardará `redondear2`), y la **presentación** fuerza exactamente 2 decimales con `minimumFractionDigits`/`maximumFractionDigits`. ARS ya usa 2 por defecto, pero se explicita para no depender del motor. Resultado: `1500 → "$ 1.500,00"` (el separador entre `$` y el número es un espacio no separable U+00A0, comprobado con Node/ICU).
**Alternativas**: `n.toFixed(2)` → "1500.00" con punto decimal, sin separador de miles ni símbolo; armar el formato a mano → reinventa lo que `Intl` resuelve.

### D5 — Orden de secciones de `comun.js`
**Decisión**: `Datos` → `Acceso a datos` → `Búsqueda y formato` → `DOM` (la existente queda al final, sin cambios). Las constantes son `const` de nivel superior: en scripts clásicos comparten el ámbito léxico global, así que `catalogo.js` y la consola las ven aunque no estén en `window`. Se actualiza el comentario de cabecera ("C-01 DOM, C-03 datos semilla, acceso y formato; C-05 storage").
**Por qué**: refleja la convención de la arquitectura (constantes → persistencia → búsqueda → formato → DOM) y deja el lugar exacto donde C-05 agrega `CLAVES` y storage.

### D6 — `catalogo.js`: filtro puro y una sola función de actualización
**Decisión**:
- **Lógica**: `filtrarLibrosPorTitulo(libros, texto)` → `t = normalizarBusqueda(texto)`; si `t === ''` devuelve `libros.slice()`; si no, `libros.filter(l => normalizarBusqueda(l.titulo).includes(t))`. `mensajeEstadoCatalogo(total, visibles, texto)` → `''` si hay visibles; `'Todavía no hay libros en el catálogo.'` si `total === 0`; si no, `'No se encontraron libros para «' + String(texto).trim() + '».'` (conserva las mayúsculas originales).
- **Render**: `crearTarjetaLibro(libro)` → `article.tarjeta` con, en orden, `img` (solo si `libro.imagen`; `src`, `alt = 'Tapa de «' + titulo + '»'`, `loading = 'lazy'`), `h3` con el título y un `p` por dato con rótulo en el mismo texto ("ISBN: …", "Editorial: …", "Género: …", "Autores: …", "Precio: …"), todo con `crearElemento`. `renderCatalogo(contenedor, libros)` → `limpiar` + `appendChild` de cada tarjeta (un `DocumentFragment` para un solo reflow). `actualizarCatalogo(libros, texto)` → filtra, renderiza en `#catalogo` y llama `mostrarMensaje(#estado-catalogo, 'info', mensajeEstadoCatalogo(...))` (texto vacío limpia la zona).
- **Eventos**: `alEscribirBusqueda(evento)` → `actualizarCatalogo(librosCatalogo, evento.target.value)`; `alEnviarBusqueda(evento)` → `evento.preventDefault()`.
- **Inicio**: `document.addEventListener('DOMContentLoaded', iniciarCatalogo)`; `iniciarCatalogo` toma `librosCatalogo = cargarLibros()` (variable `let` del archivo), registra `input` en `#buscador-titulo` y `submit` en `#form-busqueda`, y llama `actualizarCatalogo(librosCatalogo, buscador.value)` — usa el valor actual porque el navegador puede restaurar el texto al volver con "Atrás".
**Evento `input`**: cubre escribir, borrar, pegar, la "x" del `type="search"` y Escape (que vacía el campo y dispara `input`). No se usa `keyup` (no cubre pegar con el mouse) ni `change` (solo al salir del campo). Sin *debounce*: 6–N libros se filtran en microsegundos.
**Alternativas**: un rótulo + valor en `<dl>` por tarjeta → más semántico pero `layout.css` estila `dl` para el detalle del historial y habría que revisar ese estilo dentro de la tarjeta; `p` con rótulo en texto no requiere CSS nuevo. `alt=""` (tapa decorativa porque el título ya está en el `h3`) → la consigna y RN-UI-09 piden `alt` descriptivo para las tapas, y el texto dibujado dentro de un SVG cargado con `<img>` no es accesible para lectores de pantalla: el `alt` "Tapa de «título»" describe con exactitud lo que muestra la imagen (una tapa con ese título). La repetición con el `h3` es breve y se acepta.

### D7 — Zonas `estado-*`: de `<p>` a `<div>` y siempre vía `mostrarMensaje`
**Decisión**: en `index.html`, `libros.html` y `clientes.html` se cambia solo la etiqueta de `estado-catalogo`, `estado-libros` y `estado-clientes` de `<p>` a `<div>`, conservando `id`, `class="zona-mensajes"`, `role="status"` y el texto inicial (que queda como respaldo sin JS). JS actualiza esas zonas siempre con `mostrarMensaje(zona, 'info', texto)`: con texto vacío las deja vacías, con texto muestra "Aviso: …".
**Alternativas**: dejar `<p>` y que `mostrarMensaje` agregue otro `<p>` adentro → el DOM lo permite pero es HTML no conforme (un `p` no puede contener `p`) y un validador del DOM lo marcaría; escribir `zona.textContent = texto` → mensajes sin prefijo ni clase, distintos del resto de la app (RN-UI-05).
**Consecuencia**: `ventas.html` e `historial.html` conservan `<p id="estado-*">` hasta C-07/C-08, que deben aplicar el mismo cambio cuando sus zonas pasen a ser dinámicas.

### D8 — Listados de Libros y Clientes (DD-08) y sus avisos de maqueta
**Decisión**:
- `libros.js` — **Lógica**: `celdasLibro(libro)` → `[titulo, isbn, nombreEditorial, nombreGenero, nombresAutores, formatearPrecio(precio)]` (pura, en el orden de los `th`). **Render**: `renderListadoLibros(cuerpo, libros)` (una `tr` con un `td` por celda vía `crearElemento`) y `actualizarListadoLibros(libros)` (render en `#tabla-libros-cuerpo` + `mostrarMensaje(#estado-libros, 'info', libros.length ? '' : 'Todavía no hay libros registrados.')`). **Eventos**: vacía, con comentario "el alta llega en C-06". **Inicio**: `DOMContentLoaded` → `actualizarListadoLibros(cargarLibros())`.
- `clientes.js` — mismo esquema con `celdasCliente(cliente)` → `[nombreCompleto, email]`, `renderListadoClientes`, `actualizarListadoClientes`.
- Los avisos `#aviso-libro` / `#aviso-cliente` y su `aria-describedby` **se conservan sin cambios**: su texto ("el formulario es parte de la maqueta y todavía no registra libros") sigue siendo cierto. Los quita C-06. No se agrega `preventDefault` a esos formularios (también C-06).
**Por qué**: C-06 llama `actualizarListadoLibros(libros)` después de cada alta, sin tocar el render.

### D9 — Tapas: SVG de elaboración propia
**Decisión (confirmada por el autor)**: las seis tapas son **SVG dibujados para este proyecto**, sin imágenes de terceros. Como los libros son ficticios, una tapa real o una foto genérica mostraría otro título o no representaría al libro; un SVG propio muestra el título y el autor reales de la semilla y no requiere licencias ni créditos de terceros.
- **Archivos**: `img/tapas/lib-1.svg` … `img/tapas/lib-6.svg` (minúsculas, nombre = id del libro), referenciados en la semilla como `imagen: 'img/tapas/lib-N.svg'`.
- **Formato**: `<svg xmlns="…/2000/svg" viewBox="0 0 200 300">` (proporción 2:3, la misma que `.tarjeta img`, así `object-fit: cover` no recorta nada) con `width="200" height="300"`. Codificación UTF-8 sin BOM (los nombres llevan tildes: Tomás, Inés).
- **Contenido**: un `rect` de fondo a pantalla completa, un marco interior fino y una forma geométrica simple alusiva al título (faro, carta, mapa, luna, puerto, viento), el **título** en `<text>` con saltos de línea manuales (`<tspan x dy>`, porque SVG no ajusta texto) y el **autor** en un tamaño menor. Cada tapa tiene un fondo distinto.
- **Paleta**: tonos de C-02 escritos como hex (un SVG cargado con `<img>` no ve las custom properties de la página): fondos `#0f766e`, `#115e59`, `#1f2933`, `#52606d` y `#6b7280` con texto `#ffffff` (contraste 4.83:1 a 14.76:1), y `#e6f4f1` con texto `#1f2933` (13.05:1). No se usan los colores de error, éxito ni aviso, que C-02 reserva para estados.
- **Tipografía**: `font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"`; sin `@font-face`, `@import` ni fuentes web.
- **Seguridad y autocontención**: sin `<script>`, sin atributos `on*`, sin `<image>`, `<use>` ni `href` a recursos, sin `<foreignObject>` y sin `<style>` con `@import`. La única URL es el `xmlns` obligatorio, que es un identificador de espacio de nombres y no descarga nada; el `grep` de `http://`/`https://` de C-04 abarca `*.html`, `*.css` y `*.js`, no `*.svg`.
- **Tamaño**: ≤ 4 KB por archivo (objetivo ~2 KB), escritos a mano, sin metadatos de editores.
- **Créditos**: no hay fuentes de terceros. C-04 indica en el README que las tapas son SVG de elaboración propia del autor; no se crea ningún archivo de créditos.
**Alternativas**: (a) tapas de libros reales → contradicen los datos ficticios y tienen copyright; (b) imágenes libres de Wikimedia Commons u otros bancos → exigen verificar y citar licencia por archivo y no muestran el título del libro ficticio; (c) PNG/JPG generados → más pesados y sin texto nítido al escalar. El autor eligió (d) SVG propios.

### D10 — Casos manuales del filtro (para el README de C-04)

| Búsqueda | Resultado esperado |
|----------|--------------------|
| `noche` | 3 libros: La noche del faro, Cartas a la Noche, Diario de una NOCHE sin luna |
| `NOCHE` | los mismos 3 |
| `   noche   ` (espacios exteriores) | los mismos 3 |
| `noch` (parcial) | los mismos 3 |
| `PUERTO` | 2: Mapas del puerto, El Puerto dormido |
| vacío o solo espacios | los 6 libros, sin mensaje |
| `Zzz` | ninguno + "Aviso: No se encontraron libros para «Zzz»." |
| `<b>hola</b>` | ninguno + el texto literal en el mensaje, sin negrita |

## Risks / Trade-offs

- [El formato de `Intl` puede variar levemente entre motores (espacio normal o no separable)] → los scenarios aceptan ambos; se verifica en Chrome y Firefox.
- [El texto de un SVG no ajusta líneas y puede desbordar la tapa con títulos largos] → saltos de línea manuales con `tspan` y verificación visual de las seis tapas en Chrome y Firefox.
- [`system-ui` resuelve a fuentes distintas según el sistema y cambia el ancho del texto] → márgenes laterales amplios en el `viewBox` (≥ 16 unidades) y títulos de a lo sumo 3 líneas.
- [Las zonas `estado-*` de Ventas e Historial quedan como `<p>`] → registrado en D7 para C-07/C-08.
- [Si falta una tapa o el SVG es inválido, el navegador muestra el ícono de imagen rota con el `alt`] → la tarea de tapas abre cada SVG directamente y verifica las seis rutas; la consola muestra el 404 si falta alguna.
- [El filtro no ignora tildes ("rio" no encuentra "río")] → es lo que pide RN-CA-04; los títulos semilla evitan tildes en las palabras de prueba.

## Migration Plan

No hay datos previos. Rollback: restaurar los tres JS de página a su placeholder, quitar las secciones nuevas de `comun.js`, volver las tres zonas `estado-*` a `<p>` y vaciar `img/tapas/`.

## Open Questions

Ninguna. Resueltas por el autor durante la propuesta:
- **Origen de las tapas** → SVG de elaboración propia (D9); sin imágenes de terceros.
- **Créditos** → solo en el README de C-04, que indica que las tapas son obra propia del autor; no hay `CREDITOS.md` (P-06 resuelta).

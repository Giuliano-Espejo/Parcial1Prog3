# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|--------|--------------|---------|
| Multipágina con script común | 5 HTML + `comun.js` + un JS por página | Decisión del usuario (DD-01, DD-04); navegación con enlaces reales, sin router |
| Repositorio simple sobre `localStorage` | `comun.js`: `cargarX()` / `guardarX()` | Un único punto de acceso a la persistencia; carga la semilla solo si la clave falta |
| Funciones puras separadas de las funciones de DOM | Dentro de cada archivo JS, en secciones comentadas | La consigna valora funciones acotadas y separar responsabilidades (DD-04) |
| Render por reconstrucción | `renderCatalogo(libros)`, `renderRenglones()`… | Se vacía el contenedor (`replaceChildren()`) y se reconstruye con `createElement` + `textContent`; simple y seguro |
| Snapshot de datos históricos | Renglones y cliente copiados en la Venta | Exigencia del precio histórico (RN-VE-07) |
| Mensajes centralizados | `mostrarMensaje(contenedor, tipo, texto)` en `comun.js` | Formato uniforme de éxito, error, vacío y sin resultados (RN-UI-04/05) |

## Estructura de directorios

```
Parcial1Prog32026/
├── index.html            # Catálogo (entrada)
├── libros.html
├── clientes.html
├── ventas.html
├── historial.html
├── css/
│   ├── base.css          # custom properties, reset, tipografía, foco
│   ├── layout.css        # header/nav/main, grids, media queries
│   └── componentes.css   # tarjetas, botones, formularios, tablas, mensajes
├── js/
│   ├── comun.js          # semilla, storage, normalizadores, formato, helpers DOM, nav
│   ├── catalogo.js       # index.html
│   ├── libros.js
│   ├── clientes.js
│   ├── ventas.js
│   └── historial.js
├── img/
│   └── tapas/            # tapas SVG de elaboración propia (lib-N.svg)
├── README.md             # entrega
├── knowledge-base/       # documentación interna (no forma parte de la entrega)
├── discovery/            # idem
└── openspec/             # idem
```

### Orden de carga en cada HTML

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/componentes.css">
<script src="js/comun.js" defer></script>
<script src="js/catalogo.js" defer></script>   <!-- el de la página -->
```

Los scripts con `defer` se ejecutan en el orden del documento, después del parseo del HTML. **Nunca `type="module"`**.

### Convención interna de cada `js/<pagina>.js`

```js
'use strict';

// ===== Lógica (funciones puras: sin DOM, sin localStorage) =====
function validarLibro(datos, libros) { /* → string[] errores */ }

// ===== Render (DOM) =====
function renderListadoLibros(contenedor, libros) { /* createElement + textContent */ }

// ===== Eventos =====
function alEnviarFormulario(evento) { evento.preventDefault(); /* ... */ }

// ===== Inicio =====
document.addEventListener('DOMContentLoaded', iniciar);
```

### Contenido de `comun.js`

- Constantes: `CLAVES` (`libreria.libros`, …), `EDITORIALES`, `GENEROS`, `AUTORES`, `LIBROS_SEMILLA`, `CLIENTES_SEMILLA`.
- Persistencia: `leerColeccion(clave, semilla)`, `guardarColeccion(clave, datos)`, y los atajos `cargarLibros()`, `guardarLibros()`, etc.
- Búsqueda por id: `buscarPorId(lista, id)`, `nombreEditorial(id)`, `nombreGenero(id)` (devuelve «Sin clasificar» si es `null`), `nombresAutores(ids)`.
- Normalización: `normalizarIsbn(s)` (quita espacios y guiones), `normalizarEmail(s)` (trim + minúsculas), `normalizarBusqueda(s)`.
- Cálculo y formato: `redondear2(n)`, `formatearPrecio(n)` (`Intl.NumberFormat('es-AR', {style:'currency', currency:'ARS'})`), `formatearFecha(iso)`.
- Ids: `siguienteId(lista, prefijo)`, `siguienteIdVenta(ventas)`.
- DOM: `crearElemento(tag, texto, clase)`, `mostrarMensaje(contenedor, tipo, texto)`, `limpiar(contenedor)`.
- Navegación: marcar el enlace activo con `aria-current`.

## Identidad visual (moderna minimal)

- Custom properties en `base.css`: `--color-fondo` (claro), `--color-superficie`, `--color-texto`, `--color-acento` (un único acento con contraste AA), `--color-error`, `--color-exito`, `--espacio-1..6`, `--radio`, `--sombra`.
- Tipografía: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; escala modular.
- Catálogo con `display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`.
- Breakpoint principal ~ 768 px; diseño mobile-first desde 320 px.
- `:focus-visible { outline: 3px solid var(--color-acento); outline-offset: 2px; }`.
- Mensajes: `.mensaje--error`, `.mensaje--exito` y `.mensaje--info`, siempre con texto y prefijo.

## Seguridad

- **Autenticación / autorización**: no aplica (sin login, consigna explícita).
- **Validación de input**: en JS antes de cada alta; `novalidate` en los formularios para no depender de la validación nativa.
- **Inyección en el DOM**: prohibido `innerHTML` con datos del usuario; solo `textContent` / `createElement` (RN-UI-01).
- **Datos manipulados**: al cargar desde `localStorage` se hace `try/catch` sobre `JSON.parse`.
- **Alcance**: la consigna aclara que las validaciones y el storage del navegador son práctica, no seguridad real.

## Variables de entorno

No aplica. Sin build, sin servidor, sin secrets.

## Verificación

- Sin tests automatizados (DD-05). La verificación son los **8 casos manuales** del Ej. 6, ejecutados en Chrome y Firefox a 320 px y 1280 px, con el resultado real registrado en el README.
- Antes de cada entrega: buscar `innerHTML`, `type="module"`, `http://` y `https://` en `*.html`/`*.js`/`*.css` para detectar violaciones del alcance.

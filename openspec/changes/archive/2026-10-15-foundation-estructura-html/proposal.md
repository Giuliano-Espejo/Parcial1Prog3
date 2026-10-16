## Why

El proyecto está vacío: no existe ninguna página ni la estructura de directorios que el resto de los changes (CSS en C-02, datos y catálogo en C-03, README en C-04) necesita para trabajar. El Ejercicio 1 de la consigna (20 puntos, Etapa 1) pide las vistas HTML semánticas con navegación común, formularios con etiquetas, tablas con encabezados y zonas de mensaje; es la base del camino crítico (`C-01 → C-03 → C-04 → …`) y no depende de nada, así que va primero.

## What Changes

- Crear la estructura de directorios del proyecto (`css/`, `js/`, `img/tapas/`) sin `package.json`, build ni CDNs.
- Crear las 5 vistas multipágina: `index.html` (Catálogo, entrada), `libros.html`, `clientes.html`, `ventas.html` e `historial.html`, cada una con `lang="es"`, `meta charset` + `viewport`, `<title>` y `meta description` propios, enlace "Saltar al contenido", `header` + `nav` + `main` + `footer` y un único `h1`.
- Menú común de 5 enlaces, en el mismo orden en todas las páginas, con `aria-current="page"` estático en el enlace de la página actual.
- Orden de carga fijo en cada página: `css/base.css`, `css/layout.css`, `css/componentes.css`, `js/comun.js` y el JS de la página, todos con `defer` y **sin** `type="module"`.
- Formularios maquetados (alta de libro, alta de cliente, renglón de venta) con `<label for>` en cada campo, `novalidate` y botones que describen su acción ("Registrar libro", "Registrar cliente", "Agregar renglón", "Confirmar venta"); buscador por título en el Catálogo.
- Tablas con `<caption>`, `<thead>` y `<th scope="col">` para libros, clientes, renglones de venta (con total), historial de ventas y detalle de una venta.
- Zonas de mensaje en cada vista (lista vacía, búsqueda sin resultados, operación correcta y operación rechazada, según corresponda a la vista).
- Marca visible "Pendiente — Etapa 2" en los controles que todavía no funcionan (formularios de alta, venta e historial), como pide la consigna para la maqueta de la Etapa 1.
- `js/comun.js` mínimo con `'use strict'` y los helpers DOM `crearElemento(tag, texto, clase)`, `limpiar(contenedor)` y `mostrarMensaje(contenedor, tipo, texto)`.
- Archivos placeholder (solo comentario de cabecera) para los CSS y los JS de página que se completan en C-02, C-03 y siguientes, para que ningún enlace referenciado falle al abrir con `file://`.

## Capabilities

### New Capabilities
- `estructura-proyecto`: organización de directorios y archivos del frontend, recursos 100 % locales, sin build ni dependencias, y archivos placeholder referenciados por las páginas.
- `navegacion-vistas`: las 5 vistas HTML, su esqueleto semántico común (documento, landmarks, encabezados, enlace de salto), el menú compartido con `aria-current` y el orden de carga de estilos y scripts clásicos.
- `estructura-formularios-tablas`: formularios, tablas, zonas de mensaje y marcas de maqueta de cada vista, con los campos e identificadores que luego usa JavaScript.
- `utilidades-dom`: helpers DOM compartidos de `js/comun.js` (`crearElemento`, `limpiar`, `mostrarMensaje`) que insertan contenido solo como texto.

### Modified Capabilities
<!-- Ninguna: openspec/specs/ está vacío; todas las capacidades son nuevas. -->

## Impact

- **Archivos nuevos**: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`; `css/base.css`, `css/layout.css`, `css/componentes.css` (placeholders); `js/comun.js`; `js/catalogo.js`, `js/libros.js`, `js/clientes.js`, `js/ventas.js`, `js/historial.js` (placeholders); directorio `img/tapas/`.
- **Changes posteriores**: C-02 aplica estilos sobre esta estructura sin cambiar la semántica; C-03 extiende `js/comun.js` y llena `catalogo.js`, `libros.js` y `clientes.js`; C-06, C-07 y C-08 quitan las marcas "Pendiente — Etapa 2" de las secciones que vuelven funcionales. C-04 pasa a verificar y documentar la marca de maqueta en lugar de crearla.
- **Dependencias**: ninguna (sin librerías, CDNs, npm ni build).
- **Verificación**: manual (sin tests automatizados, DD-05): abrir las 5 páginas con doble clic, recorrer el menú con teclado y buscar `type="module"`, `innerHTML`, `http://` y `https://` sin resultados.

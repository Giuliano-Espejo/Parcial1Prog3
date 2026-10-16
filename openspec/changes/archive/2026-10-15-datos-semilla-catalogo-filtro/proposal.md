## Why

El Ej. 3 de la consigna (15 puntos: modelo y ejemplos 5, renderizado 5, filtro y estados 5) pide datos locales, un catálogo generado con JavaScript y un filtro por título. Hoy las cinco vistas son solo estructura y estilo (C-01, C-02): el catálogo está vacío, los listados de Libros y Clientes no muestran nada y `js/catalogo.js`, `js/libros.js` y `js/clientes.js` son placeholders. Es el siguiente change del camino crítico (C-01 → C-03 → C-04) y la "interacción básica" que exige el avance de la Etapa 1 (DD-08).

## What Changes

- `js/comun.js` suma una sección de **datos semilla** con ids estables: 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes, ficticios, que cubren los casos de prueba (un libro sin género, libros con varios autores, precios 1500 y 2000, títulos con palabras repetidas en distintas mayúsculas, referencias válidas, cero ventas).
- `js/comun.js` suma helpers de **acceso, normalización y formato**: `cargarLibros()` / `cargarClientes()` (devuelven una copia de la semilla en memoria; C-05 cambia solo su cuerpo por `localStorage`), `buscarPorId`, `nombreEditorial`, `nombreGenero` («Sin clasificar» para `null`), `nombresAutores`, `normalizarBusqueda`, `redondear2` y `formatearPrecio` (pesos argentinos con 2 decimales).
- `js/catalogo.js` implementa el **catálogo**: `filtrarLibrosPorTitulo(libros, texto)` pura (trim, sin distinguir mayúsculas, coincidencia parcial, vacío = todo), render de tarjetas `article.tarjeta` con tapa, título, ISBN, editorial, género, autores y precio, filtro en vivo con el evento `input` y mensajes de catálogo vacío / sin resultados en la zona `estado-catalogo`.
- `js/libros.js` y `js/clientes.js` renderizan **solo los listados** desde la semilla (DD-08). Los formularios de alta siguen siendo maqueta con su aviso "Pendiente — Etapa 2" hasta C-06.
- Las zonas `estado-catalogo`, `estado-libros` y `estado-clientes` pasan de `<p>` a `<div>` (mismos id, clase y rol) para poder contener el párrafo que crea `mostrarMensaje` sin anidar `<p>` dentro de `<p>`.
- `img/tapas/`: seis tapas SVG de elaboración propia (`lib-1.svg` … `lib-6.svg`, proporción 2:3, con el título y el autor del libro ficticio, autocontenidas: sin scripts, fuentes ni recursos externos), mostradas con `alt` descriptivo. Al ser obra propia no requieren créditos de terceros.

## Capabilities

### New Capabilities
- `datos-semilla`: modelo de datos en memoria (editoriales, géneros, autores, libros, clientes), contenido mínimo de la semilla, acceso a colecciones y helpers puros de búsqueda por id, normalización y formato de precio.
- `catalogo-filtro`: catálogo generado por JS en `index.html`, contenido de cada tarjeta, filtro por título y estados de catálogo vacío / sin resultados.
- `listados-libros-clientes`: tablas de `libros.html` y `clientes.html` generadas desde los datos, con su estado de lista vacía.

### Modified Capabilities
- `estructura-formularios-tablas`: el requisito "Buscador del catálogo" pasa a exigir que el buscador filtre en vivo y que enviarlo no recargue la página; el requisito "Zonas de mensaje por vista" pasa a exigir que las zonas de estado de Catálogo, Libros y Clientes las actualice JavaScript según los datos y admitan un mensaje en bloque.

## Impact

- **Código**: `js/comun.js` (secciones nuevas Datos, Acceso a datos, Búsqueda y formato), `js/catalogo.js`, `js/libros.js`, `js/clientes.js`; `index.html`, `libros.html` y `clientes.html` (solo el elemento de la zona `estado-*`).
- **Recursos**: `img/tapas/lib-1.svg` … `lib-6.svg`.
- **Sin cambios**: CSS (las clases `.grilla-tarjetas` y `.tarjeta` de C-02 ya cubren el render), `ventas.html`, `historial.html`, `js/ventas.js`, `js/historial.js`.
- **Changes siguientes**: C-04 indica en el README que las tapas son SVG propias y documenta los casos del filtro; C-05 reemplaza el cuerpo de `cargarLibros()` / `cargarClientes()` sin tocar a quienes las llaman; C-06 reutiliza `renderListado*` tras cada alta y decide la imagen de los libros nuevos (P-07).
- **Dependencias externas**: ninguna. Las imágenes se descargan una vez y se sirven locales; ningún `*.html`, `*.css` ni `*.js` contiene URLs.

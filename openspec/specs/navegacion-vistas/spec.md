# navegacion-vistas Specification

## Purpose
Define las cinco vistas del frontend de la librería, su esqueleto HTML semántico común y la navegación compartida entre ellas, de modo que el operador pueda moverse entre Catálogo, Libros, Clientes, Ventas e Historial con mouse o teclado.

## Requirements

### Requirement: Cinco vistas con index.html como entrada
El sistema SHALL ofrecer cinco vistas como páginas independientes: `index.html` (Catálogo, punto de entrada), `libros.html` (alta y listado de libros), `clientes.html` (alta y listado de clientes), `ventas.html` (composición y confirmación de venta) e `historial.html` (listado de ventas y detalle).

#### Scenario: Entrada por el catálogo
- **WHEN** el usuario abre `index.html` con doble clic
- **THEN** ve la vista Catálogo, con el título de la librería como encabezado principal y un buscador por título

#### Scenario: Cada vista abre sola
- **WHEN** el usuario abre directamente cualquiera de los cinco archivos HTML con `file://`
- **THEN** la vista correspondiente se muestra completa, sin depender de haber pasado antes por otra página

### Requirement: Documento HTML válido y descriptivo
Cada página SHALL declarar `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, un `<title>` propio que nombre la vista y la librería, y un `<meta name="description">` propio.

#### Scenario: Título distinto por vista
- **WHEN** se abren las cinco páginas y se comparan los títulos de las pestañas
- **THEN** cada pestaña muestra un título diferente que identifica la vista

#### Scenario: Idioma y codificación
- **WHEN** se inspecciona el `<head>` y la etiqueta `<html>` de cualquier página
- **THEN** el idioma declarado es `es` y los caracteres acentuados (por ejemplo «Catálogo») se muestran correctamente

### Requirement: Landmarks semánticos y jerarquía de encabezados
Cada página SHALL organizarse con `<header>`, `<nav>` (con nombre accesible), un único `<main>` y `<footer>`. Cada página MUST tener exactamente un `<h1>` dentro de `<main>`, y los encabezados MUST NOT saltear niveles. Las agrupaciones de contenido dentro de `<main>` SHALL usar `<section>` con su propio encabezado. La interfaz MUST NOT usar `<div>` ni `<span>` como controles interactivos.

#### Scenario: Estructura de landmarks
- **WHEN** se inspecciona el `<body>` de cualquier página
- **THEN** contiene `header`, `nav`, un solo `main` y `footer`

#### Scenario: Un solo h1 sin saltos
- **WHEN** se recorren los encabezados de cualquier página
- **THEN** hay un único `h1` y ningún encabezado saltea un nivel (por ejemplo, no hay `h3` sin un `h2` previo)

### Requirement: Enlace para saltar al contenido
Cada página SHALL incluir, como primer elemento enfocable, un enlace "Saltar al contenido principal" que lleve el foco al `<main>` de la página.

#### Scenario: Salto con teclado
- **WHEN** el usuario carga una página y presiona Tab una vez y luego Enter
- **THEN** el foco pasa al contenido principal, salteando el encabezado y el menú

### Requirement: Menú común con página actual marcada
Cada página SHALL contener el mismo menú de navegación con cinco enlaces reales (`<a href>`), en este orden y con estos textos: Catálogo (`index.html`), Libros (`libros.html`), Clientes (`clientes.html`), Ventas (`ventas.html`) e Historial (`historial.html`). El enlace de la página actual MUST llevar `aria-current="page"` escrito en el HTML, y ningún otro enlace del menú MUST llevarlo. El marcado MUST funcionar aunque JavaScript no se ejecute.

#### Scenario: Navegación entre las cinco vistas
- **WHEN** el usuario sigue cada enlace del menú desde cualquier página
- **THEN** llega a la vista indicada por el texto del enlace

#### Scenario: Página actual identificada
- **WHEN** el usuario está en `clientes.html`
- **THEN** solo el enlace "Clientes" del menú tiene `aria-current="page"`

#### Scenario: Recorrido con teclado
- **WHEN** el usuario recorre una página solo con Tab y Shift+Tab
- **THEN** alcanza los cinco enlaces del menú y todos los controles de la vista, en el mismo orden en que aparecen en pantalla

### Requirement: Orden de carga de estilos y scripts clásicos
Cada página SHALL enlazar, en este orden, `css/base.css`, `css/layout.css` y `css/componentes.css`, y luego cargar `js/comun.js` seguido del script propio de la página, ambos con el atributo `defer`. Ningún `<script>` MUST usar `type="module"`. El script propio de cada página SHALL ser: `js/catalogo.js` (`index.html`), `js/libros.js`, `js/clientes.js`, `js/ventas.js` y `js/historial.js` respectivamente.

#### Scenario: Sin módulos
- **WHEN** se busca la cadena `type="module"` en todos los archivos HTML
- **THEN** la búsqueda no devuelve resultados

#### Scenario: comun.js antes del script de página
- **WHEN** se inspeccionan las etiquetas `<script>` de cualquier página
- **THEN** `js/comun.js` aparece antes del script de la página y ambos tienen `defer`

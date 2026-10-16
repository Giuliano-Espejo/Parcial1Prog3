## MODIFIED Requirements

### Requirement: Buscador del catálogo
La vista Catálogo SHALL incluir un formulario de búsqueda con un campo etiquetado "Buscar por título" y un contenedor para el listado de libros, que JavaScript completa a partir de los datos. El buscador MUST filtrar el catálogo mientras el usuario escribe, y enviar el formulario de búsqueda (por ejemplo, con Enter) MUST NOT recargar la página.

#### Scenario: Buscador accesible
- **WHEN** el usuario abre `index.html` y recorre la página con Tab
- **THEN** llega a un campo de búsqueda cuyo nombre accesible es "Buscar por título"

#### Scenario: Enter en el buscador
- **WHEN** el usuario escribe un texto en el buscador y presiona Enter
- **THEN** la página no se recarga y la dirección del navegador no cambia

### Requirement: Zonas de mensaje por vista
Cada vista SHALL tener zonas de mensaje presentes en el HTML desde la carga, ubicadas junto al formulario o listado al que se refieren, anunciables por lectores de pantalla (región viva) y distinguibles por un identificador propio. Las zonas MUST cubrir: lista vacía (Catálogo, Libros, Clientes, renglones de Ventas, Historial), búsqueda sin resultados (Catálogo) y operación correcta o rechazada (Libros, Clientes, Ventas). Las zonas de estado de los listados de Catálogo, Libros y Clientes MUST ser contenedores de bloque capaces de alojar un mensaje en párrafo, y JavaScript MUST actualizarlas según los datos: vacías cuando el listado tiene elementos y con su mensaje cuando no los tiene. El texto inicial escrito en el HTML de esas zonas solo se ve si JavaScript no se ejecuta.

#### Scenario: Estado vacío visible sin datos
- **WHEN** el usuario abre una vista cuyo listado todavía no tiene filas
- **THEN** la zona de lista vacía muestra un texto que lo indica (por ejemplo "Todavía no hay ventas registradas.")

#### Scenario: Zona de estado vacía con datos
- **WHEN** el usuario abre `index.html`, `libros.html` o `clientes.html` con los datos semilla
- **THEN** la zona de estado del listado no muestra ningún texto

#### Scenario: Mensaje en bloque válido
- **WHEN** se inspecciona en DevTools la zona de estado del catálogo después de una búsqueda sin resultados
- **THEN** la zona es un `div` con región viva que contiene un único párrafo de mensaje, y no hay un párrafo dentro de otro párrafo

#### Scenario: Zona de operación junto al formulario
- **WHEN** se inspecciona `libros.html`, `clientes.html` o `ventas.html`
- **THEN** existe, inmediatamente después del formulario o del botón de confirmación, una zona de mensajes vacía con región viva para informar la operación correcta o rechazada

#### Scenario: Zona de sin resultados en el catálogo
- **WHEN** se inspecciona `index.html`
- **THEN** existe una zona de estado del listado, con región viva, junto al contenedor del catálogo

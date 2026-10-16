## Purpose

Define los formularios, tablas, zonas de mensaje y marcas de maqueta de cada vista, con los campos y estados que luego utiliza JavaScript, para que el operador entienda qué cargar y qué está viendo y el evaluador distinga maqueta de funcionalidad.

## ADDED Requirements

### Requirement: Campos con etiqueta asociada
Cada campo de formulario (`input`, `select`, `textarea`) SHALL tener un `<label>` cuyo atributo `for` coincida con el `id` del campo. Ningún campo MUST depender solo de un `placeholder` para indicar qué se carga.

#### Scenario: Clic en la etiqueta enfoca el campo
- **WHEN** el usuario hace clic sobre el texto de cualquier etiqueta de formulario
- **THEN** el foco pasa al campo asociado

#### Scenario: Ningún campo huérfano
- **WHEN** se revisa cada `input`, `select` y `textarea` de las cinco páginas
- **THEN** cada uno tiene un `id` único en su página y existe un `label for` con ese `id`

### Requirement: Formularios controlados por JavaScript
Cada formulario de alta o de composición SHALL declarar el atributo `novalidate`, para que las validaciones las resuelva JavaScript y no la validación nativa del navegador. Cada botón MUST ser un `<button>` nativo con `type` explícito y un texto que describa su acción.

#### Scenario: novalidate presente
- **WHEN** se inspeccionan los formularios de `libros.html`, `clientes.html` y `ventas.html`
- **THEN** cada `<form>` tiene el atributo `novalidate`

#### Scenario: Botones descriptivos
- **WHEN** se leen los textos de los botones de acción
- **THEN** son "Registrar libro", "Registrar cliente", "Agregar renglón" y "Confirmar venta" en sus respectivas vistas, y ninguno usa textos genéricos como "Enviar" u "OK"

### Requirement: Buscador del catálogo
La vista Catálogo SHALL incluir un formulario de búsqueda con un campo etiquetado "Buscar por título" y un contenedor para el listado de libros, que JavaScript completa en un change posterior.

#### Scenario: Buscador accesible
- **WHEN** el usuario abre `index.html` y recorre la página con Tab
- **THEN** llega a un campo de búsqueda cuyo nombre accesible es "Buscar por título"

### Requirement: Formulario de alta de libro
La vista Libros SHALL incluir un formulario con los campos título, ISBN, precio, editorial (selector), género (selector) y autores (selector múltiple), y el botón "Registrar libro". El selector de género MUST incluir la opción «Sin clasificar», que representa la ausencia de género. El selector de autores MUST indicar con texto cómo elegir más de un autor.

#### Scenario: Campos del libro
- **WHEN** el usuario abre `libros.html`
- **THEN** ve campos etiquetados para título, ISBN, precio, editorial, género y autores, y el botón "Registrar libro"

#### Scenario: Opción Sin clasificar
- **WHEN** el usuario despliega el selector de género
- **THEN** encuentra la opción «Sin clasificar»

#### Scenario: Selección múltiple de autores
- **WHEN** el usuario inspecciona el campo de autores
- **THEN** es un selector que admite varias opciones y tiene un texto de ayuda asociado que explica cómo elegir más de una

### Requirement: Formulario de alta de cliente
La vista Clientes SHALL incluir un formulario con los campos nombre completo y email, y el botón "Registrar cliente". El campo de email MUST ser de tipo email.

#### Scenario: Campos del cliente
- **WHEN** el usuario abre `clientes.html`
- **THEN** ve campos etiquetados para nombre completo y email, y el botón "Registrar cliente"

### Requirement: Composición de la venta
La vista Ventas SHALL incluir un selector de cliente, un formulario de renglón con selector de libro, campo numérico de cantidad y botón "Agregar renglón", una tabla de renglones con una fila de total y un botón "Confirmar venta".

#### Scenario: Controles de la venta
- **WHEN** el usuario abre `ventas.html`
- **THEN** ve, en este orden, el selector de cliente, el selector de libro, la cantidad, el botón "Agregar renglón", la tabla de renglones con su total y el botón "Confirmar venta"

#### Scenario: Cantidad numérica
- **WHEN** el usuario enfoca el campo de cantidad
- **THEN** el campo es numérico y su valor inicial es 1

### Requirement: Historial y detalle de venta
La vista Historial SHALL incluir una tabla de ventas confirmadas con las columnas número de venta, fecha, cliente, total y acceso al detalle, y una zona de detalle con encabezado propio que muestre los datos del cliente y los renglones de la venta seleccionada.

#### Scenario: Zona de detalle presente
- **WHEN** el usuario abre `historial.html`
- **THEN** ve la tabla de ventas y una sección "Detalle de la venta" que indica con texto que se debe elegir una venta para ver su detalle

### Requirement: Tablas con encabezados
Toda tabla SHALL tener `<caption>`, `<thead>` con celdas `<th scope="col">` y `<tbody>`. La fila de total de la venta MUST usar `<th scope="row">`. Cada tabla MUST estar envuelta en un contenedor propio que permita, en un change posterior, desplazarla horizontalmente sin desplazar la página.

#### Scenario: Columnas del listado de libros
- **WHEN** se inspecciona la tabla de `libros.html`
- **THEN** sus encabezados de columna son Título, ISBN, Editorial, Género, Autores y Precio, todos con `scope="col"`

#### Scenario: Columnas del listado de clientes
- **WHEN** se inspecciona la tabla de `clientes.html`
- **THEN** sus encabezados de columna son Nombre completo y Email, con `scope="col"`

#### Scenario: Columnas de los renglones de venta
- **WHEN** se inspecciona la tabla de `ventas.html`
- **THEN** sus encabezados de columna son Libro, Precio unitario, Cantidad, Subtotal y Acciones, y tiene una fila "Total" con `th scope="row"`

#### Scenario: Toda tabla tiene caption
- **WHEN** se revisan todas las tablas de las cinco páginas
- **THEN** cada una tiene un `<caption>` que describe su contenido

### Requirement: Zonas de mensaje por vista
Cada vista SHALL tener zonas de mensaje presentes en el HTML desde la carga, ubicadas junto al formulario o listado al que se refieren, anunciables por lectores de pantalla (región viva) y distinguibles por un identificador propio. Las zonas MUST cubrir: lista vacía (Catálogo, Libros, Clientes, renglones de Ventas, Historial), búsqueda sin resultados (Catálogo) y operación correcta o rechazada (Libros, Clientes, Ventas).

#### Scenario: Estado vacío visible sin datos
- **WHEN** el usuario abre una vista cuyo listado todavía no tiene filas
- **THEN** la zona de lista vacía muestra un texto que lo indica (por ejemplo "Todavía no hay ventas registradas.")

#### Scenario: Zona de operación junto al formulario
- **WHEN** se inspecciona `libros.html`, `clientes.html` o `ventas.html`
- **THEN** existe, inmediatamente después del formulario o del botón de confirmación, una zona de mensajes vacía con región viva para informar la operación correcta o rechazada

#### Scenario: Zona de sin resultados en el catálogo
- **WHEN** se inspecciona `index.html`
- **THEN** existe una zona de estado del listado, con región viva, junto al contenedor del catálogo

### Requirement: Controles pendientes identificados como maqueta
Mientras un formulario o vista no tenga su comportamiento implementado, SHALL mostrar un aviso visible con el texto "Pendiente — Etapa 2" que explique que es parte de la maqueta. El aviso MUST ser texto (no solo color ni ícono) y MUST estar asociado al botón de acción pendiente para que también lo anuncien los lectores de pantalla. El aviso aplica al formulario de alta de libro, al formulario de alta de cliente, a la composición de venta y al historial.

#### Scenario: Aviso en formularios pendientes
- **WHEN** el usuario abre `libros.html` o `clientes.html`
- **THEN** ve el texto "Pendiente — Etapa 2" junto al formulario de alta

#### Scenario: Aviso en venta e historial
- **WHEN** el usuario abre `ventas.html` o `historial.html`
- **THEN** ve el texto "Pendiente — Etapa 2" en la vista

#### Scenario: Aviso anunciado con el botón
- **WHEN** un lector de pantalla enfoca el botón "Registrar libro"
- **THEN** anuncia también el aviso de maqueta asociado

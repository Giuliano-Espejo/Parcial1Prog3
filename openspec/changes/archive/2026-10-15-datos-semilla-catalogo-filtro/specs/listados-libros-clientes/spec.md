## Purpose

Define los listados de `libros.html` y `clientes.html` generados con JavaScript a partir de las colecciones de libros y clientes, con su mensaje de lista vacía, para que el operador vea los registros existentes aunque los formularios de alta todavía sean maqueta.

## ADDED Requirements

### Requirement: Listado de libros generado desde los datos
Al abrir `libros.html`, la tabla de libros SHALL mostrar una fila por cada libro de la colección actual, en el orden de la colección, generada por JavaScript. Cada fila MUST tener, en el orden de los encabezados, el título, el ISBN, el nombre de la editorial, el nombre del género («Sin clasificar» si no tiene), los nombres de todos los autores separados por coma y el precio en pesos con exactamente 2 decimales. El HTML MUST NOT contener filas de libros escritas a mano.

#### Scenario: Libros semilla en la tabla
- **WHEN** el usuario abre `libros.html`
- **THEN** la tabla muestra una fila por cada libro semilla, la zona de estado del listado no muestra ningún mensaje y la consola no muestra errores

#### Scenario: Datos resueltos
- **WHEN** el usuario mira la fila del libro sin género y la de un libro con dos autores
- **THEN** la primera muestra «Sin clasificar» en la columna Género y la segunda muestra ambos autores en la columna Autores, y ninguna celda muestra un id como `ed-1` o `aut-2`

#### Scenario: Precio formateado
- **WHEN** el usuario mira la fila de un libro con precio 1500
- **THEN** la columna Precio muestra "$ 1.500,00"

### Requirement: Listado de clientes generado desde los datos
Al abrir `clientes.html`, la tabla de clientes SHALL mostrar una fila por cada cliente de la colección actual, generada por JavaScript, con el nombre completo y el email. El HTML MUST NOT contener filas de clientes escritas a mano.

#### Scenario: Clientes semilla en la tabla
- **WHEN** el usuario abre `clientes.html`
- **THEN** la tabla muestra una fila por cada cliente semilla con su nombre completo y su email, la zona de estado del listado no muestra ningún mensaje y la consola no muestra errores

### Requirement: Listado vacío informado
Cuando la colección de libros o de clientes está vacía, la tabla correspondiente SHALL quedar sin filas y su zona de estado MUST mostrar un mensaje informativo con texto: "Todavía no hay libros registrados." o "Todavía no hay clientes registrados.", con el prefijo de tipo informativo.

#### Scenario: Libros vacío
- **WHEN** se ejecuta en la consola de `libros.html` `actualizarListadoLibros([])`
- **THEN** la tabla queda sin filas y la zona de estado muestra "Aviso: Todavía no hay libros registrados."

#### Scenario: Clientes vacío
- **WHEN** se ejecuta en la consola de `clientes.html` `actualizarListadoClientes([])`
- **THEN** la tabla queda sin filas y la zona de estado muestra "Aviso: Todavía no hay clientes registrados."

### Requirement: Celdas insertadas como texto
Todo dato de un libro o de un cliente que se muestre en los listados SHALL insertarse como texto, nunca interpretado como HTML.

#### Scenario: Nombre con marcas HTML
- **WHEN** se ejecuta en la consola de `clientes.html` `actualizarListadoClientes([{ id: 'cli-9', nombreCompleto: '<i>Ana</i>', email: 'ana@example.com' }])`
- **THEN** la celda muestra literalmente `<i>Ana</i>` y no contiene ningún elemento `i`

### Requirement: Formularios de alta siguen como maqueta
Mientras el alta de libros y de clientes no esté implementada, los formularios de `libros.html` y `clientes.html` SHALL conservar su aviso "Pendiente — Etapa 2" asociado al botón de acción, aunque el listado ya muestre datos reales. Mostrar los listados MUST NOT agregar comportamiento a los formularios de alta.

#### Scenario: Aviso junto a un listado con datos
- **WHEN** el usuario abre `libros.html`
- **THEN** ve el aviso "Pendiente — Etapa 2" junto al formulario de alta y, debajo, la tabla con los libros semilla

# listados-libros-clientes Specification

## Purpose
Define los listados de `libros.html` y `clientes.html` generados con JavaScript a partir de las colecciones de libros y clientes, con su mensaje de lista vacía, para que el operador vea los registros existentes aunque los formularios de alta todavía sean maqueta.

## Requirements

### Requirement: Listado de libros generado desde los datos
Al abrir `libros.html`, la tabla de libros SHALL mostrar una fila por cada libro de la colección actual guardada en el navegador, en el orden de la colección, generada por JavaScript. Cada fila MUST tener, en el orden de los encabezados, el título, el ISBN, el nombre de la editorial, el nombre del género («Sin clasificar» si no tiene), los nombres de todos los autores separados por coma y el precio en pesos con exactamente 2 decimales. El HTML MUST NOT contener filas de libros escritas a mano.

#### Scenario: Libros semilla en la tabla
- **WHEN** con el almacenamiento sin claves de la librería el usuario abre `libros.html`
- **THEN** la tabla muestra una fila por cada libro semilla, la zona de estado del listado no muestra ningún mensaje y la consola no muestra errores

#### Scenario: Libros guardados en la tabla
- **WHEN** la clave `libreria.libros` contiene un libro con un precio distinto del de la semilla y el usuario abre o recarga `libros.html`
- **THEN** la fila de ese libro muestra el precio guardado, formateado con 2 decimales

#### Scenario: Datos resueltos
- **WHEN** el usuario mira la fila del libro sin género y la de un libro con dos autores
- **THEN** la primera muestra «Sin clasificar» en la columna Género y la segunda muestra ambos autores en la columna Autores, y ninguna celda muestra un id como `ed-1` o `aut-2`

#### Scenario: Precio formateado
- **WHEN** el usuario mira la fila de un libro con precio 1500
- **THEN** la columna Precio muestra "$ 1.500,00"

### Requirement: Listado de clientes generado desde los datos
Al abrir `clientes.html`, la tabla de clientes SHALL mostrar una fila por cada cliente de la colección actual guardada en el navegador, generada por JavaScript, con el nombre completo y el email. El HTML MUST NOT contener filas de clientes escritas a mano.

#### Scenario: Clientes semilla en la tabla
- **WHEN** con el almacenamiento sin claves de la librería el usuario abre `clientes.html`
- **THEN** la tabla muestra una fila por cada cliente semilla con su nombre completo y su email, la zona de estado del listado no muestra ningún mensaje y la consola no muestra errores

#### Scenario: Clientes guardados en la tabla
- **WHEN** la clave `libreria.clientes` contiene solo dos de los clientes semilla y el usuario abre `clientes.html`
- **THEN** la tabla muestra esas dos filas y la semilla no se vuelve a agregar

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

### Requirement: Listados actualizados después de un alta
Después de registrar un libro o un cliente, el listado correspondiente SHALL mostrar el registro nuevo como última fila sin recargar la página, con las mismas columnas y formato que el resto, y la zona de estado del listado MUST quedar sin mensaje. Un alta rechazada MUST NOT cambiar el listado.

#### Scenario: Libro nuevo al final
- **WHEN** el usuario registra un libro válido en `libros.html`
- **THEN** la tabla muestra una fila más, la última, con el título, el ISBN, la editorial, el género, los autores y el precio con 2 decimales del libro nuevo, y la página no se recargó

#### Scenario: Cliente nuevo al final
- **WHEN** el usuario registra un cliente válido en `clientes.html`
- **THEN** la tabla muestra una fila más, la última, con el nombre completo y el email del cliente nuevo

#### Scenario: Alta rechazada
- **WHEN** el usuario intenta registrar un cliente con un email ya existente
- **THEN** la tabla de clientes conserva exactamente las mismas filas

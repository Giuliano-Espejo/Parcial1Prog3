## MODIFIED Requirements

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

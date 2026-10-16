## MODIFIED Requirements

### Requirement: Acceso a las colecciones de libros y clientes
El script común SHALL ofrecer funciones de acceso que devuelvan la colección actual de libros y la de clientes. La colección actual MUST ser la guardada en el almacenamiento del navegador; los datos semilla solo MUST usarse para inicializar una colección cuya clave todavía no existe, o en memoria cuando el almacenamiento no está disponible (ver la capacidad `persistencia-local`). La forma de llamarlas y el tipo de valor devuelto (un arreglo de objetos con las propiedades del modelo) MUST permanecer iguales a los del avance de la Etapa 1. Modificar la colección devuelta MUST NOT alterar los datos semilla ni los datos guardados.

#### Scenario: Libros disponibles
- **WHEN** con el almacenamiento sin claves de la librería se ejecuta `cargarLibros()` en la consola
- **THEN** devuelve un arreglo con todos los libros semilla

#### Scenario: Libros guardados
- **WHEN** la clave `libreria.libros` contiene un arreglo con un precio distinto del de la semilla y se ejecuta `cargarLibros()`
- **THEN** devuelve los libros guardados con ese precio, no los de la semilla

#### Scenario: La semilla no se altera
- **WHEN** se ejecuta `const l = cargarLibros(); l[0].precio = 1; l.pop();` y luego otra vez `cargarLibros()`
- **THEN** el nuevo arreglo tiene todos los libros guardados y el primero conserva su precio guardado, y `LIBROS_SEMILLA` no cambió

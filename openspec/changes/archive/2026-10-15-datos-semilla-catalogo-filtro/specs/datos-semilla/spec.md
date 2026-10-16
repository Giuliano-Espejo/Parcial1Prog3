## Purpose

Define el modelo de datos local de la librería (editoriales, géneros, autores, libros y clientes), el contenido mínimo de los datos semilla ficticios y los helpers compartidos para acceder a las colecciones, resolver referencias por id, normalizar búsquedas y formatear precios, de modo que todas las vistas usen los mismos datos y el mismo formato.

## ADDED Requirements

### Requirement: Colecciones fijas de catálogo
El script común SHALL definir como datos globales las colecciones fijas de editoriales, géneros y autores. Cada elemento MUST tener un `id` de texto estable con prefijo (`ed-N`, `gen-N`, `aut-N`) y un `nombre` de texto no vacío. Debe haber al menos 2 editoriales, 2 géneros y 3 autores, y los ids MUST ser únicos dentro de cada colección.

#### Scenario: Mínimos y prefijos
- **WHEN** se escribe en la consola de cualquier página `EDITORIALES.length`, `GENEROS.length` y `AUTORES.length`, y se inspeccionan sus ids
- **THEN** los valores son al menos 2, 2 y 3, y los ids siguen la forma `ed-1`, `gen-1`, `aut-1`, sin repetidos

### Requirement: Libros semilla consistentes
Los datos semilla SHALL incluir al menos 6 libros ficticios. Cada libro MUST tener `id` (`lib-N`, único), `titulo` sin espacios exteriores, `isbn` único, `precio` numérico mayor que 0 con a lo sumo 2 decimales, `editorialId` que referencia una editorial existente, `generoId` que referencia un género existente o es `null`, `autorIds` con al menos un id y todos de autores existentes, e `imagen` con una ruta local dentro de `img/tapas/`. El conjunto MUST incluir al menos un libro con `generoId: null`, al menos un libro con más de un autor, al menos un libro con precio 1500 y al menos uno con precio 2000, y al menos una palabra repetida en tres títulos escrita con distintas combinaciones de mayúsculas y minúsculas.

#### Scenario: Referencias válidas
- **WHEN** se recorre en la consola cada libro semilla y se busca su editorial, su género (si no es `null`) y cada uno de sus autores en las colecciones fijas
- **THEN** todas las referencias se encuentran

#### Scenario: Casos de prueba cubiertos
- **WHEN** se inspeccionan los libros semilla
- **THEN** hay al menos un libro sin género, al menos uno con dos o más autores, uno a 1500, uno a 2000, y la palabra "noche" aparece en tres títulos como "noche", "Noche" y "NOCHE"

#### Scenario: Tapas locales
- **WHEN** se inspecciona la propiedad `imagen` de cada libro semilla
- **THEN** cada una es una ruta relativa que empieza con `img/tapas/` y el archivo existe en el proyecto

### Requirement: Clientes semilla y cero ventas
Los datos semilla SHALL incluir al menos 3 clientes ficticios, cada uno con `id` (`cli-N`, único), `nombreCompleto` no vacío y `email` con formato válido, único sin distinguir mayúsculas. Los emails MUST usar dominios reservados para ejemplos, para no corresponder a personas reales. No SHALL existir ventas semilla.

#### Scenario: Clientes de ejemplo
- **WHEN** se inspeccionan los clientes semilla en la consola
- **THEN** hay al menos 3, con ids `cli-1` … `cli-3`, nombres completos y emails distintos en dominios de ejemplo

### Requirement: Acceso a las colecciones de libros y clientes
El script común SHALL ofrecer funciones de acceso que devuelvan la colección actual de libros y la de clientes. En este change MUST devolver los datos semilla en memoria; la forma de llamarlas y el tipo de valor devuelto MUST permanecer iguales cuando un change posterior pase a leerlas del almacenamiento del navegador. Modificar la colección devuelta MUST NOT alterar los datos semilla.

#### Scenario: Libros disponibles
- **WHEN** se ejecuta `cargarLibros()` en la consola
- **THEN** devuelve un arreglo con todos los libros semilla

#### Scenario: La semilla no se altera
- **WHEN** se ejecuta `const l = cargarLibros(); l[0].precio = 1; l.pop();` y luego otra vez `cargarLibros()`
- **THEN** el nuevo arreglo tiene todos los libros semilla y el primero conserva su precio original

### Requirement: Resolución de referencias por id
El script común SHALL resolver los ids de los libros a nombres legibles: el nombre de la editorial, el nombre del género («Sin clasificar» cuando el id es `null`) y los nombres de los autores en el orden de `autorIds`, separados por coma y espacio. Un id que no existe MUST resolverse a un texto que lo indique (por ejemplo «Editorial desconocida»), sin producir errores. Buscar un id inexistente en una colección MUST devolver `null`.

#### Scenario: Género nulo
- **WHEN** se ejecuta `nombreGenero(null)`
- **THEN** devuelve «Sin clasificar»

#### Scenario: Varios autores
- **WHEN** se ejecuta `nombresAutores(['aut-1', 'aut-3'])`
- **THEN** devuelve los dos nombres en ese orden, separados por ", "

#### Scenario: Id inexistente
- **WHEN** se ejecuta `buscarPorId(EDITORIALES, 'ed-99')` y `nombreEditorial('ed-99')`
- **THEN** la primera devuelve `null` y la segunda un texto que indica editorial desconocida, sin errores en la consola

### Requirement: Normalización de búsqueda
El script común SHALL normalizar un texto de búsqueda quitando los espacios exteriores y pasándolo a minúsculas. Un valor ausente (`null` o `undefined`) MUST normalizarse como texto vacío. La normalización MUST NOT quitar tildes ni modificar los espacios interiores.

#### Scenario: Mayúsculas y espacios exteriores
- **WHEN** se ejecuta `normalizarBusqueda('  NoChe  ')`
- **THEN** devuelve `"noche"`

#### Scenario: Valor ausente
- **WHEN** se ejecuta `normalizarBusqueda(undefined)`
- **THEN** devuelve `""`

### Requirement: Precio con dos decimales en pesos argentinos
El script común SHALL redondear importes a 2 decimales y formatear precios como moneda en pesos argentinos con la convención local (`es-AR`): separador de miles con punto, separador decimal con coma y siempre exactamente 2 decimales.

#### Scenario: Precio entero
- **WHEN** se ejecuta `formatearPrecio(1500)`
- **THEN** devuelve el texto "$ 1.500,00" (el espacio puede ser un espacio no separable)

#### Scenario: Precio con un decimal
- **WHEN** se ejecuta `formatearPrecio(2499.9)`
- **THEN** devuelve "$ 2.499,90"

#### Scenario: Redondeo
- **WHEN** se ejecuta `redondear2(1.005)` y `redondear2(10.456)`
- **THEN** devuelven `1.01` y `10.46`

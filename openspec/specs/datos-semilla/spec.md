# datos-semilla Specification

## Purpose
Define el modelo de datos local de la librería (editoriales, géneros, autores, libros y clientes), el contenido mínimo de los datos semilla ficticios y los helpers compartidos para acceder a las colecciones, resolver referencias por id, normalizar búsquedas y formatear precios, de modo que todas las vistas usen los mismos datos y el mismo formato.

## Requirements

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

### Requirement: Normalización de ISBN y email para comparar
El script común SHALL ofrecer una normalización de ISBN que quite todos los espacios y guiones y pase las letras a mayúsculas, y una normalización de email que quite los espacios exteriores y pase a minúsculas. Un valor ausente (`null` o `undefined`) MUST normalizarse como texto vacío. Estas normalizaciones MUST usarse solo para comparar: MUST NOT alterar los valores que se guardan ni los que se muestran.

#### Scenario: ISBN con separadores
- **WHEN** se normaliza el ISBN `978-987 8000-01-5`
- **THEN** el resultado es `9789878000015`

#### Scenario: ISBN-10 con X minúscula
- **WHEN** se normalizan `0-306-40615-x` y `030640615X`
- **THEN** ambos resultados son `030640615X`

#### Scenario: Email con mayúsculas y espacios
- **WHEN** se normaliza el email `  ANA.Mendez@Example.com `
- **THEN** el resultado es `ana.mendez@example.com`

#### Scenario: Valor ausente
- **WHEN** se normaliza `undefined` como ISBN o como email
- **THEN** el resultado es una cadena vacía

### Requirement: Id siguiente para registros nuevos
El script común SHALL calcular el id de un registro nuevo a partir de una lista y un prefijo (`lib` o `cli`): el resultado MUST ser `<prefijo>-<N>`, donde N es el mayor número de los ids de la lista con ese prefijo más 1, o 1 si no hay ninguno. Los ids que no tengan la forma `<prefijo>-<número>` MUST ignorarse. El cálculo MUST NOT modificar la lista.

#### Scenario: Lista semilla
- **WHEN** se calcula el id siguiente de los 6 libros semilla con el prefijo `lib`
- **THEN** el resultado es `lib-7`

#### Scenario: Ids con huecos
- **WHEN** se calcula el id siguiente de una lista con `lib-1` y `lib-9` con el prefijo `lib`
- **THEN** el resultado es `lib-10`

#### Scenario: Lista vacía o con ids ajenos
- **WHEN** se calcula el id siguiente de `[]`, y luego de una lista con un único id `x-5`, con el prefijo `cli`
- **THEN** ambos resultados son `cli-1`

### Requirement: Id siguiente para ventas nuevas
El script común SHALL calcular el id de una venta nueva a partir de la lista de ventas: el resultado MUST ser `V-NNNN` con 4 dígitos con ceros a la izquierda, donde NNNN es el mayor número de los ids con forma `V-<número>` más 1, o 1 si no hay ninguno (`V-0001`). Los ids que no tengan esa forma MUST ignorarse. El cálculo MUST NOT modificar la lista ni tocar el DOM o el almacenamiento.

#### Scenario: Lista vacía
- **WHEN** se ejecuta `siguienteIdVenta([])`
- **THEN** devuelve `"V-0001"`

#### Scenario: Correlativo con ceros
- **WHEN** se ejecuta `siguienteIdVenta([{id:'V-0001'},{id:'V-0002'}])`
- **THEN** devuelve `"V-0003"`

#### Scenario: Huecos e ids ajenos
- **WHEN** se ejecuta `siguienteIdVenta([{id:'V-0001'},{id:'V-0009'},{id:'x-5'}])`
- **THEN** devuelve `"V-0010"`

## Purpose

Define el catálogo de `index.html` generado con JavaScript a partir de los datos de libros: el contenido de cada tarjeta, el filtro en vivo por título y los mensajes de catálogo vacío y de búsqueda sin resultados.

## ADDED Requirements

### Requirement: Catálogo generado desde los datos
Al abrir `index.html`, el catálogo SHALL mostrar una tarjeta por cada libro de la colección actual, en el orden de la colección, generada por JavaScript dentro del contenedor del catálogo. El HTML MUST NOT contener tarjetas o filas de libros escritas a mano.

#### Scenario: Catálogo completo al cargar
- **WHEN** el usuario abre `index.html` con `file://`
- **THEN** ve una tarjeta por cada libro semilla, la zona de estado del catálogo no muestra ningún mensaje y la consola no muestra errores

#### Scenario: Sin tarjetas en el HTML
- **WHEN** se inspecciona el código fuente de `index.html` (no el DOM en vivo)
- **THEN** el contenedor del catálogo está vacío

### Requirement: Contenido de cada tarjeta
Cada tarjeta SHALL ser un artículo independiente con, en este orden: la imagen de tapa (si el libro tiene imagen), el título como encabezado de tercer nivel, y luego el ISBN, la editorial, el género, los autores y el precio, cada dato precedido de su rótulo textual ("ISBN:", "Editorial:", "Género:", "Autores:", "Precio:"). Un libro sin género MUST mostrar «Sin clasificar». Un libro con varios autores MUST mostrarlos todos. El precio MUST mostrarse en pesos con exactamente 2 decimales. La imagen MUST tener un texto alternativo que identifique el libro por su título; un libro sin imagen MUST mostrarse sin imagen y sin errores.

#### Scenario: Libro sin género
- **WHEN** el usuario mira la tarjeta del libro semilla sin género
- **THEN** la tarjeta muestra "Género: Sin clasificar"

#### Scenario: Libro con varios autores
- **WHEN** el usuario mira la tarjeta de un libro semilla con dos autores
- **THEN** la tarjeta muestra "Autores:" seguido de ambos nombres separados por coma

#### Scenario: Precio con dos decimales
- **WHEN** el usuario mira la tarjeta de un libro con precio 2000
- **THEN** la tarjeta muestra "Precio: $ 2.000,00"

#### Scenario: Texto alternativo de la tapa
- **WHEN** se inspecciona la imagen de cualquier tarjeta
- **THEN** su atributo `alt` contiene el título del libro y la imagen se carga desde `img/tapas/`

#### Scenario: Libro sin imagen
- **WHEN** se ejecuta en la consola `renderCatalogo(document.getElementById('catalogo'), [Object.assign({}, cargarLibros()[0], { imagen: null })])`
- **THEN** se muestra una tarjeta con todos los datos y sin imagen, y la consola no muestra errores

### Requirement: Tapas propias autocontenidas
Las tapas de los libros semilla SHALL ser imágenes vectoriales SVG de elaboración propia, una por libro, guardadas en `img/tapas/` con proporción 2:3, que muestren el título y el autor del libro. Cada tapa MUST ser autocontenida: MUST NOT contener scripts, manejadores de eventos, fuentes web ni referencias a imágenes o recursos externos. El proyecto MUST NOT incluir imágenes de terceros para las tapas.

#### Scenario: Tapa legible
- **WHEN** se abre cualquiera de los SVG de `img/tapas/` directamente con `file://` en Chrome y en Firefox
- **THEN** se ve completa la tapa con el título y el autor del libro, sin texto cortado y con los acentos correctos

#### Scenario: Sin contenido activo ni externo
- **WHEN** se buscan `<script`, `onload`, `onclick`, `<image`, `href` y `@import` en `img/tapas/*.svg`
- **THEN** la búsqueda no devuelve resultados

### Requirement: Datos insertados como texto
Todo dato de un libro que se muestre en el catálogo SHALL insertarse como texto, nunca interpretado como HTML. Los scripts del catálogo MUST NOT usar `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `document.write`.

#### Scenario: Título con marcas HTML
- **WHEN** se ejecuta en la consola `renderCatalogo(document.getElementById('catalogo'), [Object.assign({}, cargarLibros()[0], { titulo: '<img src=x onerror=alert(1)>' })])`
- **THEN** la tarjeta muestra ese texto literal como título, no se crea ninguna imagen extra y no se ejecuta ningún script

#### Scenario: Búsqueda en el código
- **WHEN** se busca `innerHTML`, `insertAdjacentHTML` y `document.write` en todos los `*.js`
- **THEN** la búsqueda no devuelve resultados

### Requirement: Filtro por título
El filtro SHALL mostrar solo los libros cuyo título contiene el texto buscado, comparando sin distinguir mayúsculas de minúsculas, después de quitar los espacios exteriores del texto buscado, y aceptando coincidencias parciales en cualquier posición del título. Una búsqueda vacía o formada solo por espacios MUST mostrar el catálogo completo. El filtro MUST NOT modificar la colección de libros. La comparación respeta las tildes: "rio" no coincide con "río".

#### Scenario: Sin distinguir mayúsculas
- **WHEN** el usuario escribe "noche" en el buscador
- **THEN** ve exactamente los tres libros cuyos títulos contienen "noche", "Noche" y "NOCHE"

#### Scenario: Mayúsculas en la búsqueda
- **WHEN** el usuario escribe "NOCHE"
- **THEN** ve los mismos tres libros que con "noche"

#### Scenario: Espacios exteriores
- **WHEN** el usuario escribe "   noche   "
- **THEN** ve los mismos tres libros que con "noche"

#### Scenario: Coincidencia parcial
- **WHEN** el usuario escribe "noch"
- **THEN** ve los mismos tres libros que con "noche"

#### Scenario: Búsqueda vacía
- **WHEN** el usuario borra el texto del buscador o deja solo espacios
- **THEN** vuelve a ver el catálogo completo y la zona de estado queda sin mensaje

#### Scenario: Función pura verificable en consola
- **WHEN** se ejecuta `filtrarLibrosPorTitulo(cargarLibros(), '  NOCHE ').length` y luego `filtrarLibrosPorTitulo(cargarLibros(), '').length`
- **THEN** devuelven 3 y la cantidad total de libros semilla

### Requirement: Filtro en vivo sin recargar
El catálogo SHALL actualizarse con cada cambio del texto del buscador, mientras el usuario escribe o borra, sin necesidad de presionar Enter ni un botón. Presionar Enter en el buscador MUST NOT recargar la página ni borrar el texto escrito.

#### Scenario: Actualización al escribir
- **WHEN** el usuario escribe "n", luego "no", luego "noc"
- **THEN** el catálogo se actualiza después de cada tecla

#### Scenario: Enter no recarga
- **WHEN** el usuario escribe "noche" y presiona Enter
- **THEN** la página no se recarga, la dirección del navegador no cambia y siguen visibles los tres resultados

#### Scenario: Botón de borrar del campo de búsqueda
- **WHEN** el usuario borra la búsqueda con el control de borrado del campo (la "x" del navegador) o con Escape
- **THEN** vuelve a ver el catálogo completo

### Requirement: Estados del catálogo
La zona de estado del catálogo SHALL mostrar un mensaje informativo cuando no hay tarjetas para mostrar y quedar vacía cuando las hay. Si la colección de libros está vacía, el mensaje MUST indicar que todavía no hay libros en el catálogo. Si hay libros pero la búsqueda no coincide con ninguno, el mensaje MUST decir "No se encontraron libros para «texto»", donde texto es lo que escribió el usuario sin los espacios exteriores y con sus mayúsculas originales. El mensaje MUST ser texto con el prefijo de tipo informativo y MUST anunciarse a los lectores de pantalla sin mover el foco.

#### Scenario: Sin resultados
- **WHEN** el usuario escribe "  Zzz  "
- **THEN** el catálogo queda vacío y la zona de estado muestra "Aviso: No se encontraron libros para «Zzz»."

#### Scenario: Sin resultados con texto HTML
- **WHEN** el usuario escribe `<b>hola</b>`
- **THEN** la zona de estado muestra literalmente "Aviso: No se encontraron libros para «<b>hola</b>»." sin texto en negrita

#### Scenario: Volver a tener resultados
- **WHEN** después de una búsqueda sin resultados el usuario cambia el texto por "noche"
- **THEN** el mensaje desaparece y se ven los tres libros

#### Scenario: Catálogo vacío
- **WHEN** se ejecuta en la consola `actualizarCatalogo([], '')`
- **THEN** el catálogo queda vacío y la zona de estado muestra "Aviso: Todavía no hay libros en el catálogo."

#### Scenario: El foco no se mueve
- **WHEN** el usuario escribe una búsqueda sin resultados
- **THEN** el foco permanece en el buscador

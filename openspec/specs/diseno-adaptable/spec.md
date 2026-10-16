# diseno-adaptable Specification

## Purpose
Garantiza que las cinco vistas de la librería se puedan usar en un celular de 320 px de ancho y en una computadora de 1280 px, reacomodando menú, catálogo, formularios y tablas sin que la página se desplace horizontalmente.

## Requirements

### Requirement: Sin scroll horizontal de página
A 320 px y a 1280 px de ancho de ventana, ninguna de las cinco vistas SHALL desplazarse horizontalmente: el ancho del documento MUST ser igual o menor que el ancho visible. Ningún contenedor de la página MUST tener un ancho fijo mayor que el ancho visible.

#### Scenario: Vista a 320 px
- **WHEN** se abre cada una de las cinco vistas en el modo dispositivo de DevTools con 320 px de ancho y se ejecuta en la consola `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
- **THEN** el resultado es `true` y no aparece barra de desplazamiento horizontal en la página

#### Scenario: Vista a 1280 px
- **WHEN** se abre cada una de las cinco vistas con 1280 px de ancho
- **THEN** no hay barra de desplazamiento horizontal y el contenido principal queda centrado con un ancho máximo legible

### Requirement: Encabezado y menú adaptables
En pantallas angostas el encabezado SHALL mostrar la marca arriba y el menú debajo, con los cinco enlaces repartidos en las filas que hagan falta y sin cortar ninguna palabra. A partir del breakpoint principal (aproximadamente 768 px) la marca y el menú SHALL quedar en una sola fila. Los cinco enlaces MUST permanecer visibles en todos los anchos, sin menús desplegables.

#### Scenario: Menú a 320 px
- **WHEN** el usuario abre cualquier vista a 320 px
- **THEN** ve los cinco enlaces del menú completos, en una o más filas, sin desplazamiento horizontal

#### Scenario: Menú a 1280 px
- **WHEN** el usuario abre cualquier vista a 1280 px
- **THEN** la marca "Librería TUP" y los cinco enlaces se ven en una sola fila

### Requirement: Grilla adaptable del catálogo
El catálogo SHALL distribuir sus tarjetas en una grilla cuyas columnas se ajustan al ancho disponible, con un ancho mínimo de tarjeta de 220 px (o el ancho total disponible si es menor), de modo que a 320 px haya una columna y a 1280 px varias.

#### Scenario: Columnas según el ancho
- **WHEN** se agregan seis tarjetas al catálogo desde la consola y se cambia el ancho de 320 px a 1280 px
- **THEN** a 320 px se ve una tarjeta por fila y a 1280 px cuatro o más por fila, sin desplazamiento horizontal

### Requirement: Formularios adaptables
En pantallas angostas los campos de cada formulario SHALL apilarse en una sola columna ocupando todo el ancho. A partir del breakpoint principal, los campos de los formularios de alta y de renglón SHALL poder ubicarse en dos o más columnas, y el botón de acción MUST quedar debajo de los campos, alineado al inicio.

#### Scenario: Alta de libro a 320 px
- **WHEN** el usuario abre `libros.html` a 320 px
- **THEN** los seis campos se ven uno debajo del otro, cada uno a todo el ancho, y el botón "Registrar libro" debajo del último

#### Scenario: Alta de libro a 1280 px
- **WHEN** el usuario abre `libros.html` a 1280 px
- **THEN** los campos se distribuyen en más de una columna y el botón queda debajo de ellos

### Requirement: Tablas con desplazamiento propio
Cuando una tabla no entra en el ancho disponible SHALL desplazarse horizontalmente dentro de su propio contenedor, sin desplazar la página. Las celdas de encabezado MUST NOT partir su texto en varias líneas.

#### Scenario: Tabla de libros a 320 px
- **WHEN** el usuario abre `libros.html` a 320 px
- **THEN** la tabla de libros se puede desplazar horizontalmente dentro de su contenedor, mientras el resto de la página no se desplaza

### Requirement: Imágenes fluidas
Ninguna imagen SHALL superar el ancho de su contenedor; las imágenes MUST escalar proporcionalmente.

#### Scenario: Imagen ancha en una tarjeta
- **WHEN** se agrega desde la consola una tarjeta con una imagen de 1200 px de ancho y se ve la página a 320 px
- **THEN** la imagen se ajusta al ancho de la tarjeta y la página no se desplaza horizontalmente

### Requirement: Zoom al 200 %
Con el zoom del navegador al 200 % sobre una ventana de 1280 px, todas las vistas SHALL seguir mostrando todo su contenido y sus controles sin superposiciones y sin desplazamiento horizontal de página.

#### Scenario: Ventas con zoom
- **WHEN** el usuario abre `ventas.html` a 1280 px y aplica zoom del 200 %
- **THEN** la vista se reacomoda como en pantalla angosta y todos los controles siguen visibles y operables

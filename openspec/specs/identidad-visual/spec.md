# identidad-visual Specification

## Purpose
Define la identidad visual "moderna minimal" de la librería: hojas de estilo externas basadas en variables, una paleta clara con un único color de acento, tipografía del sistema y componentes visuales reutilizables que se ven igual en las cinco vistas.

## Requirements

### Requirement: Estilos externos basados en variables
La presentación SHALL definirse exclusivamente en las hojas de estilo externas `css/base.css`, `css/layout.css` y `css/componentes.css`. Los colores, la tipografía, los espaciados, el radio de borde y la sombra MUST declararse como custom properties en `css/base.css` y el resto de las reglas MUST usarlas en lugar de repetir valores literales. Las páginas MUST NOT contener atributos `style` ni elementos `<style>`.

#### Scenario: Sin estilos embebidos
- **WHEN** se buscan las cadenas `style=` y `<style` en los cinco archivos HTML
- **THEN** la búsqueda no devuelve resultados

#### Scenario: Cambio de acento centralizado
- **WHEN** se modifica en DevTools el valor de la variable del color de acento en `:root`
- **THEN** cambian a la vez el botón, el enlace de la página actual, la marca del encabezado y el anillo de foco, sin editar ninguna otra regla

### Requirement: Paleta clara con un único acento
La interfaz SHALL usar un fondo claro, superficies blancas y un único color de acento (con sus variantes más oscura y más clara del mismo tono) para los elementos interactivos y destacados. Los colores de error, éxito y aviso SHALL reservarse para comunicar estados y MUST NOT usarse como decoración.

#### Scenario: Un solo acento en la navegación y las acciones
- **WHEN** el usuario recorre las cinco vistas
- **THEN** los botones de acción, el enlace de la página actual y la marca del encabezado usan el mismo tono de acento, sobre un fondo claro

### Requirement: Tipografía del sistema
El texto SHALL usar la pila de fuentes sans-serif del sistema operativo (`system-ui` y equivalentes), con un tamaño base de al menos 16 px y una escala de encabezados en la que `h1` sea mayor que `h2` y `h2` mayor que el texto. La interfaz MUST NOT descargar fuentes web.

#### Scenario: Sin fuentes externas
- **WHEN** se abre cualquier vista con `file://` y se revisa la pestaña de red de DevTools
- **THEN** no se solicita ningún archivo de fuente y en los CSS no hay `@font-face` ni `@import`

#### Scenario: Jerarquía visible
- **WHEN** el usuario abre `libros.html`
- **THEN** el `h1` "Libros" se ve más grande que los `h2` de sus secciones, y estos más grandes que el texto de las etiquetas

### Requirement: Componentes reutilizables y uniformes
Los elementos equivalentes SHALL compartir la misma clase y la misma apariencia en todas las vistas: todo botón de acción con la clase de botón, todo campo con su envoltorio de campo (etiqueta arriba, control a todo el ancho disponible y texto de ayuda secundario), toda tabla dentro de su contenedor de tabla con encabezados destacados y filas separadas, y todo mensaje de operación con la clase de mensaje y su variante de tipo (error, éxito o información).

#### Scenario: Botones idénticos entre vistas
- **WHEN** se comparan "Registrar libro", "Registrar cliente", "Agregar renglón" y "Confirmar venta"
- **THEN** los cuatro tienen el mismo color, tamaño de letra, relleno y radio de borde

#### Scenario: Variantes de mensaje distinguibles
- **WHEN** se ejecuta en la consola `mostrarMensaje(document.getElementById('mensajes-libro'), 'error', 'Prueba.')` y luego con `'exito'` e `'info'`
- **THEN** cada mensaje se muestra como un bloque con borde lateral y fondo propios de su tipo, además de su prefijo textual

#### Scenario: Tablas con estilo común
- **WHEN** se comparan las tablas de Libros, Clientes, Ventas e Historial
- **THEN** todas tienen el mismo estilo de título (`caption`), encabezados y separación de filas, y la fila de total se destaca en negrita

### Requirement: Página actual destacada en el menú
El enlace del menú que corresponde a la página actual SHALL distinguirse visualmente de los demás por más de un rasgo: color de acento más un fondo o subrayado/borde y mayor peso de letra.

#### Scenario: Clientes destacado
- **WHEN** el usuario abre `clientes.html`
- **THEN** el enlace "Clientes" del menú se ve con fondo y borde de acento y en negrita, y los otros cuatro enlaces no

### Requirement: Aviso de maqueta destacado
Los avisos "Pendiente — Etapa 2" SHALL mostrarse como un bloque destacado, distinto de los mensajes de operación, con borde discontinuo, fondo de aviso y texto en negrita, de modo que se perciban aunque no se distinga el color.

#### Scenario: Aviso visible en escala de grises
- **WHEN** se abre `ventas.html` con la emulación de visión acromática de DevTools activada
- **THEN** el aviso "Pendiente — Etapa 2" sigue distinguiéndose del resto del contenido por su borde discontinuo y su texto en negrita

### Requirement: Tarjetas del catálogo con imagen uniforme
El contenedor del catálogo SHALL presentar sus tarjetas en una grilla, y cada tarjeta SHALL mostrarse como una superficie blanca con borde, radio y sombra suaves. La imagen de una tarjeta MUST ocupar todo el ancho de la tarjeta con una proporción fija de 2:3 y recortarse sin deformarse, cualquiera sea la proporción del archivo original.

#### Scenario: Imágenes de distinta proporción
- **WHEN** se agregan desde la consola dos tarjetas con imágenes de proporciones distintas dentro del catálogo
- **THEN** ambas imágenes se muestran con la misma altura y proporción y ninguna se ve estirada ni aplastada

### Requirement: Atributo hidden respetado
Ninguna regla de estilo SHALL hacer visible un elemento que tenga el atributo `hidden`.

#### Scenario: Detalle de venta oculto
- **WHEN** el usuario abre `historial.html`
- **THEN** no se ven ni la lista de datos del cliente ni la tabla de renglones del detalle, solo el texto "Seleccioná una venta para ver su detalle."

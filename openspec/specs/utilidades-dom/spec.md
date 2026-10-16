# utilidades-dom Specification

## Purpose
Provee helpers DOM compartidos por todas las páginas para crear elementos, vaciar contenedores y mostrar mensajes con formato uniforme, insertando siempre el contenido como texto y nunca como HTML.

## Requirements

### Requirement: Script común en modo estricto y sin módulos
El script común SHALL ejecutarse en modo estricto, como script clásico, y exponer sus helpers como funciones globales disponibles para los scripts de página que se cargan después. Su carga MUST NOT producir errores ni modificar la página por sí sola.

#### Scenario: Helpers disponibles en la consola
- **WHEN** se abre cualquier página y se escribe en la consola `typeof crearElemento`, `typeof limpiar` y `typeof mostrarMensaje`
- **THEN** las tres expresiones devuelven `"function"`

#### Scenario: Carga silenciosa
- **WHEN** se abre cualquier página con `file://`
- **THEN** la consola no muestra errores y el contenido visible es solo el del HTML

### Requirement: Crear elementos con texto
El helper `crearElemento(tag, texto, clase)` SHALL devolver un elemento nuevo de la etiqueta indicada. Si se pasa `texto`, MUST asignarlo como contenido de texto (convertido a cadena), nunca interpretado como HTML. Si se pasa `clase`, MUST asignarla como clase del elemento. Si `texto` o `clase` se omiten, son `null` o `undefined`, el elemento MUST quedar sin texto o sin clase respectivamente. El valor numérico `0` y la cadena vacía MUST tratarse como texto válido, no como omisión.

#### Scenario: Texto con marcas HTML se muestra literal
- **WHEN** se ejecuta `crearElemento('p', '<b>hola</b>')` y se agrega el resultado a la página
- **THEN** la página muestra literalmente `<b>hola</b>` y el párrafo no contiene ningún elemento `b`

#### Scenario: Clase asignada
- **WHEN** se ejecuta `crearElemento('td', 'ISBN', 'celda')`
- **THEN** se obtiene un `td` con el texto "ISBN" y la clase `celda`

#### Scenario: Sin texto ni clase
- **WHEN** se ejecuta `crearElemento('tr')`
- **THEN** se obtiene un `tr` vacío y sin atributo `class`

#### Scenario: Cero como texto
- **WHEN** se ejecuta `crearElemento('td', 0)`
- **THEN** el `td` muestra el texto "0"

### Requirement: Limpiar un contenedor
El helper `limpiar(contenedor)` SHALL quitar todos los nodos hijos del contenedor recibido, dejándolo vacío y conservando el contenedor y sus atributos.

#### Scenario: Contenedor con hijos
- **WHEN** se ejecuta `limpiar` sobre un `tbody` con tres filas
- **THEN** el `tbody` queda sin filas y sigue presente en la tabla

#### Scenario: Contenedor ya vacío
- **WHEN** se ejecuta `limpiar` sobre un contenedor sin hijos
- **THEN** no se produce ningún error y el contenedor sigue vacío

### Requirement: Mostrar mensajes con texto y prefijo
El helper `mostrarMensaje(contenedor, tipo, texto)` SHALL reemplazar el contenido del contenedor por un único mensaje de texto. Los tipos admitidos son `exito`, `error` e `info`; cualquier otro valor MUST tratarse como `info`. Cada mensaje MUST comenzar con un prefijo textual según su tipo ("Éxito: ", "Error: " o "Aviso: "), para que el estado no dependa solo del color, y MUST llevar una clase que identifique el tipo (`mensaje` y `mensaje--<tipo>`). Un mensaje de tipo `error` MUST anunciarse como alerta para lectores de pantalla. Si `texto` está vacío o falta, el contenedor MUST quedar vacío. El texto MUST insertarse como texto, nunca como HTML.

#### Scenario: Mensaje de error
- **WHEN** se ejecuta `mostrarMensaje(zona, 'error', 'El ISBN ya existe.')`
- **THEN** la zona contiene solo un mensaje con el texto "Error: El ISBN ya existe.", con las clases `mensaje` y `mensaje--error` y con rol de alerta

#### Scenario: Mensaje de éxito reemplaza al anterior
- **WHEN** la zona ya muestra un error y se ejecuta `mostrarMensaje(zona, 'exito', 'Libro registrado.')`
- **THEN** la zona contiene solo "Éxito: Libro registrado." y el error anterior desapareció

#### Scenario: Tipo desconocido
- **WHEN** se ejecuta `mostrarMensaje(zona, 'otro', 'Sin datos.')`
- **THEN** la zona muestra "Aviso: Sin datos." con la clase `mensaje--info`

#### Scenario: Texto vacío limpia la zona
- **WHEN** se ejecuta `mostrarMensaje(zona, 'info', '')` sobre una zona con un mensaje
- **THEN** la zona queda vacía

#### Scenario: Texto con HTML no se interpreta
- **WHEN** se ejecuta `mostrarMensaje(zona, 'info', '<img src=x onerror=alert(1)>')`
- **THEN** la zona muestra ese texto literal, no se crea ningún elemento `img` y no se ejecuta ningún script

### Requirement: Varios errores en una zona de mensajes
El script común SHALL ofrecer un helper que reemplace el contenido de una zona de mensajes por un mensaje de error por cada texto de una lista, en el mismo orden. Cada mensaje MUST comenzar con "Error: ", llevar las clases `mensaje` y `mensaje--error`, anunciarse como alerta para lectores de pantalla e insertarse como texto, nunca como HTML. Con una lista vacía, la zona MUST quedar vacía.

#### Scenario: Dos errores
- **WHEN** se muestran en una zona los errores `El título es obligatorio.` y `Elegí al menos un autor.`
- **THEN** la zona contiene exactamente dos mensajes, "Error: El título es obligatorio." y "Error: Elegí al menos un autor.", en ese orden y con rol de alerta

#### Scenario: Reemplaza el contenido anterior
- **WHEN** la zona muestra un mensaje de éxito y se muestran en ella una lista de errores
- **THEN** el mensaje de éxito desaparece y solo quedan los errores

#### Scenario: Lista vacía
- **WHEN** se muestra una lista vacía de errores en una zona con mensajes
- **THEN** la zona queda vacía

#### Scenario: Texto con marcas HTML
- **WHEN** se muestra el error `<img src=x onerror=alert(1)>`
- **THEN** la zona muestra ese texto literal precedido de "Error: ", no se crea ningún elemento `img` y no se ejecuta ningún script

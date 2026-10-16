# persistencia local

## Purpose
Define cómo la librería guarda y recupera libros, clientes y ventas en el almacenamiento local del navegador (`localStorage`), sin duplicar la semilla, con datos editables a mano desde las herramientas de desarrollo, avisos visibles ante datos dañados o almacenamiento no disponible, y los mismos datos compartidos por las cinco páginas abiertas con `file://`.

## Requirements

### Requirement: Una clave por colección mutable
La aplicación SHALL guardar cada colección mutable en su propia clave de `localStorage`: los libros en `libreria.libros`, los clientes en `libreria.clientes` y las ventas en `libreria.ventas`. Cada clave MUST contener un arreglo JSON con los objetos de esa colección y los mismos nombres de propiedad del modelo de datos. Editoriales, géneros y autores MUST NOT guardarse en el almacenamiento: siguen siendo constantes del script común. La aplicación MUST NOT crear otras claves propias en el almacenamiento.

#### Scenario: Claves después de la primera apertura
- **WHEN** con el almacenamiento del origen `file://` sin claves de la librería se abren `index.html` y `clientes.html`, y se revisa el almacenamiento local en las herramientas de desarrollo
- **THEN** existen las claves `libreria.libros` y `libreria.clientes` con arreglos JSON de 6 libros y 3 clientes, y no hay claves de editoriales, géneros ni autores

#### Scenario: Ventas sin semilla
- **WHEN** sin la clave `libreria.ventas` se ejecuta en la consola de cualquier página `cargarVentas()`
- **THEN** devuelve un arreglo vacío y la clave `libreria.ventas` queda guardada con el valor `[]`

### Requirement: Semilla solo cuando falta la clave
Al leer una colección, la aplicación SHALL usar los datos guardados en su clave si la clave existe, y SHALL escribir la semilla en la clave y devolverla solo si la clave no existe. Recargar o abrir otra página MUST NOT volver a agregar la semilla ni duplicar registros. Borrar una única clave MUST restaurar la semilla solo de esa colección en la siguiente lectura, sin alterar las demás claves.

#### Scenario: Recargar no duplica
- **WHEN** se abre `libros.html`, se recarga la página tres veces y se abre `clientes.html` y `index.html`
- **THEN** el listado de libros sigue mostrando 6 filas, el de clientes 3 filas, el catálogo 6 tarjetas, y las claves guardadas contienen 6 libros y 3 clientes

#### Scenario: Borrar una clave restaura su semilla
- **WHEN** con un precio de libro modificado en `libreria.libros` y la clave `libreria.clientes` presente, se borra solo la clave `libreria.libros` y se recarga `libros.html`
- **THEN** el listado muestra los 6 libros semilla con sus precios originales, y `libreria.clientes` conserva su contenido anterior

#### Scenario: Colección guardada vacía
- **WHEN** la clave `libreria.clientes` contiene `[]` y se abre `clientes.html`
- **THEN** el listado queda vacío con el aviso "Todavía no hay clientes registrados." y la semilla no se vuelve a cargar

### Requirement: Guardado inmediato de una colección
La aplicación SHALL ofrecer una operación de guardado por colección que escriba en el momento la colección completa en su clave, reemplazando el valor anterior, como JSON compacto (sin sangrías ni saltos de línea). La operación MUST informar a quien la llama si el guardado se realizó o no, sin lanzar errores, para que la vista pueda avisar al usuario.

#### Scenario: Guardar y releer
- **WHEN** en la consola de `libros.html` se ejecuta `const l = cargarLibros(); l[0].precio = 9999; guardarLibros(l);` y luego `cargarLibros()[0].precio`
- **THEN** el guardado informa éxito (`true`), la segunda lectura devuelve `9999` y el valor de `libreria.libros` es una sola línea de JSON

#### Scenario: Guardado que no se puede realizar
- **WHEN** el almacenamiento no está disponible o rechaza la escritura y se ejecuta `guardarClientes(cargarClientes())`
- **THEN** la operación devuelve `false` y la consola no muestra errores sin capturar

### Requirement: Colecciones devueltas independientes de lo guardado
Cada lectura de una colección SHALL devolver un arreglo nuevo con objetos nuevos. Modificar lo devuelto MUST NOT alterar los datos guardados ni la semilla hasta que se guarde explícitamente.

#### Scenario: Modificar sin guardar
- **WHEN** en la consola se ejecuta `const c = cargarClientes(); c.pop(); c[0].email = 'x@example.com';` y luego `cargarClientes()`
- **THEN** la nueva lectura devuelve los 3 clientes con sus emails originales y la clave `libreria.clientes` no cambió

### Requirement: Datos guardados dañados
Si el valor de una clave existe pero no es JSON válido o no es un arreglo, la aplicación SHALL mostrar en la página un aviso visible que nombre la colección afectada y la clave a revisar, y SHALL continuar con esa colección vacía en memoria. La aplicación MUST NOT sobrescribir ni borrar el valor dañado: durante esa carga de página MUST rechazar los guardados de esa colección (informando que no se guardó), de modo que los datos del usuario no se pisen sin aviso. Las demás colecciones MUST seguir funcionando normalmente.

#### Scenario: JSON dañado por una edición manual
- **WHEN** se edita `libreria.libros` y se borra el corchete final, y se recarga `index.html`
- **THEN** el catálogo queda vacío con su aviso de catálogo vacío, la zona de aviso de almacenamiento muestra un mensaje de error que menciona los libros y la clave `libreria.libros`, la página sigue respondiendo (el buscador funciona) y la consola no muestra errores sin capturar

#### Scenario: El valor dañado no se pisa
- **WHEN** con `libreria.libros` dañado se recarga `libros.html` y luego se ejecuta en la consola `guardarLibros([])`
- **THEN** la operación devuelve `false` y el valor de `libreria.libros` sigue siendo exactamente el texto dañado

#### Scenario: Valor que no es un arreglo
- **WHEN** se reemplaza el valor de `libreria.clientes` por `{}` y se abre `clientes.html`
- **THEN** se muestra el mismo tipo de aviso de datos dañados para los clientes y el listado queda vacío

#### Scenario: Recuperación borrando la clave
- **WHEN** después del aviso de datos dañados se borra la clave `libreria.libros` y se recarga
- **THEN** el aviso desaparece y se ven los 6 libros semilla

### Requirement: Almacenamiento no disponible
Si el navegador no permite usar `localStorage` (acceso bloqueado, deshabilitado o que lanza un error), la aplicación SHALL mostrar el aviso "No se pueden guardar datos en este navegador", con una aclaración de que se muestran los datos iniciales y que los cambios no se conservarán, y SHALL funcionar con la semilla en memoria (libros y clientes semilla, ventas vacías). El aviso MUST mostrarse una sola vez por página aunque fallen varias colecciones. La página MUST NOT dejar de funcionar ni mostrar errores sin capturar.

#### Scenario: Navegador sin almacenamiento
- **WHEN** se abre `index.html` en un navegador o perfil donde `localStorage` está bloqueado (por ejemplo, Firefox con `dom.storage.enabled` en `false`)
- **THEN** el catálogo muestra las 6 tarjetas semilla, el filtro funciona y la zona de aviso de almacenamiento muestra un único mensaje que empieza con "Error: No se pueden guardar datos en este navegador"

### Requirement: Aviso de almacenamiento visible en cada vista
Cada una de las cinco vistas SHALL tener, al comienzo del contenido principal y debajo de su encabezado principal, una zona propia para los avisos de almacenamiento, presente en el HTML desde la carga, vacía si no hay problemas y anunciable por lectores de pantalla. Los avisos MUST insertarse como texto con el prefijo de error ("Error: "), uno por problema detectado, y MUST NOT ser reemplazados por los mensajes de estado de los listados ni del filtro. Las vistas que leen datos SHALL mostrar en esa zona los problemas detectados al cargar.

#### Scenario: Sin problemas
- **WHEN** con el almacenamiento en buen estado se abre cualquiera de las cinco vistas
- **THEN** la zona de aviso de almacenamiento está vacía y no ocupa espacio visible con texto

#### Scenario: El filtro no borra el aviso
- **WHEN** con `libreria.libros` dañado se abre `index.html` y se escribe "noche" en el buscador
- **THEN** el aviso de almacenamiento sigue visible mientras la zona de estado del catálogo muestra su propio mensaje

#### Scenario: Error expresado con texto
- **WHEN** se muestra un aviso de almacenamiento
- **THEN** el aviso se entiende por su texto (prefijo "Error:" y descripción), no solo por su color

### Requirement: Acceso al almacenamiento concentrado
Solo las funciones de almacenamiento del script común SHALL leer o escribir `localStorage`. Los scripts de cada página y las funciones de lógica pura (validaciones, filtros, cálculos) MUST NOT acceder a `localStorage` directamente, y las funciones de almacenamiento MUST NOT manipular el DOM.

#### Scenario: Búsqueda de accesos
- **WHEN** se busca el texto `localStorage` en `js/*.js`
- **THEN** solo aparece dentro de la sección de almacenamiento de `js/comun.js`

### Requirement: Datos compartidos entre las vistas abiertas con file://
Un cambio guardado en una colección desde una página SHALL verse en las demás páginas del proyecto abiertas desde la misma carpeta con `file://` en el mismo navegador y perfil, al cargarlas o recargarlas. Este comportamiento MUST verificarse manualmente en Chrome y en Firefox, y el resultado observado en cada navegador MUST quedar documentado en el README; si un navegador no comparte los datos entre páginas, la limitación MUST declararse en el README en lugar de presentarse como funcionamiento correcto.

#### Scenario: Precio editado visto desde otra página
- **WHEN** en `libros.html` se cambia el precio de "La noche del faro" a 9999 en `libreria.libros` (desde las herramientas de desarrollo o con el guardado en la consola) y luego se abre `index.html` desde el menú
- **THEN** la tarjeta de "La noche del faro" muestra "Precio: $ 9.999,00"

#### Scenario: Página abierta por separado
- **WHEN** después del cambio anterior se abre `clientes.html` con doble clic desde el explorador de archivos en una pestaña nueva y desde allí se navega a `libros.html`
- **THEN** el listado de libros muestra el precio 9999 para "La noche del faro"

### Requirement: Datos editables a mano por el docente
El valor de `libreria.libros` SHALL poder editarse desde las herramientas de desarrollo del navegador cambiando un número de `precio`, y la aplicación SHALL reflejar el nuevo valor al recargar cualquier página que muestre libros, sin pasos adicionales.

#### Scenario: Edición del precio en DevTools
- **WHEN** en las herramientas de desarrollo se edita el valor de `libreria.libros` reemplazando `"precio":1500` por `"precio":9999` y se recarga `index.html`
- **THEN** la tarjeta correspondiente muestra "Precio: $ 9.999,00" y no aparece ningún aviso de almacenamiento

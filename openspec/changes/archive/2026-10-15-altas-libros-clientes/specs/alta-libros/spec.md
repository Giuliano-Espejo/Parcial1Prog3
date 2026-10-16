## Purpose

Permite registrar libros nuevos desde `libros.html` con validación completa de título, ISBN, precio, editorial, género y autores, informando los errores con texto junto al formulario y guardando el libro solo cuando todas las comprobaciones pasan.

## ADDED Requirements

### Requirement: Opciones del formulario generadas desde los datos
Al abrir `libros.html`, los selectores de editorial, género y autores SHALL tener una opción por cada editorial, género y autor de los datos locales, creada por JavaScript, con el nombre como texto visible. El selector de editorial MUST conservar como primera opción "Seleccioná una editorial" sin valor, y el de género MUST conservar como primera opción «Sin clasificar» sin valor, que representa la ausencia de género. El HTML MUST NOT contener opciones de editoriales, géneros ni autores escritas a mano.

#### Scenario: Opciones completas
- **WHEN** el usuario abre `libros.html` y despliega los tres selectores
- **THEN** el de editorial muestra "Seleccioná una editorial" y las 2 editoriales, el de género muestra «Sin clasificar» y los 2 géneros, y el de autores muestra los 3 autores, todos con su nombre y ninguno con un id visible

#### Scenario: Sin clasificar seleccionado por defecto
- **WHEN** el usuario abre `libros.html` sin tocar el selector de género
- **THEN** el género seleccionado es «Sin clasificar»

### Requirement: Envío del formulario de libro sin recargar
Enviar el formulario de alta de libro (con el botón "Registrar libro" o con Enter) SHALL procesarse con JavaScript sin recargar la página ni cambiar la dirección del navegador, y sin que intervenga la validación nativa del navegador.

#### Scenario: Envío vacío
- **WHEN** el usuario pulsa "Registrar libro" con el formulario vacío
- **THEN** la página no se recarga, la dirección no cambia, no aparece ningún globo de validación del navegador y se muestran los errores del formulario

### Requirement: Validación del libro
Antes de guardar, el sistema SHALL comprobar los datos del libro y producir un mensaje de error por cada regla incumplida, en el orden de los campos del formulario (título, ISBN, precio, editorial, género, autores):
- El título MUST no quedar vacío después de quitar los espacios exteriores ("El título es obligatorio.").
- El ISBN MUST no quedar vacío después de quitar espacios y guiones ("El ISBN es obligatorio.").
- El ISBN MUST NOT coincidir con el de un libro existente comparando ambos sin espacios ni guiones y sin distinguir mayúsculas ("Ya existe un libro con el ISBN «<isbn escrito>»."). No se valida la cantidad de dígitos ni el dígito de control.
- El precio MUST ser numérico y mayor que 0 después de redondearlo a 2 decimales; se acepta coma o punto como separador decimal ("El precio debe ser un número mayor que 0.").
- La editorial MUST estar elegida ("Elegí una editorial.") y existir en los datos locales ("La editorial elegida no existe.").
- El género MAY quedar en «Sin clasificar»; si se asigna, MUST existir en los datos locales ("El género elegido no existe.").
- MUST elegirse al menos un autor ("Elegí al menos un autor.") y todos los autores elegidos MUST existir en los datos locales ("Uno de los autores elegidos no existe.").

La comprobación MUST NOT depender de la página ni del almacenamiento: con los mismos datos de entrada y la misma lista de libros, MUST producir siempre los mismos errores.

#### Scenario: ISBN duplicado escrito con espacios
- **WHEN** el usuario completa todos los campos correctamente pero escribe el ISBN `978 987 8000 01 5` (el de "La noche del faro" sin guiones)
- **THEN** se rechaza el alta con "Error: Ya existe un libro con el ISBN «978 987 8000 01 5»." y el listado no cambia

#### Scenario: ISBN duplicado sin separadores
- **WHEN** el usuario escribe el ISBN `9789878000022` y el resto de los campos correctos
- **THEN** se rechaza el alta por ISBN existente

#### Scenario: Precio cero, negativo o no numérico
- **WHEN** el usuario intenta registrar un libro válido salvo el precio, primero con `0`, después con `-5` y después con un valor no numérico (por ejemplo `1e`)
- **THEN** cada intento se rechaza con "Error: El precio debe ser un número mayor que 0."

#### Scenario: Precio que redondea a cero
- **WHEN** se comprueba un libro con precio `0.004`
- **THEN** se rechaza con el error de precio

#### Scenario: Sin autores
- **WHEN** el usuario completa todo menos los autores
- **THEN** se rechaza el alta con "Error: Elegí al menos un autor."

#### Scenario: Editorial o autor manipulado
- **WHEN** el usuario cambia en DevTools el valor de una opción de editorial a `ed-99` (o el de un autor a `aut-99`), la elige y envía el formulario
- **THEN** se rechaza el alta con "Error: La editorial elegida no existe." (o "Error: Uno de los autores elegidos no existe.")

#### Scenario: Género manipulado
- **WHEN** el usuario cambia en DevTools el valor de una opción de género a `gen-99`, la elige y envía un libro por lo demás válido
- **THEN** se rechaza el alta con "Error: El género elegido no existe."

#### Scenario: Varios errores a la vez
- **WHEN** el usuario envía el formulario vacío
- **THEN** se muestran, en este orden, los errores de título, ISBN, precio, editorial y autores, y ninguno de género

### Requirement: Presentación accesible de los errores del libro
Cuando el alta de libro se rechaza por validación, el sistema SHALL mostrar todos los errores en la zona de mensajes que sigue al formulario, uno por línea y cada uno precedido por "Error: ", anunciados a los lectores de pantalla. Cada campo con al menos un error MUST quedar marcado con `aria-invalid="true"` y los demás campos MUST quedar sin esa marca. El foco MUST moverse al primer campo con error en el orden del formulario. No MUST guardarse nada y los valores escritos MUST conservarse en el formulario.

#### Scenario: Foco al primer campo inválido
- **WHEN** el usuario completa el título y envía el formulario sin ISBN, sin precio, sin editorial y sin autores
- **THEN** el foco queda en el campo ISBN, los campos ISBN, precio, editorial y autores tienen `aria-invalid="true"`, el título no lo tiene y el título escrito se conserva

#### Scenario: Corrección parcial
- **WHEN** después del rechazo anterior el usuario completa el ISBN y el precio y vuelve a enviar
- **THEN** los errores de ISBN y precio desaparecen, esos campos pierden `aria-invalid`, y solo quedan marcados la editorial y los autores

#### Scenario: Errores como texto
- **WHEN** se inspecciona la zona de mensajes después de un rechazo
- **THEN** cada error es un texto que empieza con "Error:" y nombra el campo, de modo que se entiende sin depender del color

### Requirement: Registro de un libro válido
Cuando todas las comprobaciones pasan, el sistema SHALL agregar el libro al final de la colección y guardarla en el navegador. El libro registrado MUST tener un id nuevo con el formato `lib-N` (N = mayor número usado + 1), el título y el ISBN sin espacios exteriores (el ISBN tal como se escribió, sin normalizar), el precio redondeado a 2 decimales, la editorial, el género (`null` para «Sin clasificar»), los autores elegidos en el orden del selector e `imagen: null`. Si el guardado se completa, el listado de libros MUST actualizarse sin recargar la página, el formulario MUST volver a su estado inicial sin marcas de error, y la zona de mensajes MUST mostrar "Éxito: Libro «<título>» registrado.". El título MUST insertarse como texto, nunca como HTML.

#### Scenario: Alta correcta
- **WHEN** con los datos semilla el usuario registra "Mareas de invierno", ISBN `978-987-8000-07-7`, precio `1999.9`, editorial "Editorial Cardón", «Sin clasificar» y los autores Tomás Aldao e Inés Barrionuevo
- **THEN** aparece una fila nueva al final del listado con "$ 1.999,90", «Sin clasificar» y ambos autores; el formulario queda vacío; la zona muestra "Éxito: Libro «Mareas de invierno» registrado."; y `libreria.libros` contiene el libro con id `lib-7`, `precio` 1999.9, `generoId` null e `imagen` null

#### Scenario: Precio con coma decimal
- **WHEN** se comprueba y registra un libro válido con precio `1500,5`
- **THEN** el libro se guarda con precio 1500.5

#### Scenario: Persistencia y catálogo
- **WHEN** después de un alta correcta el usuario recarga `libros.html` y luego abre el Catálogo desde el menú
- **THEN** el libro sigue en el listado y aparece una tarjeta suya en el catálogo, sin imagen y sin errores en la consola

#### Scenario: Título con marcas HTML
- **WHEN** el usuario registra un libro válido con título `<b>Hola</b>`
- **THEN** el listado y el mensaje de éxito muestran el texto literal `<b>Hola</b>` sin negrita

#### Scenario: Id siguiente sin huecos reutilizados
- **WHEN** la colección guardada tiene los libros `lib-1` y `lib-9` y el usuario registra un libro válido
- **THEN** el libro nuevo recibe el id `lib-10`

### Requirement: Alta de libro rechazada si no se puede guardar
Si las comprobaciones pasan pero la colección de libros no se puede guardar (por ejemplo, porque sus datos guardados están dañados o el navegador no permite almacenar), el sistema SHALL rechazar el alta: el libro MUST NOT agregarse al listado, el formulario MUST conservar lo escrito y la zona de mensajes del formulario MUST mostrar "Error: No se pudo guardar el libro. Revisá el aviso de almacenamiento al principio de la página.". El valor guardado dañado MUST NOT modificarse.

#### Scenario: Clave dañada
- **WHEN** el valor de `libreria.libros` está dañado, el usuario abre `libros.html` e intenta registrar un libro válido
- **THEN** el alta se rechaza con el error de guardado, el listado sigue vacío, el aviso de almacenamiento sigue visible y el valor dañado queda igual

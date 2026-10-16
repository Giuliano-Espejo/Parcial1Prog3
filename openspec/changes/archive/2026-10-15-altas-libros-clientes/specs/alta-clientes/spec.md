## Purpose

Permite registrar clientes nuevos desde `clientes.html` con validación de nombre completo y email (formato y unicidad sin distinguir mayúsculas), informando los errores con texto junto al formulario y guardando el cliente solo cuando todas las comprobaciones pasan.

## ADDED Requirements

### Requirement: Envío del formulario de cliente sin recargar
Enviar el formulario de alta de cliente (con el botón "Registrar cliente" o con Enter) SHALL procesarse con JavaScript sin recargar la página ni cambiar la dirección del navegador, y sin que intervenga la validación nativa del navegador.

#### Scenario: Email inválido sin globo nativo
- **WHEN** el usuario escribe `ana` en el email y pulsa Enter
- **THEN** la página no se recarga, no aparece ningún globo de validación del navegador y se muestra el error de formato del formulario

### Requirement: Validación del cliente
Antes de guardar, el sistema SHALL comprobar los datos del cliente y producir un mensaje de error por cada regla incumplida, en el orden de los campos (nombre completo, email):
- El nombre completo MUST no quedar vacío después de quitar los espacios exteriores ("El nombre completo es obligatorio.").
- El email MUST no quedar vacío después de quitar los espacios exteriores ("El email es obligatorio.").
- El email, sin sus espacios exteriores, MUST tener la forma `algo@dominio.ext`: texto sin espacios ni `@`, una `@`, y un dominio sin espacios ni `@` que contenga al menos un punto con texto antes y después ("El email no tiene un formato válido (ejemplo: nombre@dominio.com).").
- El email MUST NOT coincidir con el de un cliente existente comparando ambos sin espacios exteriores y sin distinguir mayúsculas ("Ya existe un cliente con el email «<email escrito>».").

Un email vacío MUST producir solo el error de obligatorio, y un email con formato inválido MUST NOT producir además el error de duplicado. La comprobación MUST NOT depender de la página ni del almacenamiento.

#### Scenario: Email con formato inválido
- **WHEN** el usuario intenta registrar "Diego Paz" con los emails `diego`, `diego@example`, `diego paz@example.com` y `diego@@example.com`, uno por vez
- **THEN** cada intento se rechaza con "Error: El email no tiene un formato válido (ejemplo: nombre@dominio.com)."

#### Scenario: Email existente en mayúsculas
- **WHEN** con los datos semilla el usuario intenta registrar "Ana Duplicada" con el email `ANA.MENDEZ@EXAMPLE.COM`
- **THEN** se rechaza con "Error: Ya existe un cliente con el email «ANA.MENDEZ@EXAMPLE.COM»." y el listado no cambia

#### Scenario: Email existente con espacios exteriores
- **WHEN** se comprueba un cliente con email `  bruno.iriarte@example.com  ` contra los clientes semilla
- **THEN** se rechaza por email existente

#### Scenario: Formulario vacío
- **WHEN** el usuario envía el formulario vacío
- **THEN** se muestran, en este orden, "Error: El nombre completo es obligatorio." y "Error: El email es obligatorio.", y ningún otro error

### Requirement: Presentación accesible de los errores del cliente
Cuando el alta de cliente se rechaza por validación, el sistema SHALL mostrar todos los errores en la zona de mensajes que sigue al formulario, uno por línea y cada uno precedido por "Error: ", anunciados a los lectores de pantalla. Cada campo con error MUST quedar marcado con `aria-invalid="true"`, los demás MUST quedar sin esa marca y el foco MUST moverse al primer campo con error. No MUST guardarse nada y los valores escritos MUST conservarse.

#### Scenario: Foco al email inválido
- **WHEN** el usuario escribe el nombre "Diego Paz" y el email `diego@example` y envía
- **THEN** el foco queda en el campo email, que tiene `aria-invalid="true"`, el nombre no lo tiene y ambos valores se conservan

### Requirement: Registro de un cliente válido
Cuando todas las comprobaciones pasan, el sistema SHALL agregar el cliente al final de la colección y guardarla en el navegador. El cliente registrado MUST tener un id nuevo con el formato `cli-N` (N = mayor número usado + 1), el nombre completo sin espacios exteriores y el email sin espacios exteriores, conservando las mayúsculas tal como se escribió. Si el guardado se completa, el listado de clientes MUST actualizarse sin recargar la página, el formulario MUST volver a su estado inicial sin marcas de error y la zona de mensajes MUST mostrar "Éxito: Cliente «<nombre completo>» registrado.". Los datos MUST insertarse como texto, nunca como HTML.

#### Scenario: Alta correcta
- **WHEN** con los datos semilla el usuario registra "Diego Paz" con el email `Diego.Paz@example.com`
- **THEN** aparece una fila nueva al final del listado con ese nombre y ese email, el formulario queda vacío, la zona muestra "Éxito: Cliente «Diego Paz» registrado." y `libreria.clientes` contiene el cliente con id `cli-4` y email `Diego.Paz@example.com`

#### Scenario: Duplicado del cliente recién registrado
- **WHEN** después del alta anterior el usuario intenta registrar otro cliente con el email `diego.paz@EXAMPLE.com`
- **THEN** se rechaza por email existente

#### Scenario: Persistencia entre páginas
- **WHEN** después de un alta correcta el usuario va a Catálogo desde el menú y vuelve a Clientes
- **THEN** el cliente nuevo sigue en el listado

### Requirement: Alta de cliente rechazada si no se puede guardar
Si las comprobaciones pasan pero la colección de clientes no se puede guardar, el sistema SHALL rechazar el alta: el cliente MUST NOT agregarse al listado, el formulario MUST conservar lo escrito y la zona de mensajes del formulario MUST mostrar "Error: No se pudo guardar el cliente. Revisá el aviso de almacenamiento al principio de la página.". El valor guardado dañado MUST NOT modificarse.

#### Scenario: Clave dañada
- **WHEN** el valor de `libreria.clientes` está dañado, el usuario abre `clientes.html` e intenta registrar un cliente válido
- **THEN** el alta se rechaza con el error de guardado, el listado sigue vacío y el valor dañado queda igual

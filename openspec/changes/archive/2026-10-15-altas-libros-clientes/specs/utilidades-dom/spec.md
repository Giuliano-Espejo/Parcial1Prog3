## ADDED Requirements

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

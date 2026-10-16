## ADDED Requirements

### Requirement: Listados actualizados después de un alta
Después de registrar un libro o un cliente, el listado correspondiente SHALL mostrar el registro nuevo como última fila sin recargar la página, con las mismas columnas y formato que el resto, y la zona de estado del listado MUST quedar sin mensaje. Un alta rechazada MUST NOT cambiar el listado.

#### Scenario: Libro nuevo al final
- **WHEN** el usuario registra un libro válido en `libros.html`
- **THEN** la tabla muestra una fila más, la última, con el título, el ISBN, la editorial, el género, los autores y el precio con 2 decimales del libro nuevo, y la página no se recargó

#### Scenario: Cliente nuevo al final
- **WHEN** el usuario registra un cliente válido en `clientes.html`
- **THEN** la tabla muestra una fila más, la última, con el nombre completo y el email del cliente nuevo

#### Scenario: Alta rechazada
- **WHEN** el usuario intenta registrar un cliente con un email ya existente
- **THEN** la tabla de clientes conserva exactamente las mismas filas

## REMOVED Requirements

### Requirement: Formularios de alta siguen como maqueta
**Reason**: C-06 implementa el alta de libros y de clientes; los formularios dejan de ser maqueta y pierden el aviso "Pendiente — Etapa 2".
**Migration**: El comportamiento de los formularios queda definido en las capacidades `alta-libros` y `alta-clientes`, y la actualización del listado en "Listados actualizados después de un alta".

# historial-precio-historico Specification

## Purpose

Consultar en `historial.html` las ventas confirmadas y su detalle usando solo los valores copiados al confirmar (RN-VE-07/09/10, US-012).

## Requirements

### Requirement: Listado de ventas desde copias con fecha local

El historial SHALL renderizar una fila por cada venta de `cargarVentas()`, en el orden guardado, con id, `formatearFecha(fecha)`, `clienteNombre`, `formatearPrecio(total)` y un botón nativo "Ver detalle de V-000N". `formatearFecha` SHALL ser pura: ISO válido → representación local; valor no parseable → texto original. Sin ventas, el `tbody` SHALL quedar vacío y `#estado-historial` SHALL mostrar "No hay ventas registradas"; con ventas, esa zona SHALL quedar vacía.

#### Scenario: Fila V-0001 del caso 5000

- GIVEN `libreria.ventas` con `V-0001` (`clienteNombre` de `cli-1`, `total 5000`, `fecha` ISO)
- WHEN se abre `historial.html`
- THEN la tabla muestra una fila con "V-0001", la fecha en formato local, el nombre del cliente, "$ 5.000,00" y el botón "Ver detalle de V-0001"

#### Scenario: Historial vacío

- GIVEN `libreria.ventas` igual a `[]`
- WHEN se abre `historial.html`
- THEN el cuerpo de la tabla está vacío y `#estado-historial` muestra "No hay ventas registradas"

#### Scenario: Fecha inválida por edición manual

- GIVEN una venta cuya `fecha` es "no-fecha"
- WHEN se abre `historial.html`
- THEN la celda de fecha muestra "no-fecha" y la fila se renderiza igual

### Requirement: Detalle construido solo con datos guardados

Al pulsar "Ver detalle de V-000N", el detalle SHALL mostrar `clienteNombre`, `clienteEmail`, `formatearFecha(fecha)` y los renglones con `titulo`, `isbn`, `cantidad`, `precioUnitario` y `subtotal` guardados, más el `total`. El código MUST NOT llamar a `cargarLibros()` ni leer `libreria.libros`. Elegir otra venta SHALL reemplazar el detalle. Antes de elegir, `#estado-detalle` SHALL mostrar "Seleccioná una venta para ver su detalle."

#### Scenario: Detalle con valores copiados

- GIVEN `V-0001` con renglones (`titulo`/`isbn` copiados, `2 × 1500 = 3000` y `1 × 2000 = 2000`, `total 5000`)
- WHEN se pulsa "Ver detalle de V-0001"
- THEN el detalle muestra esos título/ISBN/cantidad/precio/subtotal y el total "$ 5.000,00"

#### Scenario: Precio histórico intacto (Flujo 7)

- GIVEN `V-0001` confirmada y luego `precio` de `lib-1` editado a mano en `libreria.libros`
- WHEN se recarga `historial.html` y se abre el detalle
- THEN precio unitario, subtotales y total siguen en `1500`, `3000`/`2000` y `5000`

### Requirement: Historial inmutable sin edición ni borrado

La vista MUST NOT ofrecer controles para editar ni eliminar ventas: ningún formulario, campo editable ni botón de editar/borrar sobre ventas confirmadas. Un renglón cuyo `libroId` ya no exista en el catálogo SHALL seguir mostrándose con sus copias.

#### Scenario: Sin controles de modificación

- GIVEN cualquier venta confirmada
- WHEN se inspecciona `historial.html` y su detalle
- THEN no hay botones ni campos para editar o eliminar ventas

#### Scenario: Libro borrado del catálogo

- GIVEN `V-0001` con `lib-1` y luego `lib-1` eliminado de `libreria.libros`
- WHEN se abre el detalle de `V-0001`
- THEN el renglón muestra título, ISBN, cantidad, precio y subtotal guardados

### Requirement: Presentación accesible, segura y robusta

Todo dato SHALL insertarse con `textContent`/`crearElemento`, nunca con `innerHTML`. La tabla y el detalle SHALL conservar `caption`, `th scope="col"` y `th scope="row"`; `#estado-historial` y `#estado-detalle` SHALL ser las regiones vivas del HTML; los botones SHALL ser nativos "Ver detalle de V-000N" con foco visible. Con `libreria.ventas` dañada, el historial SHALL mostrar el aviso de C-05 y quedar vacío sin pisar lo guardado.

#### Scenario: Título con marcas HTML

- GIVEN una venta cuyo `titulo` guardado es `<b>Hola</b>`
- WHEN se abre su detalle
- THEN la celda muestra el texto literal y no se crea ningún elemento `b`

#### Scenario: Clave de ventas dañada

- GIVEN `libreria.ventas` con JSON inválido
- WHEN se abre `historial.html`
- THEN se ve el aviso de datos dañados, el listado queda vacío y el valor dañado sigue intacto

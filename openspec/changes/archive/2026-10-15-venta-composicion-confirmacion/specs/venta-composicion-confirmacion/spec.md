## Purpose

Permite componer una venta en `ventas.html` (elegir cliente, agregar renglones con cantidad, editar cantidades y quitar renglones) y confirmarla con snapshot histórico, recalculando el total a 2 decimales y guardando solo ventas confirmadas en `libreria.ventas`.

## ADDED Requirements

### Requirement: Selectores de cliente y libro generados desde los datos

Al abrir `ventas.html`, el selector de cliente SHALL tener una opción por cada cliente de `cargarClientes()` y el selector de libro una opción por cada libro de `cargarLibros()`, creadas por JavaScript con el nombre/título como texto visible. Los placeholders "Seleccioná un cliente" y "Seleccioná un libro" sin valor MUST conservarse como primera opción. El HTML MUST NOT contener opciones de clientes ni libros escritas a mano. Los registros dados de alta en C-06 MUST aparecer sin recargar la lógica (al cargar la página).

#### Scenario: Opciones semilla

- **WHEN** con almacenamiento limpio el usuario abre `ventas.html` y despliega ambos selectores
- **THEN** el de cliente muestra su placeholder y los 3 clientes semilla con nombre completo, y el de libro muestra su placeholder y los 6 libros semilla con título, sin ids visibles

#### Scenario: Alta de C-06 visible en la venta (D12)

- **WHEN** con `libreria.libros` conteniendo `lib-7` ("Mareas de invierno") y `libreria.clientes` conteniendo `cli-4` ("Diego Paz") se abre `ventas.html`
- **THEN** el selector de libro incluye "Mareas de invierno" y el de cliente incluye "Diego Paz"

#### Scenario: Sin HTML manual

- **WHEN** se inspecciona `ventas.html`
- **THEN** ambos `select` solo contienen su opción placeholder en el HTML

### Requirement: Venta en curso en memoria sin persistir

La venta en curso SHALL vivir solo en memoria como `{ clienteId: string, renglones: [{ libroId: string, cantidad: number }] }`, inicializada como `{ clienteId: '', renglones: [] }`. Ninguna operación de composición SHALL escribir en `localStorage`; solo la confirmación SHALL llamar a `guardarVentas`. Recargar la página SHALL descartar la venta en curso.

#### Scenario: No persiste hasta confirmar

- **WHEN** se agrega un renglón y sin confirmar se ejecuta `cargarVentas()` en la consola
- **THEN** devuelve el mismo arreglo que antes (sin la venta en curso) y `libreria.ventas` no cambió

#### Scenario: Recarga descarta

- **WHEN** se agrega un renglón y se recarga `ventas.html`
- **THEN** la tabla de renglones queda vacía y el selector de cliente vuelve a su placeholder

### Requirement: Agregar renglón con cantidad entera mayor que cero

`agregarRenglon(enCurso, libroId, cantidad)` SHALL ser pura (sin DOM ni `localStorage`): si `cantidad` no es un número entero mayor que 0 (0, negativos, decimales como 1.5, `NaN` o texto no numérico) SHALL rechazar con el error "La cantidad debe ser un número entero mayor que 0." sin modificar la venta. Si el `libroId` ya tiene renglón, SHALL sumar la cantidad al renglón existente y producir el aviso "Se sumaron N unidades a «título»."; si no, SHALL agregar `{ libroId, cantidad }` al final. El libro elegido MUST existir (se comprueba en Eventos con `buscarPorId`; si no existe se muestra "El libro elegido no existe." y no se llama a la pura).

#### Scenario: Cantidades inválidas

- **WHEN** se ejecuta `agregarRenglon({clienteId:'cli-1',renglones:[]}, 'lib-1', 0)`, luego con `-1`, luego con `1.5`
- **THEN** las tres devuelven el error de cantidad y la venta queda con 0 renglones

#### Scenario: Libro repetido suma (DD-06)

- **WHEN** con un renglón `lib-1 × 2` se ejecuta `agregarRenglon(enCurso, 'lib-1', 3)`
- **THEN** la venta tiene un solo renglón `lib-1 × 5` y el aviso es "Se sumaron 3 unidades a «La noche del faro»."

#### Scenario: Libro distinto agrega fila

- **WHEN** con `lib-1 × 2` se agrega `lib-2 × 1`
- **THEN** la venta tiene dos renglones en ese orden y no hay aviso de suma

### Requirement: Tabla de renglones con cantidad editable y Quitar

La tabla SHALL mostrar una fila por renglón con libro (título), precio unitario formateado, cantidad (input numérico editable), subtotal formateado y botón "Quitar". Cambiar una cantidad SHALL validarla como entera > 0: si es inválida, el campo MUST quedar con `aria-invalid="true"`, mostrarse un texto de error y la confirmación MUST quedar bloqueada; si es válida, MUST recalcular subtotal y total. "Quitar" SHALL eliminar el renglón y recalcular. Todos los textos SHALL insertarse con `textContent`, nunca con `innerHTML`.

#### Scenario: Edición válida recalcula

- **WHEN** con `lib-1 × 2` ($ 1.500,00) se cambia la cantidad a 3
- **THEN** el subtotal pasa a "$ 4.500,00" y el total se actualiza sin recargar

#### Scenario: Edición inválida bloquea

- **WHEN** se cambia una cantidad a `0` o a `1.5`
- **THEN** el campo queda con `aria-invalid="true"`, aparece el texto "La cantidad debe ser un número entero mayor que 0." y "Confirmar venta" muestra el error de validación al pulsarse sin guardar nada

#### Scenario: Quitar renglón

- **WHEN** con dos renglones se pulsa "Quitar" en el primero
- **THEN** la tabla queda con un solo renglón y el total es el subtotal restante

#### Scenario: Título con marcas HTML

- **WHEN** un libro tiene título `<b>Hola</b>` y se agrega a la venta
- **THEN** la celda muestra el texto literal sin negrita y no se crea ningún elemento `b`

### Requirement: Cálculos con redondeo a 2 decimales

`calcularSubtotal(cantidad, precioUnitario)` SHALL devolver `redondear2(cantidad * precioUnitario)` y `calcularTotal(renglones, libros)` SHALL devolver `redondear2(Σ subtotales)` buscando cada precio en `libros`. El total mostrado SHALL usar `formatearPrecio` (es-AR, 2 decimales) y recalcularse en cada cambio (agregar, editar, quitar, elegir cliente no lo altera). Las funciones MUST ser puras.

#### Scenario: Caso manual 5000

- **WHEN** se ejecuta `calcularSubtotal(2, 1500)` y `calcularSubtotal(1, 2000)` y `calcularTotal` de ambos renglones
- **THEN** devuelven `3000`, `2000` y `5000`, y `formatearPrecio(5000)` muestra "$ 5.000,00"

#### Scenario: Total en vivo

- **WHEN** con `lib-1 × 2` ($ 3.000,00) se agrega `lib-2 × 1` ($ 2.000,00)
- **THEN** `#venta-total` muestra "$ 5.000,00" y `#estado-renglones` queda sin mensaje

### Requirement: Validación antes de confirmar

`validarVenta(enCurso, libros, clientes)` SHALL ser pura y devolver `[{ campo, mensaje }]` en este orden: si `clienteId` está vacío → "Elegí un cliente." (`clienteId`); si no existe en `clientes` → "El cliente elegido no existe."; si `renglones` está vacío → "Agregá al menos un libro a la venta." (`renglones`); por cada renglón con libro inexistente → "El libro elegido no existe."; por cada renglón con cantidad no entera > 0 → "La cantidad de «título» debe ser un número entero mayor que 0." (si el libro no existe, "La cantidad debe ser un número entero mayor que 0."). Con datos válidos SHALL devolver `[]`.

#### Scenario: Venta sin cliente

- **WHEN** se valida `{ clienteId: '', renglones: [{ libroId: 'lib-1', cantidad: 2 }] }` con semilla
- **THEN** devuelve solo "Elegí un cliente."

#### Scenario: Venta sin renglones

- **WHEN** se valida `{ clienteId: 'cli-1', renglones: [] }`
- **THEN** devuelve solo "Agregá al menos un libro a la venta."

#### Scenario: Cantidad inválida en curso

- **WHEN** se valida `{ clienteId: 'cli-1', renglones: [{ libroId: 'lib-1', cantidad: 1.5 }] }`
- **THEN** devuelve el error de cantidad de «La noche del faro»

#### Scenario: Cliente manipulado

- **WHEN** se valida `{ clienteId: 'cli-99', renglones: [{ libroId: 'lib-1', cantidad: 1 }] }`
- **THEN** devuelve "El cliente elegido no existe."

### Requirement: Construcción con snapshot histórico

`construirVenta(enCurso, libros, clientes, ventas)` SHALL ser pura y devolver `{ id, fecha, clienteId, clienteNombre, clienteEmail, renglones: [{ libroId, titulo, isbn, cantidad, precioUnitario, subtotal }], total }` donde `titulo`, `isbn` y `precioUnitario` se copian del libro actual, `clienteNombre`/`clienteEmail` del cliente actual, `subtotal = redondear2(cantidad * precioUnitario)`, `total = redondear2(Σ subtotales)`, `id = siguienteIdVenta(ventas)` y `fecha = new Date().toISOString()`. Asume datos ya validados.

#### Scenario: Snapshot 5000

- **WHEN** se construye con `cli-1`, `lib-1 × 2` (1500) y `lib-2 × 1` (2000) sobre `ventas = []`
- **THEN** devuelve `id "V-0001"`, `clienteNombre`/`clienteEmail` de `cli-1`, renglones con `titulo`/`isbn`/`precioUnitario` copiados, subtotales `3000` y `2000`, `total 5000` y `fecha` ISO válida

#### Scenario: Correlativo

- **WHEN** `ventas` ya contiene `V-0001` y `V-0002`
- **THEN** la venta construida tiene `id "V-0003"`

#### Scenario: Copia no referencia

- **WHEN** después de construir se cambia el precio de `lib-1` en `libros` a 9999
- **THEN** el objeto construido conserva `precioUnitario: 1500`

### Requirement: Confirmar venta y limpiar

Con validación exitosa, el sistema SHALL agregar la venta construida al final de `cargarVentas()` y llamar a `guardarVentas`; solo si devuelve `true` SHALL limpiar la venta en curso (`{ clienteId: '', renglones: [] }`), resetear el formulario, re-renderizar tabla y selectores y mostrar "Éxito: Venta V-0001 confirmada. Total: $ 5.000,00." (id y total reales). Si `guardarVentas` devuelve `false`, SHALL rechazar con "Error: No se pudo guardar la venta. Revisá el aviso de almacenamiento al principio de la página.", conservar la venta en curso y no limpiar nada. Si la validación falla, SHALL mostrar todos los errores con "Error:", marcar con `aria-invalid` y llevar el foco al primer campo inválido, sin guardar.

#### Scenario: Confirmación válida

- **WHEN** con `cli-1` y `lib-1 × 2 + lib-2 × 1` se pulsa "Confirmar venta"
- **THEN** `libreria.ventas` contiene `V-0001` con `total 5000`, la tabla queda vacía, el formulario queda en placeholders y la zona muestra el éxito con id y total

#### Scenario: Confirmación bloqueada

- **WHEN** se pulsa "Confirmar venta" sin cliente y sin renglones
- **THEN** se muestran los errores, `libreria.ventas` no cambia y el foco va al selector de cliente

#### Scenario: Clave de ventas dañada

- **WHEN** `libreria.ventas` está dañada y se confirma una venta válida
- **THEN** se rechaza con el error de guardado, la venta en curso se conserva y el valor dañado queda intacto

### Requirement: Presentación accesible de la venta

Cada control SHALL tener `label for`; el total SHALL anunciarse en región viva (`#venta-total` o `#estado-renglones` con `aria-live="polite"` / `role="status"` existente antes de actualizar); los errores SHALL mostrarse con texto con prefijo "Error:", `role="alert"`, `aria-invalid="true"` en el control inválido y foco al primero. El foco visible (`:focus-visible`) MUST conservarse; los botones MUST ser nativos ("Agregar renglón", "Quitar de «título»" o "Quitar", "Confirmar venta").

#### Scenario: Foco al primer inválido

- **WHEN** se confirma sin cliente
- **THEN** el foco queda en `#venta-cliente` con `aria-invalid="true"`

#### Scenario: Total anunciado

- **WHEN** se agrega un renglón con lector de pantalla activo
- **THEN** la región viva anuncia el nuevo total sin mover el foco

### Requirement: Separación lógica y seguridad del DOM

Las funciones de lógica (`agregarRenglon`, `calcularSubtotal/Total`, `validarVenta`, `construirVenta`) MUST NOT tocar el DOM ni `localStorage`; las de almacenamiento solo viven en `comun.js`. Todo dato de libro/cliente/venta SHALL insertarse con `textContent`/`crearElemento`. `localStorage` SHALL leerse solo vía `cargar*` y escribirse solo vía `guardarVentas` en la confirmación.

#### Scenario: Búsqueda de accesos

- **WHEN** se busca `localStorage` e `innerHTML` en `js/ventas.js`
- **THEN** no hay coincidencias

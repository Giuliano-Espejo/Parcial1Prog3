# Flujos Principales

## Flujo 1: Inicio de cualquier página (carga de datos)

**Disparador**: se abre cualquier `.html`.
**Actor**: operador o docente.

**Pasos**:
1. El navegador carga `css/*.css`, `js/comun.js` y luego el script de la página (ambos con `defer`, en ese orden).
2. `comun.js` expone las funciones de datos (`cargarLibros()`, `cargarClientes()`, `cargarVentas()`).
3. Cada `cargarX()` lee su clave de `localStorage`:
   - si la clave **no existe**, escribe la semilla y la devuelve (primer inicio);
   - si existe, la parsea y la devuelve (reapertura).
4. El script de la página renderiza su vista con esos datos y registra los eventos.

```
página.html → comun.js → localStorage.getItem('libreria.libros')
                              ├─ null  → setItem(semilla) → semilla
                              └─ JSON  → JSON.parse      → datos guardados
           → página.js → render(datos) + addEventListener(...)
```

**Casos de error**:
- JSON corrupto en `localStorage` (por ejemplo, por una edición manual mal hecha) → se muestra un mensaje de error en la página y se usa un array vacío. No se pisan los datos del usuario sin avisar (ver P-03 en 10).
- `localStorage` no disponible → mensaje "No se pueden guardar datos en este navegador"; la página funciona con la semilla en memoria.

---

## Flujo 2: Filtro del catálogo

**Disparador**: evento `input` en el buscador de `index.html`.

**Pasos**:
1. Se lee el valor y se normaliza: trim y minúsculas.
2. Si queda vacío → se renderizan todos los libros.
3. Si no → se filtran los libros cuyo `titulo.toLowerCase()` incluye el texto.
4. Si el resultado está vacío → se muestra "No se encontraron libros para «texto»"; si no, se renderizan las tarjetas.

---

## Flujo 3: Alta de libro

**Disparador**: `submit` del formulario en `libros.html`.

**Pasos**:
1. `event.preventDefault()`.
2. Se leen los campos, incluidos los autores seleccionados (`selectedOptions` o los checkboxes marcados).
3. `validarLibro(datos, librosExistentes)` (función pura) devuelve una lista de errores.
4. Si hay errores → se muestran en la zona de mensajes del formulario, con un "Error:" por línea, y se lleva el foco al primer campo inválido. No se guarda nada.
5. Si no hay errores → se crea el libro con un id nuevo, se agrega al array, se guarda `libreria.libros`, se re-renderiza el listado, se resetea el formulario y se muestra "Libro «título» registrado".

**Casos de error**: ISBN duplicado (comparado normalizado), precio ≤ 0 o no numérico, sin autores, editorial o género inexistente (por ejemplo, un `<select>` manipulado con DevTools).

---

## Flujo 4: Alta de cliente

Igual que el Flujo 3, sobre `clientes.html` y con `validarCliente(datos, clientesExistentes)`. El email duplicado se compara con `trim().toLowerCase()`.

---

## Flujo 5: Componer y confirmar venta

**Disparador**: interacción en `ventas.html`.
**Estado**: la venta en curso vive **en memoria** (`{ clienteId, renglones: [] }`) y **no** se persiste hasta confirmar.

**Pasos — agregar renglón**:
1. Se elige un libro y una cantidad y se pulsa "Agregar renglón".
2. Se valida que la cantidad sea un entero > 0 y que el libro exista.
3. Si el libro ya tiene renglón → `renglon.cantidad += cantidad` y se muestra "Se sumaron N unidades a «título»".
4. Si no → se agrega `{ libroId, cantidad }`.
5. Se re-renderiza la tabla de renglones y el total.

**Pasos — editar o quitar**:
- Al cambiar la cantidad de un renglón se valida; si es inválida, el campo se marca con texto de error y la confirmación queda bloqueada.
- "Quitar" elimina el renglón y se recalcula el total.

**Pasos — confirmar**:
1. Se valida que haya cliente, que haya ≥ 1 renglón y que todas las cantidades sean válidas.
2. Se construye la venta **copiando** `titulo`, `isbn` y `precioUnitario` del libro actual y `nombreCompleto` y `email` del cliente; se calculan los subtotales y el total redondeados.
3. Se asigna `id` correlativo (`V-0001`) y `fecha = new Date().toISOString()`.
4. Se agrega a `libreria.ventas` y se guarda.
5. Se limpia la venta en curso y el formulario y se muestra "Venta V-0001 confirmada. Total: $ 5.000,00".

```
Operador → ventas.js: confirmar()
ventas.js → validarVenta(enCurso)        ── errores → mostrar, fin
ventas.js → construirVenta(enCurso, libros, clientes, ventas) (copia de datos)
ventas.js → guardarVentas([...ventas, nueva]) → localStorage
ventas.js → limpiar() + mensaje éxito
```

---

## Flujo 6: Historial y detalle

**Disparador**: se abre `historial.html`.

**Pasos**:
1. Se cargan las ventas; si no hay, se muestra "No hay ventas registradas".
2. Se renderiza la tabla id / fecha / cliente / total con el botón "Ver detalle de V-000N".
3. Al pulsar el botón, la sección de detalle muestra los renglones de esa venta **solo con sus datos guardados** (nunca busca el libro en el catálogo).

---

## Flujo 7: Prueba guiada del precio histórico (docente)

1. En una copia del proyecto, se confirma la venta "2 × 1500 + 1 × 2000 = 5000".
2. DevTools → Application → Local Storage → `libreria.libros` → se cambia **solo** el `precio` de uno de esos libros.
3. Se recarga `historial.html` y se abre el detalle de la venta.
4. Resultado esperado: el precio unitario, los subtotales y el total siguen con los valores confirmados.

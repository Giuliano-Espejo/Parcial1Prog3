## Context

Ver proposal.md (Intent). Estado actual observado en el código:

- `ventas.html`: `h1` Ventas, `#mensajes-almacenamiento` (`aria-live polite`), `p#aviso-venta.aviso-maqueta` referenciado por `aria-describedby` de "Agregar renglón" y "Confirmar venta", sección Cliente (`select#venta-cliente` solo placeholder), `form#form-renglon[novalidate]` (`select#renglon-libro` solo placeholder, `input#renglon-cantidad[type=number][min=1][step=1][value=1]`), tabla en `.tabla-contenedor[overflow-x:auto]` con `caption` + `thead th scope=col` (Libro, Precio unitario, Cantidad, Subtotal, Acciones) + `tbody#tabla-renglones-cuerpo` vacío + `tfoot` Total (`th scope=row colspan=3`, `td#venta-total`), `p#estado-renglones[role=status]` con texto inicial, `button#boton-confirmar-venta`, `#mensajes-venta[aria-live=polite]` vacía.
- `js/comun.js`: `cargarLibros/Clientes/Ventas`, `guardarVentas` (→ `true`/`false`, bloqueo de clave dañada, C-05), `buscarPorId`, `redondear2`, `formatearPrecio` (es-AR, 2 decimales), `siguienteId`, `crearElemento`, `limpiar`, `mostrarMensaje/Errores`, `mostrarAvisosAlmacenamiento`. No existe `siguienteIdVenta`.
- `js/ventas.js`: placeholder de 10 líneas con secciones vacías.
- `css/componentes.css`: `[aria-invalid=true]`, `.mensaje--error/exito`, `.zona-mensajes:empty`, `.tabla-contenedor{overflow-x:auto}`, `:focus-visible` (C-02). Sin CSS nuevo.
- Restricciones (AGENTS.md): scripts clásicos sin módulos, puras sin DOM ni `localStorage`, nunca `innerHTML` con datos de usuario, secciones Lógica / Render / Eventos / Inicio, sin tests automatizados, Chrome + Firefox (Firefox no disponible: columna "No ejecutado").

## Goals / Non-Goals

**Goals:**

- Lógica de composición y confirmación 100 % pura y ejecutable desde consola (incluye el caso 5000 y cantidades inválidas que la UI filtra).
- Un único flujo: selectores → agregar → editar/quitar → validar → construir (copias) → guardar → limpiar.
- Reutilizar contratos existentes (`guardarVentas` booleano, `mostrarMensaje/Errores`, `actualizar` + `render` por reconstrucción).

**Non-Goals:**

- Historial y detalle (C-08); `formatearFecha` queda para C-08.
- Editar/eliminar ventas confirmadas (RN-VE-09); persistir venta en curso (SU-05).
- Sincronizar pestañas (`storage` event); validar cada registro guardado.
- Cambios de CSS; botón de reinicio de datos.

## Decisions

### D1 — Capacidades: una nueva + tres modificadas

Nueva `venta-composicion-confirmacion` (RN-VE-01..08, US-010/011). Modificadas: `datos-semilla` (solo `siguienteIdVenta`), `estructura-formularios-tablas` (aviso solo en Historial), `documentacion-entrega` (README Ventas funcional + casos V).
**Alternativa descartada**: dos capacidades (composición vs confirmación) → el flujo comparte `enCurso` y validación; partirlo duplica escenarios.

### D2 — Firmas puras (sección Lógica, `js/ventas.js`)

- `agregarRenglon(enCurso, libroId, cantidad)`: valida `Number.isInteger(cantidad) && cantidad > 0`; si falla devuelve `{ enCurso: mismo, errores: ["La cantidad debe ser un número entero mayor que 0."], aviso: "" }`. Si el libro ya tiene renglón devuelve nuevo `enCurso` con cantidad sumada + `aviso: 'Se sumaron N unidades a «título».'` (título buscado por el llamador y pasado como 4.º arg opcional, o resuelto en Eventos; ver Open Q2). No muta la entrada (usa `concat`/`map` + spread).
- `calcularSubtotal(cantidad, precioUnitario) = redondear2(cantidad * precioUnitario)`; `calcularTotal(renglones, libros) = redondear2(Σ calcularSubtotal(r.cantidad, precioDe(r.libroId)))`, precio vía `buscarPorId(libros, id).precio`.
- `validarVenta(enCurso, libros, clientes) → [{ campo, mensaje }]` en orden cliente → renglones → por renglón (mismo patrón C-06 D2; `campo` en `clienteId | renglones | cantidad-<libroId>`; Eventos lo traduce a ids con mapa).
- `construirVenta(enCurso, libros, clientes, ventas)` → objeto con copias + `id: siguienteIdVenta(ventas)` + `fecha: new Date().toISOString()`; `subtotal`/`total` con `redondear2`.
- `comun.js` → `siguienteIdVenta(ventas)`: regex `^V-(\d+)$`, máximo + 1, formato `V-` + `String(n).padStart(4,"0")`; ignora ajenos; no muta.

### D3 — Venta en curso y orden de Inicio

`let enCurso = { clienteId: "", renglones: [] }` (módulo de `ventas.js`); colecciones `libros/clientes/ventas` en variables de módulo asignadas en Inicio. Inicio: `cargarLibros/Clientes/Ventas()` → `mostrarAvisosAlmacenamiento()` → `renderSelectores()` → `renderRenglones()` + `renderTotal()` → listeners (`change` en `#venta-cliente`, `submit` en `#form-renglon`, `click` en `#boton-confirmar-venta`, delegación en `tbody` para `change` de cantidad y `click` en Quitar).

### D4 — Selectores y D12

`renderSelectores()`: por cada cliente `new Option(nombreCompleto, id)` (o `createElement` + `textContent` + `value`), igual para libros con título; agregadas después de los placeholders; preservan `enCurso.clienteId` si sigue existiendo. Caso D12: con `lib-7`/`cli-4` guardados, ambos aparecen (verificado en tarea 3.1).

### D5 — Tabla, edición y Quitar

`renderRenglones()`: reconstrucción (`limpiar` + `DocumentFragment`); por fila: `td` título, `td` `formatearPrecio(precio)`, `td` con `input[type=number][min=1][step=1][value=cantidad][aria-label="Cantidad de «título»"]`, `td` subtotal, `td` con `button[type=button]` "Quitar" (`aria-label='Quitar «título» de la venta'`). Cantidad inválida → `aria-invalid=true` + texto en `#mensajes-venta` y `validarVenta` bloquea (D8). `#estado-renglones`: "Todavía no agregaste renglones a la venta." si vacío, si no vacía (mismo patrón `mostrarMensaje` con `""`).

### D6 — Total con DD-10

`renderTotal()`: `calcularTotal(enCurso.renglones, libros)` → `#venta-total.textContent = formatearPrecio(total)` (ej. "$ 5.000,00"). Se llama tras cada agregar/editar/quitar/Inicio. Sin `redondear2` en el render (ya viene redondeado de la pura).

### D7 — Validación de frontera y DOM seguro

Cantidad: `Number(valor)` desde el input (Chrome entrega `""` si no es número → inválido); se exige entero > 0, sin excepciones. Cliente: requerido + existente (manipulación vía DevTools → "El cliente elegido no existe."). Todo inserto con `crearElemento`/`textContent`; `ventas.js` no menciona `localStorage` ni `innerHTML` (verificado con `grep`).

### D8 — Confirmar: validar → construir → guardar → limpiar (Q4)

`alConfirmarVenta()`: `validarVenta` → si hay errores `mostrarErrores` + `aria-invalid` (`#venta-cliente` o input de cantidad) + `focus()` al primero, fin. Si no: `construirVenta` → `nueva = ventas.concat([venta])` → `if (!guardarVentas(nueva))` error "No se pudo guardar la venta. Revisá el aviso de almacenamiento al principio de la página." + `mostrarAvisosAlmacenamiento()`, sin limpiar (igual que C-06 D9; también cubre navegador sin almacenamiento). Si `true`: `ventas = nueva; enCurso = {clienteId:"",renglones:[]}`; reset de `#form-renglon` + `#venta-cliente` a placeholder; `renderSelectores/Renglones/Total`; `mostrarMensaje(zona,"exito",'Venta V-0001 confirmada. Total: $ 5.000,00.')` con id/total reales; foco queda en "Confirmar venta".

### D9 — Accesibilidad (WCAG 2.2 AA)

`label for` ya existen y se conservan. `#venta-total` y `#estado-renglones` ya son región viva (`aria-live polite` / `role=status`) y existen antes de actualizar. Errores con "Error:" + `role=alert` (vía `mostrarErrores`/`mostrarMensaje`), `aria-invalid` por campo, foco al primero. Botones nativos ≥ 44 px (heredado de C-02; verificar en 320 px). Sin `aria-describedby` nuevo por campo (mismo criterio C-06 D4).

### D10 — Responsive sin CSS nuevo

`.tabla-contenedor{overflow-x:auto}` ya envuelve la tabla; no hay scroll horizontal de página a 320/1280. Verificación manual en tareas (sin cambios de CSS).

### D11 — Fin de maqueta en Ventas

Borrar `p#aviso-venta` y los dos `aria-describedby="aviso-venta"`. Historial conserva el suyo. Sin cambios de estructura ni de ids usados por specs.

### D12 — README (§4, §5, §8) y casos V

- §4 Ventas: "Composición y confirmación con snapshot histórico (cliente, renglones editables, total a 2 decimales, mensaje con id y total)"; maqueta "Nada". Historial sigue maqueta.
- §5: mover venta a Implementadas; pendiente solo Historial.
- §8: casos V1–V8 (ver tabla en tareas): V1 sin cliente, V2 cantidades 0/-1/1.5, V3 repetido, V4 válida 2×1500+1×2000=5000 (caso 5 de la consigna), V5 `lib-7`/`cli-4` (D12), V6 edición inválida bloquea, V7 Quitar recalcula, V8 clave `libreria.ventas` dañada. Chrome "Pendiente de ejecutar"; Firefox "No ejecutado: Firefox no disponible en el equipo del autor".

### D13 — Tamaño IN-03

`ventas.js` estimado ~230 líneas con funciones cortas y comentarios de sección. Si al aplicar supera ~250, partir Lógica pura a `js/ventas-logica.js` (cargado entre `comun.js` y `ventas.js`) sin cambiar firmas; la tarea 6.4 lo verifica.

## Risks / Trade-offs

- [Chrome normaliza `type=number` no numérico a `""`] → mismo mensaje genérico cubre vacío y texto; casos de consola cubren `abc`.
- [`role=alert` por cada error puede anunciarse varias veces] → patrón aceptado en C-05/C-06.
- [Venta en curso se pierde al navegar (DD-01/SU-05)] → documentado en spec (Recarga descarta); sin arreglo desde código.
- [Desvío CHANGES: `agregarRenglon` con 3 args no valida existencia del libro] → existencia en Eventos (Q2); la pura sigue siendo testeable.
- [Sin `localStorage` no se confirma (D8)] → coherente con C-06 D9; README lo declara.

## Migration Plan

Sin migración: `libreria.ventas` ya existe como `[]` desde C-05; ventas nuevas usan el mismo esquema que C-08 leerá. Rollback: revertir 4 archivos y borrar `libreria.ventas` para volver a `[]`.

## Open Questions

Governance MEDIO: recomendaciones aplicadas en specs y tareas; confirmar o cambiar antes de `/opsx:apply`.

1. **Textos de error** — propuestos en el delta `venta-composicion-confirmacion` ("Elegí un cliente.", "Agregá al menos un libro…", "La cantidad…"). **Recomendado: esos**.
2. **`agregarRenglon` 3 args (CHANGES) vs 4 args `(enCurso, libroId, cantidad, libros)`** — 3 args + existencia en Eventos evita cambiar CHANGES. **Recomendado: 3 args**.
3. **`siguienteIdVenta` formato `V-NNNN`** — 4 dígitos con ceros. **Recomendado: sí**.
4. **`guardarVentas false` → rechazar sin limpiar** (también sin almacenamiento). **Recomendado: sí** (C-06 D9).
5. **Cantidad editable como `input number`** (actual) vs texto — number da flechas y teclado móvil; la pura cubre lo que la UI no deja tipear. **Recomendado: mantener number**.
6. **Foco tras éxito** — queda en "Confirmar venta" (no se mueve). **Recomendado: esa**.
7. **README con casos V ahora** vs dejar todo a C-09 — ahora evita README falso. **Recomendado: ahora (mínimo)**.
8. **Partir `ventas.js` si > 250 líneas** — solo si aplica. **Recomendado: medir en tarea 6.4**.

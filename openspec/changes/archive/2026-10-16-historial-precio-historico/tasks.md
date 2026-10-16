# Tasks: historial-precio-historico

> Se asumen las recomendaciones de design.md (Q1–Q4). Sin tests automatizados (DD-05): todo se verifica en Chrome con `file://`. No commitear ni tocar `knowledge-base/`, `discovery/`, `.claude/`, `.atl/`.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 120–180 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Historial inmutable + fin de maqueta | PR 1 | `historial.js` + `historial.html`; verificación Flujo 6/7 incluida |

## Phase 1: Lógica pura (`js/historial.js`)

- [x] 1.1 Implementar `formatearFecha(fechaISO)` pura y defensiva (ISO válido → local `es-AR`; inválida → texto original); verificar en consola de `historial.html`: `formatearFecha('2026-10-15T12:00:00.000Z')` incluye "2026" y `formatearFecha('no-fecha') === 'no-fecha'`
- [x] 1.2 Implementar `ventaPorId(ventas, id)` pura (devuelve la venta o `null`); verificar: `ventaPorId(cargarVentas(), 'V-0001').id === 'V-0001'` y `ventaPorId([], 'V-0001') === null`

## Phase 2: Render, eventos, inicio y HTML

- [x] 2.1 Implementar `renderHistorial(ventas)` (una fila por venta: id, `formatearFecha`, `clienteNombre`, `formatearPrecio(total)`, botón "Ver detalle de V-000N" con `data-venta-id`; vacía → "No hay ventas registradas"); verificar con `libreria.ventas` borrada: mensaje visible y `tbody` vacío; con `V-0001` (5000): fila con "$ 5.000,00"
- [x] 2.2 Implementar `renderDetalle(venta)` solo con copias (`clienteNombre`/`clienteEmail`, renglones `titulo`/`isbn`/`cantidad`/`precioUnitario`/`subtotal`, `total`); verificar: detalle de `V-0001` muestra `3000`/`2000`/`5000` sin llamar a `cargarLibros()` (`Select-String -Pattern 'cargarLibros|LIBROS_SEMILLA|localStorage|innerHTML' js/historial.js` vacío)
- [x] 2.3 Implementar delegación `click` en `tbody` (reemplaza detalle, quita `hidden`, foco a `titulo-detalle-venta`) e Inicio (`cargarVentas()` → `mostrarAvisosAlmacenamiento()` → renders → listener); verificar por teclado: Tab hasta "Ver detalle", Enter muestra detalle con foco visible en el encabezado
- [x] 2.4 Quitar `p#aviso-historial` de `historial.html` (conservar `caption`, `th scope`, `role="status"`, `.tabla-contenedor`); verificar: la página no contiene "Pendiente — Etapa 2" y mantiene un solo `h1`

## Phase 3: Verificación manual y nota para C-09

- [x] 3.1 Flujo 7 en copia de prueba: confirmar `cli-1` + `lib-1×2` + `lib-2×1` (= 5000), en DevTools cambiar solo `precio` de `lib-1` en `libreria.libros`, recargar `historial.html`; verificar que unitarios/subtotales/total no cambian y restaurar la copia — verificado 2026-10-16 en Chrome `file://`: `cli-1` + `lib-1×2` + `lib-2×1` (= 5000), editado solo `precio` de `lib-1` 1500→9999 en `libreria.libros`, recargado `historial.html`, unitarios (1500/2000), subtotales (3000/2000) y total (5000) sin cambios, copia restaurada
- [x] 3.2 Casos límite: `titulo` guardado `<b>Hola</b>` se ve literal; `libreria.ventas` dañada muestra aviso C-05 con listado vacío sin pisar el valor; 320 px y 1280 px sin scroll de página, tablas con scroll propio, botones ≥ 44 px — verificado 2026-10-16 en Chrome: `<b>Hola</b>` literal sin crear elemento `b`; `libreria.ventas` dañada muestra aviso C-05 con listado vacío sin pisar el valor; 320/1280 px sin scroll horizontal de página (tablas con scroll propio); Tab+Enter con foco visible en `h2` de detalle; botones ≥ 44 px
- [x] 3.3 Anotar para C-09 (sin tocar `README.md`): clave `libreria.libros`, campo `precio` editado en Flujo 7 y resultado observado; verificar `Select-String` de `type="module"` y `http://|https://` en `historial.html`/`js/historial.js` vacío — verificado 2026-10-16: `Select-String` de `cargarLibros|localStorage|innerHTML` en `js/historial.js` y de `type="module"` + `http://|https://` en `historial.html`/`js/historial.js` vacíos; Firefox no disponible; nota para C-09: clave `libreria.libros`, campo `precio` de `lib-1` editado 1500→9999, resultado sin cambios (`README.md` no tocado, lo documenta C-09)

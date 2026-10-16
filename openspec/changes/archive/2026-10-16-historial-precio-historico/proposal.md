# Proposal: historial-precio-historico

## Intent

`historial.html` es maqueta (US-012, RN-VE-07/09/10): el docente no puede verificar que la venta conserva su precio histórico. Se implementa el historial inmutable que lee solo las copias de C-07 y la prueba guiada del Flujo 7.

## Scope

### In Scope

- `js/historial.js` (Lógica / Render / Eventos / Inicio): listado id / fecha local (`formatearFecha`) / `clienteNombre` / total + botón "Ver detalle de V-000N".
- Detalle solo con `titulo`, `isbn`, `cantidad`, `precioUnitario`, `subtotal`, `total`, `clienteNombre`, `clienteEmail` guardados; nunca `cargarLibros()` ni catálogo.
- Sin editar ni eliminar; sin ventas muestra "No hay ventas registradas"; todo con `textContent`.
- Prueba guiada Flujo 7 (2×1500 + 1×2000, edición manual de `precio` en `libreria.libros`, recarga sin cambios).
- Quitar aviso "Pendiente — Etapa 2" de `historial.html`; anotar clave/estructura de `libreria.libros` para C-09.

### Out of Scope

- Cambios en venta, semilla, persistencia, CSS o README (README va en C-09); tests automatizados (DD-05).

## Capabilities

### New Capabilities

- `historial-precio-historico`: historial inmutable con detalle desde copias y prueba de precio histórico.

### Modified Capabilities

- `estructura-formularios-tablas`: el aviso "Pendiente — Etapa 2" deja de aplicar al historial.

## Approach

Puras locales en `historial.js` (`formatearFecha`, selectores de detalle) + Render por reconstrucción (`crearElemento`/`textContent`, `DocumentFragment`) + Inicio que carga solo `cargarVentas()`. Reutiliza `formatearPrecio`, `mostrarMensaje`, `mostrarAvisosAlmacenamiento`, regiones vivas y `.tabla-contenedor` existentes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `js/historial.js` | Modified | Lógica + Render + Eventos + Inicio (~150 líneas) |
| `historial.html` | Modified | Quita `aviso-historial`; conserva ids, `caption`/`th scope`, regiones vivas |
| `openspec/specs/historial-precio-historico/` | New | Spec nueva al archivar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Fecha ISO inválida por edición manual | Low | `formatearFecha` defensiva con texto alternativo |
| `libreria.ventas` dañada a mano | Low | Aviso de C-05 + historial vacío sin pisar nada |
| Catálogo editado confunde al docente | Med | Detalle nunca lee `libreria.libros`; Flujo 7 lo demuestra |

## Rollback Plan

Revertir `js/historial.js` y `historial.html`; borrar solo claves de prueba creadas en la verificación. Las ventas de C-07 quedan intactas.

## Dependencies

- C-07 archivada: ventas con snapshot (`titulo`/`isbn`/`precioUnitario`/`clienteNombre`/`clienteEmail`/`subtotal`/`total`/`fecha`).
- C-05 archivada: `cargarVentas()` y avisos de almacenamiento.

## Success Criteria

- [ ] Listado y detalle muestran solo valores copiados; `grep cargarLibros js/historial.js` vacío.
- [ ] Flujo 7: tras editar `precio` en `libreria.libros`, unitarios/subtotales/total no cambian.
- [ ] Vacío muestra "No hay ventas registradas"; `grep innerHTML` y `type="module"` vacíos.

# Proposal: venta-composicion-confirmacion

## Intent

`ventas.html` es maqueta: componer y confirmar la venta (US-010, US-011, RN-VE-01..08) no funciona. Se implementa venta en curso en memoria, cálculos a 2 decimales y confirmación con snapshot histórico sobre `cargar*/guardarVentas` de C-05.

## Scope

### In Scope

- Selectores de cliente y libro desde `cargarClientes()` / `cargarLibros()`, incluyendo `lib-7` / `cli-4` de C-06.
- `agregarRenglon` pura; repetido suma cantidad y avisa (DD-06).
- Tabla: libro, cantidad editable, precio unitario, subtotal, "Quitar"; total con `redondear2` + `formatearPrecio` (DD-10).
- `validarVenta` + `construirVenta` con copias (`titulo`, `isbn`, `precioUnitario`, `clienteNombre`, `clienteEmail`), `siguienteIdVenta` (`V-0001`), `fecha` ISO.
- Confirmar: `guardarVentas`, limpiar venta y formulario, mensaje "Venta V-0001 confirmada. Total: $ 5.000,00".
- Fin de maqueta en Ventas; Historial sigue en maqueta.
- README: Ventas a funcional + casos V.

### Out of Scope

- Historial y detalle (C-08); editar/eliminar ventas.
- Persistir venta en curso (SU-05); sincronizar pestañas.
- CSS nuevo; tests automatizados (DD-05).

## Capabilities

### New Capabilities

- `venta-composicion-confirmacion`: componer (selectores, renglones, cálculos) y confirmar con snapshot histórico.

### Modified Capabilities

- `datos-semilla`: agrega `siguienteIdVenta(ventas)` → `V-NNNN`.
- `estructura-formularios-tablas`: aviso "Pendiente — Etapa 2" solo en Historial.
- `documentacion-entrega`: README con Ventas funcional y casos V.

## Approach

Puras en `js/ventas.js` (`agregarRenglon`, `calcularSubtotal/Total`, `validarVenta`, `construirVenta`) sin DOM ni `localStorage`; Render con `createElement` + `textContent`; Eventos con `preventDefault`; Inicio carga y registra listeners. Reutiliza `redondear2`, `formatearPrecio`, `buscarPorId`, `mostrarMensaje/Errores`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `js/ventas.js` | Modified | Lógica + Render + Eventos + Inicio (máx ~250 líneas, IN-03) |
| `js/comun.js` | Modified | Agrega `siguienteIdVenta` |
| `ventas.html` | Modified | Quita `aviso-venta` y `aria-describedby` |
| `README.md` | Modified | §4/§5 Ventas funcional; §8 casos V |
| `openspec/specs/venta-composicion-confirmacion/` | New | Spec nueva al archivar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Cantidad "1.5" en `type="number"` | Med | Validación entera estricta + bloqueo de confirmación |
| `ventas.js` supera 250 líneas | Med | Funciones cortas; partir si aplica (IN-03) |
| `guardarVentas` devuelve `false` | Low | Rechazar sin limpiar, como C-06 D9 |

## Rollback Plan

Revertir `ventas.js`, `comun.js`, `ventas.html` y `README.md`; borrar `libreria.ventas` para volver a `[]`. Ventas guardadas siguen válidas para C-08.

## Dependencies

- C-05 archivada: `cargar*/guardarVentas`.
- C-06 archivada: `lib-7`/`cli-4` en selectores (D12).

## Success Criteria

- [ ] Sin cliente / sin renglones / cantidad inválida se rechaza con texto.
- [ ] Repetido suma y avisa; "Quitar" y edición recalculan total.
- [ ] `2 × 1500 + 1 × 2000 = 5000` (3000 y 2000) con mensaje con id y total.
- [ ] Copia título/ISBN/precioUnitario/clienteNombre/clienteEmail; `grep innerHTML` y `type="module"` vacíos.

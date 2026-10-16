# Design: historial-precio-historico

## Technical Approach

`js/historial.js` en secciones Lógica / Render / Eventos / Inicio, sin tocar `comun.js` ni CSS. Inicio carga solo `cargarVentas()`, muestra avisos de C-05 y renderiza listado + detalle por reconstrucción. Todo texto con `crearElemento`/`textContent`. Quita `p#aviso-historial` de `historial.html`; conserva ids, `caption`/`th scope`, regiones vivas y `.tabla-contenedor`.

## Architecture Decisions

### Decision: `formatearFecha` pura y local en `historial.js`

**Choice**: `formatearFecha(fechaISO)` local, defensiva: ISO válido → `toLocaleDateString('es-AR', {day, month, year, hour, minute})`; inválido → texto original.
**Alternatives considered**: helper global en `comun.js`.
**Rationale**: único consumidor es el historial; evita blast radius en C-05/C-06/C-07 y mantiene el aislamiento "nunca lee catálogo".

### Decision: aislamiento de lectura verificado por búsqueda

**Choice**: `historial.js` solo llama a `cargarVentas()`; prohibición de `cargarLibros`, `LIBROS_SEMILLA`, `localStorage` e `innerHTML`, verificable con `Select-String`.
**Alternatives considered**: revalidar renglones contra catálogo.
**Rationale**: RN-VE-07 lo prohíbe; cualquier lectura del catálogo rompería la prueba del precio histórico.

### Decision: render por reconstrucción con `DocumentFragment`

**Choice**: `renderHistorial` y `renderDetalle` limpian y reconstruyen; botones "Ver detalle de V-000N" con `data-venta-id` y delegación en `tbody`.
**Alternatives considered**: ocultar/mostrar filas pre-renderizadas.
**Rationale**: mismo patrón de C-03/C-07; evita estado DOM desincronizado y fugas de `textContent`.

### Decision: detalle reemplazable con foco y regiones vivas

**Choice**: al elegir venta se reemplaza `#detalle-datos` + `#tabla-detalle-cuerpo` + `#detalle-total`, se quita `hidden` y el foco va al `h2#titulo-detalle-venta` (`tabindex="-1"`); `#estado-historial`/`#estado-detalle` (`role="status"`) anuncian vacío/selección.
**Alternatives considered**: detalle sin mover el foco.
**Rationale**: el docente con teclado/lector percibe el cambio; conserva `:focus-visible` y botones ≥ 44 px de C-02.

### Decision: robustez ante edición manual

**Choice**: ventas dañada → aviso C-05 + listado vacío sin escribir; fecha inválida → texto original; `libroId` ausente del catálogo → se muestran igual las copias.
**Alternatives considered**: filtrar ventas "rotas".
**Rationale**: el Flujo 7 exige edición manual en DevTools; nunca se pisa `libreria.ventas` sin aviso (P-03).

### Decision: fin de maqueta sin reestructurar

**Choice**: borrar solo `p#aviso-historial`; sin agregar formularios (`novalidate` no aplica) ni cambiar columnas/ids.
**Alternatives considered**: rediseñar el detalle.
**Rationale**: la estructura de C-01 ya cubre US-012; menos diff, menos riesgo a 320/1280 px.

## Data Flow

```
historial.html → comun.js (defer) → historial.js (defer)
  Inicio: cargarVentas() → mostrarAvisosAlmacenamiento()
    → renderHistorial(ventas) → click "Ver detalle" → renderDetalle(venta)
  libreria.libros: nunca leída ──╳
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `js/historial.js` | Modify | Lógica (`formatearFecha`, `ventaPorId`), Render (`renderHistorial`, `renderDetalle`), Eventos (delegación), Inicio |
| `historial.html` | Modify | Quita `aviso-historial`; agrega `tabindex="-1"` a `titulo-detalle-venta` si falta |
| `openspec/specs/historial-precio-historico/` | New | Spec nueva al archivar |

## Interfaces / Contracts

```js
formatearFecha(fechaISO: string): string  // pura, nunca lanza
ventaPorId(ventas: Venta[], id: string): Venta | null  // pura
renderHistorial(ventas: Venta[]): void    // solo textContent
renderDetalle(venta: Venta | null): void  // solo copias guardadas
```

Venta leída: `{id, fecha, clienteNombre, clienteEmail, renglones[{titulo, isbn, cantidad, precioUnitario, subtotal}], total}`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Lógica | `formatearFecha` ISO/inválida, `ventaPorId` | Consola en `historial.html` con `file://` |
| Integración | Listado, detalle, vacío, clave dañada | UI Chrome + DevTools Application → Local Storage |
| E2E | Flujo 7 completo (5000 intacto) | Pasos guiados en copia de prueba (tasks 3.x) |

Sin tests automatizados (DD-05). Firefox: "No ejecutado" si no disponible.

## Migration / Rollout

Sin migración: `libreria.ventas` de C-07 se lee tal cual. Rollback: revertir 2 archivos; ventas intactas.

## Open Questions

- [ ] Q1: formato de fecha propuesto (`es-AR` día/mes/año + hora) — ¿confirmar o solo fecha?
- [ ] Q2: foco al `h2` del detalle tras "Ver detalle" — ¿confirmar o dejar foco en el botón?
- [ ] Q3: `formatearFecha` local vs global en `comun.js` — recomendado local.
- [ ] Q4: sin cambios de README en C-08 (solo nota para C-09) — ¿confirmar?

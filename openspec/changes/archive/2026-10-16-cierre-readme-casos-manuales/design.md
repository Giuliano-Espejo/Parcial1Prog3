# Design: cierre-readme-casos-manuales

## Technical Approach

README de C-04 como esqueleto: se reescriben Estado, Maquetas→"todo funcional", Funcionalidades, Persistencia (límites + guía de precio C-08) y Casos (tabla de 8 con resultado real); se conservan Autor, Apertura, Navegación, Imágenes y árbol de entrega. Chrome es fuente de verdad; Firefox se registra honesto sin ejecutar. Barridos por grep del agente; casos de navegador por el usuario; entrega armada a mano.

## Architecture Decisions

### Decision: Chrome verdad, Firefox honesto no-ejecutado

**Choice**: ejecutar los 8 casos solo en Chrome; columna Firefox = "No ejecutado: Firefox no disponible en el equipo del autor".
**Alternatives considered**: marcar Firefox "Pendiente de ejecutar" o asumir paridad con Chrome.
**Rationale**: precedente C-05..C-08 (mismo equipo, mismo texto); RN-GL-02 prohíbe aprobar lo no ejecutado y la paridad asumida sería falsa.

### Decision: caso 6 con backup y restauración

**Choice**: antes del caso 6 exportar `libreria.libros` (copiar valor JSON); editar solo `"precio":1500`→`"precio":9999` en `lib-1`; verificar historial intacto; restaurar backup y recargar.
**Alternatives considered**: operar sin backup; usar un libro de prueba `lib-7`.
**Rationale**: evita pérdida de datos del autor y reutiliza el arrastre C-08 (1500→9999); sin backup, un error de edición (P-03) deja la semilla corrupta.

### Decision: falla real se registra, el fix se acuerda

**Choice**: si un caso falla, la celda describe la falla y el código NO se toca sin aprobación del usuario.
**Alternatives considered**: incluir fixes en C-09.
**Rationale**: governance BAJO y scope de cierre; un fix cambia comportamiento y merece su propio delta o aprobación explícita.

### Decision: README outcome-first con tablas (cognitive-doc-design)

**Choice**: estado y "cómo abrir" primero; detalles en tablas (8 casos, Controles, claves); checklist de entrega; árbol de archivos.
**Alternatives considered**: prosa corrida por sección.
**Rationale**: el docente verifica siguiendo tablas; coherente con el README C-04 y la skill de docs.

## Data Flow

```
C-08 (historial 5000 intacto) ──→ backup claves ──→ 8 casos Chrome [usuario]
        │                                                      │
        └─→ grep barridos [agente] ──→ README final ──→ carpeta entrega [usuario]
Firefox: sin flujo ──→ celda "No ejecutado..." (honesta)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `README.md` | Modify | Único entregable modificado: estado final, sin maquetas, persistencia+guía, 8 casos, controles |
| `openspec/specs/documentacion-entrega/spec.md` | Modify | Al archivar, con este delta |
| `js/*.js`, `*.html`, `*.css` | Read-only | Verificación; cambio solo ante falla aprobada |

## Interfaces / Contracts

Esqueleto README (10 secciones C-04, reescritas 0/4/5/7/8): `Estado: entrega final`; §4 "Todo funcional, sin maquetas"; §7 claves (`libreria.libros/clientes/ventas`), ejemplo `{"id":"lib-1",...,"precio":1500,...}` y guía 1500→9999; §8 tabla `# · Caso · Entrada/pasos · Esperado · Chrome · Firefox`; `### Controles de alcance`; §10 árbol (5 HTML + `css/`+`js/`+`img/`+`README.md`, excluye P-04).

## Testing Strategy

| Caso | Procedimiento | Esperado |
|------|---------------|----------|
| 1 filtro | `NOCHE`, vacío, `Zzz` en `index.html` | 3 mismos / 6 sin mensaje / 0 + aviso literal |
| 2 libro | ISBN existente con espacios/guiones, luego ISBN nuevo | Rechazo "Ya existe…" / alta `lib-7` + tarjeta sin tapa |
| 3 cliente | email inválido, `ANA.MENDEZ@EXAMPLE.COM`, email nuevo | Rechazo formato / rechazo duplicado / alta `cli-4` |
| 4 venta inválida | sin cliente; cant 0/-1/1.5; `lib-1` repetido | Errores + sin guardar / aviso "Se sumaron N…" |
| 5 venta válida | `cli-1` + `lib-1`×2 + `lib-2`×1, confirmar | 3000+2000=5000, "Venta V-000N confirmada…" |
| 6 precio histórico | backup; precio 1500→9999; recargar historial | Unitarios/subtotales/total intactos; restaurar |
| 7 recarga | recargar tras altas+venta | Sin duplicados; venta persistida |
| 8 teclado+anchos | Tab todo; 320/1280 px (A9/A10/A12 + `overflow-x:auto`) | Foco visible; sin scroll horizontal de página |

Sin tests automatizados (DD-05). Accesibilidad: `label for`, `:focus-visible`, errores con texto, regiones vivas — se re-verifican en el caso 8.

## Migration / Rollout

Sin migración. Rollback: restaurar `README.md` y claves respaldadas. `localStorage` no se comparte entre navegadores/perfiles/ubicaciones (RN-PE-04): se documenta, no se corrige.

## Open Questions

- [ ] Q1: ¿Confirmás Firefox como "No ejecutado…" con Chrome como verdad (precedente C-05..C-08)?
- [ ] Q2: ¿Caso 6 con backup+1500→9999 en `lib-1` y restauración posterior?
- [ ] Q3: Ante falla real, ¿solo registrar o también corregir código en C-09?
- [ ] Q4: Nombre de la carpeta/zip final y ¿hay fecha/canal de entrega confirmados (P-01)?
- [ ] Q5: ¿Línea de estado "Estado: entrega final" tal cual?

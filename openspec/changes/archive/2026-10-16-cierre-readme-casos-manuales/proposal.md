# Proposal: cierre-readme-casos-manuales

## Intent

Cerrar el hito final de la Etapa 2 (US-014, Ej. 6): README final y los 8 casos manuales ejecutados con su resultado real registrado (RN-GL-02). Sin este cierre, el docente no puede reproducir ni verificar la entrega.

## Scope

### In Scope

- 8 casos en Chrome con resultado observado: (1) filtro mayúsculas/vacío/inexistente, (2) libro ISBN existente/nuevo, (3) cliente email inválido/duplicado-mayúsculas/nuevo, (4) venta sin cliente, cant 0/negativa/decimal y repetido, (5) venta 2×1500+1×2000=5000, (6) solo-precio en `localStorage` en copia de prueba, (7) recarga tras altas+venta, (8) teclado y 320/1280 px.
- README final sobre C-04: estado "entrega final", sin maquetas, límites de `localStorage`, claves y `libreria.libros` con guía 1500→9999 (C-08), tabla de 8 casos, tapas SVG propias, árbol de entrega.
- Barrido `innerHTML`/`type="module"`/`http(s)` en html/js/css; legibilidad (funciones acotadas, Lógica/Render/Eventos/Inicio).
- Verificación de la carpeta de entrega (5 HTML + `css/`+`js/`+`img/`+`README.md`).

### Out of Scope

- Cambios funcionales, salvo falla real (se registra; el fix se acuerda). Tests automatizados (DD-05); fecha/canal sin confirmar (P-01); el zip lo arma el autor a mano.

## Capabilities

### New Capabilities

None — sin comportamiento nuevo; solo verifica y documenta.

### Modified Capabilities

- `documentacion-entrega`: README a "entrega final" sin maquetas, tabla de 8 casos reales, límites de `localStorage` y entrega según P-04.

## Approach

README C-04 como esqueleto; Chrome fuente de verdad, Firefox no-ejecutado honesto (precedente C-05..C-08); grep del agente; casos del usuario transcriptos literalmente.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `README.md` | Modified | Único entregable modificado |
| `openspec/specs/documentacion-entrega/spec.md` | Modified | Al archivar, con este delta |
| `js/*.js`, `*.html`, `*.css` | Read-only | Solo verificación; cambio ante falla aprobada |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Firefox no disponible | High | "No ejecutado: Firefox no disponible…"; Chrome como verdad |
| Tentar marcar OK sin ejecutar | Low | RN-GL-02: falla real registrada, cero "OK" sin ejecución |
| Edición de `localStorage` pierde datos | Low | Backup de claves; caso 6 en copia y restaurar |

## Rollback Plan

Restaurar `README.md` y claves `libreria.*` desde el backup previo. Sin migración; la semilla no cambia.

## Dependencies

- C-06 archivada; C-08 archivada (2026-10-16). C-01..C-08 archivadas; `openspec list` limpio.

## Success Criteria

- [ ] 8 casos reales en Chrome; Firefox honesto; cero aprobados sin ejecutar.
- [ ] README final: estado, sin maquetas, `localStorage`+guía, 8 casos, tapas, árbol.
- [ ] Barridos limpios; la entrega abre con doble clic sin faltantes.

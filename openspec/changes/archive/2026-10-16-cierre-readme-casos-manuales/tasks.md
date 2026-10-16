# Tasks: cierre-readme-casos-manuales

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~120-200 (solo `README.md`; código read-only) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single unit (sin PRs: no es repo git, no commitear) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | README final + 8 casos + barridos + entrega | N/A | Unidad única docs; incluye tareas [usuario] |

## Phase 1: Resguardo y aprobación

- [x] 1.1 Copiar `README.md` a `C:\Users\espej\AppData\Local\Temp\opencode\README.c08.bak.md` y exportar valores `libreria.*` (backup caso 6).
- [x] 1.2 **[usuario]** Aprobar Q1–Q5 del design (Firefox honesto, caso 6 con backup, falla=registrar o fix, nombre entrega, línea de estado).

## Phase 2: Barridos y legibilidad (agente)

- [x] 2.1 Grep `innerHTML|outerHTML|insertAdjacentHTML|document.write` y `type="module"` en `*.html`+`js/*.js`; `http://|https://` en `*.html`+`css/*.css`+`js/*.js`; anotar salida real.
- [x] 2.2 Revisar `js/comun| catalogo|libros|clientes|ventas|historial.js`: funciones acotadas, secciones Lógica/Render/Eventos/Inicio, nombres claros; anotar desvíos sin tocar código.
- [x] 2.3 Re-verificar caso 8 base: un `h1` por página, `caption`+`th scope`, `label for`, `:focus-visible`, errores con texto, tablas con `overflow-x:auto` a 320/1280 px.

## Phase 3: 8 casos en Chrome [usuario]

- [x] 3.1 **[usuario]** Ejecutar casos 1–5 en Chrome (`file://`): filtro, alta libro (duplicado/nuevo), alta cliente (inválido/mayús-duplicado/nuevo), venta inválida, venta 5000; informar observado por caso. — verificado 2026-10-16 en Chrome `file://`: TODO FUNCIONA, los 5 coincidieron con lo esperado (filtro; duplicado rechazado + alta `lib-7` sin tapa; inválido/mayús-duplicado rechazados + alta `cli-4`; inválida con errores + repetido suma; 3000+2000=5000).
- [x] 3.2 **[usuario]** Ejecutar casos 6–8: solo-precio 1500→9999 con backup (restaurar al terminar), recarga sin duplicados, Tab + 320/1280 px; informar observado. — verificado 2026-10-16 en Chrome `file://`: TODO FUNCIONA (historial intacto, backup restaurado; sin duplicados; foco visible, sin scroll horizontal de página).
- [x] 3.3 Transcribir cada observado literal a la tabla; falla real → describirla (RN-GL-02), sin "OK" sin ejecutar; Firefox = "No ejecutado: Firefox no disponible en el equipo del autor". — transcripto 2026-10-16: 8 filas Chrome = "Cumple lo esperado" (cero fallas que registrar), Firefox verbatim; `### Casos de la consigna (cierre final)` en README §8.

## Phase 4: README final

- [x] 4.1 Reescribir Estado ("entrega final"), §4 sin maquetas, §5 (pendientes "Ninguna"), §7 (límites RN-PE-04 + claves + ejemplo `precio` + guía 1500→9999).
- [x] 4.2 Completar §8 (tabla 8 casos + `### Controles de alcance` con 2.1), §9 tapas SVG propias, §10 árbol P-04; verificar sin `npm/fechas/URLs` ni "OK" no ejecutado. — verificado 2026-10-16: `### Casos de la consigna (cierre final)` con 8 filas; Controles 2026-10-16 todo "Sin resultados" (grep 0 `innerHTML|outerHTML|insertAdjacentHTML|document.write`, 0 `type="module"`, 0 `http`); README sin `npm/npx`, sin fechas de entrega, sin URLs, cero "Pendiente de ejecutar", cero "OK/Aprobado"; §4 sin maquetas, §5 "Ninguna", §9 tapas propias, §10 árbol P-04 exacto.

## Phase 5: Carpeta de entrega [usuario]

- [x] 5.1 **[usuario]** Copiar 5 HTML + `css/`+`js/`+`img/`+`README.md` a carpeta nueva fuera del proyecto y comprimir por Explorador (sin scripts). — ejecutado por el autor 2026-10-16 a mano (sin scripts), TODO FUNCIONA.
- [x] 5.2 **[usuario]** Descomprimir en otra ubicación, sin conexión, abrir `index.html`: 6 tarjetas con tapas, 5 vistas por menú, consola sin faltantes. — ejecutado por el autor 2026-10-16 sin conexión: 6 tarjetas con tapas, 5 vistas por menú, consola sin faltantes.

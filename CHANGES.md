# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **TPI Frontend Librería** (Programación III, UTN-TUP — repaso Parcial 1).
> Cada change es atómico: una persona puede implementarlo en una sesión (~2-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**
>
> Contexto fijo del proyecto: HTML/CSS/JS nativos, multipágina (5 HTML), scripts clásicos (sin `type="module"`), sin build ni librerías, `localStorage`, trabajo **individual**, **sin tests automatizados** (Strict TDD desactivado; verificación = casos manuales registrados en el README). Los changes se reparten en dos hitos de entrega: **Etapa 1** (C-01..C-04) y **Etapa 2** (C-05..C-09).

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>` con el nombre kebab-case del change (ej. `foundation-estructura-html`); el `C-NN` es solo el índice de este documento.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

### Trazabilidad con la consigna

| Change | Ejercicio / Épica | Historias | Puntos | Etapa |
|--------|-------------------|-----------|:------:|:-----:|
| C-01 `foundation-estructura-html` | Ej. 1 / E1 | US-001, US-002 | 20 | 1 |
| C-02 `identidad-visual-responsive` | Ej. 2 / E2 | US-003, US-004 | 20 | 1 |
| C-03 `datos-semilla-catalogo-filtro` | Ej. 3 / E3 (render + filtro) | US-005, US-006, US-007 | 15 | 1 |
| C-04 `readme-avance-etapa-1` | Ej. 6 / E6 (README de avance) | US-014 (parcial) | — | 1 (hito) |
| C-05 `persistencia-localstorage` | Ej. 6 / E6 (persistencia) + Ej. 3 | US-013 | 4 de 10 | 2 |
| C-06 `altas-libros-clientes` | Ej. 4 / E4 | US-008, US-009 | 15 | 2 |
| C-07 `venta-composicion-confirmacion` | Ej. 5 / E5 (composición, cálculos, confirmación) | US-010, US-011 | ~13 de 20 | 2 |
| C-08 `historial-precio-historico` | Ej. 5 / E5 (historial inmutable) | US-012 | ~7 de 20 | 2 |
| C-09 `cierre-readme-casos-manuales` | Ej. 6 / E6 (casos manuales + documentación) | US-014 | 6 de 10 | 2 (hito final) |

> Governance de este proyecto: no hay dominios CRITICO ni ALTO (sin auth, sin datos sensibles). La persistencia en `localStorage`, las validaciones y la venta con precio histórico son **MEDIO**; maqueta, estilos y documentación son **BAJO**.

---

## Árbol de dependencias

```
C-01 foundation-estructura-html
  │
  ├── C-02 identidad-visual-responsive ──────┐        ← paralelo lógico con C-03
  │                                          │
  └── C-03 datos-semilla-catalogo-filtro ────┤
                                             │
                                             └── C-04 readme-avance-etapa-1        ← HITO ETAPA 1
                                                   │
                                                   └── C-05 persistencia-localstorage    ← desbloquea Etapa 2
                                                         │
                                                         ├── C-06 altas-libros-clientes ────────────────┐
                                                         │                                              │
                                                         └── C-07 venta-composicion-confirmacion        │
                                                               │                                        │
                                                               └── C-08 historial-precio-historico ─────┤
                                                                                                        │
                                                                                                        └── C-09 cierre-readme-casos-manuales   ← HITO ETAPA 2
```

### Paralelismo por fase

> Un solo desarrollador implementa el proyecto: los gates indican **orden lógico** (qué queda desbloqueado y qué es independiente), no ejecución concurrente real. Las "pistas" A/B/C son agrupaciones por tipo de trabajo.

```
GATE 0: ninguna
  → C-01 foundation-estructura-html          [Pista A]

GATE 1: C-01 ✓                               ← FORK lógico (2 ramas independientes)
  → C-02 identidad-visual-responsive         [Pista B]
  → C-03 datos-semilla-catalogo-filtro       [Pista A]

GATE 2: C-02 + C-03 ✓
  → C-04 readme-avance-etapa-1               [Pista C]      ← cierra el HITO ETAPA 1

GATE 3: C-04 ✓
  → C-05 persistencia-localstorage           [Pista A]

GATE 4: C-05 ✓                               ← FORK lógico (2 ramas independientes)
  → C-06 altas-libros-clientes               [Pista B]
  → C-07 venta-composicion-confirmacion      [Pista A]

GATE 5: C-07 ✓
  → C-08 historial-precio-historico          [Pista A]

GATE 6: C-06 + C-08 ✓
  → C-09 cierre-readme-casos-manuales        [Pista C]      ← cierra el HITO ETAPA 2 (entrega final)
```

### Camino crítico (7 changes — mínimo irreducible)

```
C-01 → C-03* → C-04 → C-05 → C-07 → C-08 → C-09
```

> `*` C-02 y C-03 son hermanos con la misma longitud: cualquiera de los dos puede ir antes. Además de la cadena, **C-02 y C-06 son obligatorios** (Ej. 2 y Ej. 4 valen 35 puntos): no están en el camino crítico solo porque se pueden hacer en paralelo lógico, no porque sean opcionales. Para una sola persona el total real es de los 9 changes.

### Plan óptimo con 3 agentes

> Pistas lógicas (no hay 3 agentes reales). Pista A = datos y lógica de negocio · Pista B = vistas, estilos y altas · Pista C = documentación y verificación.

```
Paso │ Agente A (Datos y ventas)           │ Agente B (Vistas, estilos y altas) │ Agente C (Docs y verificación)
─────┼─────────────────────────────────────┼────────────────────────────────────┼─────────────────────────────────
  1  │ C-01 foundation-estructura-html     │               —                    │               —
  2  │ C-03 datos-semilla-catalogo-filtro  │ C-02 identidad-visual-responsive   │               —
  3  │               —                     │               —                    │ C-04 readme-avance-etapa-1
  4  │ C-05 persistencia-localstorage      │               —                    │               —
  5  │ C-07 venta-composicion-confirmacion │ C-06 altas-libros-clientes         │               —
  6  │ C-08 historial-precio-historico     │               —                    │               —
  7  │               —                     │               —                    │ C-09 cierre-readme-casos-manuales
```

> Orden secuencial recomendado para una persona: `C-01 → C-02 → C-03 → C-04 → C-05 → C-06 → C-07 → C-08 → C-09`.

---

## FASE 0 — Cimientos (Etapa 1)

### [C-01] `foundation-estructura-html`
- **Estado**: `[x]` completado (archivado 2026-10-15)
- **Scope**: Estructura de directorios + las 5 vistas HTML semánticas con navegación común (Ej. 1 completo, sin estilos ni datos)
  - Directorios: `css/`, `js/`, `img/tapas/`; sin `package.json`, sin build, sin CDNs
  - Archivos: `index.html` (Catálogo, entrada), `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, cada uno con `lang="es"`, `meta charset` + `viewport`, `header` + `nav` + `main` semánticos y el mismo menú de 5 enlaces
  - Enlace de la página actual con `aria-current="page"` en cada HTML
  - Orden de carga en cada página: `css/base.css`, `css/layout.css`, `css/componentes.css`, `<script src="js/comun.js" defer>` y el JS de la página; **nunca `type="module"`**
  - `libros.html`: formulario con título, ISBN, precio, editorial, género (con «Sin clasificar») y autores (selección múltiple), todos con `<label for>`, `novalidate` y botón "Registrar libro"; tabla de listado con `<thead>` + `<th scope="col">`
  - `clientes.html`: formulario con nombre completo y email, botón "Registrar cliente"; tabla de listado
  - `ventas.html`: selector de cliente, selector de libro, cantidad, botón "Agregar renglón", tabla de renglones con total y botón "Confirmar venta"
  - `historial.html`: tabla id / fecha / cliente / total y zona de detalle
  - Zonas de mensaje en cada vista para lista vacía, sin resultados, operación correcta y operación rechazada
  - `js/comun.js` mínimo: `'use strict'` y helpers DOM `crearElemento(tag, texto, clase)`, `limpiar(contenedor)`, `mostrarMensaje(contenedor, tipo, texto)`
  - Verificación manual: abrir las 5 páginas con doble clic (`file://`), recorrer el menú, `grep` de `type="module"` y `innerHTML` sin resultados
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance v1.0 y §Etapas
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001, US-002)
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios y §Orden de carga en cada HTML
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UI-04, RN-UI-06

---

## FASE 1 — Presentación y catálogo (Etapa 1)

> C-02 y C-03 son independientes entre sí (ambos dependen solo de C-01). Cerrar C-04 = **HITO ENTREGA ETAPA 1**.

### [C-02] `identidad-visual-responsive`
- **Estado**: `[x]` completado (archivado 2026-10-15)
- **Scope**: Identidad visual "moderna minimal", adaptable y accesible, en CSS externo (Ej. 2 completo)
  - `css/base.css`: custom properties (`--color-fondo`, `--color-superficie`, `--color-texto`, `--color-acento`, `--color-error`, `--color-exito`, `--espacio-1..6`, `--radio`, `--sombra`), reset, tipografía `system-ui`, `:focus-visible { outline: 3px solid var(--color-acento); outline-offset: 2px; }`
  - `css/layout.css`: `header`/`nav`/`main` con Flexbox, grilla del catálogo `repeat(auto-fill, minmax(220px, 1fr))`, mobile-first desde 320 px y breakpoint principal ~768 px
  - `css/componentes.css`: `.tarjeta`, `.boton`, `.campo`, `.mensaje--error`, `.mensaje--exito`, `.mensaje--info` (siempre con prefijo de texto, no solo color), tablas dentro de un contenedor con `overflow-x: auto`
  - Aplicar las clases a las 5 páginas sin cambiar la estructura semántica de C-01; un solo color de acento con contraste AA y fondo claro
  - Estilo de `.tarjeta img` (tamaño fijo y `object-fit`) listo para las tapas de C-03
  - Verificación manual: 320 px y 1280 px sin scroll horizontal en las 5 vistas, recorrido completo con Tab (foco visible), Chrome y Firefox
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (US-003, US-004)
  - `knowledge-base/08_arquitectura_propuesta.md` §Identidad visual (moderna minimal)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UI-05, RN-UI-07, RN-UI-08, RN-UI-09
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-09

---

### [C-03] `datos-semilla-catalogo-filtro`
- **Estado**: `[x]` completado (archivado 2026-10-15)
- **Scope**: Datos semilla en JS, catálogo generado por JS y filtro por título (Ej. 3: modelo, render y filtro)
  - `js/comun.js`: constantes `EDITORIALES` (2), `GENEROS` (2), `AUTORES` (3), `LIBROS_SEMILLA` (≥ 6) y `CLIENTES_SEMILLA` (3) con ids estables (`ed-1`, `gen-1`, `aut-1`, `lib-1`, `cli-1`)
  - Semilla: al menos un libro con `generoId: null`, uno con varios autores, precios 1500 y 2000, títulos con palabras repetidas en distintas mayúsculas, todas las referencias válidas, cero ventas
  - `comun.js`: `cargarLibros()` / `cargarClientes()` devolviendo la semilla en memoria (el storage entra en C-05), `buscarPorId`, `nombreEditorial`, `nombreGenero` («Sin clasificar» si es `null`), `nombresAutores`, `normalizarBusqueda`, `redondear2`, `formatearPrecio` (`Intl.NumberFormat('es-AR')`)
  - `js/catalogo.js` (secciones Lógica / Render / Eventos / Inicio): `filtrarLibrosPorTitulo(libros, texto)` pura (trim, sin distinguir mayúsculas, `includes`, vacío = todo), `renderCatalogo(contenedor, libros)` con `createElement` + `textContent`, mensaje "No se encontraron libros para «texto»"
  - Cada libro muestra título, ISBN, editorial, género (o «Sin clasificar»), autores y precio con 2 decimales; evento `input` del buscador en `index.html`
  - `img/tapas/`: tapas SVG de elaboración propia (`lib-1.svg` … `lib-6.svg`, 2:3, título y autor, sin scripts ni recursos externos) con `alt` descriptivo; sin imágenes de terceros ni créditos
  - `js/libros.js` y `js/clientes.js`: solo render de los listados desde la semilla (DD-08); la lógica de alta llega en C-06
  - Verificación manual: filtro con mayúsculas, con espacios exteriores, vacío y texto inexistente; sin `innerHTML`
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades y §Seed data inicial
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (US-005, US-006, US-007)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CA-01..06, RN-UI-01
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/08_arquitectura_propuesta.md` §Contenido de `comun.js` y §Convención interna de cada `js/<pagina>.js`

---

### [C-04] `readme-avance-etapa-1`
- **Estado**: `[x]` completado (archivado 2026-10-15) — HITO ETAPA 1
- **Scope**: README de avance y cierre del hito de la Etapa 1
  - `README.md` en la raíz: autor (Giuliano Espejo), pasos para abrir `index.html` sin npm, navegación entre vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales (`js/comun.js`), aclaración de que las tapas son SVG de elaboración propia
  - Sección "Maquetas vs. interacciones funcionales": maquetas = formularios de alta, venta e historial vacío; funcional = catálogo generado por JS y filtro por título
  - Verificar y documentar en el README los avisos de maqueta "Pendiente — Etapa 2" creados en C-01 (`p.aviso-maqueta` en `libros.html`, `clientes.html`, `ventas.html` e `historial.html`; sin lógica nueva)
  - Checklist de entrega de la Etapa 1: 320 px / 1280 px sin scroll horizontal, foco visible, búsqueda de `innerHTML`, `type="module"`, `http://` y `https://` en `*.html`, `*.js`, `*.css`
  - Definir qué entra en el zip de avance (propuesta: excluir `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`) y confirmar fecha/canal de entrega con el docente
- **Dependencias**: C-02, C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-014
  - `knowledge-base/01_vision_y_objetivos.md` §Etapas
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-08, SU-01
  - `knowledge-base/10_preguntas_abiertas.md` §IN-02, P-01, P-04, P-06
  - `knowledge-base/08_arquitectura_propuesta.md` §Verificación

---

## FASE 2 — Persistencia y altas (Etapa 2)

> C-05 va primero porque, con multipágina, un alta en `libros.html` solo llega a `index.html` y `ventas.html` si los datos viven en `localStorage` (DD-03, IN-01). C-06 y C-07 son independientes entre sí; para una sola persona conviene C-06 antes que C-07 para validar el alta de punta a punta.

### [C-05] `persistencia-localstorage`
- **Estado**: `[x]` completado (archivado 2026-10-15) — verificado solo en Chrome
- **Scope**: Capa de persistencia sobre `localStorage` sin duplicar la semilla
  - `js/comun.js`: constante `CLAVES` (`libreria.libros`, `libreria.clientes`, `libreria.ventas`), `leerColeccion(clave, semilla)` (carga la semilla solo si la clave no existe, la guarda y la devuelve; si existe, `JSON.parse`), `guardarColeccion(clave, datos)` y atajos `cargarLibros/Clientes/Ventas` + `guardarLibros/Clientes/Ventas`
  - Ventas arrancan en `[]` (sin semilla de ventas)
  - Errores: `try/catch` sobre `JSON.parse` → mensaje visible en la página y `[]` sin pisar los datos guardados (P-03); `localStorage` no disponible → mensaje "No se pueden guardar datos en este navegador" y semilla en memoria
  - Migrar `catalogo.js`, `libros.js` y `clientes.js` de C-03 a los `cargarX()` persistentes
  - Verificar SU-02: un cambio en `libreria.libros` se ve desde otra página, en Chrome **y** Firefox abriendo por `file://`; anotar el resultado real para el README
  - Verificación manual: recargar no duplica libros ni clientes; borrar una clave restaura su semilla; JSON corrupto avisa y no rompe la página
- **Dependencias**: C-04
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Estructura en `localStorage`
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PE-01..04
  - `knowledge-base/07_flujos_principales.md` §Flujo 1
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-03, DD-07, SU-02
  - `knowledge-base/10_preguntas_abiertas.md` §IN-01, P-02, P-03

---

### [C-06] `altas-libros-clientes`
- **Estado**: `[x]` completado (archivado 2026-10-15) — verificado solo en Chrome
- **Scope**: Alta validada de libros y de clientes con actualización sin recargar (Ej. 4 completo)
  - `js/comun.js`: `normalizarIsbn` (quita espacios y guiones), `normalizarEmail` (trim + minúsculas), `siguienteId(lista, prefijo)` (máximo numérico + 1)
  - `js/libros.js`: `validarLibro(datos, libros)` pura → `string[]` de errores (título no vacío; ISBN no vacío y no duplicado normalizado; precio numérico > 0; editorial existente; ≥ 1 autor y todos existentes; género existente si se asigna, «Sin clasificar» = `null`)
  - Selectores de editorial, género y autores generados desde los datos; `submit` con `preventDefault`; errores junto al formulario con prefijo "Error:" y foco al primer campo inválido; el libro se agrega solo si pasan todas las comprobaciones
  - Alta correcta: `guardarLibros`, re-render del listado, reset del formulario y mensaje "Libro «título» registrado"; precio guardado con 2 decimales; `imagen: null` (sin tapa o placeholder con `alt=""`)
  - `js/clientes.js`: `validarCliente(datos, clientes)` pura (nombre y email no vacíos, formato `algo@dominio.ext` sin espacios internos, email único con trim y sin distinguir mayúsculas); mismo flujo de alta
  - Verificación manual: ISBN duplicado con espacios/guiones, precio 0 / negativo / texto, sin autores, email inválido, email existente en mayúsculas, altas válidas visibles en catálogo y en los selectores de venta
- **Dependencias**: C-05
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 4 (US-008, US-009)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LI-01..08, RN-CL-01..04, RN-UI-02, RN-UI-03
  - `knowledge-base/07_flujos_principales.md` §Flujo 3 y §Flujo 4
  - `knowledge-base/04_modelo_de_datos.md` §Libro y §Cliente
  - `knowledge-base/10_preguntas_abiertas.md` §P-05, P-07

---

## FASE 3 — Ventas e historial (Etapa 2)

### [C-07] `venta-composicion-confirmacion`
- **Estado**: `[x]` completado (archivado 2026-10-15) — verificado solo en Chrome
- **Scope**: Composición de la venta, cálculos y confirmación con datos históricos copiados (Ej. 5: composición, cálculos y confirmación)
  - `js/ventas.js`: venta en curso en memoria `{ clienteId, renglones: [] }`, no se persiste hasta confirmar (SU-05)
  - Selectores de cliente y de libro generados con `cargarClientes()` / `cargarLibros()`
  - `agregarRenglon(enCurso, libroId, cantidad)` pura: cantidad entera > 0 (rechaza 0, negativos y decimales); libro repetido suma la cantidad al renglón existente y avisa "Se sumaron N unidades a «título»" (DD-06)
  - Tabla de renglones: libro, cantidad editable, precio unitario, subtotal y botón "Quitar"; cantidad inválida marca el campo con texto y bloquea la confirmación
  - `calcularSubtotal` / `calcularTotal` con `redondear2`; total recalculado en cada cambio y mostrado con 2 decimales (DD-10)
  - `validarVenta(enCurso)` (cliente, ≥ 1 renglón, cantidades válidas) y `construirVenta(enCurso, libros, clientes, ventas)` que **copia** `titulo`, `isbn`, `precioUnitario`, `clienteNombre` y `clienteEmail`; `siguienteIdVenta` (`V-0001`) y `fecha = new Date().toISOString()`
  - Confirmar: `guardarVentas`, limpiar formulario y venta en curso, mensaje "Venta V-0001 confirmada. Total: $ 5.000,00"
  - Verificación manual: venta sin cliente, cantidad 0 / -1 / 1.5, libro repetido, venta 2 × 1500 + 1 × 2000 = 5000 (subtotales 3000 y 2000); revisar el tamaño de `ventas.js` y partirlo si pasa de ~250 líneas (IN-03)
- **Dependencias**: C-05
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (US-010, US-011)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VE-01..08
  - `knowledge-base/07_flujos_principales.md` §Flujo 5
  - `knowledge-base/04_modelo_de_datos.md` §Venta y §Renglon
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-06, DD-10, SU-05

---

### [C-08] `historial-precio-historico`
- **Estado**: `[x]` completado (archivado 2026-10-16) — verificado solo en Chrome
- **Scope**: Historial de ventas inmutable que usa solo los valores copiados (Ej. 5: historial inmutable)
  - `js/historial.js`: `cargarVentas()` y tabla id / fecha (`formatearFecha`, formato local) / cliente (`clienteNombre`) / total, con botón "Ver detalle de V-000N"
  - Detalle de la venta construido **solo** con `titulo`, `isbn`, `cantidad`, `precioUnitario`, `subtotal` y `total` guardados en la venta; `historial.js` no llama a `cargarLibros()` ni lee el catálogo (RN-VE-07)
  - Sin controles de edición ni de eliminación (RN-VE-09); sin ventas muestra "No hay ventas registradas"; todos los textos con `textContent`
  - Prueba guiada del precio histórico (Flujo 7): confirmar 2 × 1500 + 1 × 2000, cambiar a mano solo el `precio` de ese libro en `libreria.libros` (DevTools), recargar `historial.html` y comprobar que precio unitario, subtotales y total no cambian
  - Dejar anotadas la clave y la estructura de `libreria.libros` (campo `precio`) para documentarlas en el README de C-09
- **Dependencias**: C-07
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-012
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VE-07, RN-VE-09, RN-VE-10
  - `knowledge-base/07_flujos_principales.md` §Flujo 6 y §Flujo 7
  - `knowledge-base/04_modelo_de_datos.md` §Renglon (nota sobre precio histórico) y §Estructura en `localStorage`

---

## FASE 4 — Cierre y verificación (Etapa 2 — entrega final)

### [C-09] `cierre-readme-casos-manuales`
- **Estado**: `[x]` completado (archivado 2026-10-16) — HITO ETAPA 2 — verificado solo en Chrome
- **Scope**: Verificación manual completa, README final y preparación de la carpeta de entrega (Ej. 6: pruebas registradas y documentación)
  - Ejecutar los 8 casos manuales de la consigna en Chrome y Firefox: (1) filtro en mayúsculas / vacío / inexistente, (2) alta de libro con ISBN existente y nuevo, (3) alta de cliente con email inválido / existente en mayúsculas / nuevo, (4) venta sin cliente, cantidad 0 / negativa / decimal y libro repetido, (5) venta válida 2 × 1500 + 1 × 2000, (6) cambio exclusivo del precio de catálogo en `localStorage` en una copia de prueba, (7) recarga después de altas y venta, (8) teclado y anchos de 320 px / 1280 px
  - `README.md` final (extiende el de C-04): autor, pasos para abrir sin npm, navegación, funcionalidades implementadas y pendientes (sin maquetas), ubicación de los datos iniciales, funcionamiento y límites de `localStorage` (depende del navegador, del perfil y de la ubicación de apertura; no comparte datos entre usuarios), claves y estructura de `libreria.libros` para la prueba guiada, tabla de los 8 casos con el **resultado real observado**, aclaración de que las tapas son SVG de elaboración propia
  - No marcar ningún caso como aprobado sin ejecutarlo; si un caso falla o algo queda pendiente, registrar el comportamiento real (RN-GL-02)
  - Barrido de alcance: buscar `innerHTML`, `type="module"`, `http://` y `https://` en `*.html`, `*.js`, `*.css`
  - Revisión de legibilidad: funciones acotadas, secciones Lógica / Render / Eventos / Inicio en cada `js/<pagina>.js`, nombres comprensibles
  - Carpeta de entrega: `index.html` + demás HTML + `css/` + `js/` + `img/` + `README.md`; sin `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`, sin dependencias ni herramientas de build (P-04)
- **Dependencias**: C-06, C-08
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-014
  - `knowledge-base/01_vision_y_objetivos.md` §Métricas de éxito
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PE-04, RN-GL-01, RN-GL-02
  - `knowledge-base/08_arquitectura_propuesta.md` §Verificación
  - `knowledge-base/10_preguntas_abiertas.md` §P-04, P-06

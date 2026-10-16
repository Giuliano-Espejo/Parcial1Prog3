# Delta for documentacion-entrega

## ADDED Requirements

### Requirement: Tabla de los 8 casos de la consigna con resultado real

El README SHALL incluir la tabla de los 8 casos de la consigna (filtro, alta de libro, alta de cliente, venta inválida, venta válida 5000, precio histórico solo-precio, recarga, teclado+anchos) con pasos/entrada, esperado y observado en Chrome y Firefox. Cada celda MUST registrar solo lo visto al ejecutar; lo no ejecutado MUST mostrar "Pendiente de ejecutar" y MUST NOT figurar como aprobado. Sin Firefox disponible, su celda MUST decir "No ejecutado: Firefox no disponible en el equipo del autor". El caso 6 MUST documentar clave, campo `precio` con ejemplo JSON y esperado (valores intactos).

#### Scenario: Caso ejecutado en Chrome

- GIVEN el caso ejecutado en Chrome con `file://`
- WHEN se completa la tabla
- THEN la celda registra el observado literal, sin agregar nada no visto

#### Scenario: Falla registrada con honestidad

- GIVEN un observado distinto del esperado
- WHEN se completa la tabla
- THEN la celda describe la falla real (RN-GL-02), sin "OK" ni "Aprobado"

### Requirement: Barrido de alcance y revisión de legibilidad del cierre

El change SHALL registrar el barrido de `innerHTML` (+`outerHTML`, `insertAdjacentHTML`, `document.write`), `type="module"` y `http://`/`https://` sobre `*.html`/`*.js`/`*.css` con su resultado real, y la revisión de legibilidad (funciones acotadas, Lógica/Render/Eventos/Inicio, nombres claros). El README SHALL listar la entrega (5 HTML + `css/`+`js/`+`img/`+`README.md`) y MUST NOT incluir `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`, `.atl/` ni archivos de estado.

#### Scenario: Barrido limpio

- GIVEN el barrido ejecutado sobre los archivos de entrega
- WHEN se revisa `### Controles de alcance`
- THEN cada búsqueda muestra su resultado real ("Sin resultados" o archivo+línea)

#### Scenario: Entrega abre igual que el proyecto

- GIVEN el zip con solo lo entregable descomprimido en carpeta nueva, sin conexión
- WHEN se abre `index.html`
- THEN el catálogo muestra las 6 tarjetas con tapas y la consola no informa faltantes

## MODIFIED Requirements

### Requirement: Maquetas e interacciones funcionales identificadas por vista

En la entrega final el README SHALL declarar las cinco vistas funcionales y MUST NOT listar maquetas "Pendiente — Etapa 2": catálogo con filtro, altas validadas, venta con snapshot e historial inmutable. Lo funcional MUST limitarse a lo verificado en los 8 casos. Las altas SHALL declararse visibles sin tapa.
(Previously: la sección distinguía por vista qué ya funcionaba y qué era maqueta "Pendiente — Etapa 2".)

#### Scenario: Ventas funcional, Historial maqueta

- GIVEN la entrega final con venta e historial implementados
- WHEN el docente lee la sección por vistas
- THEN ambas figuran funcionales y ninguna vista como maqueta

#### Scenario: Coherencia con los avisos de las páginas

- GIVEN ninguna página muestra "Pendiente — Etapa 2"
- WHEN se compara la sección con las páginas
- THEN el README no declara maquetas en ninguna vista

#### Scenario: Sin funcionalidades exageradas

- WHEN se ejecuta lo declarado como funcional
- THEN se comporta como el README lo describe, sin avisos en pantalla

#### Scenario: Cobertura de las cinco vistas

- WHEN el docente lee la sección por vistas
- THEN encuentra una entrada funcional por cada vista

#### Scenario: Libros dados de alta sin tapa

- WHEN el docente lee Libros o Catálogo
- THEN el README indica altas visibles sin imagen de tapa

### Requirement: Funcionalidades implementadas y pendientes

El README SHALL listar como implementadas la navegación, el catálogo con filtro, las altas, la venta con snapshot, el historial y la persistencia. Las pendientes SHALL decir "Ninguna — entrega final completa" o solo fuera de alcance. Lo implementado MUST haber pasado su caso manual.
(Previously: las pendientes indicaban lo que se completaba en la Etapa 2, con el historial como pendiente.)

#### Scenario: Venta implementada

- WHEN el docente revisa la lista final
- THEN ve navegación, catálogo, altas, venta, historial y persistencia implementadas, sin pendientes de etapa

# documentacion-entrega Specification

## Purpose
Define el contenido obligatorio del `README.md` de entrega del TPI (avance de la Etapa 1 y, más adelante, entrega final), el registro honesto de los casos manuales y la composición de la carpeta o zip que se entrega al docente.

## Requirements

### Requirement: README en la raíz que identifica autor y estado de la entrega
El proyecto SHALL tener un `README.md` en la raíz, escrito en español, que identifique el trabajo como TPI de Programación III (UTN-TUP) de la "Librería TUP", nombre a su autor (Giuliano Espejo) e indique que es un trabajo individual. El README MUST declarar al comienzo el estado del proyecto que representa ("avance de la Etapa 1", "Etapa 2 en desarrollo" o "entrega final") de modo que el lector sepa, antes de seguir, si hay partes pendientes. Mientras queden vistas en maqueta durante la Etapa 2, el estado MUST ser "Etapa 2 en desarrollo".

#### Scenario: Autor identificado
- **WHEN** el docente abre `README.md`
- **THEN** encuentra, antes de cualquier instrucción técnica, el nombre "Giuliano Espejo" y la indicación de trabajo individual

#### Scenario: Estado de la entrega visible al inicio
- **WHEN** el docente lee el primer bloque del README con las altas de libros y clientes implementadas y la venta y el historial todavía en maqueta
- **THEN** sabe que se trata de la Etapa 2 en desarrollo y que hay pantallas que todavía son maqueta

### Requirement: Pasos para abrir el proyecto sin npm ni servidor
El README SHALL explicar, en pasos numerados, cómo abrir `index.html` con doble clic en un navegador (Chrome o Firefox) sin npm, sin servidor, sin herramientas de build y sin conexión a internet, conservando la estructura de carpetas de la entrega. El README MUST NOT pedir instalar dependencias ni ejecutar comandos para ver la aplicación.

#### Scenario: Apertura siguiendo el README
- **WHEN** una persona descomprime la entrega y sigue los pasos del README
- **THEN** abre `index.html` en el navegador con `file://` y ve el catálogo, sin instalar ni ejecutar nada

#### Scenario: Sin comandos de instalación
- **WHEN** se busca en el README `npm`, `npx`, `yarn` o `node` como instrucción a ejecutar
- **THEN** no aparece ninguna instrucción de ese tipo (solo puede mencionarse que no hacen falta)

### Requirement: Navegación entre vistas documentada
El README SHALL listar las cinco vistas (Catálogo, Libros, Clientes, Ventas, Historial) con el archivo HTML de cada una y su propósito, y SHALL explicar que todas comparten el mismo menú de navegación, utilizable con mouse o teclado.

#### Scenario: Cinco vistas con su archivo
- **WHEN** el docente busca cómo llegar a una vista
- **THEN** el README le indica el nombre de la vista, su archivo (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) y que se accede desde el menú de cualquier página

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

### Requirement: Ubicación de los datos iniciales
El README SHALL indicar en qué archivo y sección están los datos iniciales (libros, clientes, editoriales, géneros y autores de la semilla) y qué cantidad de libros y clientes trae la semilla.

#### Scenario: Encontrar la semilla
- **WHEN** el docente quiere ver o editar los datos iniciales
- **THEN** el README lo dirige a `js/comun.js`, a la sección de datos, y le anticipa que hay 6 libros y 3 clientes

### Requirement: Estado de la persistencia declarado con honestidad
El README SHALL tener una sección sobre `localStorage` que describa solo el comportamiento implementado. Con la persistencia implementada, esa sección MUST explicar: las claves usadas (`libreria.libros`, `libreria.clientes`, `libreria.ventas`) y que editoriales, géneros y autores no se guardan; que la semilla se carga solo cuando falta la clave y que recargar no duplica datos; dónde ver y editar los datos en las herramientas de desarrollo y un ejemplo de la forma de `libreria.libros`; cómo restaurar los datos iniciales borrando una o todas las claves; qué pasa ante datos dañados y ante un navegador sin almacenamiento; y que `localStorage` depende del navegador, del perfil y de la ubicación desde donde se abre el archivo, y no comparte datos entre usuarios ni equipos. La sección MUST registrar, para Chrome y para Firefox, si las páginas abiertas con `file://` comparten los datos, con el texto literal "Pendiente de ejecutar" mientras el autor no lo haya verificado; si un navegador no los comparte, MUST declarar la limitación y la recomendación de navegador. El README MUST NOT describir como implementado un comportamiento de persistencia que no exista.

#### Scenario: Avance sin persistencia
- **WHEN** el docente lee la sección de `localStorage` de una entrega en la que la persistencia todavía no está implementada (avance de la Etapa 1)
- **THEN** entiende que en esa entrega no hay datos guardados en el navegador y que esa parte corresponde a la Etapa 2

#### Scenario: Persistencia documentada
- **WHEN** el docente lee la sección de `localStorage`
- **THEN** encuentra las tres claves, la regla de la semilla, cómo editar `libreria.libros` en DevTools y cómo restaurar los datos iniciales

#### Scenario: Verificación entre páginas registrada por navegador
- **WHEN** el autor todavía no informó el resultado de compartir datos entre páginas en un navegador
- **THEN** la celda de ese navegador dice "Pendiente de ejecutar" y no afirma que funciona

#### Scenario: Limitación de un navegador
- **WHEN** el autor informó que en un navegador las páginas abiertas con `file://` no comparten los datos
- **THEN** el README describe lo observado como limitación de ese navegador e indica con qué navegador abrir el proyecto

### Requirement: Casos manuales con resultado realmente observado
El README SHALL incluir una tabla de casos manuales con, para cada caso, los pasos o la entrada, el resultado esperado y el resultado observado en Chrome y en Firefox. Un resultado observado MUST registrar únicamente lo que vio quien ejecutó el caso; un caso no ejecutado MUST mostrar el texto literal "Pendiente de ejecutar" y MUST NOT figurar como aprobado. Si un caso falla, el README MUST registrar el comportamiento real observado. Si un navegador no está disponible para el autor, su celda MUST decirlo con texto y MUST NOT figurar como aprobado.

#### Scenario: Caso no ejecutado
- **WHEN** un caso todavía no fue ejecutado por el autor en un navegador
- **THEN** la celda de ese navegador dice "Pendiente de ejecutar" y no contiene "OK", "Aprobado" ni equivalentes

#### Scenario: Caso ejecutado
- **WHEN** el autor ejecutó el caso e informó lo que vio
- **THEN** la celda registra ese resultado observado (por ejemplo "OK: 3 tarjetas" o la descripción de la falla), sin agregar nada que el autor no haya observado

#### Scenario: Cobertura mínima del avance
- **WHEN** el docente revisa la tabla del avance de la Etapa 1
- **THEN** encuentra casos del filtro por título (mayúsculas, espacios exteriores, búsqueda parcial, vacío, sin resultados y texto con etiquetas HTML), de apertura sin servidor, de anchos 320 px y 1280 px sin scroll horizontal y de uso con teclado con foco visible

#### Scenario: Casos de persistencia
- **WHEN** el docente revisa la tabla con la persistencia implementada
- **THEN** encuentra además casos de primera apertura, recarga sin duplicar, edición de precio en DevTools vista desde otra página, restauración al borrar una clave, datos dañados sin pisar lo guardado y navegador sin almacenamiento

#### Scenario: Casos de altas
- **WHEN** el docente revisa la tabla con las altas implementadas
- **THEN** encuentra además casos de alta de libro con ISBN existente (escrito con espacios o guiones) y luego con ISBN nuevo, precio 0, negativo y no numérico, libro sin autores, formulario vacío con foco al primer campo inválido, editorial manipulada, alta de cliente con email inválido, con email existente en mayúsculas y con email nuevo, y la aparición de los registros válidos en el listado y, para el libro, en el catálogo

#### Scenario: Casos de venta
- **WHEN** el docente revisa la tabla con la venta implementada
- **THEN** encuentra además casos de venta sin cliente, cantidad 0 / -1 / 1.5, libro repetido que suma, venta válida 2 × 1500 + 1 × 2000 = 5000 con mensaje con id y total, venta con `lib-7`/`cli-4` de C-06, edición inválida que bloquea, "Quitar" que recalcula, y confirmación con clave de ventas dañada

#### Scenario: Firefox no disponible
- **WHEN** el autor no tiene Firefox en su equipo
- **THEN** la columna Firefox de cada caso dice "No ejecutado: Firefox no disponible en el equipo del autor"

### Requirement: Procedencia de las imágenes
El README SHALL indicar la procedencia de las imágenes del proyecto. Las tapas de `img/tapas/` MUST declararse como SVG de elaboración propia del autor, y el README MUST indicar que no hay imágenes tomadas de terceros.

#### Scenario: Tapas propias
- **WHEN** el docente busca de dónde salen las imágenes
- **THEN** el README indica que las seis tapas son SVG dibujados por el autor y que no se usan imágenes ajenas

### Requirement: Sin datos de entrega inventados
El README MUST NOT afirmar fechas, canal ni modalidad de entrega que no hayan sido confirmados por el docente y comunicados por el autor.

#### Scenario: Fecha no confirmada
- **WHEN** la fecha o el canal de entrega no fueron confirmados
- **THEN** el README no contiene ninguna fecha ni canal de entrega

### Requirement: Contenido de la carpeta o zip de entrega
La carpeta o zip de entrega SHALL contener únicamente `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/`, `js/`, `img/` y `README.md`, con la misma estructura relativa del proyecto. La entrega MUST NOT incluir `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`, `.atl/`, archivos de estado o de agentes (`AGENTS.md`, `CLAUDE.md`, `CHANGES.md`, `.active-orchestrator-state.json`), el PDF de la consigna, dependencias instaladas ni scripts o herramientas de build. El README SHALL listar ese contenido.

#### Scenario: Zip con solo lo entregable
- **WHEN** se lista el contenido del zip de entrega
- **THEN** aparecen solo los cinco HTML, `css/`, `js/`, `img/` y `README.md`, y ningún archivo o carpeta excluido

#### Scenario: La entrega abre igual que el proyecto
- **WHEN** se descomprime el zip en una carpeta nueva y se abre `index.html` sin conexión
- **THEN** el catálogo muestra las 6 tarjetas con sus tapas y la consola no informa recursos faltantes

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

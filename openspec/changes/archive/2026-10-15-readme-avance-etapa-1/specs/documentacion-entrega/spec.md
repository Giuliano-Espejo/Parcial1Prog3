## Purpose

Define el contenido obligatorio del `README.md` de entrega del TPI (avance de la Etapa 1 y, más adelante, entrega final), el registro honesto de los casos manuales y la composición de la carpeta o zip que se entrega al docente.

## ADDED Requirements

### Requirement: README en la raíz que identifica autor y estado de la entrega
El proyecto SHALL tener un `README.md` en la raíz, escrito en español, que identifique el trabajo como TPI de Programación III (UTN-TUP) de la "Librería TUP", nombre a su autor (Giuliano Espejo) e indique que es un trabajo individual. El README MUST declarar al comienzo qué entrega representa (en este hito, "avance de la Etapa 1") de modo que el lector sepa, antes de seguir, que hay partes pendientes.

#### Scenario: Autor identificado
- **WHEN** el docente abre `README.md`
- **THEN** encuentra, antes de cualquier instrucción técnica, el nombre "Giuliano Espejo" y la indicación de trabajo individual

#### Scenario: Estado de la entrega visible al inicio
- **WHEN** el docente lee el primer bloque del README
- **THEN** sabe que se trata del avance de la Etapa 1 y que hay pantallas que todavía son maqueta

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
Mientras la entrega sea un avance de la Etapa 1, el README SHALL incluir una sección que indique expresamente, para cada una de las cinco vistas, qué ya funciona y qué es maqueta. Lo declarado como maqueta MUST coincidir con las pantallas que muestran el aviso "Pendiente — Etapa 2" (`libros.html`, `clientes.html`, `ventas.html` e `historial.html`), y lo declarado como funcional MUST limitarse a lo que efectivamente está implementado (catálogo generado por JS con filtro por título; listados de Libros y Clientes generados desde la semilla).

#### Scenario: Cobertura de las cinco vistas
- **WHEN** el docente lee la sección de maquetas e interacciones funcionales
- **THEN** encuentra una entrada por cada una de las cinco vistas con lo que funciona y lo que es maqueta

#### Scenario: Coherencia con los avisos de las páginas
- **WHEN** se compara la sección del README con los avisos "Pendiente — Etapa 2" de las páginas
- **THEN** toda vista con aviso tiene declarada su parte de maqueta en el README, y el Catálogo (sin aviso) no figura como maqueta

#### Scenario: Sin funcionalidades exageradas
- **WHEN** se intenta en el navegador cualquier interacción que el README declara como funcional
- **THEN** la interacción se comporta como el README la describe; ninguna alta, venta o persistencia figura como funcional

### Requirement: Funcionalidades implementadas y pendientes
El README SHALL listar por separado las funcionalidades implementadas y las pendientes. Las pendientes MUST indicar en qué etapa se completan.

#### Scenario: Pendientes con su etapa
- **WHEN** el docente revisa la lista de pendientes
- **THEN** ve las altas de libros y clientes, la venta, el historial y la persistencia en `localStorage` marcadas como pendientes de la Etapa 2

### Requirement: Ubicación de los datos iniciales
El README SHALL indicar en qué archivo y sección están los datos iniciales (libros, clientes, editoriales, géneros y autores de la semilla) y qué cantidad de libros y clientes trae la semilla.

#### Scenario: Encontrar la semilla
- **WHEN** el docente quiere ver o editar los datos iniciales
- **THEN** el README lo dirige a `js/comun.js`, a la sección de datos, y le anticipa que hay 6 libros y 3 clientes

### Requirement: Estado de la persistencia declarado con honestidad
El README SHALL tener una sección sobre `localStorage`. Mientras la entrega sea un avance de la Etapa 1, esa sección MUST declarar que la aplicación todavía no guarda datos en `localStorage`, que los listados se generan en memoria desde la semilla en cada carga, y que la persistencia llega en la Etapa 2. El README MUST NOT describir como implementado un comportamiento de persistencia que no exista.

#### Scenario: Avance sin persistencia
- **WHEN** el docente lee la sección de `localStorage` del avance
- **THEN** entiende que en esta entrega no hay datos guardados en el navegador y que esa parte corresponde a la Etapa 2

### Requirement: Casos manuales con resultado realmente observado
El README SHALL incluir una tabla de casos manuales con, para cada caso, los pasos o la entrada, el resultado esperado y el resultado observado en Chrome y en Firefox. Un resultado observado MUST registrar únicamente lo que vio quien ejecutó el caso; un caso no ejecutado MUST mostrar el texto literal "Pendiente de ejecutar" y MUST NOT figurar como aprobado. Si un caso falla, el README MUST registrar el comportamiento real observado.

#### Scenario: Caso no ejecutado
- **WHEN** un caso todavía no fue ejecutado por el autor en un navegador
- **THEN** la celda de ese navegador dice "Pendiente de ejecutar" y no contiene "OK", "Aprobado" ni equivalentes

#### Scenario: Caso ejecutado
- **WHEN** el autor ejecutó el caso e informó lo que vio
- **THEN** la celda registra ese resultado observado (por ejemplo "OK: 3 tarjetas" o la descripción de la falla), sin agregar nada que el autor no haya observado

#### Scenario: Cobertura mínima del avance
- **WHEN** el docente revisa la tabla del avance de la Etapa 1
- **THEN** encuentra casos del filtro por título (mayúsculas, espacios exteriores, búsqueda parcial, vacío, sin resultados y texto con etiquetas HTML), de apertura sin servidor, de anchos 320 px y 1280 px sin scroll horizontal y de uso con teclado con foco visible

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

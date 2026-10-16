## MODIFIED Requirements

### Requirement: README en la raíz que identifica autor y estado de la entrega
El proyecto SHALL tener un `README.md` en la raíz, escrito en español, que identifique el trabajo como TPI de Programación III (UTN-TUP) de la "Librería TUP", nombre a su autor (Giuliano Espejo) e indique que es un trabajo individual. El README MUST declarar al comienzo el estado del proyecto que representa ("avance de la Etapa 1", "Etapa 2 en desarrollo" o "entrega final") de modo que el lector sepa, antes de seguir, si hay partes pendientes. Mientras queden vistas en maqueta durante la Etapa 2, el estado MUST ser "Etapa 2 en desarrollo".

#### Scenario: Autor identificado
- **WHEN** el docente abre `README.md`
- **THEN** encuentra, antes de cualquier instrucción técnica, el nombre "Giuliano Espejo" y la indicación de trabajo individual

#### Scenario: Estado de la entrega visible al inicio
- **WHEN** el docente lee el primer bloque del README con las altas de libros y clientes implementadas y la venta y el historial todavía en maqueta
- **THEN** sabe que se trata de la Etapa 2 en desarrollo y que hay pantallas que todavía son maqueta

### Requirement: Maquetas e interacciones funcionales identificadas por vista
Mientras queden partes en maqueta, el README SHALL incluir una sección que indique expresamente, para cada una de las cinco vistas, qué ya funciona y qué es maqueta. Lo declarado como maqueta MUST coincidir con las partes de las páginas que muestran el aviso "Pendiente — Etapa 2", y lo declarado como funcional MUST limitarse a lo que efectivamente está implementado (en este estado: catálogo generado por JS con filtro por título; listados de Libros y Clientes generados desde los datos guardados; alta validada de libros y de clientes con actualización del listado sin recargar; datos guardados en `localStorage` y compartidos entre las vistas).

#### Scenario: Cobertura de las cinco vistas
- **WHEN** el docente lee la sección de maquetas e interacciones funcionales
- **THEN** encuentra una entrada por cada una de las cinco vistas con lo que funciona y lo que es maqueta

#### Scenario: Coherencia con los avisos de las páginas
- **WHEN** se compara la sección del README con los avisos "Pendiente — Etapa 2" de las páginas
- **THEN** toda vista con aviso tiene declarada su parte de maqueta en el README, y el Catálogo, Libros y Clientes (sin aviso) no figuran con partes de maqueta

#### Scenario: Sin funcionalidades exageradas
- **WHEN** se intenta en el navegador cualquier interacción que el README declara como funcional
- **THEN** la interacción se comporta como el README la describe; ninguna venta ni historial figura como funcional mientras su vista muestre el aviso "Pendiente — Etapa 2"

#### Scenario: Libros dados de alta sin tapa
- **WHEN** el docente lee qué funciona en Libros o en Catálogo
- **THEN** el README indica que los libros dados de alta se muestran en el catálogo sin imagen de tapa

### Requirement: Funcionalidades implementadas y pendientes
El README SHALL listar por separado las funcionalidades implementadas y las pendientes. Las pendientes MUST indicar en qué etapa se completan. Una funcionalidad MUST figurar como implementada solo cuando funciona en el proyecto.

#### Scenario: Pendientes con su etapa
- **WHEN** el docente revisa la lista de pendientes con las altas ya implementadas
- **THEN** ve la venta y el historial marcados como pendientes de la Etapa 2, y la persistencia en `localStorage` y las altas de libros y de clientes figuran entre las implementadas

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

#### Scenario: Firefox no disponible
- **WHEN** el autor no tiene Firefox en su equipo
- **THEN** la columna Firefox de cada caso dice "No ejecutado: Firefox no disponible en el equipo del autor"

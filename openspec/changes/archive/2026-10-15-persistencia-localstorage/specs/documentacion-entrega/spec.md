## MODIFIED Requirements

### Requirement: README en la raíz que identifica autor y estado de la entrega
El proyecto SHALL tener un `README.md` en la raíz, escrito en español, que identifique el trabajo como TPI de Programación III (UTN-TUP) de la "Librería TUP", nombre a su autor (Giuliano Espejo) e indique que es un trabajo individual. El README MUST declarar al comienzo el estado del proyecto que representa ("avance de la Etapa 1", "Etapa 2 en desarrollo" o "entrega final") de modo que el lector sepa, antes de seguir, si hay partes pendientes. Mientras queden vistas en maqueta durante la Etapa 2, el estado MUST ser "Etapa 2 en desarrollo".

#### Scenario: Autor identificado
- **WHEN** el docente abre `README.md`
- **THEN** encuentra, antes de cualquier instrucción técnica, el nombre "Giuliano Espejo" y la indicación de trabajo individual

#### Scenario: Estado de la entrega visible al inicio
- **WHEN** el docente lee el primer bloque del README con la persistencia implementada y las altas, la venta y el historial todavía en maqueta
- **THEN** sabe que se trata de la Etapa 2 en desarrollo y que hay pantallas que todavía son maqueta

### Requirement: Maquetas e interacciones funcionales identificadas por vista
Mientras queden partes en maqueta, el README SHALL incluir una sección que indique expresamente, para cada una de las cinco vistas, qué ya funciona y qué es maqueta. Lo declarado como maqueta MUST coincidir con las partes de las páginas que muestran el aviso "Pendiente — Etapa 2", y lo declarado como funcional MUST limitarse a lo que efectivamente está implementado (en este estado: catálogo generado por JS con filtro por título; listados de Libros y Clientes generados desde los datos guardados; datos guardados en `localStorage` y compartidos entre las vistas).

#### Scenario: Cobertura de las cinco vistas
- **WHEN** el docente lee la sección de maquetas e interacciones funcionales
- **THEN** encuentra una entrada por cada una de las cinco vistas con lo que funciona y lo que es maqueta

#### Scenario: Coherencia con los avisos de las páginas
- **WHEN** se compara la sección del README con los avisos "Pendiente — Etapa 2" de las páginas
- **THEN** toda vista con aviso tiene declarada su parte de maqueta en el README, y el Catálogo (sin aviso) no figura como maqueta

#### Scenario: Sin funcionalidades exageradas
- **WHEN** se intenta en el navegador cualquier interacción que el README declara como funcional
- **THEN** la interacción se comporta como el README la describe; ninguna alta, venta o historial figura como funcional mientras su vista muestre el aviso "Pendiente — Etapa 2"

### Requirement: Funcionalidades implementadas y pendientes
El README SHALL listar por separado las funcionalidades implementadas y las pendientes. Las pendientes MUST indicar en qué etapa se completan. Una funcionalidad MUST figurar como implementada solo cuando funciona en el proyecto.

#### Scenario: Pendientes con su etapa
- **WHEN** el docente revisa la lista de pendientes con la persistencia ya implementada
- **THEN** ve las altas de libros y clientes, la venta y el historial marcadas como pendientes de la Etapa 2, y la persistencia en `localStorage` figura entre las implementadas

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

#### Scenario: Casos de persistencia
- **WHEN** el docente revisa la tabla con la persistencia implementada
- **THEN** encuentra además casos de primera apertura, recarga sin duplicar, edición de precio en DevTools vista desde otra página, restauración al borrar una clave, datos dañados sin pisar lo guardado y navegador sin almacenamiento
